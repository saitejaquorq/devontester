"""GET/POST /patients, GET/PATCH /patients/{id}."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth import get_current_account
from app.database import get_db
from app.models import Account, Patient
from app.schemas import PatientCreate, PatientOut, PatientUpdate

router = APIRouter(prefix="/patients", tags=["patients"])


def _get_or_404(db: Session, patient_id: str) -> Patient:
    patient = db.get(Patient, patient_id)
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return patient


@router.get("", response_model=list[PatientOut])
def list_patients(
    q: str | None = Query(default=None),
    db: Session = Depends(get_db),  # noqa: B008
    account: Account = Depends(get_current_account),  # noqa: B008
) -> list[Patient]:
    del account
    query = db.query(Patient)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Patient.first_name.ilike(like),
                Patient.last_name.ilike(like),
                Patient.phone.ilike(like),
                Patient.email.ilike(like),
            )
        )
    return query.order_by(Patient.created_at.desc()).all()


@router.post("", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db),  # noqa: B008
    account: Account = Depends(get_current_account),  # noqa: B008
) -> Patient:
    del account
    patient = Patient(
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        email=payload.email,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),  # noqa: B008
    account: Account = Depends(get_current_account),  # noqa: B008
) -> Patient:
    del account
    return _get_or_404(db, patient_id)


@router.patch("/{patient_id}", response_model=PatientOut)
def update_patient(
    patient_id: str,
    payload: PatientUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    account: Account = Depends(get_current_account),  # noqa: B008
) -> Patient:
    del account
    patient = _get_or_404(db, patient_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(patient, field, value)
    db.commit()
    db.refresh(patient)
    return patient
