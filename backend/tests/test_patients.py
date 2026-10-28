"""Patient API tests: GET /patients, POST /patients, GET /patients/{id},
PATCH /patients/{id}.

AC-008: a valid POST persists the record and it is returned by both list and
detail GETs. AC-009: a blank required name is rejected with 422 naming the
missing field, and creates no row. AC-003: every one of the four routes
requires a valid JWT.
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
        "first_name": "Ellie",
        "last_name": f"Dawson-{unique}",
        "phone": "07700 900 318",
        "email": f"ellie.{unique}@example.com",
    }


def _cleanup_patient(db_session, patient_id: str) -> None:
    from app import models

    patient = db_session.get(models.Patient, patient_id)
    if patient is not None:
        db_session.delete(patient)
        db_session.commit()


def _count_patients(db_session) -> int:
    from app import models

    return db_session.query(models.Patient).count()


# ---------------------------------------------------------------------------
# AC-008: a valid POST persists the record and it is returned by GET /patients
# and GET /patients/{id}
# ---------------------------------------------------------------------------


def test_ac008_post_patients_with_valid_data_persists_and_is_returned(receptionist, db_session):
    headers = _auth_headers(receptionist)
    payload = _valid_payload()

    create_response = client.post(PATIENTS_ENDPOINT, json=payload, headers=headers)
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["first_name"] == payload["first_name"]
    assert created["last_name"] == payload["last_name"]
    assert created["phone"] == payload["phone"]
    assert created["email"] == payload["email"]
    patient_id = created["id"]

    try:
        list_response = client.get(PATIENTS_ENDPOINT, headers=headers)
        assert list_response.status_code == 200
        ids = [p["id"] for p in list_response.json()]
        assert patient_id in ids

        detail_response = client.get(f"{PATIENTS_ENDPOINT}/{patient_id}", headers=headers)
        assert detail_response.status_code == 200
        detail = detail_response.json()
        assert detail["id"] == patient_id
        assert detail["first_name"] == payload["first_name"]
        assert detail["last_name"] == payload["last_name"]
    finally:
        _cleanup_patient(db_session, patient_id)


# ---------------------------------------------------------------------------
# AC-009: a blank required name returns 422 naming the missing field, and
# creates no row
# ---------------------------------------------------------------------------


def test_ac009_post_patients_with_blank_first_name_returns_422_and_creates_no_row(
    receptionist, db_session
):
    headers = _auth_headers(receptionist)
    before = _count_patients(db_session)
    payload = _valid_payload()
    payload["first_name"] = ""

    response = client.post(PATIENTS_ENDPOINT, json=payload, headers=headers)

    assert response.status_code == 422
    body = response.json()
    offending_fields = {
        detail["loc"][-1] for detail in body["detail"] if isinstance(detail.get("loc"), list)
    }
    assert "first_name" in offending_fields
    assert _count_patients(db_session) == before


def test_ac009_post_patients_with_blank_last_name_returns_422_and_creates_no_row(
    receptionist, db_session
):
    headers = _auth_headers(receptionist)
    before = _count_patients(db_session)
    payload = _valid_payload()
    payload["last_name"] = "   "

    response = client.post(PATIENTS_ENDPOINT, json=payload, headers=headers)

    assert response.status_code == 422
    body = response.json()
    offending_fields = {
        detail["loc"][-1] for detail in body["detail"] if isinstance(detail.get("loc"), list)
    }
    assert "last_name" in offending_fields
    assert _count_patients(db_session) == before


def test_ac009_post_patients_with_missing_first_name_key_returns_422_and_creates_no_row(
    receptionist, db_session
):
    headers = _auth_headers(receptionist)
    before = _count_patients(db_session)
    payload = _valid_payload()
    del payload["first_name"]

    response = client.post(PATIENTS_ENDPOINT, json=payload, headers=headers)

    assert response.status_code == 422
    body = response.json()
    offending_fields = {
        detail["loc"][-1] for detail in body["detail"] if isinstance(detail.get("loc"), list)
    }
    assert "first_name" in offending_fields
    assert _count_patients(db_session) == before


# ---------------------------------------------------------------------------
# AC-003: every patient route requires a valid JWT
# ---------------------------------------------------------------------------


def test_ac003_get_patients_list_requires_a_valid_jwt():
    response = client.get(PATIENTS_ENDPOINT)
    assert response.status_code == 401


def test_ac003_post_patients_requires_a_valid_jwt():
    response = client.post(PATIENTS_ENDPOINT, json=_valid_payload())
    assert response.status_code == 401


def test_ac003_get_patient_by_id_requires_a_valid_jwt(receptionist, db_session):
    headers = _auth_headers(receptionist)
    created = client.post(PATIENTS_ENDPOINT, json=_valid_payload(), headers=headers)
    assert created.status_code == 201
    patient_id = created.json()["id"]

    try:
        response = client.get(f"{PATIENTS_ENDPOINT}/{patient_id}")
        assert response.status_code == 401
    finally:
        _cleanup_patient(db_session, patient_id)


def test_ac003_patch_patient_requires_a_valid_jwt(receptionist, db_session):
    headers = _auth_headers(receptionist)
    created = client.post(PATIENTS_ENDPOINT, json=_valid_payload(), headers=headers)
    assert created.status_code == 201
    patient_id = created.json()["id"]

    try:
        response = client.patch(f"{PATIENTS_ENDPOINT}/{patient_id}", json={"phone": "123"})
        assert response.status_code == 401
    finally:
        _cleanup_patient(db_session, patient_id)


def test_ac003_patient_routes_reject_an_invalid_token(receptionist, db_session):
    bad_headers = {"Authorization": "Bearer not-a-real-token"}
    created = client.post(
        PATIENTS_ENDPOINT, json=_valid_payload(), headers=_auth_headers(receptionist)
    )
    assert created.status_code == 201
    patient_id = created.json()["id"]

    try:
        assert client.get(PATIENTS_ENDPOINT, headers=bad_headers).status_code == 401
        assert (
            client.post(PATIENTS_ENDPOINT, json=_valid_payload(), headers=bad_headers).status_code
            == 401
        )
        assert (
            client.get(f"{PATIENTS_ENDPOINT}/{patient_id}", headers=bad_headers).status_code == 401
        )
        assert (
            client.patch(
                f"{PATIENTS_ENDPOINT}/{patient_id}", json={"phone": "999"}, headers=bad_headers
            ).status_code
            == 401
        )
    finally:
        _cleanup_patient(db_session, patient_id)
