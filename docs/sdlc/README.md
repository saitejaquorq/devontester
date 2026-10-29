# DevonTester — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
An appointment calendar app for clinic visits with history of every person available.
Should have history of a user. used by the receptionist of the clinic. No access to patients

**Documentation version:** v10
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 9 entries |
| [Development](development/README.md) | 5 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 4 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 13 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 131 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 5 releases |
| [Traceability matrix](traceability-matrix.md) | 18 requirements |
| [Changelog](CHANGELOG.md) | 10 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- No password complexity, lockout, or MFA policy specified for receptionist/admin accounts.
- Assumption that strict HIPAA access controls (break-glass, per-read audit logging) are not required because only dummy data is used -- needs explicit human/compliance confirmation before any real PHI is introduced.
- No data-retention period defined for patient records.
- Phone number format/validation rules not specified (only email validation is mentioned).
- No patient consent-capture mechanism mentioned, even as a placeholder for future real-PHI use.
- No requirement describes how providers themselves are created/configured/managed.
- No timezone handling specified for the calendar.
- Not specified whether a receptionist can override/force a booking despite a conflict warning, or whether it is a hard block.
- No cancellation-reason field mentioned.
- No requirement specifies who may change status after the fact, or whether a status-change history/audit trail is kept.
- No export/print capability mentioned for history records.
- No pagination or volume handling specified for patients with long histories.
- Only the requirement for help content exists; the actual in-app help text/screens have not been produced yet -- this is a development-phase deliverable not yet started.
- Encryption at rest is not explicitly required anywhere in the requirements (only encryption in transit is specified) -- recommend confirming database/storage encryption at rest even for dummy data, as defense-in-depth.
- No WCAG/accessibility requirement is stated for this staff-facing application -- confirm whether accessibility standards apply to internal clinical staff tools under the organization's policy.
- No tested backup/recovery or high-availability requirement is stated beyond general mention that AWS 'comfortably hosts' the app -- confirm whether backup/recovery testing is needed for a clinical front-desk workflow.
- HL7/FHIR/DICOM interoperability and FDA SaMD/EU MDR medical-device classification are explicitly out of scope on the stated assumption the app does not inform diagnosis or treatment -- recommend human/compliance confirmation that this classification assumption holds.
- Patient consent and proxy/caregiver access are not applicable because there is no patient-facing or caregiver access in this tool -- recommend explicit written confirmation of this assumption for the compliance file.

### Architecture

- Architecture input does not explicitly map this design to specific requirement IDs (US-001..US-018); traceability from stories to architecture decisions is not stated and should be confirmed.
- NFR-005 scope decision (excluding strict HIPAA controls) should be cross-checked against actual requirements/compliance expectations if real patient data is ever introduced.
- No explicit requirement IDs attached to individual components in the input; inferred only from functional descriptions.
- Token expiry/refresh behavior and blacklist-on-logout ('if enabled') are not fully specified — /auth/logout description notes blacklisting is conditional, condition not defined.
- Exact UX of the 'conflict warning' (e.g., can the receptionist override it) is not detailed in architecture input.
- No explicit requirement IDs tied to individual entities/fields in the input.
- Pagination, rate limiting, and error-response schema for these endpoints are not specified in the architecture input.
- No deployment phase input yet exists to confirm this topology was actually provisioned — this entry documents the design/plan only.

### Development

- No dates given for sprint start/end or plan approval.
- No owner/approver named for the plan approval.
- Epics themselves have no assigned role (unassigned) -- unclear if this is intentional or a gap in planning.
- No test or QA evidence linked to this ticket in the input.
- Sub-task-level (US-003-T1..T4) completion status not individually confirmed, only the parent story is marked delivered.
- No sub-task breakdown was given, so implementation scope beyond 'edit patient record' cannot be fully verified.
- Sub-task-level (US-007-T1..T3) completion status not individually confirmed, only the parent story is marked delivered.
- Conflict: run status says 'completed' but only 3/18 stories have recorded delivery -- needs clarification on whether this reflects a partial run or a reporting gap.
- No delivery record for US-001 (Receptionist sign-in).
- No delivery record for US-002 (Sign out).
- No delivery record for US-004 (Add a new patient record).
- No delivery record for US-006 (Find a patient).
- No delivery record for US-008 (Today's appointments overview).
- No delivery record for US-009 (Book an appointment).
- No delivery record for US-010 (Add a reason-for-visit/front-desk note).
- No delivery record for US-011 (Reschedule an appointment).
- No delivery record for US-012 (Cancel an appointment).
- No delivery record for US-013 (Mark appointment status).
- No delivery record for US-014 (View a patient's appointment history).
- No delivery record for US-015 (Access how-to documentation).
- No delivery record for US-016 (Responsive desktop web access).
- No delivery record for US-017 (Secure transport and authentication baseline).
- No delivery record for US-018 (Excluded features boundary).
- No sub-task-level status reported for any story in the development run input.

### Testing

- Testing phase has not started -- no verification of any acceptance criteria (AC-001 through AC-040) or non-functional requirement exists yet.

### Deployment

- Deployment date/timestamp not provided.
- No record of who approved or executed this deployment.
- No release notes or list of which requirements/tickets (e.g. US-001..US-018) are included in this version -- cannot trace this deployment to specific requirements.
- No indication of deployment environment (e.g. staging vs. production) or rollback plan.
- No prior deployment history given, so it is unclear if this is the first release or an update.

### Maintenance

- No post-deployment/maintenance activity exists yet because the application has not been deployed.
<!-- sdlc:auto:end open-gaps -->
