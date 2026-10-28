import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

/**
 * US-004 -- add-patient flow (AC-008, AC-009).
 *
 * Seeds a receptionist through the backend's own ORM model and
 * password-hashing helper (app.models.Account / app.security.hash_password),
 * so the hash the UI logs in against is exactly what the app produces -- no
 * raw row, no mock. Runs against the real backend + database this
 * environment provides.
 */

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend");

const VALID_USERNAME = "qa.e2e.patients";
const VALID_PASSWORD = "Qa-E2E-Patients-9!";

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

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(VALID_USERNAME);
  await page.getByLabel(/password/i).fill(VALID_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/today/);
}

async function openPatients(page: import("@playwright/test").Page) {
  await page.goto("/patients");
  await expect(page.getByRole("heading", { name: /patients/i })).toBeVisible();
}

test.describe("add patient", () => {
  test("[AC-008] a signed-in receptionist adds a patient through the dialog and finds them by search", async ({
    page,
  }) => {
    await signIn(page);
    await openPatients(page);

    const unique = Date.now().toString(36);
    const firstName = "Ellie";
    const lastName = `Dawson${unique}`;
    const phone = "07700 900 318";
    const email = `ellie.${unique}@example.com`;

    await page.getByRole("button", { name: /add patient/i }).click();

    const dialog = page.getByRole("dialog", { name: /new patient/i });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/first name/i).fill(firstName);
    await dialog.getByLabel(/last name/i).fill(lastName);
    await dialog.getByLabel(/^phone$/i).fill(phone);
    await dialog.getByLabel(/^email$/i).fill(email);

    await dialog.getByRole("button", { name: /save patient/i }).click();

    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText(firstName);
    await expect(page.getByRole("status")).toContainText(lastName);

    const search = page.getByLabel(/search by name, phone or email/i);
    await search.fill(lastName);

    await expect(page.getByRole("table")).toContainText(firstName);
    await expect(page.getByRole("table")).toContainText(lastName);
    await expect(page.getByRole("table")).toContainText(phone);
    await expect(page.getByRole("table")).toContainText(email);
  });

  test("[AC-009] saving with a blank required name keeps the dialog open, names the missing field and preserves entered values", async ({
    page,
  }) => {
    await signIn(page);
    await openPatients(page);

    const unique = Date.now().toString(36);
    const lastName = `Hendricks${unique}`;
    const phone = "07700 900 512";
    const email = `preserved.${unique}@example.com`;

    await page.getByRole("button", { name: /add patient/i }).click();

    const dialog = page.getByRole("dialog", { name: /new patient/i });
    await expect(dialog).toBeVisible();

    // First name left blank on purpose; the other fields are filled so we can
    // confirm they survive the failed save.
    await dialog.getByLabel(/last name/i).fill(lastName);
    await dialog.getByLabel(/^phone$/i).fill(phone);
    await dialog.getByLabel(/^email$/i).fill(email);

    await dialog.getByRole("button", { name: /save patient/i }).click();

    // Still open: the save did not succeed.
    await expect(dialog).toBeVisible();

    // Names the missing field.
    const alert = dialog.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/first name/i);

    // Entered values are preserved, not cleared.
    await expect(dialog.getByLabel(/last name/i)).toHaveValue(lastName);
    await expect(dialog.getByLabel(/^phone$/i)).toHaveValue(phone);
    await expect(dialog.getByLabel(/^email$/i)).toHaveValue(email);
  });
});
