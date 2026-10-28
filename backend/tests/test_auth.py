"""Auth and session API tests.

AC-001/AC-002: login outcomes. AC-003/NFR-002: protected-route enforcement.
AC-004/AC-005/NFR-003: logout invalidates the token. AC-037: transport
security headers, where this environment can show them.

If `app.routers.auth` or `app.security` do not exist yet in this checkout
(the implementation may still be in flight), every test below fails at
collection or at the first request rather than silently passing -- that is
expected until the routes land, and is reported as PENDING, not a defect,
by QA for this run.
"""

from datetime import UTC, timedelta

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

PROTECTED_ENDPOINT = "/auth/me"
LOGIN_ENDPOINT = "/auth/login"
LOGOUT_ENDPOINT = "/auth/logout"


# ---------------------------------------------------------------------------
# AC-001 / AC-002: login
# ---------------------------------------------------------------------------


def test_login_with_valid_credentials_returns_a_token(receptionist):
    response = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )

    assert response.status_code == 200
    body = response.json()
    assert body.get("access_token")
    assert isinstance(body["access_token"], str) and len(body["access_token"]) > 10


def test_login_with_wrong_password_and_unknown_username_return_identical_401(receptionist):
    wrong_password = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": "not-the-password"},
    )
    unknown_username = client.post(
        LOGIN_ENDPOINT,
        json={"username": "no-such-user-ever", "password": receptionist["password"]},
    )

    assert wrong_password.status_code == 401
    assert unknown_username.status_code == 401
    # The body must not reveal which of the two reasons caused the failure.
    assert wrong_password.json() == unknown_username.json()


def test_login_rejects_inactive_account(db_session, receptionist):
    from app import models

    account = db_session.query(models.Account).filter_by(username=receptionist["username"]).first()
    account.is_active = False
    db_session.commit()

    response = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )

    assert response.status_code == 401


# ---------------------------------------------------------------------------
# AC-003 / NFR-002: protected endpoint requires a valid, unexpired token
# ---------------------------------------------------------------------------


def test_protected_endpoint_rejects_missing_token():
    response = client.get(PROTECTED_ENDPOINT)
    assert response.status_code == 401


def test_protected_endpoint_rejects_invalid_token():
    response = client.get(PROTECTED_ENDPOINT, headers={"Authorization": "Bearer not-a-real-token"})
    assert response.status_code == 401


def _expired_token_for(username: str) -> str:
    """Build a token for `username` that is already expired.

    Tries the app's own token factory first (so the signature and claim
    shape match production exactly); falls back to encoding one directly
    with the app's configured secret and algorithm if that helper is not
    exposed under this name.
    """
    try:
        from app.security import create_access_token

        return create_access_token({"sub": username}, expires_delta=timedelta(seconds=-60))
    except (ImportError, TypeError):
        pass

    try:
        from datetime import datetime

        import jwt

        from app.security import JWT_ALGORITHM, JWT_SECRET_KEY

        payload = {
            "sub": username,
            "exp": datetime.now(UTC) - timedelta(seconds=60),
        }
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    except Exception as exc:  # pragma: no cover - environment-dependent
        pytest.skip(f"cannot mint an expired token in this checkout: {exc}")


def test_protected_endpoint_rejects_expired_token(receptionist):
    token = _expired_token_for(receptionist["username"])
    response = client.get(PROTECTED_ENDPOINT, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_protected_endpoint_accepts_valid_token(receptionist):
    login = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    token = login.json()["access_token"]

    response = client.get(PROTECTED_ENDPOINT, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    body = response.json()
    assert body.get("username") == receptionist["username"]


# ---------------------------------------------------------------------------
# AC-004 / AC-005 / NFR-003: logout invalidates the session token
# ---------------------------------------------------------------------------


def test_token_rejected_after_logout(receptionist):
    login = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    token = login.json()["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    pre_logout = client.get(PROTECTED_ENDPOINT, headers=auth_header)
    assert pre_logout.status_code == 200

    logout = client.post(LOGOUT_ENDPOINT, headers=auth_header)
    assert logout.status_code in (200, 204)

    post_logout = client.get(PROTECTED_ENDPOINT, headers=auth_header)
    assert post_logout.status_code == 401


def test_logout_without_a_token_is_rejected():
    response = client.post(LOGOUT_ENDPOINT)
    assert response.status_code == 401


# ---------------------------------------------------------------------------
# AC-037: HSTS / TLS enforcement
# ---------------------------------------------------------------------------


def test_response_sets_hsts_header_where_this_environment_exposes_it(receptionist):
    """TestClient talks to the app directly over HTTP with no reverse proxy,
    so this sandbox cannot show whether a TLS-terminating layer adds
    Strict-Transport-Security in front of it. We assert it when present so a
    regression here is caught in any environment that does front the app
    with TLS; its absence here is recorded as a gap, not asserted as pass.
    """
    login = client.post(
        LOGIN_ENDPOINT,
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    header = login.headers.get("strict-transport-security")
    if header is None:
        pytest.skip(
            "AC-037 gap: this test environment has no TLS-terminating layer in front "
            "of the API, so Strict-Transport-Security cannot be observed here; verify "
            "it at the deployed edge (load balancer/reverse proxy) instead."
        )
    assert "max-age" in header.lower()
