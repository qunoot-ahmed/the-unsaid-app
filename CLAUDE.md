# Working instructions for The Unsaid

These instructions apply to every change in this repository, whether made by a person or by an AI assistant.

## Project

The Unsaid is an anonymous confession and branching fiction platform. The approved design is in DESIGN.md; requirements with IDs are in docs/product/requirements.md. Work proceeds one milestone at a time. Do not implement features from a later milestone.

## Approval rules

- Never commit, push, merge, deploy or change Git remotes without explicit approval from the repository owner.
- Propose a commit message with each completed change; wait for approval before committing.
- Do not add a dependency without a stated purpose. Record significant choices in docs/architecture/decisions.
- Do not silently change an agreed business rule. Raise it first.

## Writing rules (mandatory)

- Documentation (every Markdown file, including this one, README, DESIGN, CHANGELOG and decision records) contains no backtick characters. Write commands and paths as plain text or as indented blocks.
- Project-authored text (documentation, interface strings, seed content, changelogs) contains no em dashes and no en dashes. Use commas, colons, periods, parentheses or separate sentences. Write ranges as "1 to 4".
- Text entered by users is stored and displayed exactly as typed. Never rewrite user punctuation.
- npm run check:writing checks documentation and content files. ESLint checks string literals and JSX text in source code.

## Commands

    npm run verify              lint, format, types, writing rules, boundaries, unit tests
    npm run db:up               start PostgreSQL in Docker
    npm run test:integration    integration tests against PostgreSQL
    npm run build               production build
    npm run test:e2e            Playwright and axe (after a build)

The project requires Node.js 24. See docs/development/setup.md.

## Architecture rules

- Modular monolith. Routes in src/app stay thin; features live in src/modules/name with domain, server and ui folders and a public index.ts.
- Modules import each other only through index.ts. src/shared never imports from src/app or src/modules. Domain code imports no framework, database or UI packages. These rules are enforced by npm run check:deps.
- Server Components by default. Client Components only where interaction requires them.
- Every mutation goes through a Server Action that checks the session, validates input, applies rate limits and calls a module service that checks ownership or role.
- Data leaves the server only through explicit public mappers. Never pass Prisma models to Client Components.
- Authorization, anonymity, sealed-content visibility and publication state are enforced on the server. CSS or client checks are never the protection.
- No business logic may depend on animations, transitions or their events.

## Testing rules

- Write tests with the feature. Name and tag tests with requirement IDs, for example [CONF-002].
- Unit tests for domain logic, integration tests against the real database, Playwright for journeys and accessibility.
- No fixed sleeps, no tests that depend on each other, no weakened assertions, no silenced failures.
- Never report a test or build as passing unless it was run. Report failures with their output.

## Definition of done

1. The change stays within the current milestone.
2. npm run verify passes, plus integration and end-to-end tests where relevant.
3. Accessibility acceptance criteria for touched screens are checked by their stated method.
4. Documentation, requirements and the test matrix are updated.
5. The writing check passes.
6. A commit message is proposed and approved before committing.
