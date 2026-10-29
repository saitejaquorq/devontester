"""SQLAlchemy models.

`Base` is already bound to the engine and `main.py` imports this module
before it creates the schema. Production schema changes for these tables
live in backend/migrations/; this module is also what the dev SQLite
scaffold creates its tables from.
"""

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

__all__ = ["Base", "Account", "RevokedToken", "Patient", "Provider", "Appointment"]


def _new_id() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(UTC)


class Account(Base):
    """A login: either an admin or a receptionist/staff member (US-003)."""

    __tablename__ = "accounts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_id)
    username: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="staff")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )


class RevokedToken(Base):
    """A session JWT's ``jti`` after logout: a replay of that token is
    rejected even though the signature and expiry are still valid."""

    __tablename__ = "revoked_tokens"

    jti: Mapped[str] = mapped_column(String(64), primary_key=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )


class Patient(Base):
    """A patient record: name and contact details (US-004)."""

    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_id)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )


class Provider(Base):
    """A clinician the calendar can be filtered to (US-007)."""

    __tablename__ = "providers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_id)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    specialty: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )


class Appointment(Base):
    """A booked slot for a patient with a provider (US-007)."""

    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_id)
    provider_id: Mapped[str] = mapped_column(String(36), ForeignKey("providers.id"), nullable=False)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patients.id"), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="booked")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )
