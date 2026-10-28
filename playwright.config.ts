import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const isCI = Boolean(process.env.CI);

// Behaviour and accessibility tests run against a production build on desktop and mobile Chromium:
// run npm run build first (CI does this in the workflow).
// Visual comparisons run only in the pinned Playwright Linux container (npm run test:visual:docker),
// because font rendering differs between operating systems.
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: isCI
    ? [["list"], ["junit", { outputFile: "reports/e2e-junit.xml" }], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.002 },
  },
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  projects: [
    { name: "desktop-chromium", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", testDir: "tests/e2e", use: { ...devices["Pixel 7"] } },
    {
      name: "visual",
      testDir: "tests/visual",
      use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" },
    },
  ],
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
