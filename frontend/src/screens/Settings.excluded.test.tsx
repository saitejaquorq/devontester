import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Settings from "./Settings";

// US-018 -- Excluded features boundary (AC-039, AC-040).
//
// The Settings screen is where the clinic administrator "reviews available
// features". Its "What this tool does not do" panel is the on-screen statement
// of the agreed MVP boundary, so a receptionist who is asked for one of these
// at the desk knows it is out of scope. These tests assert the admin can read
// that boundary -- if a line is dropped, the criterion it names is no longer
// communicated and the test fails.

function renderSettings() {
  return render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>,
  );
}

function openScopePanel() {
  // The scope panel lives on the "How-to guide" tab; admins land on Accounts first.
  fireEvent.click(screen.getByRole("tab", { name: /how-to guide/i }));
}

describe("Settings excluded-features boundary", () => {
  it("[AC-039] names no payments, billing, invoicing or patient reminders as out of scope", () => {
    renderSettings();
    openScopePanel();

    expect(screen.getByText(/what this tool does not do/i)).toBeInTheDocument();
    expect(screen.getByText("No payments, billing or invoicing")).toBeInTheDocument();
    expect(screen.getByText("No automated patient SMS or email reminders")).toBeInTheDocument();
  });

  it("[AC-040] states the tool is standalone with no EHR / HL7 / FHIR integration", () => {
    renderSettings();
    openScopePanel();

    expect(screen.getByText("No EHR / HL7 / FHIR integration")).toBeInTheDocument();
  });
});
