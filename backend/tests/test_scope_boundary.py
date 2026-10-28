"""US-018 -- MVP scope-boundary assertions (AC-039, AC-040).

QA-authored, reading the *live* generated OpenAPI document and the real
dependency manifest (backend/requirements.txt) rather than a hand-maintained
list of "things we didn't build" -- so a route or a dependency added later
fails this suite the moment it lands, instead of relying on someone
remembering to update a checklist.

AC-039: no payment / billing / invoicing surface, and no SMS/email reminder
         dispatch route or scheduled-notification dependency.
AC-040: no FHIR or HL7 client/endpoint/outbound integration; the service
         depends on no external clinical system.
"""

from __future__ import annotations

import re
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

REQUIREMENTS_PATH = Path(__file__).resolve().parents[1] / "requirements.txt"

# AC-039
BILLING_AND_REMINDER_PATH_KEYWORDS = re.compile(
    r"(payment|billing|invoice|invoicing|charge|refund|checkout|stripe|"
    r"remind|\bsms\b|twilio|sendgrid|mailgun|notification)",
    re.IGNORECASE,
)
# Package names (left of any version pin) that would indicate a payment
# processor, SMS/email dispatch client, or a background job scheduler used
# to fire reminders -- the kind of dependency this MVP must not carry.
BILLING_AND_REMINDER_DEPENDENCIES = re.compile(
    r"^(stripe|braintree|paypal|square|twilio|sendgrid|mailgun|plivo|"
    r"nexmo|vonage|apscheduler|celery|django-celery-beat|rq|huey|"
    r"python-telegram-bot)\b",
    re.IGNORECASE,
)

# AC-040
INTEGRATION_PATH_KEYWORDS = re.compile(
    r"(fhir|hl7|\behr\b|\bemr\b|integration|integrations|interop|"
    r"practice.?management|webhook)",
    re.IGNORECASE,
)
# Package names for FHIR/HL7 client libraries or outbound clinical-system SDKs.
INTEGRATION_DEPENDENCIES = re.compile(
    r"^(fhirclient|fhir\.resources|fhir-resources|hl7|hl7apy|python-hl7|"
    r"cerner-|epic-|redox)",
    re.IGNORECASE,
)


def _live_openapi() -> dict:
    response = client.get("/openapi.json")
    assert response.status_code == 200
    return response.json()


def _requirement_names() -> list[str]:
    """Package names from requirements.txt, comments and version pins stripped."""
    names: list[str] = []
    for raw_line in REQUIREMENTS_PATH.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        # Strip extras (e.g. "passlib[bcrypt]") and any version specifier.
        name = re.split(r"[\[=<>~!; ]", line, maxsplit=1)[0]
        if name:
            names.append(name)
    return names


def _schema_names(doc: dict) -> list[str]:
    return list(doc.get("components", {}).get("schemas", {}).keys())


# ---------------------------------------------------------------------------
# AC-039: no payment/billing/invoicing path or schema
# ---------------------------------------------------------------------------


def test_ac039_openapi_has_no_billing_payment_or_invoicing_path() -> None:
    doc = _live_openapi()
    paths = list(doc.get("paths", {}).keys())
    offenders = [p for p in paths if BILLING_AND_REMINDER_PATH_KEYWORDS.search(p)]
    assert offenders == [], (
        "AC-039 violated: the live OpenAPI document advertises a payment/billing/"
        f"invoicing/reminder path: {offenders}"
    )


def test_ac039_openapi_has_no_billing_payment_or_invoicing_schema() -> None:
    doc = _live_openapi()
    schemas = _schema_names(doc)
    offenders = [s for s in schemas if BILLING_AND_REMINDER_PATH_KEYWORDS.search(s)]
    assert offenders == [], (
        "AC-039 violated: the live OpenAPI document defines a payment/billing/"
        f"invoicing/reminder schema: {offenders}"
    )


def test_ac039_no_reminder_dispatch_route_or_scheduler_dependency() -> None:
    """No SMS/email reminder-dispatch route, and no scheduled-notification
    dependency (job scheduler or SMS/email provider SDK) in requirements.txt."""
    doc = _live_openapi()
    paths = list(doc.get("paths", {}).keys())
    reminder_routes = [p for p in paths if re.search(r"remind|notif|\bsms\b", p, re.IGNORECASE)]
    assert reminder_routes == [], (
        f"AC-039 violated: a reminder/notification route is served: {reminder_routes}"
    )

    offending_deps = [
        name for name in _requirement_names() if BILLING_AND_REMINDER_DEPENDENCIES.match(name)
    ]
    assert offending_deps == [], (
        "AC-039 violated: backend/requirements.txt depends on a payment processor, "
        f"SMS/email dispatch client, or job scheduler: {offending_deps}"
    )


def test_ac039_billing_and_reminder_endpoints_404_for_an_authenticated_user(receptionist) -> None:
    login = client.post(
        "/auth/login",
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    assert login.status_code == 200
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    for path in ("/payments", "/billing", "/invoices", "/reminders", "/notifications"):
        response = client.get(path, headers=headers)
        assert response.status_code == 404, (
            f"AC-039 violated: {path} is served (status {response.status_code})"
        )


# ---------------------------------------------------------------------------
# AC-040: no FHIR/HL7 client, endpoint, or outbound EHR integration
# ---------------------------------------------------------------------------


def test_ac040_openapi_has_no_fhir_hl7_or_ehr_path() -> None:
    doc = _live_openapi()
    paths = list(doc.get("paths", {}).keys())
    offenders = [p for p in paths if INTEGRATION_PATH_KEYWORDS.search(p)]
    assert offenders == [], (
        f"AC-040 violated: the live OpenAPI document advertises an EHR/FHIR/HL7 path: {offenders}"
    )


def test_ac040_openapi_has_no_fhir_hl7_or_ehr_schema() -> None:
    doc = _live_openapi()
    schemas = _schema_names(doc)
    offenders = [s for s in schemas if INTEGRATION_PATH_KEYWORDS.search(s)]
    assert offenders == [], (
        f"AC-040 violated: the live OpenAPI document defines an EHR/FHIR/HL7 schema: {offenders}"
    )


def test_ac040_no_fhir_or_hl7_client_dependency() -> None:
    """The service depends on no external clinical system: no FHIR/HL7 client
    library, and no vendor EHR SDK, in requirements.txt."""
    offending_deps = [name for name in _requirement_names() if INTEGRATION_DEPENDENCIES.match(name)]
    assert offending_deps == [], (
        "AC-040 violated: backend/requirements.txt depends on an EHR/FHIR/HL7 "
        f"client: {offending_deps}"
    )


def test_ac040_integration_endpoints_404_for_an_authenticated_user(receptionist) -> None:
    login = client.post(
        "/auth/login",
        json={"username": receptionist["username"], "password": receptionist["password"]},
    )
    assert login.status_code == 200
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    for path in ("/fhir", "/fhir/Patient", "/hl7", "/ehr", "/integrations"):
        response = client.get(path, headers=headers)
        assert response.status_code == 404, (
            f"AC-040 violated: {path} is served (status {response.status_code})"
        )
