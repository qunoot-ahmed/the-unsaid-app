import { expect, test } from "@playwright/test";
import { expectNoSeriousAxeViolations } from "./support";

const READER = "/stories/the-letter-at-number-nine/read";
const UNDISCOVERED = ["The Appointment", "The Quiet Tenant", "What the Smoke Said"];

test.describe("[READ-THREAD-001] reader choices and the thread", () => {
  test("grows the thread with each choice and moves focus to the new scene", async ({ page }) => {
    await page.goto(READER);
    const thread = page.getByRole("list", { name: "Your thread" });
    await expect(thread.getByRole("listitem")).toHaveCount(3);

    await page.getByRole("button", { name: "Burn it in the grate" }).click();

    const heading = page.getByRole("heading", { level: 1, name: "Ash" });
    await expect(heading).toBeFocused();
    await expect(
      page.getByText("You chose to burn it in the grate.", { exact: true }),
    ).toBeVisible();
    await expect(thread.getByRole("listitem")).toHaveCount(4);
    await expect(thread).toContainText("You are here: Ash");
  });

  test("chooses with number keys and reaches an ending that is kept after starting again", async ({
    page,
  }) => {
    await page.goto(READER);
    // Number keys work only after hydration; the choice list marks when they are live.
    await expect(page.locator("[data-shortcuts='on']")).toHaveCount(1);
    await page.keyboard.press("3");
    await expect(page.getByRole("heading", { level: 1, name: "The Man Downstairs" })).toBeFocused();
    await page.keyboard.press("1");
    await expect(page.getByRole("heading", { level: 1, name: "Number Nine" })).toBeVisible();
    await expect(page.getByText("1 of 4")).toBeVisible();
    await expectNoSeriousAxeViolations(page);

    await page.getByRole("button", { name: "Follow another thread" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "The Envelope" })).toBeFocused();
    await expect(page.getByText("1 of 4")).toBeVisible();
    await expect(page.getByRole("list", { name: "Your thread" })).toContainText(
      "You are here: The Envelope",
    );
  });

  test("[READ-MAP-001] never sends titles of undiscovered endings to the page", async ({
    page,
    request,
  }) => {
    const html = await (await request.get(READER)).text();
    for (const title of UNDISCOVERED) expect(html).not.toContain(title);

    await page.goto(READER);
    await page.getByRole("button", { name: "Open the letter" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "What the Letter Said" }),
    ).toBeVisible();
    const content = await page.content();
    for (const title of UNDISCOVERED) expect(content).not.toContain(title);
    await expect(page.getByText("Undiscovered")).toHaveCount(4);
  });

  test("switches to the Parchment reading theme", async ({ page }) => {
    await page.goto(READER);
    const theme = page.getByRole("button", { name: "Parchment theme" });
    await theme.click();
    await expect(theme).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-theme='parchment']")).toHaveCount(1);
    await expectNoSeriousAxeViolations(page);
  });
});
