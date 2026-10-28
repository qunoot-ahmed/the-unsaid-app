import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations } from "./support";

const SENTENCE =
  "I never told my brother that I was the one who sold our father's watch. He still blames the movers.";

test.describe("[HOME-INK-001] The Lifted Ink", () => {
  test("reveals and settles the ink with the keyboard", async ({ page }) => {
    await page.goto("/");
    const lift = page.getByRole("button", { name: "Lift the ink" });

    await lift.focus();
    await page.keyboard.press("Enter");

    const settle = page.getByRole("button", { name: "Let the ink settle" });
    await expect(settle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-inked='false']")).toHaveCount(3);

    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Lift the ink" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await expect(page.locator("[data-inked='true']")).toHaveCount(3);
  });

  test("keeps the whole sentence available to assistive technology while inked", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText(SENTENCE)).toBeAttached();
  });

  test("hides inked phrases visually until lifted", async ({ page }) => {
    await page.goto("/");
    const phrase = page.locator("[data-inked]").first();
    const transparent = await phrase.evaluate((node) => getComputedStyle(node).color);
    expect(transparent).toBe("rgba(0, 0, 0, 0)");

    await page.getByRole("button", { name: "Lift the ink" }).click();
    await expect
      .poll(() => phrase.evaluate((node) => getComputedStyle(node).color))
      .not.toBe(transparent);
  });

  test("passes the accessibility audit while lifted", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Lift the ink" }).click();
    await expectNoSeriousAxeViolations(page);
  });
});

test.describe("[HOME-DOORS-001] the two doors", () => {
  test("previews each room and navigates through the preview link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Step into a story that answers to you/ }).click();
    await expect(page.getByRole("link", { name: "Open the story" })).toBeVisible();

    await page.getByRole("button", { name: /Listen to what others never said/ }).click();
    await page.getByRole("link", { name: "Enter the Wall" }).click();
    await expect(page).toHaveURL(/\/wall$/);
  });
});
