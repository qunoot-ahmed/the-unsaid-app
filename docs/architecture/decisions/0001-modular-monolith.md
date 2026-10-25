# 0001: Modular monolith

Status: Accepted (Milestone 0)

## Context

The Unsaid is a portfolio MVP built by one developer. It needs clear feature boundaries for testability and for future test impact analysis, but not independent deployment or scaling.

## Options considered

1. Microservices for identity, confessions and stories.
2. A single Next.js application with no internal structure.
3. A single Next.js application organised into feature modules with enforced boundaries.

## Decision

Option 3. One Next.js application and one PostgreSQL database. Features live in src/modules with public index files; dependency-cruiser enforces the boundaries in CI.

## Consequences

- One deployment, one database, simple local setup and transactions across features.
- Boundaries depend on tooling discipline rather than network separation; the dependency check is mandatory in CI.
- The dependency graph is a reliable input for impact analysis because cross-module imports are explicit.
