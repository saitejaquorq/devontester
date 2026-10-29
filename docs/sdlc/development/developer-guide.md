# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `880146b` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
DevonTester is an appointment-calendar tool for clinic receptionists to manage patients, providers, and bookings, with a full audit-style history. It is split into two independently generated apps in one repo: a React 19 + Vite SPA (frontend/) with approved screens currently running on seeded sample data, and a FastAPI 0.115 service (backend/) backed by SQLAlchemy models, SQLite by default locally (Postgres 16 in the approved architecture/production) exposing JWT-based auth, accounts, patients, providers, and calendar endpoints.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for npm/Vite 6, React 19 toolchain)
- npm
- Python 3.12
- pip
- Docker (optional, for the Dockerfile and docker-compose Postgres service)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. cd backend
3. pip install -r requirements.txt
4. (optional) set DATABASE_URL to point at Postgres; otherwise a local app.db SQLite file is created automatically on startup
5. uvicorn app.main:app --reload   # starts the API on http://localhost:8000, creates tables via Base.metadata.create_all
6. In a new terminal: cd frontend
7. npm install
8. npm run dev   # starts the Vite dev server, defaults to calling http://localhost:8000 unless VITE_API_BASE_URL is set
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service locally with auto-reload; uses SQLite (app.db) unless DATABASE_URL is set |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally |
| local db (optional) | `docker compose up db` | Starts a Postgres 16 container (app/app/app) if you want to run against Postgres instead of the default SQLite file |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `backend` | FastAPI service: app code, migrations, scripts, tests |
| `backend/app` | Application package: main.py entrypoint, models.py (SQLAlchemy), schemas.py (Pydantic), auth.py/security.py, and routers/ (one file per resource: accounts, auth, calendar, patients, providers) |
| `backend/migrations` | SQL migration files and run_migrations.py for the deployed Postgres auth/patients/providers/appointments schema |
| `backend/scripts` | Operational scripts: check_connections.py, seed_account.py |
| `backend/tests` | Pytest unit and integration tests for routers, auth, security, and scope boundaries |
| `frontend` | React 19 + Vite SPA: approved screens, API client, Playwright e2e tests |
| `frontend/src` | App source: App.tsx (routing/shell), screens/ (one module per approved screen), lib/ (api client, auth, ui/icon vocabulary, brand tokens) |
| `frontend/e2e` | Playwright acceptance specs run against either a locally booted backend+frontend or a deployed E2E_BASE_URL |
| `.github/workflows` | CI/CD: deploy.yml builds and pushes the backend image, builds the frontend with baked-in API URL, and deploys to AWS Amplify via OIDC |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- One FastAPI router per resource (accounts, auth, calendar, patients, providers), each mounted in app/main.py
- Pydantic request/response schemas in schemas.py are kept separate from SQLAlchemy models in models.py
- A single HTTP middleware in main.py enforces auth (session JWT via Bearer token) and HSTS on every route except /health, /auth/login, and docs paths, so new routers are protected by default
- Routers depend on get_db (per-request DB session) and get_current_account/require_admin for auth instead of re-implementing checks
- Frontend screens live one-per-file under src/screens, matching the approved design; shared UI/icon primitives live in src/lib/ui.tsx and src/lib/icons.tsx
- Frontend uses a path alias @ -> src (see tsconfig.json and vite.config.ts)
- Frontend tests are colocated beside the code they test (e.g. Patients.tsx / Patients.test.tsx); Playwright specs live separately under e2e/
- API base URL and auth are centralized in src/lib/api.ts (apiFetch, ApiError, session token storage)
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs unit and integration tests under backend/tests |
| backend lint | `cd backend && ruff check .` | Lints backend Python code |
| backend format | `cd backend && ruff format .` | Formats backend Python code |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests under src/ |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit (not run by npm run build) |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the app; this gates development |
| frontend e2e install | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser Playwright needs |
| frontend e2e | `cd frontend && npm run test:e2e` | Runs Playwright specs from e2e/; without E2E_BASE_URL it boots the backend (via backend/.venv) and builds+serves the frontend itself |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend requests fail with CORS errors | Set ALLOWED_ORIGINS on the backend to a comma-separated list including the frontend's origin; defaults to http://localhost:5173 and http://127.0.0.1:5173 only |
| pytest fails with 'ModuleNotFoundError: app' | Run pytest from the backend/ directory; pytest.ini sets pythonpath = . relative to that location |
| 401 errors on every endpoint except /health and /auth/login | Log in via POST /auth/login to get an access_token, then send it as 'Authorization: Bearer <token>' on subsequent requests (the frontend's src/lib/api.ts does this automatically once signed in) |
| bcrypt-related errors installing/running the backend | requirements.txt pins bcrypt==4.0.1 specifically because passlib 1.7.4's self-test breaks on newer bcrypt; ensure that pin is respected (avoid upgrading bcrypt independently) |
| Playwright e2e tests fail to start the backend | The e2e webServer config expects a backend/.venv with dependencies installed and launches it with .venv/bin/python; create that virtualenv and pip install -r backend/requirements.txt into it, or set E2E_BASE_URL to point at an already-running backend+frontend |
| npm run build succeeds but tsc fails later | Run npm run typecheck explicitly; vite build does not typecheck and can pass with TypeScript errors still present |
<!-- sdlc:auto:end troubleshooting -->
