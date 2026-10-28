// Module boundary rules. See docs/architecture/overview.md.
// Rules for src/modules apply from Milestone 2, when the first feature module is added.
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies make impact analysis and testing unreliable.",
      from: {},
      to: { circular: true },
    },
    {
      name: "shared-is-a-leaf",
      severity: "error",
      comment: "src/shared must not depend on routes or feature modules.",
      from: { path: "^src/shared/" },
      to: { path: "^src/(app|modules)/" },
    },
    {
      name: "modules-through-public-index",
      severity: "error",
      comment: "A module may import another module only through its index.ts.",
      from: { path: "^src/modules/([^/]+)/" },
      to: {
        path: "^src/modules/[^/]+/.+",
        pathNot: ["^src/modules/$1/", "^src/modules/[^/]+/index\\.ts$"],
      },
    },
    {
      name: "domain-is-pure",
      severity: "error",
      comment: "Domain code holds business rules only: no framework, database or UI imports.",
      from: { path: "^src/modules/[^/]+/domain/" },
      to: { path: "(^|/)node_modules/(next|react|react-dom|@prisma|pg)/" },
    },
    {
      name: "ui-reaches-server-only-through-actions",
      severity: "error",
      comment:
        "Client and UI code may call Server Actions but must never import server data or queries, which can hold sealed text or story graphs.",
      from: { path: "^src/modules/[^/]+/ui/", pathNot: "\\.test\\.tsx?$" },
      to: { path: "^src/modules/[^/]+/server/", pathNot: "-actions\\.ts$" },
    },
    {
      name: "app-code-does-not-import-tests-or-tools",
      severity: "error",
      from: { path: "^src/" },
      to: { path: "^(tests|tools)/" },
    },
    {
      name: "no-dev-dependencies-in-app-code",
      severity: "error",
      comment: "Application code must not depend on packages installed only for development.",
      from: { path: "^src/", pathNot: "\\.test\\.tsx?$" },
      to: { dependencyTypes: ["npm-dev"] },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "^src/generated/" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
  },
};
