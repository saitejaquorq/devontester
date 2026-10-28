<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because The front desk runs an interactive day/week calendar all day with booking, drag-to-reschedule, status flips and a patient-history panel; React's component state model fits this stateful desktop-browser screen. Delivered as a responsive SPA for desktop browsers (NFR-008).

## Consequences

A SPA needs client-side route guarding to redirect unauthenticated access (AC-003); handled with a lightweight router. No native app, by scope.
<!-- sdlc:auto:end adr -->