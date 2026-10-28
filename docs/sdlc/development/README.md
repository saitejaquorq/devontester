# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### PLAN-v1 · approved · source: plan:v1

Development plan version 1 is approved, organized into 4 sprints (capacity 20 each) covering authentication, patient records, calendar viewing, booking workflow, and polish/help docs across 8 epics and 18 user stories.

Plan status: approved (version 1). Sprint goals: Sprint 1 - stand up authentication, secure transport, and patient record creation; Sprint 2 - add account administration, patient editing/search, and provider calendar viewing; Sprint 3 - enable appointment booking with notes, conflict detection, cancellation and status tracking; Sprint 4 - deliver rescheduling, patient history, today's overview, help docs and desktop responsiveness. Backlog by epic: EPIC-001 Receptionist Authentication & Access Control -> US-001 Receptionist sign-in (8pts, backend-agent; tasks: users table/migration, login/session endpoints, sign-in form/auth context, route guard for unauthenticated access), US-002 Sign out (3pts, backend-agent), US-003 Admin and staff roles (8pts, backend-agent; tasks: role field/admin-only authorization, account management endpoints, admin account management screen, hide account management from staff). EPIC-002 Patient Record Management -> US-004 Add a new patient record (5pts, backend-agent), US-005 Edit an existing patient record (3pts, backend-agent), US-006 Find a patient (3pts, backend-agent). EPIC-003 Per-Provider Appointment Calendar -> US-007 View a provider's day/week calendar (8pts, frontend-agent; tasks: calendar/providers endpoints, day/week grid, provider selector), US-008 Today's appointments overview (3pts, frontend-agent). EPIC-004 Appointment Booking, Rescheduling & Cancellation -> US-009 Book an appointment (8pts, backend-agent; tasks: appointments table/constraints, booking endpoint with conflict validation, slot selection/patient-link booking flow, booking conflict warning), US-010 Reason-for-visit/front-desk note (2pts, backend-agent), US-011 Reschedule an appointment (5pts, backend-agent), US-012 Cancel an appointment (3pts, backend-agent). EPIC-005 Appointment Status Tracking -> US-013 Mark appointment status (3pts, backend-agent). EPIC-006 Per-Patient Visit History -> US-014 View a patient's appointment history (5pts, backend-agent). EPIC-007 Receptionist Help Documentation -> US-015 Access how-to documentation (3pts, frontend-agent). EPIC-008 Platform, Security & Scope Boundaries -> US-016 Responsive desktop web access (3pts, frontend-agent), US-017 Secure transport and authentication baseline (3pts, devops-agent), US-018 Excluded features boundary (1pt, qa-agent).

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018

- ⚠ No explicit mapping is given of which backlog items belong to which sprint, so sprint-to-story traceability cannot be confirmed beyond the sprint goal descriptions.
- ⚠ Epic-level items (EPIC-001 through EPIC-008) have no points or assigned role recorded in the plan.

### DEV-RUN-2026 · approved · source: dev:run-status

Development run is marked 'completed', but ticket outcomes were only reported for 5 of the 18 planned user stories.

Run status reported as completed. Delivered tickets: US-001 Receptionist sign-in (commit 9eb9e558361ff8945abe70f37b8ba235f8d828ae), US-002 Sign out (commit 9eb9e558361ff8945abe70f37b8ba235f8d828ae), US-004 Add a new patient record (commit 36c8db44a84353f6cc49ff0882abb03ca28988cc), US-017 Secure transport and authentication baseline (commit 9eb9e558361ff8945abe70f37b8ba235f8d828ae), US-018 Excluded features boundary (commit fbac89b180f06a491a9b53a67ec02b9c95f5ffa3). No ticket records were provided for US-003, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, or US-016, even though the approved plan covers all of these across Sprints 1-4.

**Related:** US-001, US-002, US-004, US-017, US-018

- ⚠ Run status says 'completed' yet 13 of 18 planned stories (US-003, US-005 through US-016) have no delivered/ticket status recorded -- unclear whether this run only covered a partial scope or those stories remain unbuilt.
- ⚠ US-001, US-002, and US-017 all cite the identical commit hash (9eb9e558361ff8945abe70f37b8ba235f8d828ae); unclear whether they shipped as one combined change or this is a reporting duplication.
- ⚠ Task-level delivery (e.g., US-001-T1..T4, US-003-T1..T4, US-007-T1..T3, US-009-T1..T4) is not individually confirmed -- only story-level ticket status was reported.

### US-001 · approved · source: dev:US-001

Receptionist sign-in story is marked delivered.

Ticket US-001 (Receptionist sign-in, 8 points, backend-agent) marked delivered under commit 9eb9e558361ff8945abe70f37b8ba235f8d828ae. Planned subtasks: add users table and migration, implement login and session endpoints, build sign-in form and auth context, add route guard for unauthenticated access.

**Related:** US-001-T1, US-001-T2, US-001-T3, US-001-T4, EPIC-001

- ⚠ Individual subtask completion (US-001-T1 through T4) is not separately confirmed -- only the parent story ticket status was reported.

### US-002 · approved · source: dev:US-002

Sign out story is marked delivered.

Ticket US-002 (Sign out, 3 points, backend-agent) marked delivered under commit 9eb9e558361ff8945abe70f37b8ba235f8d828ae (same commit as US-001 and US-017).

**Related:** EPIC-001, US-001

- ⚠ Shares a commit hash with US-001 and US-017; unclear if bundled into a single change or a data duplication in reporting.

### US-004 · approved · source: dev:US-004

Add a new patient record story is marked delivered.

Ticket US-004 (Add a new patient record, 5 points, backend-agent) marked delivered under commit 36c8db44a84353f6cc49ff0882abb03ca28988cc. No subtasks were listed for this story in the plan.

**Related:** EPIC-002

- ⚠ No frontend task was listed in the plan for a patient-entry UI; unclear whether a matching screen was built alongside the backend record creation.

### US-017 · approved · source: dev:US-017

Secure transport and authentication baseline story is marked delivered.

Ticket US-017 (Secure transport and authentication baseline, 3 points, devops-agent) marked delivered under commit 9eb9e558361ff8945abe70f37b8ba235f8d828ae (same commit as US-001 and US-002).

**Related:** EPIC-008

- ⚠ Shares commit hash with US-001/US-002; the input does not detail what transport/auth baseline configuration was actually applied.

### US-018 · approved · source: dev:US-018

Excluded features boundary story is marked delivered.

Ticket US-018 (Excluded features boundary, 1 point, qa-agent) marked delivered under commit fbac89b180f06a491a9b53a67ec02b9c95f5ffa3.

**Related:** EPIC-008

- ⚠ Delivered under a qa-agent role rather than a dev role; the input does not specify what boundary/exclusion logic or documentation was actually implemented.
<!-- sdlc:auto:end narrative -->
