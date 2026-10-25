# The Unsaid

Some stories are written. Others are confessed.

The Unsaid is an independent, open-source literary platform with two connected spaces: the Whisper Wall, where people leave anonymous confessions, and the Library, where branching stories change with the reader's choices.

**Status: Milestone 0, project foundations.** No product features are implemented yet. The repository currently contains the application skeleton, design tokens, tooling, tests that prove the tooling works, continuous integration and the project documentation.

## Planned experience

- **The Whisper Wall:** anonymous confessions grouped into mood rooms, folded letters for long entries and sealed letters that readers choose to open.
- **The Library:** serialised and branching fiction under pen names, with a visible thread of the reader's choices and saved progress.
- **The Letter:** a distraction-free composer where publication completes only when the server confirms it.
- **Safety:** private reporting, a moderation queue and audited moderator access to sealed content.

The full plan, requirements and acceptance criteria are in [docs/product](docs/product) and [DESIGN.md](DESIGN.md).

## Milestones

| Milestone | Scope                                             | Status    |
| --------- | ------------------------------------------------- | --------- |
| 0         | Project foundations                               | In review |
| 1         | Design system primitives and specimen page        | Planned   |
| 2         | Accounts, pen names, authorization, rate limiting | Planned   |
| 3         | Whisper Wall and The Letter composer              | Planned   |
| 4         | Reporting and moderation                          | Planned   |
| 5         | Story engine and authoring studio                 | Planned   |
| 6         | Reader, Library and The Thread                    | Planned   |
| 7         | Hardening and first release                       | Planned   |

## Technology

| Area                       | Choice                         | Version        |
| -------------------------- | ------------------------------ | -------------- |
| Runtime                    | Node.js LTS                    | 24             |
| Framework                  | Next.js App Router             | 16.4.3         |
| UI library                 | React                          | 19.3.1         |
| Language                   | TypeScript, strict             | 6.0.3          |
| Styling                    | Tailwind CSS                   | 4.3.3          |
| Database                   | PostgreSQL                     | 17.11          |
| Data access                | Prisma ORM with the pg adapter | 7.10.1         |
| Unit and integration tests | Vitest                         | 5.0.5          |
| Browser tests              | Playwright with axe            | 1.64.1         |
| Linting and formatting     | ESLint, Prettier               | 9.39.5, 3.9.10 |
| Module boundaries          | dependency-cruiser             | 18.7.0         |

Reasons for these versions are recorded in [docs/architecture/decisions/0006-toolchain-versions.md](docs/architecture/decisions/0006-toolchain-versions.md).

## Getting started

Prerequisites: Node.js 24, Docker Desktop and Git. Detailed instructions, including installing Node.js 24 on Windows with nvm, are in [docs/development/setup.md](docs/development/setup.md).

    npm ci
    cp .env.example .env
    npm run db:up
    npm run dev

Edit .env before starting the database: replace every value marked change-me. The development server runs at http://localhost:3000.

## Commands

| Command                  | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| npm run dev              | Start the development server                                           |
| npm run build            | Production build                                                       |
| npm run lint             | ESLint, including the writing rule for strings and JSX text            |
| npm run format:check     | Prettier check                                                         |
| npm run typecheck        | Generate route types and run the TypeScript compiler                   |
| npm run check:writing    | Writing rules for documentation and content files                      |
| npm run check:deps       | Module boundary rules                                                  |
| npm run test:unit        | Unit tests                                                             |
| npm run test:integration | Integration tests against PostgreSQL (run npm run db:up first)         |
| npm run test:e2e         | Browser and accessibility tests (run npm run build first)              |
| npm run verify           | Lint, format, types, writing rules, boundaries and unit tests together |

## Project structure

| Path              | Contents                                                         |
| ----------------- | ---------------------------------------------------------------- |
| src/app           | Routes and layouts only                                          |
| src/modules       | Feature modules, added from Milestone 2                          |
| src/shared        | Design tokens, shared libraries and, later, interface primitives |
| prisma            | Database schema and migrations                                   |
| tests/integration | Tests that use the real database                                 |
| tests/e2e         | Playwright browser tests                                         |
| tools             | Repository tooling, including the writing-rules checker          |
| docs              | Product, architecture, testing and development documentation     |

## Continuous integration

Pull requests to main and pushes to main or development branches run three jobs on GitHub Actions with read-only permissions: quality (lint, format, types, writing rules, module boundaries, unit tests with coverage), integration (tests against a PostgreSQL service) and end-to-end (production build, Playwright and axe). JUnit results, coverage and the module dependency graph are published as build artifacts.

## Documentation

- [DESIGN.md](DESIGN.md): approved visual language, tokens and interaction rules
- [CLAUDE.md](CLAUDE.md): working instructions for AI-assisted development
- [docs/product](docs/product): vision, scope and requirements with IDs
- [docs/architecture](docs/architecture): overview, data model, security and decision records
- [docs/testing](docs/testing): strategy and the requirement to test matrix
- [docs/development](docs/development): setup and workflow
- [CHANGELOG.md](CHANGELOG.md)

## Licence

The Unsaid is released under the MIT License. See [LICENSE](LICENSE).
