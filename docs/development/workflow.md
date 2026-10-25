# Development workflow

## Branches and commits

- Work on a branch named by type and purpose, for example chore/project-foundation or feat/whisper-wall.
- Keep commits small and coherent. Use Conventional Commits: type(scope): summary, for example feat(confessions): add sealed letter reveal.
- Nothing is committed, pushed or merged without the repository owner's approval.
- Lockfiles are committed. Generated files, build output, test reports and .env files are not.

## Pull request checklist

1. The change stays within the current milestone.
2. npm run verify passes; integration and end-to-end tests pass where relevant.
3. Requirement IDs are in the titles of new tests, and docs/testing/test-matrix.md is updated.
4. DESIGN.md and tokens are updated together with any design change.
5. Accessibility criteria for touched screens are checked by their stated method.
6. New dependencies have a stated purpose; significant choices have a decision record.
7. The CHANGELOG has an entry under Unreleased.

## Writing rules

| Applies to                                                | Rule                                                           | Checked by            |
| --------------------------------------------------------- | -------------------------------------------------------------- | --------------------- |
| Documentation (every Markdown file)                       | No backticks. No em dashes, en dashes or other long dashes.    | npm run check:writing |
| Project-authored content files (src/content, prisma/seed) | No em dashes, en dashes or other long dashes                   | npm run check:writing |
| Strings and JSX text in source code                       | No em dashes, en dashes or other long dashes                   | ESLint (npm run lint) |
| Text entered by users                                     | Stored and shown exactly as typed. Never checked or rewritten. | Not applicable        |

Use commas, colons, periods, parentheses or separate sentences instead of long dashes. Write ranges as "1 to 4". In documentation, write commands as indented blocks or plain text.

## Continuous integration

GitHub Actions runs three jobs on pull requests to main, on pushes to main and to development branches (chore, feat, fix, docs, test and refactor prefixes), and on manual dispatch. Every job has read-only repository permissions, a time limit, and does not keep the job token after checkout. The job names quality, integration and e2e are the status checks to require in branch protection for main:

| Job         | Steps                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| quality     | Install, lint, format check, type check, writing rules, module boundaries, unit tests with coverage, dependency graph |
| integration | Install and run integration tests against a PostgreSQL 17.11 service container                                        |
| e2e         | Install, production build, Playwright with axe on desktop and mobile Chromium                                         |

Reports (JUnit, coverage, dependency graph, and Playwright traces on failure) are uploaded as artifacts.
