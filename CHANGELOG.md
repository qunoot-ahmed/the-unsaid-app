# Changelog

All notable changes to this project are recorded here. The format follows Keep a Changelog, and the project will use semantic versioning from its first release.

## Unreleased

### Added

- Milestone 1 design system: shared interface primitives (buttons, fields, radio cards, feedback states, dialog, site navigation and chrome) and a design specimen page at /design.
- Signature demonstrations with fictional content: the Lifted Ink homepage with two doors, the Whisper Wall with mood rooms and ordinary, folded and sealed letters, a branching demonstration story with the Thread and endings found, and The Letter composer in preview mode. Nothing is stored or published.
- Component tests with Testing Library in a jsdom Vitest project, end-to-end specifications for every Milestone 1 flow, responsive and touch-target checks, and a visual regression suite run in a pinned Playwright container.
- A dependency rule that lets module UI reach server code only through action files.
- Decision record 0007 for component and visual testing.
- Milestone 0 project foundations: Next.js 16 App Router with strict TypeScript, Tailwind CSS 4 with the Nocturne Folio design tokens, and a foundation page that proves fonts, tokens and accessibility checks. The foundation page was replaced by the homepage in Milestone 1.
- PostgreSQL 17 in Docker Compose and Prisma 7 with the pg adapter, with a database connectivity check.
- Vitest unit and integration projects, Playwright with axe on desktop and mobile Chromium, and token contrast tests.
- Writing-rules checker for documentation and content files, and an ESLint rule for project-authored strings.
- dependency-cruiser module boundary rules.
- GitHub Actions workflow with quality, integration and end-to-end jobs. Milestone 1 adds component tests to the quality job and a visual job.
- Project documentation: README, CLAUDE, DESIGN, product requirements, architecture overview, data model, security and privacy, decision records, testing strategy and development guides.
- MIT License.
