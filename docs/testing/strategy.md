# Testing strategy

Tests are written with each feature, named by requirement ID and run in CI on every pull request. A milestone is done only when its required tests pass.

## Layers

| Layer         | Tool                                                            | Location                                 | Scope                                                                             |
| ------------- | --------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Unit          | Vitest (project unit)                                           | next to the code, name.test.ts           | Pure logic: validators, reducers, view builders, tokens, tooling                  |
| Component     | Vitest with Testing Library (added in Milestone 1)              | next to components                       | Interactive components and their states                                           |
| Integration   | Vitest (project integration) against PostgreSQL                 | tests/integration                        | Services, repositories, constraints, transactions, authorization                  |
| Security      | Vitest and Playwright                                           | alongside the relevant layer             | Leaks of author identity, sealed text and undiscovered endings; cross-user access |
| End to end    | Playwright                                                      | tests/e2e                                | Journeys on desktop and mobile Chromium                                           |
| Accessibility | Playwright with axe, plus manual checks                         | tests/e2e and the checklist in DESIGN.md | Every screen and state                                                            |
| Visual        | Playwright screenshots in a pinned container (from Milestone 1) | tests/visual                             | Specimen page and accepted screens at 390 and 1440 px                             |

## Rules

- Deterministic fixtures: factory functions with fixed values and an injected clock; fictional seed content only.
- Isolation: integration tests will use one database per worker cloned from a migrated template once domain tables exist (Milestone 2). Milestone 0 has one read-only connectivity test.
- Playwright users are created through server-side factories, never through test-only HTTP endpoints.
- No fixed sleeps, no hidden retries (CI allows one retry and reports it as flaky), no test depends on another.
- Server latency and failure are simulated with route interception, not timers.
- Never report a test as passing unless it ran.

## Coverage

Coverage is measured with V8 on src and tools and reported in CI. The target for domain modules is 90 percent branch coverage. Coverage is a signal, not a gate, outside domain code.

## Artifacts for impact analysis

CI publishes JUnit results for every layer, the coverage summary and the module dependency graph from dependency-cruiser. With requirement IDs in test titles, these let a future tool relate a code change to modules, requirements and tests.

## Accessibility verification

Automated: axe through Playwright reports no serious or critical violations. Manual: keyboard-only runs of each journey, NVDA with Firefox and VoiceOver with Safari, and one real mobile device check per milestone. Criteria are listed in DESIGN.md and are ticked only after verification in the running application.
