import { expect, test } from "@playwright/test";

test.describe("[DS-NAV-001] primary navigation", () => {
  test("uses inline links on large screens and a menu button on small screens", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });

    if (isMobile) {
      const menu = nav.getByRole("button", { name: "Menu" });
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await nav.getByRole("link", { name: "Write" }).last().click();
      await expect(page).toHaveURL(/\/write$/);
      await expect(
        page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Menu" }),
      ).toHaveAttribute("aria-expanded", "false");
    } else {
      await expect(nav.getByRole("button", { name: "Menu" })).toBeHidden();
      await nav.getByRole("link", { name: "The Wall" }).first().click();
      await expect(page).toHaveURL(/\/wall$/);
      await expect(nav.getByRole("link", { name: "The Wall" }).first()).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
  });

  test("can be operated with the keyboard alone", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard navigation is checked on the desktop layout.");
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // wordmark
    await page.keyboard.press("Tab"); // The Wall
    await expect(page.getByRole("link", { name: "The Wall" }).first()).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/wall$/);
  });
});
