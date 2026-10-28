<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- SQLite

## Decision Outcome

Chosen option: PostgreSQL 16, because Patients, providers and appointments are relational; foreign keys enforce integrity and a btree_gist exclusion constraint on provider time ranges prevents double-booking (AC-021, AC-025). History is a simple join. Encryption in transit and at rest supported.

## Consequences

Exclusion constraint needs the btree_gist extension enabled; modest operational overhead well within a single managed RDS instance.
<!-- sdlc:auto:end adr -->