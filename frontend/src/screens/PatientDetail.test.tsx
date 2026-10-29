import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PatientDetail, { SELECTED_PATIENT_KEY } from "./PatientDetail";

const PATIENT = {
  id: "p-1",
  first_name: "Ellie",
  last_name: "Dawson",
  phone: "07700 900318",
  email: "ellie.dawson@example.com",
  created_at: "2026-01-10T09:00:00",
  updated_at: "2026-01-10T09:00:00",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function renderDetail() {
  window.sessionStorage.setItem(SELECTED_PATIENT_KEY, PATIENT.id);
  return render(
    <MemoryRouter>
      <PatientDetail />
    </MemoryRouter>,
  );
}

describe("PatientDetail screen", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-010] loads the record from GET /patients/{id} and offers an edit form for phone and email", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toContain(`/patients/${PATIENT.id}`);
      return jsonResponse(PATIENT);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();
    expect(screen.getByText(/loading patient record/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("Ellie Dawson")).toBeInTheDocument());
    expect(screen.getByLabelText(/phone/i)).toHaveValue(PATIENT.phone);
    expect(screen.getByLabelText(/^email$/i)).toHaveValue(PATIENT.email);
  });

  it("[AC-010] saving a changed phone and email PATCHes /patients/{id} and shows the update without a manual refresh", async () => {
    const updated = { ...PATIENT, phone: "07700 900999", email: "ellie.new@example.com" };
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      if (method === "GET") return jsonResponse(PATIENT);
      expect(url).toContain(`/patients/${PATIENT.id}`);
      expect(method).toBe("PATCH");
      expect(JSON.parse(String(init?.body))).toEqual({
        phone: "07700 900999",
        email: "ellie.new@example.com",
      });
      return jsonResponse(updated);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();
    await waitFor(() => expect(screen.getByLabelText(/phone/i)).toHaveValue(PATIENT.phone));

    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "07700 900999" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "ellie.new@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/saved/i));
    expect(screen.getByLabelText(/phone/i)).toHaveValue("07700 900999");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("ellie.new@example.com");
  });

  it("[AC-011] a malformed email returns a 422 and shows an inline correction prompt, leaving the record unchanged and the user in edit state", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      if (method === "GET") return jsonResponse(PATIENT);
      return jsonResponse(
        { detail: [{ loc: ["body", "email"], msg: "value is not a valid email address" }] },
        422,
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();
    await waitFor(() => expect(screen.getByLabelText(/phone/i)).toHaveValue(PATIENT.phone));

    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/value is not a valid email address/i);
    // typed value and edit state are preserved, and the displayed record is unchanged
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("not-an-email");
    expect(screen.getByText("Ellie Dawson")).toBeInTheDocument();
  });

  it("disables Save while the PATCH request is in flight", async () => {
    let resolvePatch: (() => void) | undefined;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      if (method === "GET") return jsonResponse(PATIENT);
      return new Promise<Response>((resolve) => {
        resolvePatch = () => resolve(jsonResponse(PATIENT));
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();
    await waitFor(() => expect(screen.getByLabelText(/phone/i)).toHaveValue(PATIENT.phone));

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /saving changes/i })).toBeDisabled(),
    );
    resolvePatch?.();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/saved/i));
  });

  it("shows an error message and keeps the edit when the PATCH request fails", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      if (method === "GET") return jsonResponse(PATIENT);
      return jsonResponse({ detail: "boom" }, 500);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();
    await waitFor(() => expect(screen.getByLabelText(/phone/i)).toHaveValue(PATIENT.phone));

    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "07700 900999" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/couldn't save/i);
    expect(screen.getByLabelText(/phone/i)).toHaveValue("07700 900999");
  });

  it("[AC error] shows an error state with retry when GET /patients/{id} fails", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ detail: "boom" }, 500));
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();

    await waitFor(() =>
      expect(screen.getByText(/couldn't load this patient/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
