import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations } from "./support";

// Canary from the sealed demonstration letter. It must never be in the page until revealed.
const SEALED_CANARY = "She left a voicemail about a recipe.";

test.describe("[WALL-MOOD-001] mood rooms", () => {
  test("switches rooms through shareable links and changes the room line", async ({ page }) => {
    await page.goto("/wall");
    await expect(
      page.getByRole("heading", { level: 1, name: "Things people never said aloud." }),
    ).toBeVisible();

    await page
      .getByRole("navigation", { name: "Mood rooms" })
      .getByRole("link", { name: "Fear" })
      .click();
    await expect(page).toHaveURL(/\/wall\?mood=fear$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Said quietly, with the lights off." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Fear" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("article")).toHaveCount(1);

    await page.goBack();
    await expect(
      page.getByRole("heading", { level: 1, name: "Things people never said aloud." }),
    ).toBeVisible();
  });

  test("falls back to all rooms for an unknown mood", async ({ page }) => {
    await page.goto("/wall?mood=joy");
    await expect(
      page.getByRole("heading", { level: 1, name: "Things people never said aloud." }),
    ).toBeVisible();
  });
});

test.describe("[CONF-FOLD-001] folded letters", () => {
  test("unfolds and folds a long letter", async ({ page }) => {
    await page.goto("/wall?mood=shame");
    const unfold = page.getByRole("button", { name: /Unfold the rest/ });
    await expect(page.getByText("you never quite put it down")).toHaveCount(0);

    await unfold.click();
    await expect(page.getByText(/you never quite put it down/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Fold it back" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expectNoSeriousAxeViolations(page);

    await page.getByRole("button", { name: "Fold it back" }).click();
    await expect(page.getByText(/you never quite put it down/)).toHaveCount(0);
  });
});

test.describe("[CONF-SEAL-002] sealed letters", () => {
  test("does not send sealed text in the page before the seal is broken", async ({
    page,
    request,
  }) => {
    const html = await (await request.get("/wall")).text();
    expect(html).not.toContain(SEALED_CANARY);

    await page.goto("/wall?mood=regret");
    await expect(page.getByText("Sealed by the writer · Grief and loss")).toBeVisible();
    expect(await page.content()).not.toContain(SEALED_CANARY);
  });

  test("[CONF-SEAL-003] reveals sealed text by keyboard after an explicit request", async ({
    page,
  }) => {
    await page.goto("/wall?mood=regret");
    const breakSeal = page.getByRole("button", { name: "Break the seal" });
    await breakSeal.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByText(SEALED_CANARY, { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: "Fold it away again" })).toBeVisible();
    await expectNoSeriousAxeViolations(page);

    await page.getByRole("button", { name: "Fold it away again" }).click();
    await expect(page.getByText(SEALED_CANARY, { exact: false })).toHaveCount(0);
  });
});

test.describe("[WALL-REACT-001] demonstration reactions", () => {
  test("toggle with a pressed state and an updated count", async ({ page }) => {
    await page.goto("/wall?mood=anger");
    const reaction = page.getByRole("button", { name: "I felt this 212" });
    await reaction.click();
    await expect(page.getByRole("button", { name: "I felt this 213" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
