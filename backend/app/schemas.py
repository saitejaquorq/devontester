"""Pydantic request and response models.

One pair per entity in the approved data model.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


def _validate_email(value: str | None) -> str | None:
    if value is None or value == "":
        return None
    from email_validator import EmailNotValidError, validate_email

    try:
        result = validate_email(value, check_deliverability=False)
    except EmailNotValidError as exc:
        raise ValueError(str(exc)) from exc
    return result.normalized


def _require_non_blank(value: str) -> str:
    if value is None or not value.strip():
        raise ValueError("must not be blank")
    return value


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str | None = None
    email: str | None = None

    @field_validator("first_name", "last_name")
    @classmethod
    def _check_required(cls, value: str) -> str:
        return _require_non_blank(value)

    @field_validator("email")
    @classmethod
    def _check_email(cls, value: str | None) -> str | None:
        return _validate_email(value)


class PatientUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    email: str | None = None

    @field_validator("first_name", "last_name")
    @classmethod
    def _check_optional_non_blank(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _require_non_blank(value)

    @field_validator("email")
    @classmethod
    def _check_email(cls, value: str | None) -> str | None:
        return _validate_email(value)


class PatientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    first_name: str
    last_name: str
    phone: str | None = None
    email: str | None = None
    created_at: datetime
    updated_at: datetime


class ProviderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    specialty: str | None = None
    is_active: bool


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    provider_id: str
    patient_id: str
    patient_name: str
    starts_at: datetime
    ends_at: datetime
    status: str
