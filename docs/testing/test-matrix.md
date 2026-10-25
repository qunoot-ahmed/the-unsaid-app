# Test matrix

Maps each requirement ID to the tests that verify it. Test titles start with the ID in square brackets so results and coverage can be traced back to requirements.

| ID             | Layer       | Test                               | Status          |
| -------------- | ----------- | ---------------------------------- | --------------- |
| FND-DB-001     | Integration | tests/integration/database.test.ts | Passing locally |
| FND-DB-002     | Unit        | src/shared/lib/db-health.test.ts   | Passing locally |
| FND-TOKENS-001 | Unit        | src/shared/design/contrast.test.ts | Passing locally |
| FND-WRITE-001  | Unit        | tools/writing-rules/rules.test.ts  | Passing locally |
| FND-WRITE-002  | Unit        | tools/writing-rules/rules.test.ts  | Passing locally |
| FND-WRITE-003  | Unit        | tools/writing-rules/rules.test.ts  | Passing locally |
| FND-UI-001     | End to end  | tests/e2e/foundation.spec.ts       | Passing locally |
| FND-A11Y-001   | End to end  | tests/e2e/foundation.spec.ts       | Passing locally |
| FND-MOTION-001 | End to end  | tests/e2e/foundation.spec.ts       | Passing locally |

"Passing locally" means the test ran and passed on the development machine. It becomes "Passing in CI" after the first green workflow run on GitHub.

Requirements for later milestones (docs/product/requirements.md) are added to this table when their tests are written.
