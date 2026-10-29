import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

/**
 * US-005-2 -- patient contact-detail editing (AC-010, AC-011).
 *
 * Seeds a receptionist and a patient directly through the backend's own ORM
 * models and password-hashing helper (app.models.Account / Patient /
 * app.security.hash_password), against the real database this environment
 * provides -- no mock, no stand-in.
 */

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend");

const VALID_USERNAME = "qa.e2e.patient-detail";
const VALID_PASSWORD = "Qa-E2E-PatientDetail-9!";

function runPython(script: string): string {
  return execFileSync(path.join(backendDir, ".venv/bin/python"), ["-c", script], {
    cwd: backendDir,
    encoding: "utf-8",
  });
}

function seedReceptionist(username: string, password: string): void {
  runPython(`
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
            db.rollback()
    else:
        acct.password_hash = hash_password(${JSON.stringify(password)})
        acct.is_active = True
        db.commit()
finally:
    db.close()
`);
}

type SeededPatient = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

function seedPatient(): SeededPatient {
  const suffix = Date.now().toString(36);
  const firstName = "Marion";
  const lastName = `Kestrel${suffix}`;
  const phone = "07700 900 200";
  const email = `marion.${suffix}@example.com`;
  const output = runPython(`
import sys, json
sys.path.insert(0, ".")
from app.database import Base, SessionLocal, engine
from app import models
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    patient = models.Patient(
        first_name=${JSON.stringify(firstName)},
        last_name=${JSON.stringify(lastName)},
        phone=${JSON.stringify(phone)},
        email=${JSON.stringify(email)},
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    print(json.dumps({"id": patient.id}))
finally:
    db.close()
`);
  const { id } = JSON.parse(output.trim().split("\n").pop() as string) as { id: string };
  return { id, firstName, lastName, phone, email };
}

let fixturePatient: SeededPatient;

test.beforeAll(() => {
  seedReceptionist(VALID_USERNAME, VALID_PASSWORD);
  fixturePatient = seedPatient();
});

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(VALID_USERNAME);
  await page.getByLabel(/password/i).fill(VALID_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/today/);
}

async function openPatientRecord(page: import("@playwright/test").Page, patient: SeededPatient) {
  await page.goto("/patients");
  await expect(page.getByRole("heading", { name: /patients/i })).toBeVisible();

  const search = page.getByLabel(/search by name, phone or email/i);
  await search.fill(patient.lastName);

  await page
    .getByRole("button", { name: `Open record for ${patient.firstName} ${patient.lastName}` })
    .click();

  await expect(
    page.getByRole("heading", { name: `${patient.firstName} ${patient.lastName}` }),
  ).toBeVisible();
}

test.describe("[AC-010] edit a patient's contact detail", () => {
  test("changing phone and email, saving, shows the new value on the record", async ({ page }) => {
    await signIn(page);
    await openPatientRecord(page, fixturePatient);

    const unique = Date.now().toString(36);
    const newPhone = "07700 900 321";
    const newEmail = `updated.${unique}@example.com`;

    const phoneInput = page.getByLabel(/^phone$/i);
    const emailInput = page.getByLabel(/^email$/i);

    await phoneInput.fill(newPhone);
    await emailInput.fill(newEmail);

    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByRole("status")).toContainText(/saved/i);
    await expect(phoneInput).toHaveValue(newPhone);
    await expect(emailInput).toHaveValue(newEmail);

    // Persists across a reload of the record.
    await page.reload();
    await expect(page.getByLabel(/^phone$/i)).toHaveValue(newPhone);
    await expect(page.getByLabel(/^email$/i)).toHaveValue(newEmail);
  });
});

test.describe("[AC-011] malformed email is rejected inline", () => {
  test("submitting a malformed email shows an inline correction prompt and leaves the record unchanged", async ({
    page,
  }) => {
    await signIn(page);
    await openPatientRecord(page, fixturePatient);

    const phoneInput = page.getByLabel(/^phone$/i);
    const emailInput = page.getByLabel(/^email$/i);

    const originalPhone = await phoneInput.inputValue();
    const originalEmail = await emailInput.inputValue();

    await emailInput.fill("not-an-email");
    await page.getByRole("button", { name: /save changes/i }).click();

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/email/i);

    // Record is unchanged: reload shows the original values, not the rejected one.
    await page.reload();
    await expect(page.getByLabel(/^phone$/i)).toHaveValue(originalPhone);
    await expect(page.getByLabel(/^email$/i)).toHaveValue(originalEmail);
  });
});
