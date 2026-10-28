import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations } from "./support";

test.describe("[DS-DIALOG-001] dialog in the browser", () => {
  test("traps focus, closes on Escape and returns focus to its opener", async ({ page }) => {
    await page.goto("/design");
    const opener = page.getByRole("button", { name: "Delete a letter" });
    await opener.click();

    const dialog = page.getByRole("dialog", { name: "Delete this letter?" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Keep it" })).toBeFocused();
    await expectNoSeriousAxeViolations(page);

    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Delete letter" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Keep it" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(
      page.getByRole("status").filter({ hasText: "Kept. Nothing was deleted." }),
    ).toBeVisible();
  });
});
