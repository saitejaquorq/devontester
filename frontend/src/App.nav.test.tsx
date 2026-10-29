import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

const TOKEN_KEY = "devontester.session_token";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function stubFetch(role: string) {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.endsWith("/auth/me")) return jsonResponse({ id: "u1", username: "r.okonkwo", role });
    if (url.endsWith("/accounts")) return jsonResponse([]);
    return jsonResponse({}, 404);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("App nav — role gating of the accounts entry", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(TOKEN_KEY, "tok-abc");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-007] hides the 'Accounts & help' nav option for a staff session", async () => {
    stubFetch("staff");
    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getAllByText("Today").length).toBeGreaterThan(0));
    expect(screen.queryByText("Accounts & help")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /help/i })).toBeInTheDocument();
  });

  it("[AC-007] shows the 'Accounts & help' nav option for an admin session", async () => {
    stubFetch("admin");
    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getAllByText("Today").length).toBeGreaterThan(0));
    expect(screen.getByText("Accounts & help")).toBeInTheDocument();
  });

  it("[AC-007] a staff session navigating directly to /settings sees no account management section", async () => {
    stubFetch("staff");
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/how-to guide for receptionists/i)).toBeInTheDocument(),
    );
    expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
    expect(screen.getByText(/accounts is for admins/i)).toBeInTheDocument();
  });
});
