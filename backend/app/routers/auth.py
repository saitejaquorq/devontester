"""POST /auth/login, POST /auth/logout, GET /auth/me."""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.auth import get_current_account, get_token_payload
from app.database import get_db
from app.models import Account, RevokedToken
from app.security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

# Never field-specific: a caller must not be able to tell a bad username from
# a bad password (AC-002, NFR-002).
GENERIC_LOGIN_ERROR = "Invalid username or password"


class LoginRequest(BaseModel):
    username: str
    password: str


class AccountOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    account: AccountOut


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:  # noqa: B008
    account = db.query(Account).filter(Account.username == payload.username).first()
    if (
        account is None
        or not account.is_active
        or not verify_password(payload.password, account.password_hash)
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=GENERIC_LOGIN_ERROR)
    token, _ = create_access_token(account.id, account.username, account.role)
    return LoginResponse(access_token=token, account=AccountOut.model_validate(account))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    db: Session = Depends(get_db),  # noqa: B008
    token_payload: dict = Depends(get_token_payload),  # noqa: B008
) -> None:
    """Revokes the presented token server-side: a replay of it afterwards
    fails verification (AC-004, AC-005)."""
    jti = token_payload["jti"]
    if db.get(RevokedToken, jti) is None:
        expires_at = datetime.fromtimestamp(token_payload["exp"], tz=UTC)
        db.add(RevokedToken(jti=jti, expires_at=expires_at))
        db.commit()
    return None


@router.get("/me", response_model=AccountOut)
def me(account: Account = Depends(get_current_account)) -> AccountOut:  # noqa: B008
    return AccountOut.model_validate(account)
