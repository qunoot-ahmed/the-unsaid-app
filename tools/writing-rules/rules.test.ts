import { describe, expect, it } from "vitest";
import { classifyPath, findViolations } from "./rules.ts";

// Built from code points so this test file contains no forbidden characters itself.
const EM_DASH = String.fromCodePoint(0x2014);
const EN_DASH = String.fromCodePoint(0x2013);
const BACKTICK = String.fromCodePoint(0x60);

describe("[FND-WRITE-001] documentation rule", () => {
  it("accepts plain prose, hyphens and middle dots", () => {
    expect(findViolations("Run npm test. Non-blocking · well-formed.", "documentation")).toEqual(
      [],
    );
  });

  it("reports em dashes, en dashes and backticks with line and column", () => {
    const text = `First line\nA ${EM_DASH} B\nRange 1${EN_DASH}4 and ${BACKTICK}code${BACKTICK}`;

    const violations = findViolations(text, "documentation");

    expect(violations.map((v) => [v.line, v.column, v.name])).toEqual([
      [2, 3, "em dash"],
      [3, 8, "en dash"],
      [3, 15, "backtick"],
      [3, 20, "backtick"],
    ]);
  });

  it("counts columns by character, not by UTF-16 unit", () => {
    const text = `\u{1F4D6}${EM_DASH}`;
    expect(findViolations(text, "documentation")).toEqual([
      { line: 1, column: 2, character: EM_DASH, name: "em dash" },
    ]);
  });
});

describe("[FND-WRITE-002] content rule", () => {
  it("rejects long dashes but allows backticks in content files", () => {
    const violations = findViolations(`Title ${EM_DASH} with ${BACKTICK}`, "content");
    expect(violations.map((v) => v.name)).toEqual(["em dash"]);
  });
});

describe("[FND-WRITE-003] file classification", () => {
  it.each([
    ["README.md", "documentation"],
    ["docs/architecture/overview.md", "documentation"],
    ["docs\\testing\\strategy.md", "documentation"],
    ["src/content/home.json", "content"],
    ["prisma/seed/confessions.json", "content"],
    ["src/app/page.tsx", null],
    ["package.json", null],
  ])("classifies %s as %s", (path, expected) => {
    expect(classifyPath(path)).toBe(expected);
  });
});
