import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

/**
 * US-003-3 -- admin/staff role separation for account management
 * (AC-006, AC-007).
 *
 * Seeds an admin and a staff account directly through the backend's own ORM
 * model and password-hashing helper (app.models.Account /
 * app.security.hash_password), against the real database this environment
 * provides -- no mock, no stand-in.
 */

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend");

const ADMIN_USERNAME = "qa.e2e.admin";
const ADMIN_PASSWORD = "Qa-E2E-Admin-9!";
const STAFF_USERNAME = "qa.e2e.staff";
const STAFF_PASSWORD = "Qa-E2E-Staff-9!";

function seedAccount(username: string, password: string, role: "admin" | "staff"): void {
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
        db.add(models.Account(username=${JSON.stringify(username)}, password_hash=hash_password(${JSON.stringify(password)}), role=${JSON.stringify(role)}, is_active=True))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()  # another worker won the race; the account now exists
    else:
        acct.password_hash = hash_password(${JSON.stringify(password)})
        acct.role = ${JSON.stringify(role)}
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
  seedAccount(ADMIN_USERNAME, ADMIN_PASSWORD, "admin");
  seedAccount(STAFF_USERNAME, STAFF_PASSWORD, "staff");
});

async function signIn(page: import("@playwright/test").Page, username: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/today/);
}

test.describe("[AC-006] admin manages a receptionist account end to end", () => {
  test("create, edit and deactivate a receptionist account through the UI, reflected in the list", async ({
    page,
  }) => {
    await signIn(page, ADMIN_USERNAME, ADMIN_PASSWORD);

    await page.goto("/settings");
    await page.getByRole("tab", { name: /^accounts\b/i }).click();

    const unique = Date.now().toString(36);
    const username = `qa.recept.${unique}`;
    const password = "Recept-Pass-9!";

    await page.getByLabel(/^username$/i).fill(username);
    await page.getByLabel(/temporary password/i).fill(password);
    // Role defaults to Staff -- a receptionist account.
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByRole("status")).toContainText(username);

    const row = page.getByRole("row").filter({ hasText: username });
    await expect(row).toBeVisible();
    await expect(row.getByText("Staff", { exact: true })).toBeVisible();
    await expect(row.getByText("Active", { exact: true })).toBeVisible();

    // Edit: promote the account to admin.
    await row.getByRole("button", { name: `Edit ${username}` }).click();
    await row.getByLabel(`Role for ${username}`).selectOption("admin");
    await row.getByRole("button", { name: `Save role for ${username}` }).click();

    await expect(row.getByText("Admin", { exact: true })).toBeVisible();

    // Deactivate.
    await row.getByRole("button", { name: `Deactivate account ${username}` }).click();
    await row.getByRole("button", { name: `Confirm deactivating ${username}` }).click();

    await expect(row.getByText("Deactivated", { exact: true })).toBeVisible();

    // Persists across a reload.
    await page.reload();
    await page.getByRole("tab", { name: /^accounts\b/i }).click();
    const reloadedRow = page.getByRole("row").filter({ hasText: username });
    await expect(reloadedRow.getByText("Admin", { exact: true })).toBeVisible();
    await expect(reloadedRow.getByText("Deactivated", { exact: true })).toBeVisible();
  });
});

test.describe("[AC-007] staff cannot reach account management", () => {
  test("account management option is absent from the nav and direct navigation does not expose it", async ({
    page,
  }) => {
    await signIn(page, STAFF_USERNAME, STAFF_PASSWORD);

    const nav = page.getByRole("navigation", { name: /app menu/i });
    await expect(nav.getByRole("link", { name: /accounts/i })).toHaveCount(0);

    await page.goto("/settings");
    await expect(page.getByRole("tab", { name: /^accounts\b/i })).toHaveCount(0);
    await expect(page.getByText(/accounts is for admins/i)).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
  });
});
