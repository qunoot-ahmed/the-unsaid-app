# Architecture overview

The Unsaid is a modular monolith: one Next.js application, one PostgreSQL database and no separate API service. Milestone 0 implements the skeleton described here; feature modules arrive from Milestone 2.

## Layers

| Layer           | Location         | Responsibility                                                                                                                        |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Routes          | src/app          | Layouts, pages, loading and error boundaries. Thin: compose module UI and queries.                                                    |
| Feature modules | src/modules/name | One folder per feature: domain (pure rules), server (actions, queries, services, repositories), ui (components) and a public index.ts |
| Shared          | src/shared       | Design tokens, database client, logging and, later, interface primitives                                                              |
| Generated       | src/generated    | Prisma client, recreated on install and never committed                                                                               |
| Tooling         | tools            | Repository scripts such as the writing-rules checker                                                                                  |

Planned modules: identity, confessions, stories, reading, moderation and ratelimit.

## Dependency rules

Enforced by dependency-cruiser (npm run check:deps):

- No circular dependencies.
- src/shared never imports from src/app or src/modules.
- A module imports another module only through its index.ts.
- Domain code imports no framework, database or UI package.
- Application code never imports tests, tools or development-only packages.

These boundaries keep business rules testable in isolation and make the dependency graph meaningful for future impact analysis.

## Request handling

- Server Components render by default; Client Components only where interaction requires them.
- Every mutation is a Server Action that checks the session, validates input with a schema, applies a rate limit, then calls a module service that checks ownership or role.
- Data leaves the server only through explicit public mappers.
- The proxy layer (Next.js 16 proxy.ts) redirects signed-out users for convenience and is never the authorization check.

## Caching

Public pages are cached by tag and invalidated on publish, hide, restore or delete. Private pages are rendered per request and never cached in a shared layer. Next.js 16 caching APIs (cacheTag, cacheLife, updateTag) are adopted when the first cached page is built.

## Persistence

PostgreSQL 17 through Prisma 7 with the pg driver adapter. The client is created in src/shared/lib/db.ts and cached per process. Milestone 0 has no domain tables; the planned model is in data-model.md.

## Environments

| Environment | Database                             | Notes                                         |
| ----------- | ------------------------------------ | --------------------------------------------- |
| Local       | Docker Compose, credentials in .env  | .env is never committed                       |
| CI          | PostgreSQL service container per job | Throwaway credentials, destroyed with the job |
| Hosting     | To be decided in Milestone 7         | Secrets held by the hosting provider          |
