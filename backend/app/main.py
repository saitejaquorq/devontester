"""Application entrypoint.

One router per component that owns endpoints. Every route but /health and
/auth/login requires a valid, unrevoked session JWT (NFR-002); every
response carries HSTS so a browser that has reached this service once never
speaks plain HTTP to it again (AC-037, see docs/sdlc/deployment/deployment-guide.md).
"""

import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.auth import extract_bearer_token, verify_token
from app.database import Base, SessionLocal, engine
from app.routers import auth as auth_router

app = FastAPI(
    title="DevonTester",
    description=(
        "An appointment calendar app for clinic visits with history of every "
        "person available.\n"
        "Should have history of a user. used by the receptionist of the clinic. "
        "No access to patients"
    ),
    version="0.1.0",
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The scaffold ships no migrations for most tables, so they are created from the
# models on startup. The auth tables also have a migration under backend/migrations/
# for the deployed Postgres database; this call is additive and idempotent.
Base.metadata.create_all(bind=engine)

app.include_router(auth_router.router)

# Paths reachable with no token at all. Everything else -- present and future -- is
# behind the blanket check below, so a new router never has to remember to protect
# itself (NFR-002).
_PUBLIC_PATHS = {"/health", "/auth/login"}
_PUBLIC_PREFIXES = ("/docs", "/redoc", "/openapi.json")


@app.middleware("http")
async def enforce_auth_and_security_headers(request: Request, call_next):
    path = request.url.path
    if (
        request.method != "OPTIONS"
        and path not in _PUBLIC_PATHS
        and not path.startswith(_PUBLIC_PREFIXES)
    ):
        db = SessionLocal()
        try:
            token = extract_bearer_token(request)
            account, payload = verify_token(token, db)
        except HTTPException as exc:
            return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
        finally:
            db.close()
        request.state.account = account
        request.state.token_payload = payload

    response = await call_next(request)
    # HSTS: once a browser sees this header over HTTPS it never retries over
    # plain HTTP for the given age, covering AC-037 alongside the deployment
    # platform's own TLS termination and redirect (see deployment-guide.md).
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    return response


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only non-auth route that needs no token."""
    return {"status": "ok"}
