import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Calendar from "./Calendar";

function renderCalendar() {
  return render(
    <MemoryRouter>
      <Calendar />
    </MemoryRouter>,
  );
}

const PROVIDER_A = {
  id: "pr-1",
  name: "Dr Amina Khan",
  specialty: "General practice",
  is_active: true,
};
const PROVIDER_B = {
  id: "pr-2",
  name: "Dr Tomas Lindqvist",
  specialty: "Dermatology",
  is_active: true,
};

// Dated "today" (not a fixed calendar date) so an appointment on the current day
// shows up in both the default week view and the day view regardless of when
// the suite runs.
const TODAY = new Date().toISOString().slice(0, 10);

const APPT_1 = {
  id: "ap-1",
  provider_id: "pr-1",
  patient_id: "pt-1",
  patient_name: "Ellie Dawson",
  date: TODAY,
  start_time: "09:00",
  end_time: "09:30",
  status: "booked",
  reason_note: "Follow-up",
};

const APPT_2 = {
  id: "ap-2",
  provider_id: "pr-2",
  patient_id: "pt-2",
  patient_name: "Marcus Whitfield",
  date: TODAY,
  start_time: "11:00",
  end_time: "11:30",
  status: "booked",
  reason_note: "Check-up",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("Calendar screen", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("[AC-014] loads providers from GET /providers and appointments from GET /calendar, rendering each in its slot", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse([PROVIDER_A, PROVIDER_B]);
      if (url.includes("/calendar")) {
        expect(url).toContain("provider_id=pr-1");
        expect(url).toContain("view=week");
        return jsonResponse([APPT_1]);
      }
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();

    expect(screen.getByText(/loading providers/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/ellie dawson/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/providers"),
      expect.anything(),
    );
  });

  it("[AC-015] toggling between day and week view re-fetches and re-renders the same appointments", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse([PROVIDER_A]);
      if (url.includes("/calendar")) return jsonResponse([APPT_1]);
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();
    await waitFor(() => expect(screen.getByText(/ellie dawson/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Day" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("view=day"),
        expect.anything(),
      ),
    );
    expect(screen.getByText(/ellie dawson/i)).toBeInTheDocument();
  });

  it("[AC-016] selecting a different provider refreshes the calendar to that provider's appointments", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse([PROVIDER_A, PROVIDER_B]);
      if (url.includes("provider_id=pr-2")) return jsonResponse([APPT_2]);
      if (url.includes("provider_id=pr-1")) return jsonResponse([APPT_1]);
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();
    await waitFor(() => expect(screen.getByText(/ellie dawson/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/provider/i), { target: { value: "pr-2" } });

    await waitFor(() => expect(screen.getByText(/marcus whitfield/i)).toBeInTheDocument());
    expect(screen.queryByText(/ellie dawson/i)).not.toBeInTheDocument();
  });

  it("[AC empty] shows an empty state when the provider has no appointments in the period", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse([PROVIDER_A]);
      if (url.includes("/calendar")) return jsonResponse([]);
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();

    await waitFor(() => expect(screen.getByText("No appointments")).toBeInTheDocument(), {
      timeout: 3000,
    });
  });

  it("[AC error] shows an error state with retry when GET /calendar fails", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse([PROVIDER_A]);
      if (url.includes("/calendar")) return jsonResponse({ detail: "boom" }, 500);
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();

    await waitFor(
      () => expect(screen.getByText(/couldn't load the calendar/i)).toBeInTheDocument(),
      { timeout: 3000 },
    );
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("shows an error state with retry when GET /providers fails", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse({ detail: "boom" }, 500);
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();

    await waitFor(() => expect(screen.getByText(/couldn't load providers/i)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("carries the session JWT as a bearer token on the providers request", async () => {
    window.localStorage.setItem("devontester.session_token", "tok-123");
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/providers")) return jsonResponse([PROVIDER_A]);
      return jsonResponse([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderCalendar();

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/providers"),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer tok-123" }),
        }),
      ),
    );
  });
});
