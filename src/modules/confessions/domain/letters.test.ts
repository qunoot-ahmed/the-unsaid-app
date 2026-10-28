import { describe, expect, it } from "vitest";
import { FOLD_THRESHOLD, foldBody, readingMinutes, shouldFold } from "./letters";

const sentence = "This is one sentence of a long letter. ";

describe("[CONF-FOLD-001] folded letters", () => {
  it("folds only bodies longer than the threshold", () => {
    expect(shouldFold("a".repeat(FOLD_THRESHOLD))).toBe(false);
    expect(shouldFold("a".repeat(FOLD_THRESHOLD + 1))).toBe(true);
  });

  it("leaves short bodies whole", () => {
    expect(foldBody("A short letter.")).toEqual({ visible: "A short letter.", remainder: "" });
  });

  it("splits a long body at the end of a sentence and loses no text", () => {
    const body = sentence.repeat(20).trim();
    const { visible, remainder } = foldBody(body);

    expect(visible.endsWith(".")).toBe(true);
    expect(visible.length).toBeLessThanOrEqual(280);
    expect(`${visible} ${remainder}`).toBe(body);
  });

  it("falls back to a word boundary when there is no sentence end", () => {
    const body = "word ".repeat(200).trim();
    const { visible, remainder } = foldBody(body);

    expect(visible.endsWith("word")).toBe(true);
    expect(`${visible} ${remainder}`).toBe(body);
  });

  it("estimates at least one minute of reading", () => {
    expect(readingMinutes("Few words.")).toBe(1);
    expect(readingMinutes("word ".repeat(600))).toBe(3);
  });
});
