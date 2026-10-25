// Usage: npm run check:writing
// Scans documentation and project-authored content files and exits with code 1 on any violation.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { classifyPath, findViolations, IGNORED_DIRECTORIES } from "./rules.ts";

function listFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        files.push(...listFiles(join(directory, entry.name)));
      }
    } else if (entry.isFile()) {
      files.push(join(directory, entry.name));
    }
  }
  return files;
}

const root = process.cwd();
let checked = 0;
let problems = 0;

for (const absolutePath of listFiles(root)) {
  const path = relative(root, absolutePath).replaceAll("\\", "/");
  const kind = classifyPath(path);
  if (!kind) continue;
  checked += 1;
  for (const violation of findViolations(readFileSync(absolutePath, "utf8"), kind)) {
    problems += 1;
    console.error(
      `${path}:${violation.line}:${violation.column}  ${violation.name} (${kind} rule)`,
    );
  }
}

console.log(`Writing rules: ${checked} files checked, ${problems} violations.`);
process.exitCode = problems > 0 ? 1 : 0;
