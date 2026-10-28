# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
81 tests · Passed 66 · Failed 0 · Skipped 0 · Not run 15

Acceptance criteria covered: 10/40 · passing: 2/40
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
