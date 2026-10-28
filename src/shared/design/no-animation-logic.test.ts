import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = fileURLToPath(new URL("../../", import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "generated" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

// DESIGN.md: no business logic may depend on animations, transitions or their events.
describe("[CONF-PUB-006] no state change listens for animation events", () => {
  it("finds no animation or transition event handlers in application code", () => {
    const pattern =
      /onAnimation(End|Start|Iteration)|onTransition(End|Start|Run|Cancel)|animationend|transitionend/;
    const files = sourceFiles(SRC);
    const offenders = files.filter((file) => pattern.test(readFileSync(file, "utf8")));
    expect(files.length).toBeGreaterThan(20);
    expect(offenders).toEqual([]);
  });
});
