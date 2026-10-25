// Project writing rules (see docs/development/workflow.md):
//   documentation: no backticks, no em dashes, no en dashes, no other long dashes
//   project-authored content files: no em dashes, en dashes or other long dashes
// Characters are built from code points so this file itself contains none of them.
// Text entered by users is never stored in the repository and is never checked or changed.

export type RuleKind = "documentation" | "content";

export interface Violation {
  line: number;
  column: number;
  character: string;
  name: string;
}

const LONG_DASHES: ReadonlyArray<[number, string]> = [
  [0x2013, "en dash"],
  [0x2014, "em dash"],
  [0x2015, "horizontal bar"],
  [0x2e3a, "two-em dash"],
  [0x2e3b, "three-em dash"],
  [0xfe58, "small em dash"],
];
const BACKTICK: [number, string] = [0x60, "backtick"];

function forbiddenFor(kind: RuleKind): Map<string, string> {
  const entries = kind === "documentation" ? [...LONG_DASHES, BACKTICK] : LONG_DASHES;
  return new Map(entries.map(([codePoint, name]) => [String.fromCodePoint(codePoint), name]));
}

export function findViolations(text: string, kind: RuleKind): Violation[] {
  const forbidden = forbiddenFor(kind);
  const violations: Violation[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((lineText, index) => {
    let column = 0;
    for (const character of lineText) {
      column += 1;
      const name = forbidden.get(character);
      if (name) {
        violations.push({ line: index + 1, column, character, name });
      }
    }
  });
  return violations;
}

// Decides which rule set applies to a repository path, or null when the file is not checked.
// Paths use forward slashes and are relative to the repository root.
export function classifyPath(path: string): RuleKind | null {
  const normalised = path.replaceAll("\\", "/");
  if (/\.(md|mdx)$/i.test(normalised)) {
    return "documentation";
  }
  if (/^(src\/content|prisma\/seed)\/.+\.(json|txt|md)$/i.test(normalised)) {
    return "content";
  }
  return null;
}

export const IGNORED_DIRECTORIES: ReadonlySet<string> = new Set([
  ".git",
  ".next",
  "node_modules",
  "coverage",
  "reports",
  "test-results",
  "playwright-report",
  "blob-report",
  "out",
  "generated",
]);
