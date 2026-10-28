"""Password hashing and JWT session helpers.

The one place passlib and PyJWT are touched, so every other module works
with plain strings and dicts rather than a particular hashing or token
library.
"""

import os
import uuid
from datetime import UTC, datetime, timedelta

import jwt
from passlib.context import CryptContext

# A deployment sets JWT_SECRET_KEY; a fresh clone still starts without one,
# the same trade-off app/database.py makes for DATABASE_URL.
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-insecure-jwt-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_ISSUER = "devontester-api"
JWT_AUDIENCE = "devontester-clients"
ACCESS_TOKEN_TTL = timedelta(hours=12)

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """The bcrypt hash to store; never the password itself."""
    return _pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """True when ``password`` matches the stored hash; false on any mismatch
    or malformed hash, never an exception a caller has to remember to catch."""
    try:
        return _pwd_context.verify(password, password_hash)
    except ValueError:
        return False


def create_access_token(account_id: str, username: str, role: str) -> tuple[str, dict]:
    """A signed session token plus the claims it carries, including a ``jti``
    logout can later add to the revocation list."""
    now = datetime.now(UTC)
    payload = {
        "sub": account_id,
        "username": username,
        "role": role,
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": now,
        "exp": now + ACCESS_TOKEN_TTL,
        "jti": uuid.uuid4().hex,
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token, payload


class TokenError(Exception):
    """Any problem with a presented token: missing, malformed, expired,
    wrongly signed, or issued for a different issuer/audience."""


def decode_access_token(token: str) -> dict:
    """The verified claims, or ``TokenError`` -- never a bare PyJWT exception,
    so callers have exactly one failure mode to handle."""
    try:
        return jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
            issuer=JWT_ISSUER,
            audience=JWT_AUDIENCE,
            options={"require": ["exp", "iat", "sub", "jti"]},
        )
    except jwt.PyJWTError as exc:
        raise TokenError(str(exc)) from exc
