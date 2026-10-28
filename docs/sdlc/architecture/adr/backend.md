<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Express
- Spring Boot

## Decision Outcome

Chosen option: FastAPI 0.115, because The logic is straightforward CRUD plus appointment validation and history reads; FastAPI's Pydantic request validation keeps patient and appointment payloads well-formed (AC-009, AC-011, AC-020) and serves a JSON API to React cleanly for a few concurrent staff.

## Consequences

Python async is ample here; no high-throughput tuning needed at single-clinic scale (NFR-007).
<!-- sdlc:auto:end adr -->