import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Waits until running finite animations finish, so measurements read the page users rest on.
 * During an entrance animation, computed colours are blended by opacity and boxes are read
 * through a transform, so contrast and size checks would measure a frame in transit.
 * Infinite and paused animations never finish, so they are not waited for.
 */
export async function waitForAnimationsToFinish(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            Number.isFinite(animation.effect?.getComputedTiming().endTime),
        )
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

/** Runs axe against WCAG 2.2 AA rules and fails on serious or critical violations. */
export async function expectNoSeriousAxeViolations(page: Page) {
  await waitForAnimationsToFinish(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map(
      (violation) =>
        `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
    );
  expect(blocking).toEqual([]);
}

/** Width of content that overflows the viewport horizontally, in CSS pixels. */
export async function horizontalOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/** Presses Tab until the target has focus, the way a keyboard user reaches it. Fails if it is never reached. */
export async function tabTo(page: Page, target: Locator, limit = 40) {
  for (let presses = 0; presses < limit; presses++) {
    if (await target.evaluate((node) => node === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(target).toBeFocused();
}
