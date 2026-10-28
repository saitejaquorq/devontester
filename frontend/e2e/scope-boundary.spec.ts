import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

/**
 * US-018 -- MVP scope-boundary (AC-039, AC-040), UI half.
 *
 * Checks the *signed-in app menu and screens* for interactive controls --
 * links, buttons, tabs, menu items, form fields -- named after a payment,
 * billing, invoicing, or reminder-configuration function. Interactive
 * controls, not page text, are what is asserted on: the Settings "how-to
 * guide" panel legitimately prints the words "billing" and "payment" to
 * tell the admin those things are *out of scope*, and a blanket text search
 * would false-positive on exactly the sentence that proves the boundary.
 */

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend");

const VALID_USERNAME = "qa.e2e.scope-boundary";
const VALID_PASSWORD = "Qa-E2E-Scope-9!";

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

// Whole words only, so "display"/"charger" etc. are not false positives.
const FORBIDDEN_CONTROL_NAME =
  /\b(pay|payment|payments|bill|billing|invoice|invoicing|charge|refund|checkout|stripe|remind|reminder|reminders|sms|notification|notifications|fhir|hl7|ehr|emr|integration|integrations|webhook)\b/i;

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(VALID_USERNAME);
  await page.getByLabel(/password/i).fill(VALID_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/today/);
}

/** Collects the accessible names of every interactive control on the page. */
async function interactiveControlNames(page: import("@playwright/test").Page): Promise<string[]> {
  const roles = [
    "link",
    "button",
    "tab",
    "menuitem",
    "checkbox",
    "switch",
    "textbox",
    "combobox",
  ] as const;

  const names: string[] = [];
  for (const role of roles) {
    const locator = page.getByRole(role);
    const count = await locator.count();
    for (let i = 0; i < count; i += 1) {
      const name = await locator.nth(i).evaluate((el) => el.textContent ?? el.getAttribute("aria-label") ?? "");
      if (name.trim()) names.push(name.trim());
    }
  }
  return names;
}

test.describe("[AC-039] app menu has no payment, billing, invoicing or reminder-configuration control", () => {
  test("the signed-in app menu exposes none of those controls", async ({ page }) => {
    await signIn(page);

    const menu = page.getByRole("navigation", { name: /app menu/i });
    const linkTexts = await menu.getByRole("link").allTextContents();
    const buttonTexts = await menu.getByRole("button").allTextContents();
    const offenders = [...linkTexts, ...buttonTexts].filter((t) => FORBIDDEN_CONTROL_NAME.test(t));

    expect(offenders, "the app menu must expose no billing/payment/reminder entry").toEqual([]);
  });
});

test.describe("[AC-039][AC-040] no payment, billing, invoicing, reminder-configuration, or EHR/FHIR/HL7 control on any signed-in screen", () => {
  const screens = ["/today", "/calendar", "/patients", "/patient-detail", "/settings"];

  for (const route of screens) {
    test(`${route} exposes no such interactive control`, async ({ page }) => {
      await signIn(page);
      await page.goto(route);

      const offenders = (await interactiveControlNames(page)).filter((name) =>
        FORBIDDEN_CONTROL_NAME.test(name),
      );

      expect(
        offenders,
        `${route} must expose no payment/billing/invoicing/reminder-configuration/EHR/FHIR/HL7 control`,
      ).toEqual([]);
    });
  }
});
