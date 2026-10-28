import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  apiFetch,
  clearSessionToken,
  getSessionToken,
  setSessionToken,
  SESSION_EXPIRED_EVENT,
} from "./api";

describe("apiFetch", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the stored session JWT as a bearer token on every request", async () => {
    setSessionToken("tok-xyz");
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/patients");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/patients"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer tok-xyz" }),
      }),
    );
  });

  it("a 401 response clears the stored session and announces session expiry", async () => {
    setSessionToken("tok-xyz");
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ detail: "no" }), { status: 401 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const onExpired = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);

    await expect(apiFetch("/patients")).rejects.toThrow();

    expect(getSessionToken()).toBeNull();
    expect(onExpired).toHaveBeenCalledTimes(1);
    window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  });

  it("getSessionToken/clearSessionToken round-trip through storage", () => {
    setSessionToken("abc");
    expect(getSessionToken()).toBe("abc");
    clearSessionToken();
    expect(getSessionToken()).toBeNull();
  });
});
