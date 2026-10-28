"""Shared fixtures for the auth test suite.

Seeds receptionist accounts through the application's own ORM model and
password-hashing utility (`app.security`) rather than inserting raw rows, so
a seeded account is hashed exactly the way the real signup/seed path would
hash it. Runs against the real PostgreSQL service named in DATABASE_URL --
no SQLite stand-in, no mocked database.
"""

import uuid
from datetime import datetime, timezone

import pytest

from app.database import Base, SessionLocal, engine


@pytest.fixture(scope="session", autouse=True)
def _create_schema():
    """Create tables against the real database once per test session."""
    from app import models  # noqa: F401 -- registers tables on Base before create_all

    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def _hash(password: str) -> str:
    """Hash a password the way the application hashes one.

    Prefers the app's own helper (app.security.hash_password) so a seeded
    hash is verifiable by the real login handler; falls back to passlib
    bcrypt directly if the app has not exposed that helper yet.
    """
    try:
        from app.security import hash_password

        return hash_password(password)
    except ImportError:
        from passlib.hash import bcrypt

        return bcrypt.hash(password)


@pytest.fixture
def receptionist(db_session):
    """A seeded, active receptionist account with a known plaintext password."""
    from app import models

    username = f"qa.receptionist.{uuid.uuid4().hex[:8]}"
    password = "Correct-Horse-Battery-Staple-9!"
    user = models.User(
        id=str(uuid.uuid4()),
        username=username,
        password_hash=_hash(password),
        role="receptionist",
        is_active=True,
        created_at=datetime.now(timezone.utc),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    yield {"username": username, "password": password, "id": str(user.id)}

    db_session.delete(db_session.merge(user))
    db_session.commit()
