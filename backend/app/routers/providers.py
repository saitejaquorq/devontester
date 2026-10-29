"""GET /providers."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_account
from app.database import get_db
from app.models import Account, Provider
from app.schemas import ProviderOut

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("", response_model=list[ProviderOut])
def list_providers(
    db: Session = Depends(get_db),  # noqa: B008
    account: Account = Depends(get_current_account),  # noqa: B008
) -> list[Provider]:
    del account
    return (
        db.query(Provider)
        .filter(Provider.is_active.is_(True))
        .order_by(Provider.name)
        .all()
    )
