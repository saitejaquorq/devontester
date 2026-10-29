"""JWT verification: the single place every protected route -- and the
blanket auth middleware in main.py -- checks a presented token against the
database. Other routers import `get_current_account` rather than touching
PyJWT or the revocation table directly.
"""

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Account, RevokedToken
from app.security import TokenError, decode_access_token


def _auth_failure() -> HTTPException:
    """One generic 401: callers never learn which part of the check failed."""
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")


def extract_bearer_token(request: Request) -> str:
    """The bearer token from the Authorization header, or a 401."""
    header = request.headers.get("Authorization", "")
    scheme, _, token = header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise _auth_failure()
    return token


def verify_token(token: str, db: Session) -> tuple[Account, dict]:
    """The signed-in, active account and verified claims for ``token``, or a
    401 for anything malformed, expired, revoked, or naming an account that
    no longer exists or has been deactivated."""
    try:
        payload = decode_access_token(token)
    except TokenError as exc:
        raise _auth_failure() from exc
    jti = payload.get("jti")
    if jti is None or db.get(RevokedToken, jti) is not None:
        raise _auth_failure()
    account = db.get(Account, payload.get("sub"))
    if account is None or not account.is_active:
        raise _auth_failure()
    return account, payload


def get_current_account(
    request: Request,
    db: Session = Depends(get_db),  # noqa: B008
) -> Account:
    """Reusable FastAPI dependency: the signed-in account for the presented
    token. Reuses what the blanket auth middleware already verified for this
    request when present, so a route does not re-verify the token nor hit
    the database twice; falls back to verifying directly so the dependency
    also works on its own.
    """
    cached = getattr(request.state, "account", None)
    if cached is not None:
        return cached
    token = extract_bearer_token(request)
    account, payload = verify_token(token, db)
    request.state.account = account
    request.state.token_payload = payload
    return account


def require_admin(
    account: Account = Depends(get_current_account),  # noqa: B008
) -> Account:
    """``get_current_account``, but only lets an admin through; any other
    (e.g. staff) role is a 403 (AC-007)."""
    if account.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
    return account


def get_token_payload(
    request: Request,
    account: Account = Depends(get_current_account),  # noqa: B008
) -> dict:
    """The verified JWT claims for the current request (e.g. logout's jti)."""
    del account  # ensures verification ran and request.state is populated
    return request.state.token_payload
