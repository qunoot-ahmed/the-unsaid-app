import { expect, test, type Page } from "@playwright/test";

// A small set of approved representative screens. Run only inside the pinned Playwright Linux
// container (npm run test:visual:docker locally, the visual job in CI) so fonts render identically.

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

// Parks the pointer outside the content so a hover left by the last click never reaches the image.
async function settle(page: Page) {
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.fonts.ready);
}

test.describe("[VIS-001] approved screens", () => {
  test("homepage, desktop", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await settle(page);
    await expect(page).toHaveScreenshot("home-desktop.png", { fullPage: true });
  });

  test("homepage with the ink lifted, mobile", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    await page.getByRole("button", { name: "Lift the ink" }).click();
    await settle(page);
    await expect(page).toHaveScreenshot("home-lifted-mobile.png", { fullPage: true });
  });

  test("Whisper Wall, desktop", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/wall");
    await settle(page);
    await expect(page).toHaveScreenshot("wall-desktop.png", { fullPage: true });
  });

  test("Regret room with the seal broken, mobile", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/wall?mood=regret");
    await page.getByRole("button", { name: "Break the seal" }).click();
    await expect(page.getByRole("button", { name: "Fold it away again" })).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot("wall-sealed-open-mobile.png", { fullPage: true });
  });

  test("reader after one choice, desktop", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/stories/the-letter-at-number-nine/read");
    await page.getByRole("button", { name: "Burn it in the grate" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Ash" })).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot("reader-desktop.png", { fullPage: true });
  });

  test("reader, mobile", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/stories/the-letter-at-number-nine/read");
    await settle(page);
    await expect(page).toHaveScreenshot("reader-mobile.png", { fullPage: true });
  });

  test("composer seal step, desktop", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/write");
    await page
      .getByRole("textbox", { name: "Your letter" })
      .fill("I never told her I was the one who called.");
    await page.getByRole("button", { name: "Seal this letter" }).click();
    await page.getByText("Regret", { exact: true }).click();
    await settle(page);
    await expect(page).toHaveScreenshot("composer-seal-desktop.png", { fullPage: true });
  });

  test("design system specimen, desktop", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/design");
    await settle(page);
    await expect(page).toHaveScreenshot("design-desktop.png", { fullPage: true });
  });
});
