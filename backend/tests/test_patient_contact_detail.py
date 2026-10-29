"""US-005-2 -- patient contact-detail editing (AC-010, AC-011).

AC-010: PATCH /patients/{id} persists a changed phone and email and returns
the updated record. AC-011: PATCH with a malformed email returns 422 and the
stored row is unchanged. Also verifies PATCH without a valid JWT returns 401.

Runs against the real PostgreSQL service named by DATABASE_URL -- no mock,
no stand-in database.
"""

import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

LOGIN_ENDPOINT = "/auth/login"
PATIENTS_ENDPOINT = "/patients"


def _token(receptionist) -> str:
    response = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def _auth_headers(receptionist) -> dict:
    return {"Authorization": f"Bearer {_token(receptionist)}"}


def _valid_payload() -> dict:
    unique = uuid.uuid4().hex[:8]
    return {
        "first_name": "Priya",
        "last_name": f"Okafor-{unique}",
        "phone": "07700 900 100",
        "email": f"priya.{unique}@example.com",
    }


def _create_patient(headers: dict) -> dict:
    response = client.post(PATIENTS_ENDPOINT, json=_valid_payload(), headers=headers)
    assert response.status_code == 201
    return response.json()


def _cleanup_patient(db_session, patient_id: str) -> None:
    from app import models

    patient = db_session.get(models.Patient, patient_id)
    if patient is not None:
        db_session.delete(patient)
        db_session.commit()


def _row_from_db(db_session, patient_id: str):
    from app import models

    return db_session.get(models.Patient, patient_id)


# ---------------------------------------------------------------------------
# AC-010: a changed phone and email are persisted and returned
# ---------------------------------------------------------------------------


def test_ac010_patch_patients_persists_a_changed_phone_and_email_and_returns_the_updated_record(
    receptionist, db_session
):
    headers = _auth_headers(receptionist)
    created = _create_patient(headers)
    patient_id = created["id"]
    new_phone = "07700 900 999"
    unique = uuid.uuid4().hex[:8]
    new_email = f"updated.{unique}@example.com"

    try:
        response = client.patch(
            f"{PATIENTS_ENDPOINT}/{patient_id}",
            json={"phone": new_phone, "email": new_email},
            headers=headers,
        )

        assert response.status_code == 200
        body = response.json()
        assert body["id"] == patient_id
        assert body["phone"] == new_phone
        assert body["email"] == new_email

        # Persisted: a fresh GET reflects the change.
        detail = client.get(f"{PATIENTS_ENDPOINT}/{patient_id}", headers=headers)
        assert detail.status_code == 200
        assert detail.json()["phone"] == new_phone
        assert detail.json()["email"] == new_email

        # Persisted at the row level too.
        db_session.expire_all()
        row = _row_from_db(db_session, patient_id)
        assert row.phone == new_phone
        assert row.email == new_email
    finally:
        _cleanup_patient(db_session, patient_id)


# ---------------------------------------------------------------------------
# AC-011: a malformed email returns 422 and the stored row is unchanged
# ---------------------------------------------------------------------------


def test_ac011_patch_patients_with_a_malformed_email_returns_422_and_leaves_the_row_unchanged(
    receptionist, db_session
):
    headers = _auth_headers(receptionist)
    created = _create_patient(headers)
    patient_id = created["id"]
    original_phone = created["phone"]
    original_email = created["email"]

    try:
        response = client.patch(
            f"{PATIENTS_ENDPOINT}/{patient_id}",
            json={"phone": "07700 900 321", "email": "not-an-email"},
            headers=headers,
        )

        assert response.status_code == 422
        body = response.json()
        offending_fields = {
            detail["loc"][-1] for detail in body["detail"] if isinstance(detail.get("loc"), list)
        }
        assert "email" in offending_fields

        # The stored row is unchanged -- including the phone that rode along
        # with the rejected email in the same request.
        db_session.expire_all()
        row = _row_from_db(db_session, patient_id)
        assert row.phone == original_phone
        assert row.email == original_email
    finally:
        _cleanup_patient(db_session, patient_id)


# ---------------------------------------------------------------------------
# PATCH /patients/{id} without a valid JWT returns 401
# ---------------------------------------------------------------------------


def test_patch_patients_without_a_valid_jwt_returns_401(receptionist, db_session):
    headers = _auth_headers(receptionist)
    created = _create_patient(headers)
    patient_id = created["id"]

    try:
        no_token = client.patch(
            f"{PATIENTS_ENDPOINT}/{patient_id}", json={"phone": "07700 900 000"}
        )
        assert no_token.status_code == 401

        bad_token = client.patch(
            f"{PATIENTS_ENDPOINT}/{patient_id}",
            json={"phone": "07700 900 000"},
            headers={"Authorization": "Bearer not-a-real-token"},
        )
        assert bad_token.status_code == 401
    finally:
        _cleanup_patient(db_session, patient_id)
