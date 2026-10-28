import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Patients from "./Patients";

function renderPatients() {
  return render(
    <MemoryRouter>
      <Patients />
    </MemoryRouter>,
  );
}

function clickAddPatient() {
  fireEvent.click(screen.getAllByRole("button", { name: /add patient/i })[0]);
}

const PATIENT_A = {
  id: "p-1",
  first_name: "Ellie",
  last_name: "Dawson",
  phone: "07700 900318",
  email: "ellie.dawson@example.com",
  created_at: "2026-10-27T09:00:00",
  updated_at: "2026-10-27T09:00:00",
};

const PATIENT_B = {
  id: "p-2",
  first_name: "Hamza",
  last_name: "Yilmaz",
  phone: "07700 900274",
  email: "h.yilmaz@example.com",
  created_at: "2026-10-26T09:00:00",
  updated_at: "2026-10-26T09:00:00",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("Patients screen", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-008] shows a loading state then renders patients from GET /patients", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toContain("/patients");
      return jsonResponse([PATIENT_A, PATIENT_B]);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();

    expect(screen.getByText(/loading the directory/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("Dawson")).toBeInTheDocument());
    expect(screen.getByText("Yilmaz")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/patients"),
      expect.objectContaining({
        headers: expect.not.objectContaining({ Authorization: expect.anything() }),
      }),
    );
  });

  it("[AC-005] carries the session JWT as a bearer token on the patients request", async () => {
    window.localStorage.setItem("devontester.session_token", "tok-999");
    const fetchMock = vi.fn(async () => jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/patients"),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer tok-999" }),
        }),
      ),
    );
  });

  it("[AC-008] saving the new-patient dialog POSTs to /patients and shows the created patient without reload", async () => {
    const created = {
      id: "p-9",
      first_name: "Noor",
      last_name: "Haddad",
      phone: "",
      email: "",
      created_at: "2026-10-28T10:00:00",
      updated_at: "2026-10-28T10:00:00",
    };
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if ((init?.method ?? "GET") === "GET") return jsonResponse([PATIENT_A]);
      expect(url).toContain("/patients");
      expect(init?.method).toBe("POST");
      expect(JSON.parse(String(init?.body))).toEqual({
        first_name: "Noor",
        last_name: "Haddad",
        phone: "",
        email: "",
      });
      return jsonResponse(created, 201);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();
    await waitFor(() => expect(screen.getByText("Dawson")).toBeInTheDocument());

    clickAddPatient();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Noor" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Haddad" } });
    fireEvent.click(screen.getByRole("button", { name: /save patient/i }));

    await waitFor(() => expect(screen.getByText("Haddad")).toBeInTheDocument());
    expect(screen.getByRole("status")).toHaveTextContent(/added to the patient list/i);
    // dialog closed, no page reload needed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("[AC-009] blocks save on a blank required name and names the missing field, preserving typed values", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();
    await waitFor(() => expect(screen.getByText(/no patients on file yet/i)).toBeInTheDocument());

    clickAddPatient();
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Haddad" } });
    fireEvent.click(screen.getByRole("button", { name: /save patient/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/first name is required/i);
    expect(screen.getByLabelText(/last name/i)).toHaveValue("Haddad");
    // no POST was attempted
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("[AC-009] surfaces a 422 field error from the API and preserves typed values", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if ((init?.method ?? "GET") === "GET") return jsonResponse([]);
      return jsonResponse(
        { detail: [{ loc: ["body", "email"], msg: "value is not a valid email address" }] },
        422,
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();
    await waitFor(() => expect(screen.getByText(/no patients on file yet/i)).toBeInTheDocument());

    clickAddPatient();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Noor" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Haddad" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "noor@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save patient/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/value is not a valid email address/i);
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Noor");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("noor@example.com");
  });

  it("[AC empty-search] filters the API-backed list and shows the existing empty state for no matches", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([PATIENT_A, PATIENT_B]));
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();
    await waitFor(() => expect(screen.getByText("Dawson")).toBeInTheDocument());

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "nobody-like-this" },
    });

    await waitFor(() => expect(screen.getByText(/no patients match/i)).toBeInTheDocument());
    expect(screen.queryByText("Dawson")).not.toBeInTheDocument();
  });

  it("a 401 clears the session so the route guard can redirect to /sign-in", async () => {
    window.localStorage.setItem("devontester.session_token", "expired-tok");
    const fetchMock = vi.fn(async () => jsonResponse({ detail: "no" }, 401));
    vi.stubGlobal("fetch", fetchMock);

    renderPatients();

    await waitFor(() =>
      expect(window.localStorage.getItem("devontester.session_token")).toBeNull(),
    );
  });
});
