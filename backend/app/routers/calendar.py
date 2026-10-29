"""GET /calendar?provider_id=&view=day|week&date=YYYY-MM-DD."""

from datetime import UTC, datetime, timedelta
from datetime import date as date_type
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_account
from app.database import get_db
from app.models import Account, Appointment, Patient
from app.schemas import AppointmentOut

router = APIRouter(prefix="/calendar", tags=["calendar"])


def _period(view: Literal["day", "week"], on: date_type) -> tuple[datetime, datetime]:
    """The half-open [start, end) UTC datetime range ``view`` covers for ``on``."""
    if view == "day":
        start = datetime.combine(on, datetime.min.time(), tzinfo=UTC)
        return start, start + timedelta(days=1)
    week_start = on - timedelta(days=on.weekday())
    start = datetime.combine(week_start, datetime.min.time(), tzinfo=UTC)
    return start, start + timedelta(days=7)


@router.get("", response_model=list[AppointmentOut])
def get_calendar(
    provider_id: str = Query(..., min_length=1),
    view: Literal["day", "week"] = Query(...),
    date: date_type = Query(...),  # noqa: B008
    db: Session = Depends(get_db),  # noqa: B008
    account: Account = Depends(get_current_account),  # noqa: B008
) -> list[AppointmentOut]:
    del account
    period_start, period_end = _period(view, date)
    rows = (
        db.query(Appointment, Patient)
        .join(Patient, Patient.id == Appointment.patient_id)
        .filter(
            Appointment.provider_id == provider_id,
            Appointment.starts_at >= period_start,
            Appointment.starts_at < period_end,
        )
        .order_by(Appointment.starts_at)
        .all()
    )
    return [
        AppointmentOut(
            id=appointment.id,
            provider_id=appointment.provider_id,
            patient_id=appointment.patient_id,
            patient_name=f"{patient.first_name} {patient.last_name}",
            starts_at=appointment.starts_at,
            ends_at=appointment.ends_at,
            status=appointment.status,
        )
        for appointment, patient in rows
    ]
