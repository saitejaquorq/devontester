"""Creates a usable admin test account; safe to run repeatedly.

Run: backend/.venv/bin/python backend/scripts/seed_account.py [username] [password] [role]
Defaults to username "receptionist", password "ChangeMe123!", role "admin"
when no arguments are given.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models import Account  # noqa: E402
from app.security import hash_password  # noqa: E402

DEFAULT_USERNAME = "receptionist"
DEFAULT_PASSWORD = "ChangeMe123!"
DEFAULT_ROLE = "admin"


def seed(
    username: str = DEFAULT_USERNAME, password: str = DEFAULT_PASSWORD, role: str = DEFAULT_ROLE
) -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Account).filter(Account.username == username).first()
        if existing is not None:
            print(f"account '{username}' already exists")
            return
        db.add(Account(username=username, password_hash=hash_password(password), role=role))
        db.commit()
        print(f"created account '{username}' with role '{role}'")
    finally:
        db.close()


if __name__ == "__main__":
    args = sys.argv[1:]
    seed(*args) if args else seed()
