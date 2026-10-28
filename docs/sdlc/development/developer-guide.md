# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `d3dbc3c` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
DevonTester is a two-part generated clinic application for receptionists to manage appointment calendars and patient records. The frontend is a Vite + React 19 single-page app with approved, reviewed screens that currently run on seeded sample data; the backend is a FastAPI 0.115 service that implements JWT-based session auth and a patients CRUD API, backed by SQLAlchemy models that default to a local SQLite file (app.db) for easy local runs, or PostgreSQL 16 via DATABASE_URL in deployed environments. Every backend route except /health and /auth/login requires a valid bearer session token, enforced centrally by a FastAPI middleware.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for the frontend's Vite 6 / React 19 / TypeScript 5.6 toolchain)
- Python 3.12 (matches backend/Dockerfile)
- pip
- Docker and Docker Compose (optional, to run the PostgreSQL 16 service in docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository and copy .env.example to .env, filling in any required values
2. cd frontend && npm install
3. cd backend && pip install -r requirements.txt
4. (optional) from the repo root, run docker-compose up -d to start a local PostgreSQL 16 database, then set DATABASE_URL to point at it; otherwise the backend uses a local SQLite file (sqlite:///./app.db) with no extra setup
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA |
| frontend build | `cd frontend && npm run build` | Bundles the frontend app for deployment (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the built frontend bundle locally |
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service locally with auto-reload, creating SQLite tables on startup |
| db up | `docker-compose up -d` | Starts a local PostgreSQL 16 container defined in docker-compose.yml |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `frontend/` | Vite + React 19 SPA; approved UI screens running on seeded sample data |
| `frontend/src` | App source: screens, shared UI/icon/brand libraries, API client (lib/api.ts), auth context (lib/auth.ts) |
| `frontend/e2e` | Playwright acceptance specs run against a locally built app or a deployed URL |
| `backend/` | FastAPI service implementing auth and patients endpoints |
| `backend/app` | Application code: main.py entrypoint, routers/, models.py, schemas.py, auth.py, security.py, database.py |
| `backend/migrations` | Raw SQL migrations for the auth and patients tables, applied to the deployed Postgres database |
| `backend/tests` | Pytest unit and integration test suite, including scope-boundary and security tests |
| `backend/scripts` | Operational scripts: seed_account.py (create a login) and check_connections.py |
| `.github/workflows` | CI/CD: deploy.yml builds/pushes the backend image and deploys the frontend via AWS Amplify |
| `.quorq/` | Quorq platform metadata (handoff/prepared state), not part of the application runtime |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend: one APIRouter per component (auth, patients), each with its own URL prefix and tag
- Pydantic schema naming pattern per entity: <Entity>Create, <Entity>Update, <Entity>Out
- SQLAlchemy models use string UUID primary keys and created_at/updated_at timestamp columns
- A single FastAPI middleware enforces bearer-token auth on every route except /health and /auth/login, so new routers are protected by default
- Frontend screens live one-per-file under src/screens/; shared primitives (components, icons, brand tokens) live in src/lib/ui.tsx, icons.tsx, brand.ts
- All backend API calls go through the single apiFetch helper in src/lib/api.ts, which attaches the bearer token, handles 401s via a global event, and throws a typed ApiError
- Session token persisted in localStorage under a single documented key, not in a build-time secret
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| frontend unit | `cd frontend && npm test` | Runs Vitest component tests located beside the components they cover |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit (not run as part of the build) |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend codebase |
| frontend e2e | `cd frontend && npm run test:e2e:install && npm run test:e2e` | Installs the Chromium browser then runs Playwright specs from e2e/; without E2E_BASE_URL it boots the backend (from backend/.venv) and a built/served frontend locally |
| backend test | `cd backend && pytest` | Runs the pytest suite (unit, integration, auth, security, scope-boundary tests) |
| backend lint | `cd backend && ruff check .` | Lints the backend Python code |
| backend format | `cd backend && ruff format .` | Formats the backend Python code |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend calls to the API fail with a CORS error | Run the frontend on the default Vite dev ports (http://localhost:5173 or 127.0.0.1:5173), which are allowed by default, or set the backend's ALLOWED_ORIGINS env var to a comma-separated list including your frontend origin |
| `npm run build` succeeds but the app is actually type-broken | Build does not run the TypeScript compiler; run `npm run typecheck` (tsc --noEmit) separately before relying on the bundle |
| `pip install -r requirements.txt` fails on the passlib/bcrypt self-test | requirements.txt already pins bcrypt==4.0.1 for passlib compatibility; ensure no other bcrypt version is installed in the environment |
| Running `pytest` from the repo root fails with `ModuleNotFoundError: app` | Run pytest from inside backend/ (pytest.ini sets pythonpath=. relative to that directory) so `import app` resolves |
| Playwright e2e tests can't start the backend webServer | Create a Python virtualenv at backend/.venv and install backend/requirements.txt into it before running `npm run test:e2e`, since playwright.config.ts invokes backend/.venv/bin/python directly |
<!-- sdlc:auto:end troubleshooting -->
