# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Stand up authentication, secure transport, and patient record creation

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Receptionist sign-in | 8 | backend-agent | — |
| ↳ US-001-T1 | Task | Add users table and migration | — | backend-agent | — |
| ↳ US-001-T2 | Task | Implement login and session endpoints | — | backend-agent | — |
| ↳ US-001-T3 | Task | Build sign-in form and auth context | — | frontend-agent | — |
| ↳ US-001-T4 | Task | Add route guard for unauthenticated access | — | frontend-agent | — |
| US-002 | Story | Sign out | 3 | backend-agent | US-001 |
| US-004 | Story | Add a new patient record | 5 | backend-agent | US-001 |
| US-017 | Story | Secure transport and authentication baseline | 3 | devops-agent | US-001 |
| US-018 | Story | Excluded features boundary | 1 | qa-agent | — |

## Sprint 2: Sprint 2

Add account administration, patient editing/search, and provider calendar viewing

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-003 | Story | Admin and staff roles | 8 | backend-agent | US-001 |
| ↳ US-003-T1 | Task | Add role field and admin-only authorization | — | backend-agent | — |
| ↳ US-003-T2 | Task | Implement account management endpoints | — | backend-agent | — |
| ↳ US-003-T3 | Task | Build admin account management screen | — | frontend-agent | — |
| ↳ US-003-T4 | Task | Hide account management from staff role | — | frontend-agent | — |
| US-005 | Story | Edit an existing patient record | 3 | backend-agent | US-004 |
| US-007 | Story | View a provider's day or week calendar | 8 | frontend-agent | US-001 |
| ↳ US-007-T1 | Task | Implement calendar and providers endpoints | — | backend-agent | — |
| ↳ US-007-T2 | Task | Build day/week calendar grid | — | frontend-agent | — |
| ↳ US-007-T3 | Task | Add provider selector | — | frontend-agent | — |

## Sprint 3: Sprint 3

Enable appointment booking with notes, conflict detection, cancellation and status tracking

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Find a patient | 3 | backend-agent | US-004 |
| US-009 | Story | Book an appointment | 8 | backend-agent | US-004, US-007 |
| ↳ US-009-T1 | Task | Add appointments table and constraints | — | backend-agent | — |
| ↳ US-009-T2 | Task | Implement booking endpoint with conflict validation | — | backend-agent | — |
| ↳ US-009-T3 | Task | Build slot selection and patient-link booking flow | — | frontend-agent | — |
| ↳ US-009-T4 | Task | Surface booking conflict warning | — | frontend-agent | — |
| US-010 | Story | Add a reason-for-visit / front-desk note | 2 | backend-agent | US-009 |
| US-012 | Story | Cancel an appointment | 3 | backend-agent | US-009 |
| US-013 | Story | Mark appointment status | 3 | backend-agent | US-009 |

## Sprint 4: Sprint 4

Deliver rescheduling, patient history, today's overview, help docs and desktop responsiveness

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-008 | Story | Today's appointments overview | 3 | frontend-agent | US-009 |
| US-011 | Story | Reschedule an appointment | 5 | backend-agent | US-009 |
| US-014 | Story | View a patient's appointment history | 5 | backend-agent | US-004, US-009 |
| US-015 | Story | Access how-to documentation | 3 | frontend-agent | — |
| US-016 | Story | Responsive desktop web access | 3 | frontend-agent | — |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
