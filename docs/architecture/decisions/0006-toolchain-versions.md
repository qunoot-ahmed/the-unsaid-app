# 0006: Toolchain versions

Status: Accepted (Milestone 0). Versions were checked against the npm registry on 25 October 2026.

## Decisions

| Tool           | Version        | Reason                                                                                                                                                                                                                                   |
| -------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js        | 24 LTS         | Required by Prisma 7, Vitest 5, axe for Playwright and dependency-cruiser 18. The engines field and .npmrc engine-strict enforce it.                                                                                                     |
| Next.js, React | 16.4.3, 19.3.1 | Current stable releases                                                                                                                                                                                                                  |
| TypeScript     | 6.0.3          | TypeScript 7 is the npm latest tag, but typescript-eslint 8.72 supports TypeScript below 6.1 only                                                                                                                                        |
| ESLint         | 9.39.5         | ESLint 10 is current, but eslint-plugin-react, eslint-plugin-jsx-a11y and eslint-plugin-import, which eslint-config-next depends on, declare support for ESLint 9 at most. ESLint 9 is marked as no longer supported by its maintainers. |
| Prisma         | 7.10.1         | The npm latest tag points at an 8.0 release candidate; 7.10.1 is the newest stable release                                                                                                                                               |
| Vite           | 8.3.5          | Required peer of Vitest 5                                                                                                                                                                                                                |
| PostgreSQL     | 17.11          | Pinned image tag so local and CI databases match                                                                                                                                                                                         |

## Install scripts

npm 11 blocks dependency install scripts unless allowed. Three are allowed in package.json under allowScripts: prisma and @prisma/engines (they install the Prisma engines) and unrs-resolver (the native resolver used by the ESLint import plugin).

## Consequences

- Revisit ESLint 10 when the React, accessibility and import plugins support it. Until then, ESLint 9 receives no fixes; the risk is limited because it runs only in development and CI.
- Revisit TypeScript 7 when typescript-eslint supports it.
- Revisit Prisma 8 after its stable release.
