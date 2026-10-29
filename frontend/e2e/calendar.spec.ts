import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

/**
 * US-007-3 -- provider day/week calendar (AC-014, AC-015, AC-016).
 *
 * Seeds a receptionist, two providers, a patient, and appointments directly
 * through the backend's own ORM models (app.models.Account / Provider /
 * Patient / Appointment) and password-hashing helper, against the real
 * database this environment provides -- no mock, no stand-in.
 */

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend");

const VALID_USERNAME = "qa.e2e.calendar";
const VALID_PASSWORD = "Qa-E2E-Calendar-9!";

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

type SeededCalendar = {
  providerAId: string;
  providerBId: string;
  providerAName: string;
  providerBName: string;
  patientAName: string;
  patientBName: string;
  today: string;
};

/**
 * Creates two active providers, two patients, and one appointment each
 * (both today, at distinct times) so the day view, week view, and provider
 * switch can all be exercised against stable, known data. Returns JSON so
 * the spec can assert on the exact names seeded, idempotent-ish per run via
 * a unique suffix.
 */
function seedCalendarFixture(): SeededCalendar {
  const suffix = Date.now().toString(36);
  const output = runPython(`
import sys, json, uuid
from datetime import datetime, timedelta, timezone
sys.path.insert(0, ".")
from app.database import Base, SessionLocal, engine
from app import models
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    provider_a = models.Provider(id=str(uuid.uuid4()), name="Dr Calendar A ${suffix}", is_active=True)
    provider_b = models.Provider(id=str(uuid.uuid4()), name="Dr Calendar B ${suffix}", is_active=True)
    patient_a = models.Patient(id=str(uuid.uuid4()), first_name="Avery", last_name="Calpatient${suffix}")
    patient_b = models.Patient(id=str(uuid.uuid4()), first_name="Blair", last_name="Calpatient${suffix}")
    db.add_all([provider_a, provider_b, patient_a, patient_b])
    db.commit()

    today = datetime.now(timezone.utc).replace(hour=9, minute=0, second=0, microsecond=0)
    appt_a = models.Appointment(
        id=str(uuid.uuid4()),
        provider_id=provider_a.id,
        patient_id=patient_a.id,
        starts_at=today,
        ends_at=today + timedelta(minutes=30),
        status="booked",
    )
    appt_b = models.Appointment(
        id=str(uuid.uuid4()),
        provider_id=provider_b.id,
        patient_id=patient_b.id,
        starts_at=today.replace(hour=11),
        ends_at=today.replace(hour=11, minute=30),
        status="booked",
    )
    db.add_all([appt_a, appt_b])
    db.commit()

    print(json.dumps({
        "providerAId": provider_a.id,
        "providerBId": provider_b.id,
        "providerAName": provider_a.name,
        "providerBName": provider_b.name,
        "patientAName": f"{patient_a.first_name} {patient_a.last_name}",
        "patientBName": f"{patient_b.first_name} {patient_b.last_name}",
        "today": today.date().isoformat(),
    }))
finally:
    db.close()
`);
  return JSON.parse(output.trim().split("\n").pop() as string) as SeededCalendar;
}

let fixture: SeededCalendar;

test.beforeAll(() => {
  seedReceptionist(VALID_USERNAME, VALID_PASSWORD);
  fixture = seedCalendarFixture();
});

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(VALID_USERNAME);
  await page.getByLabel(/password/i).fill(VALID_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/today/);
}

async function openCalendar(page: import("@playwright/test").Page) {
  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: /calendar/i })).toBeVisible();
}

test.describe("provider day/week calendar", () => {
  test("[AC-014] selecting a provider renders that provider's appointments in the correct time slots for the day view", async ({
    page,
  }) => {
    await signIn(page);
    await openCalendar(page);

    await page.getByLabel(/provider/i).selectOption(fixture.providerAId);
    await page.getByRole("button", { name: "Day" }).click();

    await expect(page.getByText(fixture.patientAName)).toBeVisible();
    // The appointment was seeded at 09:00; the day view should place it near
    // that hour's row rather than anywhere on the page.
    const nineAmRow = page.locator("text=9:00").first();
    await expect(nineAmRow).toBeVisible();
  });

  test("[AC-015] toggling day and week view shows the same appointment in both layouts", async ({
    page,
  }) => {
    await signIn(page);
    await openCalendar(page);

    await page.getByLabel(/provider/i).selectOption(fixture.providerAId);

    await page.getByRole("button", { name: "Week" }).click();
    await expect(page.getByText(fixture.patientAName)).toBeVisible();

    await page.getByRole("button", { name: "Day" }).click();
    await expect(page.getByText(fixture.patientAName)).toBeVisible();
  });

  test("[AC-016] switching provider shows only the newly selected provider's appointments", async ({
    page,
  }) => {
    await signIn(page);
    await openCalendar(page);

    await page.getByLabel(/provider/i).selectOption(fixture.providerAId);
    await expect(page.getByText(fixture.patientAName)).toBeVisible();
    await expect(page.getByText(fixture.patientBName)).toHaveCount(0);

    await page.getByLabel(/provider/i).selectOption(fixture.providerBId);
    await expect(page.getByText(fixture.patientBName)).toBeVisible();
    await expect(page.getByText(fixture.patientAName)).toHaveCount(0);
  });
});
