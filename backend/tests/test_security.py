"""Unit tests for password hashing and JWT session helpers."""

from datetime import UTC, datetime, timedelta

import jwt
import pytest

from app.security import (
    JWT_ALGORITHM,
    JWT_AUDIENCE,
    JWT_ISSUER,
    JWT_SECRET_KEY,
    TokenError,
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_ac001_hash_password_is_not_plaintext_and_verifies() -> None:
    hashed = hash_password("correct horse battery staple")

    assert hashed != "correct horse battery staple"
    assert verify_password("correct horse battery staple", hashed)
    assert not verify_password("wrong", hashed)


def test_ac001_create_and_decode_access_token_round_trips() -> None:
    token, payload = create_access_token("acc-1", "jdoe", "receptionist")

    decoded = decode_access_token(token)

    assert decoded["sub"] == "acc-1"
    assert decoded["username"] == "jdoe"
    assert decoded["jti"] == payload["jti"]


def test_decode_rejects_expired_token() -> None:
    now = datetime.now(UTC)
    expired = jwt.encode(
        {
            "sub": "acc-1",
            "username": "jdoe",
            "role": "receptionist",
            "iss": JWT_ISSUER,
            "aud": JWT_AUDIENCE,
            "iat": now - timedelta(hours=2),
            "exp": now - timedelta(hours=1),
            "jti": "x",
        },
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    with pytest.raises(TokenError):
        decode_access_token(expired)


def test_decode_rejects_wrong_signature() -> None:
    token, _ = create_access_token("acc-1", "jdoe", "receptionist")
    tampered = token[:-1] + ("a" if token[-1] != "a" else "b")

    with pytest.raises(TokenError):
        decode_access_token(tampered)
