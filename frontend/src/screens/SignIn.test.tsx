import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import SignIn from "./SignIn";

function renderSignIn() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("SignIn", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-001] submits valid credentials, calls POST /auth/login and stores the session token", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/login")) {
        expect(init?.method).toBe("POST");
        expect(JSON.parse(String(init?.body))).toEqual({
          username: "r.okonkwo",
          password: "frontdesk",
        });
        return new Response(JSON.stringify({ access_token: "tok-123", role: "staff" }), {
          status: 200,
        });
      }
      if (url.endsWith("/auth/me")) {
        return new Response(
          JSON.stringify({ id: "u1", username: "r.okonkwo", role: "staff" }),
          { status: 200 },
        );
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    renderSignIn();
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "r.okonkwo" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "frontdesk" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/signed in/i));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(window.localStorage.getItem("devontester.session_token")).toBe("tok-123");
  });

  it("[AC-002] shows the API's single generic error for invalid credentials, with no demo hint and no artificial delay", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/login")) {
        return new Response(JSON.stringify({ detail: "Invalid credentials" }), { status: 401 });
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    renderSignIn();
    expect(screen.queryByText(/test desk account/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "wrong" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Username or password is incorrect. Please try again."),
      ).toBeInTheDocument(),
    );
    expect(window.localStorage.getItem("devontester.session_token")).toBeNull();
  });
});
