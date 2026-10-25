import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("[FND-UI-001] foundation page", () => {
  test("renders the wordmark and tagline in English", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "The Unsaid" })).toBeVisible();
    await expect(page.getByText("Some stories are written. Others are confessed.")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("[FND-A11Y-001] automated accessibility audit", () => {
  test("has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(blocking.map((violation) => violation.id)).toEqual([]);
  });
});

test.describe("[FND-MOTION-001] reduced motion", () => {
  test("runs no animations when the user prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const runningAnimations = await page.evaluate(() => document.getAnimations().length);

    expect(runningAnimations).toBe(0);
  });
});
