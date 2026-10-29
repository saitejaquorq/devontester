"""GET /accounts, POST /accounts, PATCH /accounts/{id} -- admin-only account
management (US-003). Every route requires an admin caller; a staff caller
gets a 403 from the shared `require_admin` dependency (AC-006, AC-007).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import require_admin
from app.database import get_db
from app.models import Account
from app.schemas import AccountAdminOut, AccountCreate, AccountUpdate
from app.security import hash_password

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("", response_model=list[AccountAdminOut])
def list_accounts(
    db: Session = Depends(get_db),  # noqa: B008
    admin: Account = Depends(require_admin),  # noqa: B008
) -> list[Account]:
    del admin
    return db.query(Account).order_by(Account.created_at.desc()).all()


@router.post("", response_model=AccountAdminOut, status_code=status.HTTP_201_CREATED)
def create_account(
    payload: AccountCreate,
    db: Session = Depends(get_db),  # noqa: B008
    admin: Account = Depends(require_admin),  # noqa: B008
) -> Account:
    del admin
    account = Account(
        username=payload.username,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(account)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username already exists"
        ) from exc
    db.refresh(account)
    return account


@router.patch("/{account_id}", response_model=AccountAdminOut)
def update_account(
    account_id: str,
    payload: AccountUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    admin: Account = Depends(require_admin),  # noqa: B008
) -> Account:
    del admin
    account = db.get(Account, account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(account, field, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username already exists"
        ) from exc
    db.refresh(account)
    return account
