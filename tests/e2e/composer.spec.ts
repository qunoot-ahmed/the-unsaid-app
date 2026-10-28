import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations } from "./support";

const LETTER =
  "I never told her I was the one who called. Everyone thinks the neighbour saw the smoke first.";

test.describe("[CONF-PUB-001] The Letter composer, preview mode", () => {
  test("writes, seals and releases with confirmation from the server", async ({ page }) => {
    await page.goto("/write");
    await expect(page.getByText(/never stored or published/)).toBeVisible();

    await page.getByRole("textbox", { name: "Your letter" }).fill(LETTER);
    await page.getByRole("button", { name: "Seal this letter" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Seal the letter" })).toBeFocused();

    await page.getByText("Hope", { exact: true }).click();
    await expect(page.getByText("Shown as: Anonymous · today")).toBeVisible();
    await expectNoSeriousAxeViolations(page);

    await page.getByRole("button", { name: "Release it" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Released." })).toBeFocused();
    await expect(page.getByText(/nothing was published or saved/)).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });

  test("[CONF-PUB-002] keeps the letter when the server fails and recovers on retry", async ({
    page,
  }) => {
    await page.goto("/write");
    await page.getByRole("textbox", { name: "Your letter" }).fill(LETTER);
    await page.getByRole("button", { name: "Seal this letter" }).click();
    await page.getByText("Regret", { exact: true }).click();
    const simulate = page.getByRole("checkbox", { name: /simulate a server failure/ });
    await simulate.check();

    await page.getByRole("button", { name: "Release it" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "We could not release your letter." });
    await expect(alert).toContainText(
      "Your letter is still here, exactly as you left it. Nothing was published.",
    );
    await expect(page.getByText(LETTER)).toBeVisible();
    await expectNoSeriousAxeViolations(page);

    await simulate.uncheck();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Released." })).toBeVisible();
  });

  test("[CONF-PUB-004] completes the release with reduced motion and the keyboard alone", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Keyboard-only flow is checked on the desktop layout.");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/write");
    await page.getByRole("textbox", { name: "Your letter" }).focus();
    await page.keyboard.type(LETTER);
    await page.keyboard.press("Tab"); // move past the field
    await page.getByRole("button", { name: "Seal this letter" }).focus();
    await page.keyboard.press("Enter");

    await page.getByRole("radio", { name: "Longing" }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("radio", { name: "Longing" })).toBeChecked();
    await page.getByRole("button", { name: "Release it" }).focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { level: 1, name: "Released." })).toBeFocused();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
});
