"""US-018 -- Excluded features boundary (AC-039, AC-040).

These are "negative" acceptance criteria: the delivered MVP must *not* grow a
payment/billing/invoicing surface or patient SMS/email reminders (AC-039), and
must stay standalone with no EHR / practice-management integration via FHIR or
HL7 (AC-040).

The strongest proof a client depends on is the API contract itself: the live
OpenAPI document must advertise none of those endpoints, and a direct request
for one (with a valid session, so the blanket auth middleware is satisfied)
must 404 rather than quietly serve a feature. Both assertions fail the moment
such an endpoint is added, which is exactly when the boundary has been crossed.
"""

import re

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# AC-039: payment / billing / invoicing, and automated patient reminders.
BILLING_AND_REMINDER_KEYWORDS = re.compile(
    r"(payment|billing|invoice|invoicing|charge|refund|checkout|stripe|"
    r"remind|\bsms\b|twilio|sendgrid|mailgun|notification)",
    re.IGNORECASE,
)

# AC-040: EHR / practice-management integration via FHIR or HL7.
INTEGRATION_KEYWORDS = re.compile(
    r"(fhir|hl7|\behr\b|\bemr\b|integration|integrations|interop|"
    r"practice.?management|webhook)",
    re.IGNORECASE,
)


def _live_paths() -> list[str]:
    response = client.get("/openapi.json")
    assert response.status_code == 200
    return list(response.json().get("paths", {}).keys())


def test_ac039_no_payment_billing_invoicing_or_reminder_endpoints() -> None:
    offenders = [p for p in _live_paths() if BILLING_AND_REMINDER_KEYWORDS.search(p)]
    assert offenders == [], (
        "AC-039 violated: the delivered API advertises payment/billing/invoicing "
        f"or reminder endpoints: {offenders}"
    )


def test_ac040_no_ehr_fhir_or_hl7_integration_endpoints() -> None:
    offenders = [p for p in _live_paths() if INTEGRATION_KEYWORDS.search(p)]
    assert offenders == [], (
        "AC-040 violated: the delivered API advertises EHR / practice-management "
        f"integration endpoints: {offenders}"
    )


def _token(receptionist) -> str:
    login = client.post(
        "/auth/login",
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    assert login.status_code == 200
    return login.json()["access_token"]


def test_ac039_billing_endpoints_are_not_served_for_an_authenticated_user(receptionist) -> None:
    """A signed-in receptionist (so the auth middleware is satisfied and the
    404 can only mean "no such route") cannot reach any billing feature."""
    headers = {"Authorization": f"Bearer {_token(receptionist)}"}
    for path in ("/payments", "/billing", "/invoices", "/reminders", "/notifications"):
        response = client.get(path, headers=headers)
        assert response.status_code == 404, (
            f"AC-039 violated: {path} is served (status {response.status_code}); "
            "the MVP must expose no billing or reminder feature"
        )


def test_ac040_integration_endpoints_are_not_served_for_an_authenticated_user(receptionist) -> None:
    headers = {"Authorization": f"Bearer {_token(receptionist)}"}
    for path in ("/fhir", "/fhir/Patient", "/hl7", "/ehr", "/integrations"):
        response = client.get(path, headers=headers)
        assert response.status_code == 404, (
            f"AC-040 violated: {path} is served (status {response.status_code}); "
            "the MVP must stay standalone with no EHR/FHIR/HL7 integration"
        )
