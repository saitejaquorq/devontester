import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Settings from "./Settings";

const TOKEN_KEY = "devontester.session_token";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function renderSettings(fetchMock: ReturnType<typeof vi.fn>) {
  window.localStorage.setItem(TOKEN_KEY, "tok-abc");
  vi.stubGlobal("fetch", fetchMock);
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Settings />
      </AuthProvider>
    </MemoryRouter>,
  );
}

const ACCOUNT_A = {
  id: "acc-1",
  username: "d.okafor",
  role: "staff",
  is_active: true,
  created_at: "2025-01-08T00:00:00",
};

const ACCOUNT_B = {
  id: "acc-2",
  username: "t.whitfield",
  role: "staff",
  is_active: false,
  created_at: "2024-09-19T00:00:00",
};

function meResponder(role: string) {
  return () => jsonResponse({ id: "u1", username: "admin1", role });
}

describe("Settings screen — accounts", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-006] lists accounts from GET /accounts with edit and deactivate actions for an admin", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      if (url.endsWith("/accounts")) return jsonResponse([ACCOUNT_A, ACCOUNT_B]);
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText("d.okafor")).toBeInTheDocument());
    expect(screen.getByText("t.whitfield")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /deactivate account d.okafor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit d.okafor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reactivate account t.whitfield/i })).toBeInTheDocument();
  });

  it("[AC-006] creating an account validates required fields before calling POST /accounts", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      void init;
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      if (url.endsWith("/accounts")) return jsonResponse([]);
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText(/no receptionist accounts yet/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /^create account$/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/username is required/i);
    expect(alert).toHaveTextContent(/password is required/i);
    // only the GET calls happened (auth/me + accounts), never a POST
    expect(fetchMock.mock.calls.every((c) => (c[1]?.method ?? "GET") !== "POST")).toBe(true);
  });

  it("[AC-006] saving a valid new account POSTs to /accounts and refreshes the list", async () => {
    const created = { id: "acc-9", username: "n.haddad", role: "staff" };
    let didPost = false;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      const method = init?.method ?? "GET";
      if (url.endsWith("/accounts") && method === "GET") {
        return jsonResponse(didPost ? [created] : []);
      }
      if (url.endsWith("/accounts") && method === "POST") {
        expect(JSON.parse(String(init?.body))).toEqual({
          username: "n.haddad",
          password: "temp12345",
          role: "staff",
        });
        didPost = true;
        return jsonResponse(created, 200);
      }
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText(/no receptionist accounts yet/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/^username$/i), { target: { value: "n.haddad" } });
    fireEvent.change(screen.getByLabelText(/temporary password/i), { target: { value: "temp12345" } });
    fireEvent.click(screen.getByRole("button", { name: /^create account$/i }));

    await waitFor(() => expect(screen.getByText("n.haddad")).toBeInTheDocument());
    expect(screen.getByRole("status")).toHaveTextContent(/added as a staff account/i);
  });

  it("[AC-006] surfaces an API error from POST /accounts inline", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      const method = init?.method ?? "GET";
      if (url.endsWith("/accounts") && method === "GET") return jsonResponse([]);
      if (url.endsWith("/accounts") && method === "POST") {
        return jsonResponse(
          { detail: [{ loc: ["body", "username"], msg: "already exists" }] },
          422,
        );
      }
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText(/no receptionist accounts yet/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/^username$/i), { target: { value: "d.okafor" } });
    fireEvent.change(screen.getByLabelText(/temporary password/i), { target: { value: "temp12345" } });
    fireEvent.click(screen.getByRole("button", { name: /^create account$/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/already exists/i);
  });

  it("[AC-006] deactivating an account asks for confirmation then PATCHes and reflects the new state", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      const method = init?.method ?? "GET";
      if (url.endsWith("/accounts") && method === "GET") return jsonResponse([ACCOUNT_A]);
      if (url.endsWith(`/accounts/${ACCOUNT_A.id}`) && method === "PATCH") {
        expect(JSON.parse(String(init?.body))).toEqual({ is_active: false });
        return jsonResponse({ ...ACCOUNT_A, is_active: false });
      }
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText("d.okafor")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /deactivate account d.okafor/i }));
    expect(screen.getByText(/deactivate d.okafor\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /confirm deactivating d.okafor/i }));

    await waitFor(() => expect(screen.getByText("Deactivated")).toBeInTheDocument());
    expect(screen.getByRole("status")).toHaveTextContent(/deactivated/i);
  });

  it("[AC-006] cancelling the deactivate confirmation makes no PATCH call", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      if (url.endsWith("/accounts") && (init?.method ?? "GET") === "GET")
        return jsonResponse([ACCOUNT_A]);
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText("d.okafor")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /deactivate account d.okafor/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel deactivating d.okafor/i }));

    expect(fetchMock.mock.calls.every((c) => (c[1]?.method ?? "GET") !== "PATCH")).toBe(true);
    expect(screen.getByRole("cell", { name: "Active" })).toBeInTheDocument();
  });

  it("[AC-006] editing an account's role PATCHes /accounts/{id}", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/me")) return meResponder("admin")();
      const method = init?.method ?? "GET";
      if (url.endsWith("/accounts") && method === "GET") return jsonResponse([ACCOUNT_A]);
      if (url.endsWith(`/accounts/${ACCOUNT_A.id}`) && method === "PATCH") {
        expect(JSON.parse(String(init?.body))).toEqual({ role: "admin" });
        return jsonResponse({ ...ACCOUNT_A, role: "admin" });
      }
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() => expect(screen.getByText("d.okafor")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /edit d.okafor/i }));
    fireEvent.change(screen.getByLabelText("Role for d.okafor"), { target: { value: "admin" } });
    fireEvent.click(screen.getByRole("button", { name: /save role for d.okafor/i }));

    await waitFor(() =>
      expect(screen.getByRole("cell", { name: "Admin" })).toBeInTheDocument(),
    );
  });

  it("[AC-007] a staff session does not render the Accounts tab or account management, but keeps the how-to guide", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/me")) return meResponder("staff")();
      return jsonResponse({}, 404);
    });
    renderSettings(fetchMock);

    await waitFor(() =>
      expect(screen.getByText(/how-to guide for receptionists/i)).toBeInTheDocument(),
    );
    expect(screen.queryByRole("tab", { name: /^accounts$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
    expect(screen.getByText(/accounts is for admins/i)).toBeInTheDocument();
    // never attempted to load the account list
    expect(fetchMock.mock.calls.some((c) => String(c[0]).endsWith("/accounts"))).toBe(false);
  });
});
