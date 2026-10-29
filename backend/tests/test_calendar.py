"""Calendar API tests: GET /calendar?provider_id=&view=day|week&date=.

AC-014: returns only the requested provider's appointments inside the
requested day period. AC-015: day and week views are consistent for an
overlapping day, and invalid view/date values return 422 while a missing
JWT returns 401. AC-016: appointments belonging to another provider never
leak into the response.

Appointment data is seeded directly through the application's own ORM
models (app.models.Provider / Patient / Appointment) against the real
PostgreSQL service named by DATABASE_URL -- no mock, no stand-in database.
"""

import uuid
from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

LOGIN_ENDPOINT = "/auth/login"
CALENDAR_ENDPOINT = "/calendar"


def _token(receptionist) -> str:
    response = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def _auth_headers(receptionist) -> dict:
    return {"Authorization": f"Bearer {_token(receptionist)}"}


def _make_provider(db_session, name="Dr. Seed"):
    from app import models

    provider = models.Provider(
        id=str(uuid.uuid4()), name=f"{name}-{uuid.uuid4().hex[:6]}", is_active=True
    )
    db_session.add(provider)
    db_session.commit()
    db_session.refresh(provider)
    return provider


def _make_patient(db_session):
    from app import models

    patient = models.Patient(
        id=str(uuid.uuid4()),
        first_name="Cal",
        last_name=f"Endar-{uuid.uuid4().hex[:6]}",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient


def _make_appointment(db_session, provider_id, patient_id, starts_at, ends_at=None):
    from app import models

    appointment = models.Appointment(
        id=str(uuid.uuid4()),
        provider_id=provider_id,
        patient_id=patient_id,
        starts_at=starts_at,
        ends_at=ends_at or starts_at + timedelta(minutes=30),
        status="booked",
    )
    db_session.add(appointment)
    db_session.commit()
    db_session.refresh(appointment)
    return appointment


def _cleanup(db_session, *objects):
    from app import models

    for obj in objects:
        cls = type(obj)
        row = db_session.get(cls, obj.id)
        if row is not None:
            db_session.delete(row)
    db_session.commit()


# ---------------------------------------------------------------------------
# AC-014 / AC-016: only the requested provider's appointments, within the day
# ---------------------------------------------------------------------------


def test_ac014_ac016_calendar_returns_only_the_requested_providers_appointments_for_the_day(
    receptionist, db_session
):
    headers = _auth_headers(receptionist)
    provider_a = _make_provider(db_session, "Provider A")
    provider_b = _make_provider(db_session, "Provider B")
    patient = _make_patient(db_session)

    target_day = datetime(2026, 11, 4, tzinfo=UTC)
    appt_a = _make_appointment(db_session, provider_a.id, patient.id, target_day.replace(hour=9))
    appt_b = _make_appointment(db_session, provider_b.id, patient.id, target_day.replace(hour=10))
    # Another provider-A appointment outside the requested day must not appear.
    appt_a_other_day = _make_appointment(
        db_session, provider_a.id, patient.id, target_day + timedelta(days=5, hours=9)
    )

    try:
        response = client.get(
            CALENDAR_ENDPOINT,
            params={"provider_id": provider_a.id, "view": "day", "date": "2026-11-04"},
            headers=headers,
        )
        assert response.status_code == 200
        body = response.json()
        ids = {row["id"] for row in body}
        assert appt_a.id in ids
        assert appt_b.id not in ids
        assert appt_a_other_day.id not in ids
        for row in body:
            assert row["provider_id"] == provider_a.id
    finally:
        _cleanup(db_session, appt_a, appt_b, appt_a_other_day, patient, provider_a, provider_b)


# ---------------------------------------------------------------------------
# AC-015: day/week consistency, invalid view/date -> 422, missing JWT -> 401
# ---------------------------------------------------------------------------


def test_ac015_day_and_week_views_agree_on_an_overlapping_day(receptionist, db_session):
    headers = _auth_headers(receptionist)
    provider = _make_provider(db_session, "Provider Overlap")
    patient = _make_patient(db_session)

    # 2026-11-04 is a Wednesday; its week runs 2026-11-02 (Mon) .. 2026-11-08 (Sun).
    wednesday = datetime(2026, 11, 4, 9, tzinfo=UTC)
    appt = _make_appointment(db_session, provider.id, patient.id, wednesday)

    try:
        day_response = client.get(
            CALENDAR_ENDPOINT,
            params={"provider_id": provider.id, "view": "day", "date": "2026-11-04"},
            headers=headers,
        )
        week_response = client.get(
            CALENDAR_ENDPOINT,
            params={"provider_id": provider.id, "view": "week", "date": "2026-11-04"},
            headers=headers,
        )
        assert day_response.status_code == 200
        assert week_response.status_code == 200

        day_ids = {row["id"] for row in day_response.json()}
        week_ids = {row["id"] for row in week_response.json()}
        assert appt.id in day_ids
        assert appt.id in week_ids

        day_row = next(row for row in day_response.json() if row["id"] == appt.id)
        week_row = next(row for row in week_response.json() if row["id"] == appt.id)
        assert day_row == week_row
    finally:
        _cleanup(db_session, appt, patient, provider)


def test_ac015_invalid_view_returns_422(receptionist, db_session):
    headers = _auth_headers(receptionist)
    provider = _make_provider(db_session)
    try:
        response = client.get(
            CALENDAR_ENDPOINT,
            params={"provider_id": provider.id, "view": "month", "date": "2026-11-04"},
            headers=headers,
        )
        assert response.status_code == 422
    finally:
        _cleanup(db_session, provider)


def test_ac015_invalid_date_returns_422(receptionist, db_session):
    headers = _auth_headers(receptionist)
    provider = _make_provider(db_session)
    try:
        response = client.get(
            CALENDAR_ENDPOINT,
            params={"provider_id": provider.id, "view": "day", "date": "not-a-date"},
            headers=headers,
        )
        assert response.status_code == 422
    finally:
        _cleanup(db_session, provider)


def test_ac015_missing_jwt_returns_401(db_session):
    provider = _make_provider(db_session)
    try:
        response = client.get(
            CALENDAR_ENDPOINT,
            params={"provider_id": provider.id, "view": "day", "date": "2026-11-04"},
        )
        assert response.status_code == 401
    finally:
        _cleanup(db_session, provider)
