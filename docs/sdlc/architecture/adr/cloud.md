<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Azure
- GCP

## Decision Outcome

Chosen option: AWS, because One reliable place to host the SPA, API and database with TLS in transit, encryption at rest and tested backups — exactly what this internal tool needs (NFR-001, NFR-006). HIPAA-eligible hosting and BAAs are available later if real PHI is introduced.

## Consequences

HIPAA-specific controls deliberately not configured for dummy data (NFR-005); would be revisited before any real PHI.
<!-- sdlc:auto:end adr -->