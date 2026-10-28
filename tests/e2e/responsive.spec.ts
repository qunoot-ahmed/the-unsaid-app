import { expect, test } from "@playwright/test";
import { horizontalOverflow } from "./support";

const WIDTHS = [320, 375, 390, 768, 1024, 1440];
const PAGES = ["/", "/wall", "/write", "/stories/the-letter-at-number-nine/read", "/design"];

test.describe("[RESP-001] responsive layout", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "Viewport widths are set explicitly; run once on desktop Chromium.",
  );

  for (const width of WIDTHS) {
    test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PAGES) {
        await page.goto(path);
        expect(await horizontalOverflow(page), `${path} at ${width} px`).toBe(0);
      }
    });
  }

  test("keeps overflow at zero with signature interactions opened at 320 px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Lift the ink" }).click();
    await page.getByRole("button", { name: /Listen to what others never said/ }).click();
    expect(await horizontalOverflow(page)).toBe(0);

    await page.goto("/wall?mood=regret");
    await page.getByRole("button", { name: "Break the seal" }).click();
    await expect(page.getByRole("button", { name: "Fold it away again" })).toBeVisible();
    expect(await horizontalOverflow(page)).toBe(0);
  });
});

test.describe("[RESP-002] touch targets", () => {
  test("every button and primary control is at least 44 by 44 px on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const path of ["/", "/wall", "/write", "/stories/the-letter-at-number-nine/read"]) {
      await page.goto(path);
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("button, nav a, [role='button']")]
          .filter((element) => element.offsetParent !== null)
          .map((element) => ({
            text: element.textContent?.trim() ?? "",
            box: element.getBoundingClientRect(),
          }))
          .filter(({ box }) => box.height < 44 || box.width < 44)
          .map(
            ({ text, box }) => `${text} (${Math.round(box.width)} by ${Math.round(box.height)})`,
          ),
      );
      expect(small, path).toEqual([]);
    }
  });
});
