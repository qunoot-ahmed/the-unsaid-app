# 0002: Better Auth for authentication

Status: Accepted, implemented in Milestone 2

## Context

The application needs email and password accounts, database sessions, invite codes and roles, with authorization enforced on the server.

## Options considered

1. Auth.js. Since September 2025 it has been maintained by the Better Auth team for security fixes, and its maintainers recommend Better Auth for new projects.
2. A hosted identity provider. Adds an external dependency and cost for a portfolio project.
3. Better Auth with its Prisma adapter and database sessions.

## Decision

Option 3. Authorization decisions stay in module services; Better Auth provides identity and sessions only.

## Consequences

- Actively maintained library with database sessions that can be revoked server side.
- A smaller ecosystem than Auth.js had; versions are pinned and verified when Milestone 2 starts.
- Its exact rate-limit storage options are checked against its documentation in Milestone 2.
