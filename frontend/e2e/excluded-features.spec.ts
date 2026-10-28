import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

// US-018 -- Excluded features boundary (AC-039, AC-040).
//
// AC-039: the delivered MVP has no payment, billing or invoicing functions and
//         no automated patient SMS/email reminders.
// AC-040: the tool is standalone -- no EHR / practice-management integration
//         via FHIR or HL7.
//
// A person reviews the boundary on the Settings screen (browser specs). A
// client reviews it against the API contract: the endpoints simply do not
// exist (request specs). Both halves are covered.

const API_BASE = process.env.E2E_API_BASE_URL ?? "http://127.0.0.1:8000";

const VALID_USERNAME = "qa.e2e.excluded";
const VALID_PASSWORD = "Qa-E2E-Excl-9!";

const BILLING_AND_REMINDER =
  /(payment|billing|invoice|invoicing|charge|refund|checkout|stripe|remind|\bsms\b|twilio|sendgrid|mailgun|notification)/i;
const INTEGRATION =
  /(fhir|hl7|\behr\b|\bemr\b|integration|integrations|interop|practice.?management|webhook)/i;

// Seed a receptionist through the backend's own ORM model + password-hashing
// helper (app.models.Account / app.security.hash_password), so the hash the UI
// and API log in against is exactly what the app produces -- no raw row, no
// mock. The upsert tolerates re-runs and the race between parallel workers that
// each run beforeAll. ESM has no __dirname.
const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend");

function seedReceptionist(username: string, password: string): void {
  const script = `
import sys
sys.path.insert(0, ".")
from sqlalchemy.exc import IntegrityError
from app.database import Base, SessionLocal, engine
from app import models
from app.security import hash_password
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    acct = db.query(models.Account).filter_by(username=${JSON.stringify(username)}).first()
    if acct is None:
        db.add(models.Account(username=${JSON.stringify(username)}, password_hash=hash_password(${JSON.stringify(password)}), role="receptionist", is_active=True))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()  # another worker won the race; the account now exists
    else:
        acct.password_hash = hash_password(${JSON.stringify(password)})
        acct.is_active = True
        db.commit()
finally:
    db.close()
`;
  execFileSync(path.join(backendDir, ".venv/bin/python"), ["-c", script], {
    cwd: backendDir,
    stdio: "inherit",
  });
}

test.beforeAll(() => {
  seedReceptionist(VALID_USERNAME, VALID_PASSWORD);
});

async function openScopePanel(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(VALID_USERNAME);
  await page.getByLabel(/password/i).fill(VALID_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/today/);

  await page.goto("/settings");
  await page.getByRole("tab", { name: /how-to guide/i }).click();
  await expect(page.getByText(/what this tool does not do/i)).toBeVisible();
}

test.describe("excluded features -- on-screen boundary", () => {
  test("[AC-039] admin sees payments, billing, invoicing and reminders listed as out of scope", async ({
    page,
  }) => {
    await openScopePanel(page);

    await expect(page.getByText("No payments, billing or invoicing")).toBeVisible();
    await expect(page.getByText("No automated patient SMS or email reminders")).toBeVisible();
  });

  test("[AC-040] admin sees the tool is standalone with no EHR / HL7 / FHIR integration", async ({
    page,
  }) => {
    await openScopePanel(page);

    await expect(page.getByText("No EHR / HL7 / FHIR integration")).toBeVisible();
  });
});

async function login(request: import("@playwright/test").APIRequestContext): Promise<string> {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { username: VALID_USERNAME, password: VALID_PASSWORD },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return body.access_token as string;
}

test.describe("excluded features -- API contract", () => {
  test("[AC-039] the published API advertises no billing, invoicing or reminder endpoint", async ({
    request,
  }) => {
    const res = await request.get(`${API_BASE}/openapi.json`);
    expect(res.ok()).toBeTruthy();
    const doc = await res.json();
    const paths = Object.keys(doc.paths ?? {});
    const offenders = paths.filter((p) => BILLING_AND_REMINDER.test(p));
    expect(offenders, "no payment/billing/invoicing/reminder endpoint may exist").toEqual([]);
  });

  test("[AC-040] the published API advertises no EHR / FHIR / HL7 integration endpoint", async ({
    request,
  }) => {
    const res = await request.get(`${API_BASE}/openapi.json`);
    expect(res.ok()).toBeTruthy();
    const doc = await res.json();
    const paths = Object.keys(doc.paths ?? {});
    const offenders = paths.filter((p) => INTEGRATION.test(p));
    expect(offenders, "the tool must stay standalone -- no EHR/FHIR/HL7 endpoint").toEqual([]);
  });

  test("[AC-039] directly requesting a billing endpoint returns 404, not a working feature", async ({
    request,
  }) => {
    const token = await login(request);
    const headers = { Authorization: `Bearer ${token}` };
    for (const p of ["/payments", "/billing", "/invoices", "/reminders", "/notifications"]) {
      const res = await request.get(`${API_BASE}${p}`, { headers });
      expect(res.status(), `${p} must not be served`).toBe(404);
    }
  });

  test("[AC-040] directly requesting an integration endpoint returns 404, not a working feature", async ({
    request,
  }) => {
    const token = await login(request);
    const headers = { Authorization: `Bearer ${token}` };
    for (const p of ["/fhir", "/fhir/Patient", "/hl7", "/ehr", "/integrations"]) {
      const res = await request.get(`${API_BASE}${p}`, { headers });
      expect(res.status(), `${p} must not be served`).toBe(404);
    }
  });
});
