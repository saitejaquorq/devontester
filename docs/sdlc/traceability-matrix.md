# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Receptionist sign-in | US-001, US-001-T1, US-001-T2, US-001-T3, US-001-T4 | 1 | GET /auth/me, POST /auth/login, api_backend, database, users, web_frontend | backend/app/auth.py, backend/app/main.py, backend/app/models.py, backend/app/routers/auth.py, backend/app/security.py +18 more | 9eb9e55 | delivered | not run | 3/3 tested · 1/3 passing | d3dbc3ca537a |
| US-002 | EPIC-001 | Sign out | US-002 | 1 | POST /auth/logout, api_backend, users, web_frontend | — | 9eb9e55 | delivered | not run | 2/2 tested · 0/2 passing | d3dbc3ca537a |
| US-003 | EPIC-001 | Admin and staff roles | US-003, US-003-T1, US-003-T2, US-003-T3, US-003-T4 | 2 | GET /accounts, PATCH /accounts/{id}, POST /accounts, api_backend, database, users, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-004 | EPIC-002 | Add a new patient record | US-004 | 1 | GET /patients, POST /patients, api_backend, database, patients, web_frontend | backend/app/main.py, backend/app/models.py, backend/app/routers/patients.py, backend/app/schemas.py, backend/migrations/0002_create_patients_table.sql +5 more | 36c8db4 | delivered | not run | 2/2 tested · 0/2 passing | d3dbc3ca537a |
| US-005 | EPIC-002 | Edit an existing patient record | US-005 | 2 | PATCH /patients/{id}, api_backend, patients, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-006 | EPIC-002 | Find a patient | US-006 | 3 | GET /patients, api_backend, patients, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-007 | EPIC-003 | View a provider's day or week calendar | US-007, US-007-T1, US-007-T2, US-007-T3 | 2 | GET /calendar, GET /providers, api_backend, appointments, providers, web_frontend | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-008 | EPIC-003 | Today's appointments overview | US-008 | 4 | GET /appointments/today, api_backend, appointments, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-009 | EPIC-004 | Book an appointment | US-009, US-009-T1, US-009-T2, US-009-T3, US-009-T4 | 3 | POST /appointments, api_backend, appointments, database, patients, providers, web_frontend | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-010 | EPIC-004 | Add a reason-for-visit / front-desk note | US-010 | 3 | PATCH /appointments/{id}, POST /appointments, api_backend, appointments, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-011 | EPIC-004 | Reschedule an appointment | US-011 | 4 | PATCH /appointments/{id}, api_backend, appointments, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-012 | EPIC-004 | Cancel an appointment | US-012 | 3 | PATCH /appointments/{id}/status, api_backend, appointments, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-013 | EPIC-005 | Mark appointment status | US-013 | 3 | PATCH /appointments/{id}/status, api_backend, appointments, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-014 | EPIC-006 | View a patient's appointment history | US-014 | 4 | GET /patients/{id}/history, api_backend, appointments, patients, providers, web_frontend | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-015 | EPIC-007 | Access how-to documentation | US-015 | 4 | GET /help, api_backend, web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-016 | EPIC-008 | Responsive desktop web access | US-016 | 4 | web_frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-017 | EPIC-008 | Secure transport and authentication baseline | US-017 | 1 | api_backend | — | 9eb9e55 | delivered | not run | 1/2 tested · 1/2 passing | d3dbc3ca537a |
| US-018 | EPIC-008 | Excluded features boundary | US-018 | 1 | — | backend/tests/test_excluded_features.py, frontend/e2e/excluded-features.spec.ts, frontend/src/screens/Settings.excluded.test.tsx | fbac89b | delivered | succeeded | 2/2 tested · 0/2 passing | d3dbc3ca537a |
<!-- sdlc:auto:end matrix -->
