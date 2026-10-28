import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations } from "./support";

test.describe("[FND-UI-001] application shell", () => {
  test("renders the homepage in English with the wordmark, tagline and skip link", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "The Unsaid" }).first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Some stories are written. Others are confessed.",
      }),
    ).toBeVisible();

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("shows the not-found page for unknown addresses", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "This page was never written." }),
    ).toBeVisible();
  });
});

test.describe("[FND-A11Y-001] automated accessibility audit", () => {
  for (const path of [
    "/",
    "/wall",
    "/write",
    "/stories/the-letter-at-number-nine/read",
    "/design",
  ]) {
    test(`has no serious or critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expectNoSeriousAxeViolations(page);
    });
  }
});

test.describe("[FND-MOTION-001] reduced motion", () => {
  test("runs no animations when the user prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/wall", "/stories/the-letter-at-number-nine/read"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    }
  });
});
