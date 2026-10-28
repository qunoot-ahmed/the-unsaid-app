// Usage: npm run test:visual:docker [-- --update-snapshots]
// Runs the visual regression project inside the pinned Playwright Linux image, so local baselines
// match the CI visual job. Linux node_modules and .next live in Docker volumes and never touch the
// host checkout. Requires Docker.
import { spawnSync } from "node:child_process";

const IMAGE = "mcr.microsoft.com/playwright:v1.64.1-noble";
const extraArgs = process.argv.slice(2).join(" ");

const script = [
  "npm ci --no-audit --no-fund",
  "npm run build",
  `npx playwright test --project=visual ${extraArgs}`.trim(),
].join(" && ");

const result = spawnSync(
  "docker",
  [
    "run",
    "--rm",
    "--ipc=host",
    "-e",
    "CI=1",
    "-v",
    `${process.cwd()}:/work`,
    "-v",
    "the-unsaid-visual-node-modules:/work/node_modules",
    "-v",
    "the-unsaid-visual-next:/work/.next",
    "-w",
    "/work",
    IMAGE,
    "bash",
    "-lc",
    script,
  ],
  { stdio: "inherit" },
);

process.exitCode = result.status ?? 1;
