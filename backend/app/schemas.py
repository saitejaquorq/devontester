"""Pydantic request and response models.

One pair per entity in the approved data model, plus the placeholder every
generated route returns until it has been implemented.
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


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."
