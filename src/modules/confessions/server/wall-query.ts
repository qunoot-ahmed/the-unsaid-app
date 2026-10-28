// Builds what the Wall page is allowed to send to the browser.
// Sealed letters are mapped without their body (DESIGN.md, sealed data exposure rules).
import { catalogueMark } from "../domain/catalogue";
import type { LetterSummary } from "../domain/letters";
import type { MoodId } from "../domain/moods";
import { DEMO_LETTERS, type DemoLetterRecord } from "./demo-letters";

export function toLetterSummary(record: DemoLetterRecord): LetterSummary {
  const common = {
    id: record.publicId,
    catalogueMark: catalogueMark(record.publicId),
    mood: record.mood,
    day: record.day,
    reactionCounts: record.reactions,
  };
  return record.sealed
    ? { kind: "sealed", ...common, contentNote: record.sealed }
    : { kind: "open", ...common, body: record.body };
}

export function getDemoWall(mood: MoodId | null): LetterSummary[] {
  return DEMO_LETTERS.filter((letter) => mood === null || letter.mood === mood).map(
    toLetterSummary,
  );
}
