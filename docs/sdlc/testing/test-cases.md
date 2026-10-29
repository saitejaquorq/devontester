# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
131 tests · Passed 109 · Failed 0 · Skipped 0 · Not run 22

Acceptance criteria covered: 17/40 · passing: 6/40
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Receptionist sign-in

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_login_rejects_inactive_account | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_login_with_valid_credentials_returns_a_token | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_login_with_wrong_password_and_unknown_username_return_identical_401 | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_logout_without_a_token_is_rejected | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_protected_endpoint_accepts_valid_token | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_protected_endpoint_rejects_expired_token | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_protected_endpoint_rejects_invalid_token | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_protected_endpoint_rejects_missing_token | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_response_sets_hsts_header_where_this_environment_exposes_it | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_token_rejected_after_logout | Unit | Passed | `backend/tests/test_auth.py` |
| AC-001 | test_ac001_create_and_decode_access_token_round_trips | Unit | Passed | `backend/tests/test_security.py` |
| AC-001 | test_ac001_hash_password_is_not_plaintext_and_verifies | Unit | Passed | `backend/tests/test_security.py` |
| — | test_decode_rejects_expired_token | Unit | Passed | `backend/tests/test_security.py` |
| — | test_decode_rejects_wrong_signature | Unit | Passed | `backend/tests/test_security.py` |
| AC-003 | App route guard > [AC-003] redirects to /sign-in and renders no protected data when there is no session | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-003 | App route guard > [AC-003] resolves the session via GET /auth/me and renders the protected route when a session exists | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-004 | App route guard > [AC-004] sign out calls POST /auth/logout, clears the stored session, and returns to /sign-in | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-005 | App route guard > [AC-005] after sign out, going back to a protected route shows no protected data and prompts sign-in | Unit | Passed | `frontend/src/App.test.tsx` |
| — | apiFetch > a 401 response clears the stored session and announces session expiry | Unit | Passed | `frontend/src/lib/api.test.ts` |
| — | apiFetch > getSessionToken/clearSessionToken round-trip through storage | Unit | Passed | `frontend/src/lib/api.test.ts` |
| — | apiFetch > sends the stored session JWT as a bearer token on every request | Unit | Passed | `frontend/src/lib/api.test.ts` |
| AC-001 | SignIn > [AC-001] submits valid credentials, calls POST /auth/login and stores the session token | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-002 | SignIn > [AC-002] shows the API's single generic error for invalid credentials, with no demo hint and no artificial delay | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-001 | test_ac001_login_returns_signed_token_and_account | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-002 | test_ac002_unknown_username_returns_one_generic_message | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-002 | test_ac002_wrong_password_returns_the_same_generic_message | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-004, AC-005 | test_ac004_ac005_logout_revokes_token_so_a_replay_returns_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-037 | test_ac037_hsts_header_present_on_every_response | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_health_and_login_remain_reachable_without_a_token | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_logout_without_a_token_returns_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_me_returns_signed_in_account_for_a_valid_token | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_me_with_a_malformed_token_returns_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_me_without_a_token_returns_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_nfr002_protected_route_requires_jwt_even_when_bypassing_the_dependency | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-001 | [AC-001] valid sign-in lands on the front-desk home view | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-002 | [AC-002] invalid sign-in shows a generic error naming neither field | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-002 | [AC-002] unknown username shows the identical generic error | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-004 | [AC-004] sign out returns to /sign-in and clears the session | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-005 | [AC-005] browser-back to a protected route after sign-out prompts sign-in, not data | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |

### US-004: Add a new patient record

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-003 | test_ac003_get_patient_by_id_requires_a_valid_jwt | Unit | Passed | `backend/tests/test_patients.py` |
| AC-003 | test_ac003_get_patients_list_requires_a_valid_jwt | Unit | Passed | `backend/tests/test_patients.py` |
| AC-003 | test_ac003_patch_patient_requires_a_valid_jwt | Unit | Passed | `backend/tests/test_patients.py` |
| AC-003 | test_ac003_patient_routes_reject_an_invalid_token | Unit | Passed | `backend/tests/test_patients.py` |
| AC-003 | test_ac003_post_patients_requires_a_valid_jwt | Unit | Passed | `backend/tests/test_patients.py` |
| AC-008 | test_ac008_post_patients_with_valid_data_persists_and_is_returned | Unit | Passed | `backend/tests/test_patients.py` |
| AC-009 | test_ac009_post_patients_with_blank_first_name_returns_422_and_creates_no_row | Unit | Passed | `backend/tests/test_patients.py` |
| AC-009 | test_ac009_post_patients_with_blank_last_name_returns_422_and_creates_no_row | Unit | Passed | `backend/tests/test_patients.py` |
| AC-009 | test_ac009_post_patients_with_missing_first_name_key_returns_422_and_creates_no_row | Unit | Passed | `backend/tests/test_patients.py` |
| — | Patients screen > [AC empty-search] filters the API-backed list and shows the existing empty state for no matches | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| AC-005 | Patients screen > [AC-005] carries the session JWT as a bearer token on the patients request | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| AC-008 | Patients screen > [AC-008] saving the new-patient dialog POSTs to /patients and shows the created patient without reload | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| AC-008 | Patients screen > [AC-008] shows a loading state then renders patients from GET /patients | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| AC-009 | Patients screen > [AC-009] blocks save on a blank required name and names the missing field, preserving typed values | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| AC-009 | Patients screen > [AC-009] surfaces a 422 field error from the API and preserves typed values | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| — | Patients screen > a 401 clears the session so the route guard can redirect to /sign-in | Unit | Passed | `frontend/src/screens/Patients.test.tsx` |
| AC-008 | [AC-008] a signed-in receptionist adds a patient through the dialog and finds them by search | E2E | Not run yet | `frontend/e2e/patients.spec.ts` |
| AC-009 | [AC-009] saving with a blank required name keeps the dialog open, names the missing field and preserves entered values | E2E | Not run yet | `frontend/e2e/patients.spec.ts` |

### US-018: Excluded features boundary

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-039 | test_ac039_billing_endpoints_are_not_served_for_an_authenticated_user | Unit | Passed | `backend/tests/test_excluded_features.py` |
| AC-039 | test_ac039_no_payment_billing_invoicing_or_reminder_endpoints | Unit | Passed | `backend/tests/test_excluded_features.py` |
| AC-040 | test_ac040_integration_endpoints_are_not_served_for_an_authenticated_user | Unit | Passed | `backend/tests/test_excluded_features.py` |
| AC-040 | test_ac040_no_ehr_fhir_or_hl7_integration_endpoints | Unit | Passed | `backend/tests/test_excluded_features.py` |
| AC-039 | Settings excluded-features boundary > [AC-039] names no payments, billing, invoicing or patient reminders as out of scope | Unit | Passed | `frontend/src/screens/Settings.excluded.test.tsx` |
| AC-040 | Settings excluded-features boundary > [AC-040] states the tool is standalone with no EHR / HL7 / FHIR integration | Unit | Passed | `frontend/src/screens/Settings.excluded.test.tsx` |
| AC-039 | [AC-039] admin sees payments, billing, invoicing and reminders listed as out of scope | E2E | Not run yet | `frontend/e2e/excluded-features.spec.ts` |
| AC-039 | [AC-039] directly requesting a billing endpoint returns 404, not a working feature | E2E | Not run yet | `frontend/e2e/excluded-features.spec.ts` |
| AC-039 | [AC-039] the published API advertises no billing, invoicing or reminder endpoint | E2E | Not run yet | `frontend/e2e/excluded-features.spec.ts` |
| AC-040 | [AC-040] admin sees the tool is standalone with no EHR / HL7 / FHIR integration | E2E | Not run yet | `frontend/e2e/excluded-features.spec.ts` |
| AC-040 | [AC-040] directly requesting an integration endpoint returns 404, not a working feature | E2E | Not run yet | `frontend/e2e/excluded-features.spec.ts` |
| AC-040 | [AC-040] the published API advertises no EHR / FHIR / HL7 integration endpoint | E2E | Not run yet | `frontend/e2e/excluded-features.spec.ts` |

## Sprint 2

### US-003: Admin and staff roles

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-006 | test_ac006_admin_can_create_edit_and_deactivate_an_account_and_changes_persist | Unit | Passed | `backend/tests/test_accounts.py` |
| AC-007 | test_ac007_accounts_routes_return_401_without_a_jwt | Unit | Passed | `backend/tests/test_accounts.py` |
| AC-007 | test_ac007_staff_token_receives_403_on_get_accounts | Unit | Passed | `backend/tests/test_accounts.py` |
| AC-007 | test_ac007_staff_token_receives_403_on_patch_accounts | Unit | Passed | `backend/tests/test_accounts.py` |
| AC-007 | test_ac007_staff_token_receives_403_on_post_accounts | Unit | Passed | `backend/tests/test_accounts.py` |
| — | test_auth_me_exposes_the_callers_role_for_admin | Unit | Passed | `backend/tests/test_accounts.py` |
| — | test_auth_me_exposes_the_callers_role_for_staff | Unit | Passed | `backend/tests/test_accounts.py` |
| — | test_deactivated_account_can_no_longer_log_in | Unit | Passed | `backend/tests/test_accounts.py` |
| AC-007 | App nav — role gating of the accounts entry > [AC-007] a staff session navigating directly to /settings sees no account management section | Unit | Passed | `frontend/src/App.nav.test.tsx` |
| AC-007 | App nav — role gating of the accounts entry > [AC-007] hides the 'Accounts & help' nav option for a staff session | Unit | Passed | `frontend/src/App.nav.test.tsx` |
| AC-007 | App nav — role gating of the accounts entry > [AC-007] shows the 'Accounts & help' nav option for an admin session | Unit | Passed | `frontend/src/App.nav.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] cancelling the deactivate confirmation makes no PATCH call | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] creating an account validates required fields before calling POST /accounts | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] deactivating an account asks for confirmation then PATCHes and reflects the new state | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] editing an account's role PATCHes /accounts/{id} | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] lists accounts from GET /accounts with edit and deactivate actions for an admin | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] saving a valid new account POSTs to /accounts and refreshes the list | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-006 | Settings screen — accounts > [AC-006] surfaces an API error from POST /accounts inline | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| AC-007 | Settings screen — accounts > [AC-007] a staff session does not render the Accounts tab or account management, but keeps the how-to guide | Unit | Passed | `frontend/src/screens/Settings.test.tsx` |
| — | account management option is absent from the nav and direct navigation does not expose it | E2E | Not run yet | `frontend/e2e/accounts.spec.ts` |
| — | create, edit and deactivate a receptionist account through the UI, reflected in the list | E2E | Not run yet | `frontend/e2e/accounts.spec.ts` |

### US-005: Edit an existing patient record

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-010 | test_ac010_patch_patients_persists_a_changed_phone_and_email_and_returns_the_updated_record | Unit | Passed | `backend/tests/test_patient_contact_detail.py` |
| AC-011 | test_ac011_patch_patients_with_a_malformed_email_returns_422_and_leaves_the_row_unchanged | Unit | Passed | `backend/tests/test_patient_contact_detail.py` |
| — | test_patch_patients_without_a_valid_jwt_returns_401 | Unit | Passed | `backend/tests/test_patient_contact_detail.py` |
| — | PatientDetail screen > [AC error] shows an error state with retry when GET /patients/{id} fails | Unit | Passed | `frontend/src/screens/PatientDetail.test.tsx` |
| AC-010 | PatientDetail screen > [AC-010] loads the record from GET /patients/{id} and offers an edit form for phone and email | Unit | Passed | `frontend/src/screens/PatientDetail.test.tsx` |
| AC-010 | PatientDetail screen > [AC-010] saving a changed phone and email PATCHes /patients/{id} and shows the update without a manual refresh | Unit | Passed | `frontend/src/screens/PatientDetail.test.tsx` |
| AC-011 | PatientDetail screen > [AC-011] a malformed email returns a 422 and shows an inline correction prompt, leaving the record unchanged and the user in edit state | Unit | Passed | `frontend/src/screens/PatientDetail.test.tsx` |
| — | PatientDetail screen > disables Save while the PATCH request is in flight | Unit | Passed | `frontend/src/screens/PatientDetail.test.tsx` |
| — | PatientDetail screen > shows an error message and keeps the edit when the PATCH request fails | Unit | Passed | `frontend/src/screens/PatientDetail.test.tsx` |
| — | changing phone and email, saving, shows the new value on the record | E2E | Not run yet | `frontend/e2e/patient-detail.spec.ts` |
| — | submitting a malformed email shows an inline correction prompt and leaves the record unchanged | E2E | Not run yet | `frontend/e2e/patient-detail.spec.ts` |

### US-007: View a provider's day or week calendar

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-014, AC-016 | test_ac014_ac016_calendar_returns_only_the_requested_providers_appointments_for_the_day | Unit | Passed | `backend/tests/test_calendar.py` |
| AC-015 | test_ac015_day_and_week_views_agree_on_an_overlapping_day | Unit | Passed | `backend/tests/test_calendar.py` |
| AC-015 | test_ac015_invalid_date_returns_422 | Unit | Passed | `backend/tests/test_calendar.py` |
| AC-015 | test_ac015_invalid_view_returns_422 | Unit | Passed | `backend/tests/test_calendar.py` |
| AC-015 | test_ac015_missing_jwt_returns_401 | Unit | Passed | `backend/tests/test_calendar.py` |
| — | test_get_providers_rejects_an_invalid_token | Unit | Passed | `backend/tests/test_providers.py` |
| — | test_get_providers_requires_a_jwt | Unit | Passed | `backend/tests/test_providers.py` |
| — | test_get_providers_returns_only_active_providers | Unit | Passed | `backend/tests/test_providers.py` |
| — | Calendar screen > [AC empty] shows an empty state when the provider has no appointments in the period | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| — | Calendar screen > [AC error] shows an error state with retry when GET /calendar fails | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| AC-014 | Calendar screen > [AC-014] loads providers from GET /providers and appointments from GET /calendar, rendering each in its slot | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| AC-015 | Calendar screen > [AC-015] toggling between day and week view re-fetches and re-renders the same appointments | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| AC-016 | Calendar screen > [AC-016] selecting a different provider refreshes the calendar to that provider's appointments | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| — | Calendar screen > carries the session JWT as a bearer token on the providers request | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| — | Calendar screen > shows an error state with retry when GET /providers fails | Unit | Passed | `frontend/src/screens/Calendar.test.tsx` |
| AC-014 | [AC-014] selecting a provider renders that provider's appointments in the correct time slots for the day view | E2E | Not run yet | `frontend/e2e/calendar.spec.ts` |
| AC-015 | [AC-015] toggling day and week view shows the same appointment in both layouts | E2E | Not run yet | `frontend/e2e/calendar.spec.ts` |
| AC-016 | [AC-016] switching provider shows only the newly selected provider's appointments | E2E | Not run yet | `frontend/e2e/calendar.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| AC-039 | test_ac039_billing_and_reminder_endpoints_404_for_an_authenticated_user | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-039 | test_ac039_no_reminder_dispatch_route_or_scheduler_dependency | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-039 | test_ac039_openapi_has_no_billing_payment_or_invoicing_path | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-039 | test_ac039_openapi_has_no_billing_payment_or_invoicing_schema | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-040 | test_ac040_integration_endpoints_404_for_an_authenticated_user | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-040 | test_ac040_no_fhir_or_hl7_client_dependency | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-040 | test_ac040_openapi_has_no_fhir_hl7_or_ehr_path | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| AC-040 | test_ac040_openapi_has_no_fhir_hl7_or_ehr_schema | Unit | Passed | `backend/tests/test_scope_boundary.py` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
| — | the signed-in app menu exposes none of those controls | E2E | Not run yet | `frontend/e2e/scope-boundary.spec.ts` |
<!-- sdlc:auto:end tests -->
