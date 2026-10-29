# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /accounts | list_accounts | `backend/app/routers/accounts.py:19` | — |
| POST | /accounts | create_account | `backend/app/routers/accounts.py:28` | — |
| PATCH | /accounts/{account_id} | update_account | `backend/app/routers/accounts.py:52` | — |
| POST | /auth/login | login | `backend/app/routers/auth.py:40` | — |
| POST | /auth/logout | logout | `backend/app/routers/auth.py:53` | — |
| GET | /auth/me | me | `backend/app/routers/auth.py:68` | — |
| GET | /calendar | get_calendar | `backend/app/routers/calendar.py:28` | — |
| GET | /health | health | `backend/app/main.py:94` | Liveness probe, and the only non-auth route that needs no token. |
| GET | /patients | list_patients | `backend/app/routers/patients.py:22` | — |
| POST | /patients | create_patient | `backend/app/routers/patients.py:43` | — |
| GET | /patients/{patient_id} | get_patient | `backend/app/routers/patients.py:62` | — |
| PATCH | /patients/{patient_id} | update_patient | `backend/app/routers/patients.py:72` | — |
| GET | /providers | list_providers | `backend/app/routers/providers.py:14` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- GET /appointments/today
- GET /help
- GET /patients/{id}
- GET /patients/{id}/history
- PATCH /accounts/{id}
- PATCH /appointments/{id}
- PATCH /appointments/{id}/status
- PATCH /patients/{id}
- POST /appointments

**Code only:**

- GET /patients/{patient_id}
- PATCH /accounts/{account_id}
- PATCH /patients/{patient_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `880146b`
<!-- sdlc:auto:end source -->
