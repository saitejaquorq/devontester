"""Account management API tests: GET/POST /accounts, PATCH /accounts/{id}.

AC-006: an admin can create, edit and deactivate a receptionist (staff)
account, and every change persists. A deactivated account can no longer log
in. AC-007: a staff-role token is refused (403) on every /accounts route,
and every /accounts route refuses an anonymous caller (401). GET /auth/me
exposes the caller's role.

Accounts are seeded directly through the application's own ORM model and
password-hashing helper (app.models.Account / app.security.hash_password)
against the real database named by DATABASE_URL -- no mock, no stand-in.
"""

import uuid
from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

LOGIN_ENDPOINT = "/auth/login"
ME_ENDPOINT = "/auth/me"
ACCOUNTS_ENDPOINT = "/accounts"


def _make_account(db_session, role: str):
    from app import models
    from app.security import hash_password

    username = f"qa.{role}.{uuid.uuid4().hex[:8]}"
    password = "Qa-Accounts-Pass-9!"
    account = models.Account(
        id=str(uuid.uuid4()),
        username=username,
        password_hash=hash_password(password),
        role=role,
        is_active=True,
        created_at=datetime.now(UTC),
    )
    db_session.add(account)
    db_session.commit()
    db_session.refresh(account)
    return {"id": account.id, "username": username, "password": password}


@pytest.fixture
def admin(db_session):
    acc = _make_account(db_session, "admin")
    yield acc
    from app import models

    row = db_session.get(models.Account, acc["id"])
    if row is not None:
        db_session.delete(row)
        db_session.commit()


@pytest.fixture
def staff(db_session):
    acc = _make_account(db_session, "staff")
    yield acc
    from app import models

    row = db_session.get(models.Account, acc["id"])
    if row is not None:
        db_session.delete(row)
        db_session.commit()


def _token(creds: dict) -> str:
    response = client.post(
        LOGIN_ENDPOINT, json={"username": creds["username"], "password": creds["password"]}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def _auth_headers(creds: dict) -> dict:
    return {"Authorization": f"Bearer {_token(creds)}"}


def _cleanup_account(db_session, account_id: str) -> None:
    from app import models

    row = db_session.get(models.Account, account_id)
    if row is not None:
        db_session.delete(row)
        db_session.commit()


# ---------------------------------------------------------------------------
# AC-006: admin creates, edits and deactivates a receptionist/staff account,
# and every change persists
# ---------------------------------------------------------------------------


def test_ac006_admin_can_create_edit_and_deactivate_an_account_and_changes_persist(
    admin, db_session
):
    headers = _auth_headers(admin)
    new_username = f"qa.receptionist.{uuid.uuid4().hex[:8]}"
    new_password = "Receptionist-Pass-9!"

    create_response = client.post(
        ACCOUNTS_ENDPOINT,
        json={"username": new_username, "password": new_password, "role": "staff"},
        headers=headers,
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["username"] == new_username
    assert created["role"] == "staff"
    assert created["is_active"] is True
    account_id = created["id"]

    try:
        # Persists: visible in the list.
        list_response = client.get(ACCOUNTS_ENDPOINT, headers=headers)
        assert list_response.status_code == 200
        listed = next(a for a in list_response.json() if a["id"] == account_id)
        assert listed["username"] == new_username
        assert listed["role"] == "staff"

        # Edit: promote to admin.
        edit_response = client.patch(
            f"{ACCOUNTS_ENDPOINT}/{account_id}", json={"role": "admin"}, headers=headers
        )
        assert edit_response.status_code == 200
        assert edit_response.json()["role"] == "admin"

        list_after_edit = client.get(ACCOUNTS_ENDPOINT, headers=headers)
        listed_after_edit = next(a for a in list_after_edit.json() if a["id"] == account_id)
        assert listed_after_edit["role"] == "admin"

        # Deactivate.
        deactivate_response = client.patch(
            f"{ACCOUNTS_ENDPOINT}/{account_id}", json={"is_active": False}, headers=headers
        )
        assert deactivate_response.status_code == 200
        assert deactivate_response.json()["is_active"] is False

        list_after_deactivate = client.get(ACCOUNTS_ENDPOINT, headers=headers)
        listed_after_deactivate = next(
            a for a in list_after_deactivate.json() if a["id"] == account_id
        )
        assert listed_after_deactivate["is_active"] is False
    finally:
        _cleanup_account(db_session, account_id)


def test_deactivated_account_can_no_longer_log_in(admin, db_session):
    headers = _auth_headers(admin)
    new_username = f"qa.receptionist.{uuid.uuid4().hex[:8]}"
    new_password = "Receptionist-Pass-9!"

    created = client.post(
        ACCOUNTS_ENDPOINT,
        json={"username": new_username, "password": new_password, "role": "staff"},
        headers=headers,
    ).json()
    account_id = created["id"]

    try:
        # Logs in fine while active.
        pre = client.post(LOGIN_ENDPOINT, json={"username": new_username, "password": new_password})
        assert pre.status_code == 200

        client.patch(
            f"{ACCOUNTS_ENDPOINT}/{account_id}", json={"is_active": False}, headers=headers
        )

        post = client.post(
            LOGIN_ENDPOINT, json={"username": new_username, "password": new_password}
        )
        assert post.status_code == 401
    finally:
        _cleanup_account(db_session, account_id)


# ---------------------------------------------------------------------------
# AC-007: a staff-role token gets 403 on /accounts routes; every /accounts
# route rejects an anonymous caller with 401
# ---------------------------------------------------------------------------


def test_ac007_staff_token_receives_403_on_get_accounts(staff):
    headers = _auth_headers(staff)
    response = client.get(ACCOUNTS_ENDPOINT, headers=headers)
    assert response.status_code == 403


def test_ac007_staff_token_receives_403_on_post_accounts(staff):
    headers = _auth_headers(staff)
    response = client.post(
        ACCOUNTS_ENDPOINT,
        json={
            "username": f"blocked.{uuid.uuid4().hex[:8]}",
            "password": "Whatever-9!",
            "role": "staff",
        },
        headers=headers,
    )
    assert response.status_code == 403


def test_ac007_staff_token_receives_403_on_patch_accounts(staff):
    headers = _auth_headers(staff)
    response = client.patch(
        f"{ACCOUNTS_ENDPOINT}/{staff['id']}", json={"role": "admin"}, headers=headers
    )
    assert response.status_code == 403


def test_ac007_accounts_routes_return_401_without_a_jwt():
    assert client.get(ACCOUNTS_ENDPOINT).status_code == 401
    assert (
        client.post(
            ACCOUNTS_ENDPOINT,
            json={"username": "no-token", "password": "Whatever-9!", "role": "staff"},
        ).status_code
        == 401
    )
    assert (
        client.patch(f"{ACCOUNTS_ENDPOINT}/{uuid.uuid4()}", json={"role": "admin"}).status_code
        == 401
    )


# ---------------------------------------------------------------------------
# GET /auth/me exposes the caller's role
# ---------------------------------------------------------------------------


def test_auth_me_exposes_the_callers_role_for_admin(admin):
    headers = _auth_headers(admin)
    response = client.get(ME_ENDPOINT, headers=headers)
    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_auth_me_exposes_the_callers_role_for_staff(staff):
    headers = _auth_headers(staff)
    response = client.get(ME_ENDPOINT, headers=headers)
    assert response.status_code == 200
    assert response.json()["role"] == "staff"
