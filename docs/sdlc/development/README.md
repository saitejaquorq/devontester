# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-001 · approved · source: plan:v1

Development plan version 1 is approved and organizes work into 4 sprints of capacity 20 each, covering authentication through rescheduling, history, help docs, and responsiveness.

Plan status: approved, version 1. Sprint 1 goal: stand up authentication, secure transport, and patient record creation (capacity 20). Sprint 2 goal: add account administration, patient editing/search, and provider calendar viewing (capacity 20). Sprint 3 goal: enable appointment booking with notes, conflict detection, cancellation and status tracking (capacity 20). Sprint 4 goal: deliver rescheduling, patient history, today's overview, help docs and desktop responsiveness (capacity 20).

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018

- ⚠ Input does not explicitly map individual stories/tasks to a specific sprint number -- the groupings implied by matching sprint goal wording to story titles are an inference, not a stated assignment. Confirm actual sprint assignment.
- ⚠ No burndown, velocity, or sprint completion status provided for any of the 4 sprints.

### DEV-EPIC-001 · approved · source: plan:EPIC-001

Epic covering receptionist authentication and role-based access control: sign-in, sign-out, and admin/staff roles.

US-001 Receptionist sign-in (8 pts, backend-agent): tasks are (1) add users table and migration, (2) implement login and session endpoints, (3) build sign-in form and auth context, (4) add route guard for unauthenticated access. US-002 Sign out (3 pts, backend-agent): no subtasks listed. US-003 Admin and staff roles (8 pts, backend-agent): tasks are (1) add role field and admin-only authorization, (2) implement account management endpoints, (3) build admin account management screen, (4) hide account management from staff role.

**Related:** US-001, US-002, US-003

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-001, US-002, US-003 or their tasks -- only the planned breakdown exists in this input.

### DEV-EPIC-002 · approved · source: plan:EPIC-002

Epic covering patient record management: creating, editing, and searching patient records.

US-004 Add a new patient record (5 pts, backend-agent). US-005 Edit an existing patient record (3 pts, backend-agent). US-006 Find a patient (3 pts, backend-agent). No subtasks were listed for any of these three stories.

**Related:** US-004, US-005, US-006

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-004, US-005, US-006.
- ⚠ No tasks were broken out for these stories, unlike other epics -- unclear if task breakdown is pending or intentionally omitted.

### DEV-EPIC-003 · approved · source: plan:EPIC-003

Epic covering the per-provider appointment calendar view and the day's overview.

US-007 View a provider's day or week calendar (8 pts, frontend-agent): tasks are (1) implement calendar and providers endpoints, (2) build day/week calendar grid, (3) add provider selector. US-008 Today's appointments overview (3 pts, frontend-agent): no subtasks listed.

**Related:** US-007, US-008

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-007 or US-008.

### DEV-EPIC-004 · approved · source: plan:EPIC-004

Epic covering appointment booking with notes, conflict detection, rescheduling, and cancellation.

US-009 Book an appointment (8 pts, backend-agent): tasks are (1) add appointments table and constraints, (2) implement booking endpoint with conflict validation, (3) build slot selection and patient-link booking flow, (4) surface booking conflict warning. US-010 Add a reason-for-visit / front-desk note (2 pts, backend-agent): no subtasks listed. US-011 Reschedule an appointment (5 pts, backend-agent): no subtasks listed. US-012 Cancel an appointment (3 pts, backend-agent): no subtasks listed.

**Related:** US-009, US-010, US-011, US-012

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-009 through US-012.
- ⚠ US-010, US-011, US-012 have no task-level breakdown while US-009 does -- unclear whether that is intentional or incomplete planning.

### DEV-EPIC-005 · approved · source: plan:EPIC-005

Epic covering appointment status tracking.

US-013 Mark appointment status (3 pts, backend-agent). No subtasks were listed.

**Related:** US-013

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-013.
- ⚠ No detail given on what status values are supported (e.g. checked-in, no-show, completed) -- only the story title is known.

### DEV-EPIC-006 · approved · source: plan:EPIC-006

Epic covering per-patient visit history.

US-014 View a patient's appointment history (5 pts, backend-agent). No subtasks were listed.

**Related:** US-014

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-014.

### DEV-EPIC-007 · approved · source: plan:EPIC-007

Epic covering receptionist-facing help documentation within the app.

US-015 Access how-to documentation (3 pts, frontend-agent). No subtasks were listed.

**Related:** US-015

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-015.
- ⚠ No detail given on the content or location of the in-app help documentation.

### DEV-EPIC-008 · approved · source: plan:EPIC-008

Epic covering platform, security, and scope-boundary requirements: responsive desktop access, secure transport/auth baseline, and explicit exclusion of out-of-scope features.

US-016 Responsive desktop web access (3 pts, frontend-agent). US-017 Secure transport and authentication baseline (3 pts, devops-agent). US-018 Excluded features boundary (1 pt, qa-agent). No subtasks were listed for any of the three.

**Related:** US-016, US-017, US-018

- ⚠ Epic owner role is unassigned.
- ⚠ No implementation/completion status provided for US-016, US-017, US-018.
- ⚠ US-018's scope exclusions are referenced only by title -- no list of which features are explicitly out of scope was provided in this input.
<!-- sdlc:auto:end narrative -->
