import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, readCustomProperties } from "./contrast";

const tokensCss = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
const [inkBlock = "", parchmentBlock = ""] = [
  tokensCss.slice(tokensCss.indexOf("@theme"), tokensCss.indexOf(":root")),
  tokensCss.slice(tokensCss.indexOf('[data-theme="parchment"]')),
];
const ink = readCustomProperties(inkBlock);
const parchment = readCustomProperties(parchmentBlock);

function token(map: Map<string, string>, name: string): string {
  const value = map.get(name);
  if (!value) throw new Error(`Missing token ${name}`);
  return value;
}

// Every text and background pair the interface is allowed to use. Minimum 4.5:1 (WCAG 2.2 AA).
const inkTextTokens = [
  "--color-text",
  "--color-text-secondary",
  "--color-text-body",
  "--color-accent",
  "--color-link",
  "--color-danger",
  "--color-success",
  "--color-mood-longing",
  "--color-mood-regret",
  "--color-mood-relief",
  "--color-mood-fear",
  "--color-mood-tenderness",
  "--color-mood-anger",
  "--color-mood-shame",
  "--color-mood-hope",
];
const inkBackgrounds = ["--color-ground", "--color-surface", "--color-sheet"];
const parchmentTextTokens = [
  "--color-text",
  "--color-text-secondary",
  "--color-text-body",
  "--color-accent",
  "--color-link",
  "--color-danger",
  "--color-success",
];
const parchmentBackgrounds = ["--color-ground", "--color-surface"];

describe("[FND-TOKENS-001] token contrast", () => {
  it("computes known WCAG ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777", "#777")).toBeCloseTo(1, 5);
  });

  for (const background of inkBackgrounds) {
    for (const text of inkTextTokens) {
      it(`Ink theme: ${text} on ${background} is at least 4.5:1`, () => {
        expect(contrastRatio(token(ink, text), token(ink, background))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  for (const background of parchmentBackgrounds) {
    for (const text of parchmentTextTokens) {
      it(`Parchment theme: ${text} on ${background} is at least 4.5:1`, () => {
        expect(
          contrastRatio(token(parchment, text), token(parchment, background)),
        ).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it("keeps fill-only colours below text contrast on Ink, so they are never used for text", () => {
    expect(
      contrastRatio(token(ink, "--color-burgundy"), token(ink, "--color-ground")),
    ).toBeLessThan(4.5);
    expect(contrastRatio(token(ink, "--color-plum"), token(ink, "--color-ground"))).toBeLessThan(
      4.5,
    );
  });
});
