# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `dc52ca3` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
DevonTester is a generated clinic-appointment scheduling app for receptionist use, built as two separate applications in one repo. The frontend is a Vite + React 19 single-page app whose screens were already approved and currently render seeded sample data rather than live API calls. The backend is a FastAPI 0.115 service scaffolded from an (as-yet-unapproved) architecture: it exposes only a `/health` liveness route, uses SQLAlchemy with a SQLite database by default (switchable via `DATABASE_URL`), and has empty model/schema files ready for real endpoints to be added.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (compatible with Vite 6 / TypeScript 5.6, used for the frontend)
- npm
- Python 3.12 (matches backend/Dockerfile)
- pip
- Docker and Docker Compose (optional, for the PostgreSQL service in docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. Copy .env.example to .env and fill in any required values
3. cd frontend && npm install
4. cd backend && pip install -r requirements.txt
5. (Optional) docker-compose up -d to start a local PostgreSQL 16 instance if you want to point DATABASE_URL at Postgres instead of the default SQLite file
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally |
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service with auto-reload, creating SQLite tables on startup |
| db | `docker-compose up -d db` | Starts a local PostgreSQL 16 container (port 5432) as an alternative to the default SQLite database |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `frontend` | Vite + React 19 SPA; approved screens, UI/icon libraries, and the API client, running on seeded sample data |
| `frontend/src` | Application source: main.tsx entrypoint, lib/ helpers (api.ts, ui.tsx, icons.tsx, navigate.ts) |
| `frontend/e2e` | Playwright end-to-end specs |
| `backend` | FastAPI service scaffold: app package, Dockerfile, requirements, tests |
| `backend/app` | FastAPI app: main.py entrypoint, database.py (engine/session), models.py (SQLAlchemy models, currently empty), schemas.py (Pydantic schemas, currently just a stub response), routers/ for future per-component routers |
| `backend/tests` | Pytest tests (currently health check test) |
| `.quorq` | Quorq platform handoff metadata (handoff.json) |
| `docker-compose.yml` | Defines a local PostgreSQL 16 service for development |
| `.env.example` | Template for environment variables used by the project |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend organized as one router per approved architecture component, each owning its endpoints (backend/app/routers)
- Generated/unimplemented backend routes return a typed StubResponse (schemas.py) rather than raising, keeping the service startable with a complete OpenAPI document
- SQLAlchemy models all inherit from the shared Base in app/database.py; models.py is imported in main.py before Base.metadata.create_all so tables register
- Backend configuration via environment variables with safe local defaults: DATABASE_URL defaults to SQLite, ALLOWED_ORIGINS defaults to the Vite dev server origins
- Frontend path alias '@' maps to src/ (configured in vite.config.ts and tsconfig.json)
- Frontend API client (src/lib/api.ts) centralizes API_BASE_URL and bearer-token auth via VITE_API_BASE_URL / VITE_API_SECRET_KEY env vars; screens do not yet call it
- Code style enforced by ESLint + Prettier (frontend) and ruff (backend, config in ruff.toml)
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests located beside the components they cover |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint across the frontend; this is the gate the platform runs during development |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit (not covered by the build) |
| frontend e2e | `cd frontend && npm run test:e2e` | Runs Playwright acceptance tests from e2e/; boots backend+frontend locally unless E2E_BASE_URL is set (run npm run test:e2e:install first to fetch Chromium) |
| backend tests | `cd backend && pytest` | Runs the pytest suite (includes pytest-cov for coverage reporting) |
| backend lint | `cd backend && ruff check .` | Lints the backend code with ruff |
| backend format check | `cd backend && ruff format .` | Formats backend code with ruff |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend cannot reach the backend / CORS errors in the browser | Ensure the backend is running and, if serving from a non-default origin, set ALLOWED_ORIGINS (comma-separated) as an env var read by backend/app/main.py; locally the backend already allows http://localhost:5173 |
| `npm run build` succeeds but the app has type errors | Run `npm run typecheck` (tsc --noEmit) separately, since the build does not typecheck |
| Backend fails to import app module when running pytest from elsewhere | Run pytest from the backend/ directory; pytest.ini sets pythonpath = . so `import app` resolves from there |
| Playwright e2e tests fail to launch a browser | Run `npm run test:e2e:install` once to fetch Chromium before `npm run test:e2e` |
| Want to use PostgreSQL instead of the default SQLite | Start the db service with `docker-compose up -d db` and set DATABASE_URL (e.g. postgresql://app:app@localhost:5432/app) before starting the backend |
<!-- sdlc:auto:end troubleshooting -->
