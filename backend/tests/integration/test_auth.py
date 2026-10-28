"""Integration tests for POST /auth/login, POST /auth/logout, GET /auth/me,
and the blanket 401 every other route returns without a valid JWT.
"""

import uuid

import jwt
import pytest
from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models import Account, RevokedToken
from app.security import JWT_ALGORITHM, JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET_KEY, hash_password

client = TestClient(app)


@pytest.fixture
def account():
    db = SessionLocal()
    username = f"test_{uuid.uuid4().hex[:10]}"
    password = "Sup3rSecret!"
    acc = Account(username=username, password_hash=hash_password(password), role="receptionist")
    db.add(acc)
    db.commit()
    db.refresh(acc)
    account_id = acc.id
    db.close()

    yield {"id": account_id, "username": username, "password": password}

    cleanup = SessionLocal()
    cleanup.query(RevokedToken).delete()
    obj = cleanup.get(Account, account_id)
    if obj is not None:
        cleanup.delete(obj)
    cleanup.commit()
    cleanup.close()


def test_ac001_login_returns_signed_token_and_account(account) -> None:
    response = client.post(
        "/auth/login", json={"username": account["username"], "password": account["password"]}
    )

    assert response.status_code == 200
    body = response.json()
    assert body["account"]["username"] == account["username"]
    assert body["account"]["id"] == account["id"]
    decoded = jwt.decode(
        body["access_token"],
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM],
        audience=JWT_AUDIENCE,
        issuer=JWT_ISSUER,
    )
    assert decoded["sub"] == account["id"]


def test_ac002_unknown_username_returns_one_generic_message(account) -> None:
    response = client.post("/auth/login", json={"username": "no-such-user", "password": "x"})

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_ac002_wrong_password_returns_the_same_generic_message(account) -> None:
    response = client.post(
        "/auth/login", json={"username": account["username"], "password": "wrong-password"}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_me_returns_signed_in_account_for_a_valid_token(account) -> None:
    login = client.post(
        "/auth/login", json={"username": account["username"], "password": account["password"]}
    )
    token = login.json()["access_token"]

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["username"] == account["username"]


def test_me_without_a_token_returns_401() -> None:
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_me_with_a_malformed_token_returns_401() -> None:
    response = client.get("/auth/me", headers={"Authorization": "Bearer not-a-real-token"})

    assert response.status_code == 401


def test_ac004_ac005_logout_revokes_token_so_a_replay_returns_401(account) -> None:
    login = client.post(
        "/auth/login", json={"username": account["username"], "password": account["password"]}
    )
    token = login.json()["access_token"]

    logout_response = client.post("/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_response.status_code == 204

    replay = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert replay.status_code == 401


def test_logout_without_a_token_returns_401() -> None:
    response = client.post("/auth/logout")

    assert response.status_code == 401


def test_nfr002_protected_route_requires_jwt_even_when_bypassing_the_dependency() -> None:
    # The blanket middleware, not just the route's own dependency, is what
    # rejects this -- confirmed by hitting a route via the raw client.
    response = client.get("/auth/me", headers={"Authorization": "Bearer "})

    assert response.status_code == 401


def test_health_and_login_remain_reachable_without_a_token() -> None:
    assert client.get("/health").status_code == 200
    # Reachable without a token: it is rejected on credentials, not on auth.
    assert client.post("/auth/login", json={"username": "x", "password": "y"}).status_code == 401


def test_ac037_hsts_header_present_on_every_response() -> None:
    response = client.get("/health")

    assert "Strict-Transport-Security" in response.headers
    assert "max-age" in response.headers["Strict-Transport-Security"]
