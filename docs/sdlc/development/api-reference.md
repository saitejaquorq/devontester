# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| POST | /auth/login | login | `backend/app/routers/auth.py:40` | — |
| POST | /auth/logout | logout | `backend/app/routers/auth.py:53` | — |
| GET | /auth/me | me | `backend/app/routers/auth.py:68` | — |
| GET | /health | health | `backend/app/main.py:88` | Liveness probe, and the only non-auth route that needs no token. |
| GET | /patients | list_patients | `backend/app/routers/patients.py:22` | — |
| POST | /patients | create_patient | `backend/app/routers/patients.py:43` | — |
| GET | /patients/{patient_id} | get_patient | `backend/app/routers/patients.py:62` | — |
| PATCH | /patients/{patient_id} | update_patient | `backend/app/routers/patients.py:72` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- GET /accounts
- GET /appointments/today
- GET /calendar
- GET /help
- GET /patients/{id}
- GET /patients/{id}/history
- GET /providers
- PATCH /accounts/{id}
- PATCH /appointments/{id}
- PATCH /appointments/{id}/status
- PATCH /patients/{id}
- POST /accounts
- POST /appointments

**Code only:**

- GET /patients/{patient_id}
- PATCH /patients/{patient_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `d3dbc3c`
<!-- sdlc:auto:end source -->
