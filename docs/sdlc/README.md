# DevonTester — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
An appointment calendar app for clinic visits with history of every person available.
Should have history of a user. used by the receptionist of the clinic. No access to patients

**Documentation version:** v5
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 9 entries |
| [Development](development/README.md) | 9 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 4 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 1 route |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 2 releases |
| [Traceability matrix](traceability-matrix.md) | 18 requirements |
| [Changelog](CHANGELOG.md) | 5 versions |
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

- Input does not explicitly map individual stories/tasks to a specific sprint number -- the groupings implied by matching sprint goal wording to story titles are an inference, not a stated assignment. Confirm actual sprint assignment.
- No burndown, velocity, or sprint completion status provided for any of the 4 sprints.
- Epic owner role is unassigned.
- No implementation/completion status provided for US-001, US-002, US-003 or their tasks -- only the planned breakdown exists in this input.
- No implementation/completion status provided for US-004, US-005, US-006.
- No tasks were broken out for these stories, unlike other epics -- unclear if task breakdown is pending or intentionally omitted.
- No implementation/completion status provided for US-007 or US-008.
- No implementation/completion status provided for US-009 through US-012.
- US-010, US-011, US-012 have no task-level breakdown while US-009 does -- unclear whether that is intentional or incomplete planning.
- No implementation/completion status provided for US-013.
- No detail given on what status values are supported (e.g. checked-in, no-show, completed) -- only the story title is known.
- No implementation/completion status provided for US-014.
- No implementation/completion status provided for US-015.
- No detail given on the content or location of the in-app help documentation.
- No implementation/completion status provided for US-016, US-017, US-018.
- US-018's scope exclusions are referenced only by title -- no list of which features are explicitly out of scope was provided in this input.

### Testing

- Testing phase has not started -- no verification of any acceptance criteria (AC-001 through AC-040) or non-functional requirement exists yet.

### Deployment

- No deployment date/timestamp recorded for this release.
- No record of who approved or triggered the deployment.
- No mapping provided between this version and the specific requirements/tickets it includes.
- No rollback plan, monitoring, or health-check information recorded.
- No prior deployment history given, so it is unclear if this is the first release or an update superseding an earlier one.

### Maintenance

- No post-deployment/maintenance activity exists yet because the application has not been deployed.
<!-- sdlc:auto:end open-gaps -->
