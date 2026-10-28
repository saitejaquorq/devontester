# DevonTester — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
An appointment calendar app for clinic visits with history of every person available.
Should have history of a user. used by the receptionist of the clinic. No access to patients

**Documentation version:** v7
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 9 entries |
| [Development](development/README.md) | 7 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 4 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 8 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 81 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 4 releases |
| [Traceability matrix](traceability-matrix.md) | 18 requirements |
| [Changelog](CHANGELOG.md) | 7 versions |
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

- No explicit mapping is given of which backlog items belong to which sprint, so sprint-to-story traceability cannot be confirmed beyond the sprint goal descriptions.
- Epic-level items (EPIC-001 through EPIC-008) have no points or assigned role recorded in the plan.
- Run status says 'completed' yet 13 of 18 planned stories (US-003, US-005 through US-016) have no delivered/ticket status recorded -- unclear whether this run only covered a partial scope or those stories remain unbuilt.
- US-001, US-002, and US-017 all cite the identical commit hash (9eb9e558361ff8945abe70f37b8ba235f8d828ae); unclear whether they shipped as one combined change or this is a reporting duplication.
- Task-level delivery (e.g., US-001-T1..T4, US-003-T1..T4, US-007-T1..T3, US-009-T1..T4) is not individually confirmed -- only story-level ticket status was reported.
- Individual subtask completion (US-001-T1 through T4) is not separately confirmed -- only the parent story ticket status was reported.
- Shares a commit hash with US-001 and US-017; unclear if bundled into a single change or a data duplication in reporting.
- No frontend task was listed in the plan for a patient-entry UI; unclear whether a matching screen was built alongside the backend record creation.
- Shares commit hash with US-001/US-002; the input does not detail what transport/auth baseline configuration was actually applied.
- Delivered under a qa-agent role rather than a dev role; the input does not specify what boundary/exclusion logic or documentation was actually implemented.

### Testing

- Testing phase has not started -- no verification of any acceptance criteria (AC-001 through AC-040) or non-functional requirement exists yet.

### Deployment

- Deployment date/timestamp not provided.
- No record of which user stories (US-001..US-018) or features are included in this release -- cannot link related_ids without fabricating.
- No approver or sign-off recorded for this deployment.
- No rollback plan, monitoring, or incident-response notes provided for this live environment.
- No test-phase results referenced as having gated this release.
- Project involves clinic patient visit history handled by receptionists (no direct patient access); no evidence was provided confirming HIPAA-relevant safeguards (encryption in transit/at rest, access controls, audit logging, BAA with hosting providers) for the live frontend/backend endpoints -- should be confirmed given the healthcare domain.

### Maintenance

- No post-deployment/maintenance activity exists yet because the application has not been deployed.
<!-- sdlc:auto:end open-gaps -->
