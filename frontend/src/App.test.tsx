import * as React from "react";
import { act, render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate as useRouterNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

const TOKEN_KEY = "devontester.session_token";

function stubFetch(handlers: Record<string, () => Response>) {
  const fetchMock = vi.fn(async (url: string) => {
    for (const [suffix, make] of Object.entries(handlers)) {
      if (url.endsWith(suffix)) return make();
    }
    return new Response("not found", { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

// Exposes react-router's real `useNavigate`, rendered as a sibling of <App/> inside the
// same MemoryRouter, so a test can drive history the way a browser back button would
// without App itself needing a test-only seam.
function Harness({ onNavigateReady }: { onNavigateReady: (fn: (to: string) => void) => void }) {
  const navigate = useRouterNavigate();
  React.useEffect(() => {
    onNavigateReady((to: string) => navigate(to));
  }, [navigate, onNavigateReady]);
  return <App />;
}

describe("App route guard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-003] redirects to /sign-in and renders no protected data when there is no session", async () => {
    stubFetch({});

    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Sign in to DevonTester front desk")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
  });

  it("[AC-003] resolves the session via GET /auth/me and renders the protected route when a session exists", async () => {
    window.localStorage.setItem(TOKEN_KEY, "tok-abc");
    const fetchMock = stubFetch({
      "/auth/me": () =>
        new Response(JSON.stringify({ id: "u1", username: "r.okonkwo", role: "staff" }), {
          status: 200,
        }),
    });

    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );

    expect((await screen.findAllByText("Today")).length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/me"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer tok-abc" }),
      }),
    );
  });

  it("[AC-004] sign out calls POST /auth/logout, clears the stored session, and returns to /sign-in", async () => {
    window.localStorage.setItem(TOKEN_KEY, "tok-abc");
    const fetchMock = stubFetch({
      "/auth/me": () =>
        new Response(JSON.stringify({ id: "u1", username: "r.okonkwo", role: "staff" }), {
          status: 200,
        }),
      "/auth/logout": () => new Response(null, { status: 204 }),
    });

    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findAllByText("Today");
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() =>
      expect(screen.getByText("Sign in to DevonTester front desk")).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/logout"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(window.localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("[AC-005] after sign out, going back to a protected route shows no protected data and prompts sign-in", async () => {
    window.localStorage.setItem(TOKEN_KEY, "tok-abc");
    stubFetch({
      "/auth/me": () =>
        new Response(JSON.stringify({ id: "u1", username: "r.okonkwo", role: "staff" }), {
          status: 200,
        }),
      "/auth/logout": () => new Response(null, { status: 204 }),
    });

    let navigateBack: ((to: string) => void) | null = null;

    render(
      <MemoryRouter initialEntries={["/today"]}>
        <Harness onNavigateReady={(fn) => (navigateBack = fn)} />
      </MemoryRouter>,
    );

    await screen.findAllByText("Today");
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
    await waitFor(() =>
      expect(screen.getByText("Sign in to DevonTester front desk")).toBeInTheDocument(),
    );

    // Simulate the browser back button returning to the protected URL.
    act(() => {
      navigateBack!("/today");
    });

    await waitFor(() =>
      expect(screen.getByText("Sign in to DevonTester front desk")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
  });
});
