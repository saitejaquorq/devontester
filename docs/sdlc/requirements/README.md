# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-EPIC-001 · draft · source: requirements:EPIC-001

Receptionists sign in with username/password to access the front-desk tool; sessions can be ended via sign-out; admin accounts manage staff accounts while staff cannot.

US-001 (critical): valid credentials authenticate and land on the front-desk home view (AC-001); invalid credentials are denied with a generic error that does not reveal which field was wrong (AC-002); unauthenticated direct access to patient/calendar/appointment pages redirects to sign-in with no data shown (AC-003). US-002 (high): signing out ends the session and returns to sign-in (AC-004); browser back button after sign-out must not reveal protected data and must prompt re-authentication (AC-005). US-003 (medium): admins can create/edit/deactivate receptionist accounts via account management (AC-006); staff accounts do not see that option (AC-007). NFR-002 and NFR-003 restate the access-control and session-termination behavior as explicit non-functional requirements. Compliance note -- HIPAA: these behaviors map to HIPAA technical safeguards for access control (unique user identification, generic failed-login messaging) and automatic logoff/session termination (§164.312(a)). No patient or clinician self-service login exists.

**Related:** US-001, US-002, US-003, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, NFR-002, NFR-003

- ⚠ No password complexity, lockout, or MFA policy specified for receptionist/admin accounts.
- ⚠ Assumption that strict HIPAA access controls (break-glass, per-read audit logging) are not required because only dummy data is used -- needs explicit human/compliance confirmation before any real PHI is introduced.

### REQ-EPIC-002 · draft · source: requirements:EPIC-002

Receptionists create, edit, and search patient records containing only contact/identifying details -- no clinical data is captured.

US-004 (critical): new patient saved with name and contact details becomes findable in the patient list (AC-008); missing required fields (e.g. name) block save and flag the missing field (AC-009). US-005 (high): editing contact details (phone/email) persists and displays the update (AC-010); invalid values such as malformed email are rejected with a correction prompt (AC-011). US-006 (high): partial-name or contact-detail search returns matching patients (AC-012); no-match search shows a clear 'no results' message (AC-013). Patient records are explicitly limited to contact/identifying information; diagnoses, prescriptions and lab results are out of scope. Data used is dummy/test data, not real PHI. Compliance note -- HIPAA/GDPR special-category data: limiting records to contact details only supports the minimum-necessary principle and avoids processing of special-category health data.

**Related:** US-004, US-005, US-006, AC-008, AC-009, AC-010, AC-011, AC-012, AC-013

- ⚠ No data-retention period defined for patient records.
- ⚠ Phone number format/validation rules not specified (only email validation is mentioned).
- ⚠ No patient consent-capture mechanism mentioned, even as a placeholder for future real-PHI use.

### REQ-EPIC-003 · draft · source: requirements:EPIC-003

Receptionists view a selected provider's day/week calendar and a cross-provider today's-appointments overview for front-desk triage.

US-007 (critical): selecting a provider and day/week view shows that provider's appointments in correct time slots (AC-014); switching day/week preserves correct placement (AC-015); switching provider filters the calendar to only that provider (AC-016). US-008 (high): today's overview lists today's appointments with time, patient, provider and status (AC-017); when none are booked, a clear empty-state message is shown (AC-018).

**Related:** US-007, US-008, AC-014, AC-015, AC-016, AC-017, AC-018

- ⚠ No requirement describes how providers themselves are created/configured/managed.
- ⚠ No timezone handling specified for the calendar.

### REQ-EPIC-004 · draft · source: requirements:EPIC-004

Receptionists book, reschedule and cancel appointments into a provider's calendar, with a short front-desk note and conflict detection, but no clinical data capture.

US-009 (critical): booking with patient + open slot sets status 'booked' (AC-019); missing patient/time blocks save with a message of what's missing (AC-020); overlapping slot for the same provider triggers a conflict warning before confirmation (AC-021). US-010 (high): a short reason-for-visit/front-desk note is stored with the appointment and shown in patient history (AC-022), and is explicitly free-text only -- no diagnosis/prescription/lab-result fields are captured (AC-023, reinforced by NFR-004). US-011 (high): rescheduling moves the appointment to a new date/time/provider, removing it from the old slot (AC-024), with conflict warning before confirming a clashing new slot (AC-025). US-012 (high): cancelling requires confirmation before the status becomes 'cancelled' and is reflected in calendar and history (AC-026, AC-027). Compliance note -- HIPAA/GDPR: NFR-004's exclusion of clinical fields reduces PHI exposure and supports data minimization.

**Related:** US-009, US-010, US-011, US-012, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, NFR-004

- ⚠ Not specified whether a receptionist can override/force a booking despite a conflict warning, or whether it is a hard block.
- ⚠ No cancellation-reason field mentioned.

### REQ-EPIC-005 · draft · source: requirements:EPIC-005

Receptionists mark appointment status through its lifecycle (booked, attended, no-show, cancelled), visible everywhere the appointment appears.

US-013 (critical): status changes to attended/no-show/cancelled are saved and reflected on the appointment, calendar, and patient history (AC-028); current status is always clearly displayed on later viewing (AC-029).

**Related:** US-013, AC-028, AC-029

- ⚠ No requirement specifies who may change status after the fact, or whether a status-change history/audit trail is kept.

### REQ-EPIC-006 · draft · source: requirements:EPIC-006

Receptionists view a patient's full appointment history (past and upcoming) in one place, excluding any clinical records.

US-014 (critical): history view shows each appointment's date, provider, status, contact details and reason-for-visit note (AC-030); no diagnoses, prescriptions or lab results are displayed (AC-031, reinforced by NFR-004); a patient with no appointments sees a clear empty-state message (AC-032). Compliance note -- HIPAA/GDPR: exclusion of clinical data from the history view supports minimum-necessary access.

**Related:** US-014, AC-030, AC-031, AC-032, NFR-004

- ⚠ No export/print capability mentioned for history records.
- ⚠ No pagination or volume handling specified for patients with long histories.

### REQ-EPIC-007 · draft · source: requirements:EPIC-007

An in-app help section gives receptionists self-service, how-to guidance for the tool's core workflows.

US-015 (medium): signed-in receptionists can open a help/documentation section covering sign-in, patient management, booking/rescheduling/cancelling appointments, and marking status (AC-033); steps must be clear enough to complete each workflow unaided (AC-034, NFR-009).

**Related:** US-015, AC-033, AC-034, NFR-009

- ⚠ Only the requirement for help content exists; the actual in-app help text/screens have not been produced yet -- this is a development-phase deliverable not yet started.

### REQ-EPIC-008 · draft · source: requirements:EPIC-008

Platform, security, and scope boundaries: responsive desktop web app for a single small clinic, with encryption in transit, and explicit exclusions (no billing, no reminders, no EHR/HL7/FHIR integration).

US-016 (high): the app must render correctly and remain usable in a supported desktop browser (AC-035, NFR-008) and stay responsive for a handful of concurrent receptionists in a single-clinic, modest-volume setting (AC-036, NFR-006, NFR-007). US-017 (high): all browser-to-server traffic must be HTTPS/TLS encrypted (AC-037, NFR-001). AC-038/NFR-005 record an explicit accepted-risk decision: because only dummy/test data is used, strict HIPAA controls (per-read audit logging, break-glass access, business associate agreements) are NOT treated as hard requirements, though standard login authentication and encryption in transit still apply. US-018 (low): confirms no payment/billing/invoicing, no automated patient SMS/email reminders (AC-039), and no EHR/practice-management integration via FHIR or HL7 (AC-040) -- the tool is standalone. Technology stack approved by the product owner for this scope: FastAPI 0.115 (backend), PostgreSQL 16 (database), React 19 (frontend), AWS (cloud hosting) -- rationale given is small-scale fit, relational data model, and AWS's future HIPAA-eligible hosting/BAA option should real PHI ever be introduced. Compliance note -- HIPAA: NFR-001 addresses HIPAA transmission security (§164.312(e)); NFR-005 is an explicit, human-recorded risk acceptance regarding audit controls and BAAs that must be re-evaluated the moment real PHI is used.

**Related:** US-016, US-017, US-018, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040, NFR-001, NFR-005, NFR-006, NFR-007, NFR-008

- ⚠ Encryption at rest is not explicitly required anywhere in the requirements (only encryption in transit is specified) -- recommend confirming database/storage encryption at rest even for dummy data, as defense-in-depth.
- ⚠ No WCAG/accessibility requirement is stated for this staff-facing application -- confirm whether accessibility standards apply to internal clinical staff tools under the organization's policy.
- ⚠ No tested backup/recovery or high-availability requirement is stated beyond general mention that AWS 'comfortably hosts' the app -- confirm whether backup/recovery testing is needed for a clinical front-desk workflow.
- ⚠ HL7/FHIR/DICOM interoperability and FDA SaMD/EU MDR medical-device classification are explicitly out of scope on the stated assumption the app does not inform diagnosis or treatment -- recommend human/compliance confirmation that this classification assumption holds.
- ⚠ Patient consent and proxy/caregiver access are not applicable because there is no patient-facing or caregiver access in this tool -- recommend explicit written confirmation of this assumption for the compliance file.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-10-28

**Capabilities in scope:** Receptionist sign-in to the front-desk tool, Add and edit patient records (contact details), Per-provider day/week appointment calendar, Book, reschedule and cancel appointments, Mark appointment status (booked, attended, no-show, cancelled), Per-patient visit history (date, provider, status, contact details), Reason-for-visit / front-desk note per appointment, Today's appointments overview for the front desk, Basic how-to documentation for receptionists, Username/password sign-in for receptionists, Responsive web app for desktop browsers at the front desk, Dummy/test patient data (no real PHI), No payment, billing or invoicing, No automated patient SMS/email reminders

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The logic here is straightforward: patient CRUD, appointments against per-provider calendars, status changes, and history reads. FastAPI handles this cleanly for a few concurrent staff, pairs naturally with a React frontend over a JSON API, and its built-in request validation helps keep appointment and patient data well-formed. It's your available option and a good fit for the small scale described. |
| cloud | AWS | A single, reliable place to host the web app and its database with encryption in transit and tested backups -- exactly what this internal tool needs and no more. AWS is your available option and comfortably hosts a small-scale internal app. Should you later decide to use real patient data, AWS also supports HIPAA-eligible hosting and BAAs, so you're not boxed in. |
| database | PostgreSQL | Your data is relational by nature -- patients, providers, appointments and their statuses all link together, and the history view is just a query joining them. PostgreSQL enforces those relationships reliably and prevents double-booking with proper constraints. It easily covers a single clinic's modest volume and is your available option, with encryption in transit supported as you require. |
| frontend | React | The front desk runs this all day as an interactive calendar: booking, dragging appointments, flipping status, opening a patient's history beside it. That kind of stateful, responsive screen in a desktop browser is exactly what React is built for, and it's your available option. A handful of receptionists on desktop browsers need no native app. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Receptionist Authentication & Access Control

Secure sign-in for front-desk staff using username/password accounts, with a simple admin/staff role model. No patient or clinician self-service logins exist. Assumption: because the tool uses dummy/test data, strict HIPAA controls (per-read audit logging, break-glass, BAAs) are not treated as hard requirements; standard login authentication and encryption in transit still apply.

### US-001: Receptionist sign-in

**Priority:** critical

> As a clinic receptionist, I want to sign in to the front-desk tool with my username and password, so that only authorised staff can access and manage patient and appointment data.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am a registered receptionist with valid credentials | I enter my correct username and password and submit the sign-in form | I am authenticated and taken to the front-desk home view |
| AC-002 | I am on the sign-in screen | I enter an incorrect username or password | I am denied access and shown an error message that does not reveal which field was wrong |
| AC-003 | I am not signed in | I attempt to open any patient, calendar or appointment page directly | I am redirected to the sign-in screen and cannot view any data |

### US-002: Sign out

**Priority:** high

> As a clinic receptionist, I want to sign out of the tool when I leave the front desk, so that another person cannot use my open session.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | I am signed in | I select sign out | my session is ended and I am returned to the sign-in screen |
| AC-005 | my session has ended | I use the browser back button to reach a previous page | I am not shown protected data and am prompted to sign in again |

### US-003: Admin and staff roles

**Priority:** medium

> As a clinic administrator, I want a simple distinction between admin and staff accounts, so that account management is restricted to admins while staff focus on daily front-desk work.

| ID | Given | When | Then |
|---|---|---|---|
| AC-006 | I am signed in as an admin | I open account management | I can create, edit and deactivate receptionist accounts |
| AC-007 | I am signed in with a staff role | I look for account management | the option is not available to me |

## EPIC-002: Patient Record Management

Receptionists create and maintain patient records limited to contact and identifying details. Records explicitly do NOT contain full clinical data (no diagnoses, prescriptions or lab results). Data used is dummy/test data, not real PHI.

### US-004: Add a new patient record

**Priority:** critical

> As a clinic receptionist, I want to add a new patient with their contact details, so that I can book appointments for them and keep their details on file.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | I am signed in | I complete the new-patient form with name and contact details and save | the patient record is created and findable in the patient list |
| AC-009 | I am adding a patient | I leave a required field (such as patient name) blank | the record is not saved and I am shown which required field is missing |

### US-005: Edit an existing patient record

**Priority:** high

> As a clinic receptionist, I want to update a patient's contact details, so that their record stays accurate when information changes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | an existing patient record | I change a contact detail such as phone or email and save | the updated details are stored and shown on the patient record |
| AC-011 | I am editing a patient | I attempt to save an invalid value such as a malformed email address | the change is rejected and I am prompted to correct it |

### US-006: Find a patient

**Priority:** high

> As a clinic receptionist, I want to search for a patient by name or contact detail, so that I can quickly open the right record when booking or answering a call.

| ID | Given | When | Then |
|---|---|---|---|
| AC-012 | patients exist in the system | I type part of a patient's name into the search | matching patients are listed for me to select |
| AC-013 | I search for a term that matches no patient | the search completes | I am shown a clear 'no results' message |

## EPIC-003: Per-Provider Appointment Calendar

A day/week appointment calendar covering a single clinic with multiple providers, each having their own calendar that the receptionist books into. Includes a today's-appointments overview for front-desk use.

### US-007: View a provider's day or week calendar

**Priority:** critical

> As a clinic receptionist, I want to view a selected provider's appointments in a day or week layout, so that I can see their schedule and find open slots.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | a provider with booked appointments | I select that provider and the day or week view | their appointments are shown in the correct time slots for the chosen period |
| AC-015 | I am viewing a provider's calendar | I switch between day and week views | the same appointments are shown correctly in the selected layout |
| AC-016 | I am viewing the calendar | I select a different provider | the calendar updates to show only that provider's appointments |

### US-008: Today's appointments overview

**Priority:** high

> As a clinic receptionist, I want a quick overview of today's appointments across providers, so that I can manage patient arrivals at the front desk.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | appointments are booked for today | I open the today's overview | I see today's appointments with time, patient, provider and status |
| AC-018 | no appointments are booked for today | I open the today's overview | I see a clear message that there are no appointments today |

## EPIC-004: Appointment Booking, Rescheduling & Cancellation

Receptionists book, reschedule and cancel appointments into a chosen provider's calendar, each linked to a patient and carrying a short reason-for-visit / front-desk note.

### US-009: Book an appointment

**Priority:** critical

> As a clinic receptionist, I want to book an appointment for a patient into a provider's calendar, so that the patient has a scheduled visit.

| ID | Given | When | Then |
|---|---|---|---|
| AC-019 | a patient and a provider with an open slot | I select the slot, link the patient and save the appointment | the appointment appears in the provider's calendar with status 'booked' |
| AC-020 | I am booking an appointment | I try to save without selecting a patient or a time | the booking is rejected and I am told what is missing |
| AC-021 | a provider already has an appointment in a time slot | I attempt to book an overlapping appointment for the same provider | I am warned of the conflict before the appointment is confirmed |

### US-010: Add a reason-for-visit / front-desk note

**Priority:** high

> As a clinic receptionist, I want to record a short reason-for-visit or front-desk note on an appointment, so that staff understand the purpose of the visit without storing clinical records.

| ID | Given | When | Then |
|---|---|---|---|
| AC-022 | I am booking or editing an appointment | I enter a short reason-for-visit note and save | the note is stored with the appointment and visible on the appointment and in patient history |
| AC-023 | an appointment note field | I save the appointment | the note is treated as free-text front-desk information only and no clinical fields (diagnosis, prescription, lab result) are captured |

### US-011: Reschedule an appointment

**Priority:** high

> As a clinic receptionist, I want to move an existing appointment to a new time or provider, so that I can accommodate changes requested by the patient or clinic.

| ID | Given | When | Then |
|---|---|---|---|
| AC-024 | an existing booked appointment | I change its date, time or provider and save | the appointment moves to the new slot and no longer appears in the original slot |
| AC-025 | I am rescheduling an appointment | the new slot conflicts with another appointment for that provider | I am warned of the conflict before the change is confirmed |

### US-012: Cancel an appointment

**Priority:** high

> As a clinic receptionist, I want to cancel an appointment, so that the slot is freed and the record reflects that the visit will not happen.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | an existing booked appointment | I cancel it and confirm | its status becomes 'cancelled' and it is shown as cancelled in the calendar and patient history |
| AC-027 | I select cancel on an appointment | I am asked to confirm | the appointment is only cancelled after I confirm the action |

## EPIC-005: Appointment Status Tracking

Receptionists mark the status of each appointment through its lifecycle: booked, attended, no-show, cancelled.

### US-013: Mark appointment status

**Priority:** critical

> As a clinic receptionist, I want to set an appointment's status to booked, attended, no-show or cancelled, so that the record reflects what actually happened with the visit.

| ID | Given | When | Then |
|---|---|---|---|
| AC-028 | a booked appointment | I change its status to attended, no-show or cancelled | the new status is saved and shown on the appointment, calendar and patient history |
| AC-029 | an appointment with a status set | I view it later | the current status is clearly displayed |

## EPIC-006: Per-Patient Visit History

Each patient has a history view showing past and upcoming appointments with date, provider, status and contact details, plus the reason-for-visit note. It does NOT show full clinical records (no diagnoses, prescriptions or lab results).

### US-014: View a patient's appointment history

**Priority:** critical

> As a clinic receptionist, I want to see a patient's past and upcoming appointments in one view, so that I can answer questions and manage their visits.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | a patient with past and upcoming appointments | I open their history view | I see each appointment's date, provider, status, contact details and reason-for-visit note |
| AC-031 | a patient's history view | I review the information shown | no clinical records such as diagnoses, prescriptions or lab results are displayed |
| AC-032 | a patient with no appointments | I open their history view | I see a clear message that there are no appointments on record |

## EPIC-007: Receptionist Help Documentation

Basic how-to documentation for receptionists covering the core workflows of the tool.

### US-015: Access how-to documentation

**Priority:** medium

> As a clinic receptionist, I want to access basic how-to documentation from within the tool, so that I can learn how to perform core tasks without external help.

| ID | Given | When | Then |
|---|---|---|---|
| AC-033 | I am signed in | I open the help or documentation section | I see guidance covering signing in, managing patients, booking/rescheduling/cancelling appointments and marking status |
| AC-034 | I am reading the documentation | I look for a core workflow | the steps are described clearly enough to complete the task unaided |

## EPIC-008: Platform, Security & Scope Boundaries

Non-functional expectations and explicit scope boundaries. Delivered as a responsive web app for desktop browsers at the front desk (no native mobile/desktop app). Standard login security and encryption in transit apply; strict HIPAA controls are not hard requirements because only dummy/test data is used. No payments/billing, no automated patient reminders, and no EHR/HL7/FHIR integration. Scale is small: a single clinic, a handful of providers and a few concurrent staff users.

### US-016: Responsive desktop web access

**Priority:** high

> As a clinic receptionist, I want the tool to work reliably in a desktop browser at the front desk, so that I can use it on the clinic's existing computers without installing software.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | a supported desktop browser | I open the application | the interface renders correctly and all core features are usable. Assumption: delivered as a responsive web app for desktop browsers only, with no native mobile or desktop app |
| AC-036 | a few receptionists use the tool at once | they work concurrently in the small single-clinic setup | the application remains responsive. Assumption: scale is small (single clinic, a handful of providers, few concurrent users, modest patient volume) |

### US-017: Secure transport and authentication baseline

**Priority:** high

> As a clinic administrator, I want login security and encryption in transit to be in place, so that access is controlled and data is protected on the wire even though only dummy data is used.

| ID | Given | When | Then |
|---|---|---|---|
| AC-037 | a user connects to the application | data is transmitted between browser and server | the connection is encrypted in transit (HTTPS/TLS) |
| AC-038 | the tool uses dummy/test data | security scope is defined | standard login authentication and encryption in transit apply, while strict HIPAA controls (per-read audit logging, break-glass, BAAs) are not treated as hard requirements. Assumption recorded for confirmation |

### US-018: Excluded features boundary

**Priority:** low

> As a clinic administrator, I want out-of-scope features to be clearly excluded, so that expectations are set and effort stays within the agreed MVP.

| ID | Given | When | Then |
|---|---|---|---|
| AC-039 | the delivered MVP | I review available features | there are no payment, billing or invoicing functions and no automated patient SMS/email reminders |
| AC-040 | the delivered MVP | I review integrations | the tool is standalone with no EHR / practice-management integration via FHIR or HL7 |
<!-- sdlc:auto:end epics -->
