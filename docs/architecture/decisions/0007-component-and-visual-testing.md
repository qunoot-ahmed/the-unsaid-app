# 0007: Component and visual testing

Status: Accepted (Milestone 1)

## Context

Milestone 1 adds interactive components whose behaviour (focus movement, focus traps, pressed and expanded states, pending states, server failure handling) must be tested quickly and in isolation. It also adds approved screens whose appearance must not drift. Playwright already covers journeys, but running every component state through a browser is slow and makes failures harder to locate.

## Decisions

1. Component tests use Vitest in a separate project named component with the jsdom environment and Testing Library. New development dependencies: @testing-library/react 16.3.3 (rendering and role queries), @testing-library/dom 10.4.2 (its required peer), @testing-library/user-event 14.6.8 (realistic keyboard and pointer input) and jsdom 30.1.3 (the DOM environment). Unit tests stay in the node environment. Server Actions are mocked in component tests; their real behaviour is covered by unit tests and Playwright.
2. Visual regression tests use Playwright screenshots of eight approved screens, run only in the image mcr.microsoft.com/playwright:v1.64.1-noble, both locally (npm run test:visual:docker) and in CI (the visual job). Screenshots disable animations, hide the caret, wait for fonts and park the pointer. The tolerance is a pixel ratio of 0.002.
3. Milestone 1 feature behaviour runs on fictional data served by module server files and Server Actions, so the client contracts (no sealed bodies in the feed, no undiscovered endings) are enforced and tested before the database exists.

## Consequences

- Component tests run in a few seconds and point directly at the failing component. jsdom does not lay out or paint, so layout, overflow, contrast and real focus visibility are checked only in Playwright.
- Baselines are reproducible across machines because rendering happens in one pinned image. Upgrading Playwright means updating the image tag, regenerating every baseline and reviewing each image.
- Visual tests need Docker locally. Developers without Docker rely on the CI job.
- No animation library is added. Motion stays in CSS, and a unit test forbids logic that listens for animation or transition events.
