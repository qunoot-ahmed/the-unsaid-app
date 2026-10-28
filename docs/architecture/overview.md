# Architecture overview

The Unsaid is a modular monolith: one Next.js application, one PostgreSQL database and no separate API service. Milestone 0 implemented the skeleton. Milestone 1 added the shared interface primitives and the first feature modules, which serve fictional demonstration data only.

## Layers

| Layer           | Location         | Responsibility                                                                                                                        |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Routes          | src/app          | Layouts, pages, loading and error boundaries. Thin: compose module UI and queries.                                                    |
| Feature modules | src/modules/name | One folder per feature: domain (pure rules), server (actions, queries, services, repositories), ui (components) and a public index.ts |
| Shared          | src/shared       | Design tokens, database client, logging and interface primitives (src/shared/ui)                                                      |
| Generated       | src/generated    | Prisma client, recreated on install and never committed                                                                               |
| Tooling         | tools            | Repository scripts such as the writing-rules checker                                                                                  |

Modules in Milestone 1:

| Module      | Contents                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| home        | The Lifted Ink and the two doors, with a fixed project-authored confession                                                                                                            |
| confessions | Moods, letter folding, catalogue marks and the composer state machine (domain); demonstration letters, the Wall query and preview actions (server); Wall and composer components (ui) |
| reading     | Reader view building from a story graph (domain); the demonstration story, its query and choice actions (server); reader, thread and choice components (ui)                           |

Planned modules still to come: identity, stories, moderation and ratelimit.

### Demonstration data boundary

Milestone 1 demonstration content lives only in server files of each module (demo-letters.ts, demo-story.ts). It reaches the client through the same shapes the real features will use: the Wall receives letter summaries without sealed bodies, a sealed body is returned only by the revealSealedLetter action, and the reader receives a per-reader view without choice destinations or undiscovered ending titles. Preview actions validate input on the server and store nothing. Milestone 3 and 6 replace the demonstration sources with database queries behind the same view models.

## Dependency rules

Enforced by dependency-cruiser (npm run check:deps):

- No circular dependencies.
- src/shared never imports from src/app or src/modules.
- A module imports another module only through its index.ts.
- Domain code imports no framework, database or UI package.
- Application code never imports tests, tools or development-only packages.
- Module UI reaches the module's server folder only through files named name-actions.ts (Server Actions). Queries and demonstration data are imported by routes, never by components.

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
