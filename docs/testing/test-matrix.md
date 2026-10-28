# Test matrix

Maps each requirement ID to the tests that verify it. Test titles start with the ID in square brackets so results and coverage can be traced back to requirements.

| ID              | Layer                       | Test                                                                                                                      | Status          |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| FND-DB-001      | Integration                 | tests/integration/database.test.ts                                                                                        | Passing locally |
| FND-DB-002      | Unit                        | src/shared/lib/db-health.test.ts                                                                                          | Passing locally |
| FND-TOKENS-001  | Unit                        | src/shared/design/contrast.test.ts                                                                                        | Passing locally |
| FND-WRITE-001   | Unit                        | tools/writing-rules/rules.test.ts                                                                                         | Passing locally |
| FND-WRITE-002   | Unit                        | tools/writing-rules/rules.test.ts                                                                                         | Passing locally |
| FND-WRITE-003   | Unit                        | tools/writing-rules/rules.test.ts                                                                                         | Passing locally |
| FND-UI-001      | End to end                  | tests/e2e/foundation.spec.ts                                                                                              | Passing locally |
| FND-A11Y-001    | End to end                  | tests/e2e/foundation.spec.ts, plus axe checks in every Milestone 1 specification                                          | Passing locally |
| FND-MOTION-001  | End to end                  | tests/e2e/foundation.spec.ts                                                                                              | Passing locally |
| DS-NAV-001      | Component, end to end       | src/shared/ui/site-nav.test.tsx, tests/e2e/navigation.spec.ts                                                             | Passing locally |
| DS-BUTTON-001   | Component                   | src/shared/ui/button.test.tsx                                                                                             | Passing locally |
| DS-FIELD-001    | Component                   | src/shared/ui/button.test.tsx                                                                                             | Passing locally |
| DS-DIALOG-001   | Component, end to end       | src/shared/ui/dialog.test.tsx, tests/e2e/design-system.spec.ts                                                            | Passing locally |
| HOME-INK-001    | Component, end to end       | src/modules/home/ui/lifted-ink.test.tsx, tests/e2e/home.spec.ts                                                           | Passing locally |
| HOME-DOORS-001  | Component, end to end       | src/modules/home/ui/lifted-ink.test.tsx, tests/e2e/home.spec.ts                                                           | Passing locally |
| WALL-MOOD-001   | Unit, end to end            | src/modules/confessions/domain/moods.test.ts, tests/e2e/wall.spec.ts                                                      | Passing locally |
| WALL-REACT-001  | End to end                  | tests/e2e/wall.spec.ts                                                                                                    | Passing locally |
| CONF-FOLD-001   | Unit, component, end to end | src/modules/confessions/domain/letters.test.ts, src/modules/confessions/ui/letters.test.tsx, tests/e2e/wall.spec.ts       | Passing locally |
| CONF-SEAL-001   | Unit                        | src/modules/confessions/domain/composer.test.ts                                                                           | Passing locally |
| CONF-SEAL-002   | Unit, end to end            | src/modules/confessions/server/wall-query.test.ts, tests/e2e/wall.spec.ts                                                 | Passing locally |
| CONF-SEAL-003   | Unit, component, end to end | src/modules/confessions/server/wall-query.test.ts, src/modules/confessions/ui/letters.test.tsx, tests/e2e/wall.spec.ts    | Passing locally |
| CONF-PUB-001    | Unit, component, end to end | src/modules/confessions/domain/composer.test.ts, src/modules/confessions/ui/composer.test.tsx, tests/e2e/composer.spec.ts | Passing locally |
| CONF-PUB-002    | Unit, component, end to end | src/modules/confessions/domain/composer.test.ts, src/modules/confessions/ui/composer.test.tsx, tests/e2e/composer.spec.ts | Passing locally |
| CONF-PUB-003    | Unit                        | src/modules/confessions/server/wall-query.test.ts                                                                         | Passing locally |
| CONF-PUB-004    | End to end                  | tests/e2e/composer.spec.ts                                                                                                | Passing locally |
| CONF-PUB-006    | Unit                        | src/shared/design/no-animation-logic.test.ts                                                                              | Passing locally |
| CONF-008        | Unit                        | src/modules/confessions/domain/catalogue.test.ts (derivation only; acceptance in Milestone 3)                             | Passing locally |
| READ-THREAD-001 | Unit, component, end to end | src/modules/reading/domain/reader-view.test.ts, src/modules/reading/ui/reader-ui.test.tsx, tests/e2e/reader.spec.ts       | Passing locally |
| READ-THREAD-002 | Unit                        | src/modules/reading/server/reader-actions.test.ts                                                                         | Passing locally |
| READ-MAP-001    | Unit, end to end            | src/modules/reading/domain/reader-view.test.ts, tests/e2e/reader.spec.ts                                                  | Passing locally |
| A11Y-KEY-001    | End to end                  | tests/e2e/keyboard.spec.ts                                                                                                | Passing locally |
| RESP-001        | End to end                  | tests/e2e/responsive.spec.ts (desktop project only)                                                                       | Passing locally |
| RESP-002        | End to end                  | tests/e2e/responsive.spec.ts (desktop project only)                                                                       | Passing locally |
| VIS-001         | Visual                      | tests/visual/screens.spec.ts (pinned container only)                                                                      | Passing locally |

"Passing locally" means the test ran and passed on the development machine. It becomes "Passing in CI" after the first green workflow run on GitHub.

Requirements for later milestones (docs/product/requirements.md) are added to this table when their tests are written.

Responsive specifications run only in the desktop project because they set their own viewport sizes; the mobile project skips them on purpose. Visual tests run only inside the pinned container (npm run test:visual:docker locally, the visual job in CI).
