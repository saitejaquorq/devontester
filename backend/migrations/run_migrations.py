"""Applies pending SQL migrations in this directory against DATABASE_URL.

Additive-only SQL files, applied in filename order, tracked in a
`schema_migrations` table so a rerun only applies what is new.

Run: backend/.venv/bin/python backend/migrations/run_migrations.py
"""

import os
import re
from pathlib import Path

import psycopg

MIGRATIONS_DIR = Path(__file__).resolve().parent


def _dsn(url: str) -> str:
    """``url`` with any SQLAlchemy driver suffix (e.g. +psycopg) removed."""
    return re.sub(r"^postgresql\+\w+://", "postgresql://", url)


def main() -> None:
    url = os.environ["DATABASE_URL"]
    with psycopg.connect(_dsn(url)) as conn:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations ("
            "filename TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())"
        )
        applied = {row[0] for row in conn.execute("SELECT filename FROM schema_migrations")}
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            if path.name in applied:
                continue
            with conn.transaction():
                conn.execute(path.read_text())
                conn.execute("INSERT INTO schema_migrations (filename) VALUES (%s)", (path.name,))
            print(f"applied {path.name}")
        conn.commit()


if __name__ == "__main__":
    main()
