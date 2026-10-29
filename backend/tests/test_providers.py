"""Provider API tests: GET /providers.

Requires a valid JWT, and returns only active providers (used by the
provider day/week calendar, US-007-3).
"""

import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

LOGIN_ENDPOINT = "/auth/login"
PROVIDERS_ENDPOINT = "/providers"


def _token(receptionist) -> str:
    response = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def _auth_headers(receptionist) -> dict:
    return {"Authorization": f"Bearer {_token(receptionist)}"}


def _make_provider(db_session, is_active=True):
    from app import models

    provider = models.Provider(
        id=str(uuid.uuid4()),
        name=f"Provider-{uuid.uuid4().hex[:6]}",
        is_active=is_active,
    )
    db_session.add(provider)
    db_session.commit()
    db_session.refresh(provider)
    return provider


def _cleanup(db_session, *providers):
    from app import models

    for provider in providers:
        row = db_session.get(models.Provider, provider.id)
        if row is not None:
            db_session.delete(row)
    db_session.commit()


def test_get_providers_requires_a_jwt():
    response = client.get(PROVIDERS_ENDPOINT)
    assert response.status_code == 401


def test_get_providers_rejects_an_invalid_token():
    response = client.get(
        PROVIDERS_ENDPOINT, headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401


def test_get_providers_returns_only_active_providers(receptionist, db_session):
    headers = _auth_headers(receptionist)
    active = _make_provider(db_session, is_active=True)
    inactive = _make_provider(db_session, is_active=False)

    try:
        response = client.get(PROVIDERS_ENDPOINT, headers=headers)
        assert response.status_code == 200
        ids = {row["id"] for row in response.json()}
        assert active.id in ids
        assert inactive.id not in ids
        for row in response.json():
            assert row["is_active"] is True
    finally:
        _cleanup(db_session, active, inactive)
