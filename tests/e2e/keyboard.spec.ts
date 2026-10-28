import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations, tabTo } from "./support";

// Every signature flow reached with Tab and operated with Enter or Space, with no pointer and no
// programmatic focus.

test.describe("[A11Y-KEY-001] keyboard-only signature flows", () => {
  test("homepage: lift the ink, open a door and follow its link", async ({ page }) => {
    await page.goto("/");
    await tabTo(page, page.getByRole("button", { name: "Lift the ink" }));
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Let the ink settle" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const door = page.getByRole("button", { name: /Step into a story that answers to you/ });
    await tabTo(page, door);
    await page.keyboard.press("Space");
    await expect(door).toHaveAttribute("aria-pressed", "true");

    await tabTo(page, page.getByRole("link", { name: "Open the story" }));
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/stories\/the-letter-at-number-nine\/read$/);
  });

  test("Wall: change room, then break the seal", async ({ page }) => {
    await page.goto("/wall");
    await tabTo(
      page,
      page.getByRole("navigation", { name: "Mood rooms" }).getByRole("link", { name: "Regret" }),
    );
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/wall\?mood=regret$/);

    await tabTo(page, page.getByRole("button", { name: "Break the seal" }));
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Fold it away again" })).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });

  test("Wall: unfold a long letter and fold it back", async ({ page }) => {
    await page.goto("/wall?mood=shame");
    await tabTo(page, page.getByRole("button", { name: /Unfold the rest/ }));
    await page.keyboard.press("Enter");
    const foldBack = page.getByRole("button", { name: "Fold it back" });
    await expect(foldBack).toHaveAttribute("aria-expanded", "true");
    await expect(foldBack).toBeFocused();

    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /Unfold the rest/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("reader: choose with Enter and Space and keep focus on the new scene", async ({ page }) => {
    await page.goto("/stories/the-letter-at-number-nine/read");
    await tabTo(page, page.getByRole("button", { name: "Burn it in the grate" }));
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1, name: "Ash" })).toBeFocused();

    await tabTo(page, page.getByRole("button", { name: "Sweep the ash into a jar" }));
    await page.keyboard.press("Space");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect(page.getByRole("heading", { level: 1, name: "Ash" })).toHaveCount(0);
    await expectNoSeriousAxeViolations(page);
  });

  test("mobile menu opens and navigates from the keyboard", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The menu button exists only on the small-screen layout.");
    await page.goto("/");
    const menu = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("button", { name: "Menu" });
    await tabTo(page, menu);
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("aria-expanded", "true");

    await tabTo(
      page,
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Write" }).last(),
    );
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/write$/);
  });
});
