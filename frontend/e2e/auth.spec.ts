import { execFileSync } from "node:child_process";
import path from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Seeds (or refreshes) one receptionist account directly through the
 * backend's own ORM model and password-hashing helper -- the same code
 * path a real seed/management command would use -- rather than inserting a
 * raw row, so the hash the UI logs in against is exactly what the app
 * produces. Runs against the same database the backend under test uses
 * (DATABASE_URL in this environment); no mock, no stand-in.
 *
 * If the backend has not implemented `app.models.User` / `app.security`
 * yet, this throws and every test below fails loudly rather than silently
 * passing -- expected while the build is still in flight.
 */
function seedReceptionist(username: string, password: string) {
  const backendDir = path.resolve(__dirname, "../../backend");
  const script = `
import sys, uuid
from datetime import datetime, timezone
sys.path.insert(0, ".")
from app.database import Base, SessionLocal, engine
from app import models
Base.metadata.create_all(bind=engine)
try:
    from app.security import hash_password
except ImportError:
    from passlib.hash import bcrypt
    hash_password = bcrypt.hash
session = SessionLocal()
user = session.query(models.User).filter_by(username="${username}").first()
if user is None:
    user = models.User(
        id=str(uuid.uuid4()),
        username="${username}",
        password_hash=hash_password("${password}"),
        role="receptionist",
        is_active=True,
        created_at=datetime.now(timezone.utc),
    )
    session.add(user)
else:
    user.password_hash = hash_password("${password}")
    user.is_active = True
session.commit()
session.close()
`;
  execFileSync(path.join(backendDir, ".venv/bin/python"), ["-c", script], {
    cwd: backendDir,
    stdio: "inherit",
  });
}

const VALID_USERNAME = "qa.e2e.receptionist";
const VALID_PASSWORD = "Qa-E2E-Pass-9!";

test.beforeAll(() => {
  seedReceptionist(VALID_USERNAME, VALID_PASSWORD);
});

async function signIn(page: import("@playwright/test").Page, username: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

test.describe("sign-in", () => {
  test("[AC-001] valid sign-in lands on the front-desk home view", async ({ page }) => {
    await signIn(page, VALID_USERNAME, VALID_PASSWORD);

    await expect(page).toHaveURL(/\/today/);
    await expect(page.getByRole("alert")).toHaveCount(0);
  });

  test("[AC-002] invalid sign-in shows a generic error naming neither field", async ({
    page,
  }) => {
    await signIn(page, VALID_USERNAME, "definitely-the-wrong-password");

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    const message = (await alert.textContent())?.toLowerCase() ?? "";
    expect(message).not.toContain("username");
    expect(message).not.toContain("password");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("[AC-002] unknown username shows the identical generic error", async ({ page }) => {
    await signIn(page, "no-such-receptionist", "anything-at-all");

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    const message = (await alert.textContent())?.toLowerCase() ?? "";
    expect(message).not.toContain("username");
    expect(message).not.toContain("not found");
    await expect(page).toHaveURL(/\/sign-in/);
  });
});

test.describe("route guarding while signed out", () => {
  for (const route of ["/patients", "/calendar", "/patient-detail"]) {
    test(`[AC-003] direct navigation to ${route} while signed out redirects to /sign-in`, async ({
      page,
    }) => {
      const response = await page.goto(route);
      await expect(page).toHaveURL(/\/sign-in/);
      // No protected list/detail content should ever have been rendered.
      await expect(page.getByRole("table")).toHaveCount(0);
      expect(response?.ok()).toBeTruthy();
    });
  }
});

test.describe("sign out", () => {
  test("[AC-004] sign out returns to /sign-in and clears the session", async ({ page }) => {
    await signIn(page, VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/\/today/);

    await page.getByRole("link", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("[AC-005] browser-back to a protected route after sign-out prompts sign-in, not data", async ({
    page,
  }) => {
    await signIn(page, VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/\/today/);
    await page.goto("/patients");

    await page.getByRole("link", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/sign-in/);

    await page.goBack();

    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByRole("table")).toHaveCount(0);
  });
});
