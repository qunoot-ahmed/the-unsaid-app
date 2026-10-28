import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MOOD_IDS, MOODS, parseMoodParam } from "./moods";

describe("[WALL-MOOD-001] mood rooms", () => {
  it("opens the named room for a known mood", () => {
    expect(parseMoodParam("fear")).toBe("fear");
    expect(parseMoodParam(["hope", "fear"])).toBe("hope");
  });

  it("opens all rooms for unknown, missing or malformed values", () => {
    expect(parseMoodParam(undefined)).toBeNull();
    expect(parseMoodParam("FEAR")).toBeNull();
    expect(parseMoodParam("joy")).toBeNull();
    expect(parseMoodParam([])).toBeNull();
  });

  it("defines a label, a room line and a colour token for every mood", () => {
    const tokens = readFileSync(
      new URL("../../../shared/design/tokens.css", import.meta.url),
      "utf8",
    );
    for (const id of MOOD_IDS) {
      expect(MOODS[id].label.length).toBeGreaterThan(0);
      expect(MOODS[id].roomLine).toMatch(/\.$/);
      expect(tokens).toContain(`--color-mood-${id}:`);
      expect(tokens).toContain(`[data-mood="${id}"]`);
    }
  });
});
