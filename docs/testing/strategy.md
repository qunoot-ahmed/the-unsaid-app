# Testing strategy

Tests are written with each feature, named by requirement ID and run in CI on every pull request. A milestone is done only when its required tests pass.

## Layers

| Layer         | Tool                                                                           | Location                                                | Scope                                                                             |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Unit          | Vitest (project unit)                                                          | next to the code, name.test.ts                          | Pure logic: validators, reducers, view builders, tokens, tooling                  |
| Component     | Vitest (project component, jsdom) with Testing Library                         | next to components, name.test.tsx                       | Interactive components and their states, with server actions mocked               |
| Integration   | Vitest (project integration) against PostgreSQL                                | tests/integration                                       | Services, repositories, constraints, transactions, authorization                  |
| Security      | Vitest and Playwright                                                          | alongside the relevant layer                            | Leaks of author identity, sealed text and undiscovered endings; cross-user access |
| End to end    | Playwright                                                                     | tests/e2e                                               | Journeys on desktop and mobile Chromium                                           |
| Accessibility | Playwright with axe, plus manual checks                                        | tests/e2e and the checklist in DESIGN.md                | Every screen and state                                                            |
| Visual        | Playwright screenshots in the image mcr.microsoft.com/playwright:v1.64.1-noble | tests/visual, baselines in tests/visual/**screenshots** | Eight approved screens at 390 and 1440 px                                         |

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

A passing axe scan is not a claim of WCAG 2.2 AA conformance. Axe finds only a subset of problems.

### Milestone 1 record

Verified automatically in Chromium through Playwright:

- Axe with no serious or critical violations: homepage (ink settled and lifted), Wall (all rooms, a letter unfolded, a sealed letter open), reader (start, two choices in, an ending, Parchment theme), composer (writing, sealing, server failure, released) and the specimen page (dialog closed and open).
- Keyboard only, reaching each control with Tab (tests/e2e/keyboard.spec.ts and navigation.spec.ts): skip link, primary navigation, the mobile menu, Lift the ink, the doors and their links, mood rooms, Unfold, Break the seal and reader choices with Enter and Space. Reader number keys, the dialog trap, Escape and focus return. The composer flow is operated with Enter and Space only, but its controls are focused by the test rather than reached with Tab.
- Focus movement: reader scene heading after a choice, composer step headings, dialog focus return.
- Reduced motion: no running animations, and the composer completes with motion reduced.
- No horizontal overflow at 320, 375, 390, 768, 1024 and 1440 px; targets at least 44 px at 375 px.
- Token contrast for every allowed text pair in both themes, including mood accents (unit test).

Pending manual verification (not done yet, so not claimed):

- Screen reader runs with NVDA and Firefox and with VoiceOver and Safari, especially the Lifted Ink description, the live previews and the sealed letter announcements.
- Firefox and Safari rendering and behaviour (only Chromium is automated).
- A real touch device, 200 percent zoom, 400 percent reflow and Windows high contrast mode.
- Contrast of the inked phrase blocks and hover states, which the unit test does not cover.

### Follow-up testing gaps from Milestone 1

- Keyboard readiness before hydration: reader number keys and client controls do nothing until the page has hydrated. Tests wait for the choice list to mark its shortcuts as live (data-shortcuts="on"), so a key pressed in that first moment is lost for real users on a slow connection and no test covers it. Decide on the expected behaviour and test it under network throttling.
- Composer Tab navigation: the composer journey (CONF-PUB-004) is operated with Enter and Space only, but its controls are focused by the test instead of being reached with Tab. Add a test that reaches the letter field, Seal this letter, the mood and visibility radio groups, the content note, the failure checkbox and Release it with Tab and Shift+Tab, and checks the focus order.
