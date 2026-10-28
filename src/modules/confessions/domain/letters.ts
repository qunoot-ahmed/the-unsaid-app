// Presentation rules for letters on the Wall (DESIGN.md, folded and sealed letters).
import type { MoodId } from "./moods";

export const CONTENT_NOTES = [
  "Grief and loss",
  "Illness",
  "Self-harm",
  "Abuse",
  "Something else heavy",
] as const;
export type ContentNote = (typeof CONTENT_NOTES)[number];

/** Bodies longer than this fold on the Wall. */
export const FOLD_THRESHOLD = 600;

export interface ReactionCounts {
  felt: number;
  same: number;
  holding: number;
}

interface LetterSummaryBase {
  id: string;
  catalogueMark: string;
  mood: MoodId;
  day: string;
  reactionCounts: ReactionCounts;
}

/**
 * What the Wall may receive for a letter. A sealed letter carries no body:
 * its text is fetched only by an explicit reveal.
 */
export type LetterSummary =
  | (LetterSummaryBase & { kind: "open"; body: string })
  | (LetterSummaryBase & { kind: "sealed"; contentNote: ContentNote });

export function shouldFold(body: string): boolean {
  return body.length > FOLD_THRESHOLD;
}

/**
 * Splits a long body into the part shown while folded and the remainder.
 * Splits at the last sentence end before the limit so a reader never sees half a sentence.
 */
export function foldBody(body: string, visibleLimit = 280): { visible: string; remainder: string } {
  if (!shouldFold(body)) {
    return { visible: body, remainder: "" };
  }
  const window = body.slice(0, visibleLimit);
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("? "),
    window.lastIndexOf("! "),
  );
  const cut = sentenceEnd > 0 ? sentenceEnd + 1 : window.lastIndexOf(" ");
  const at = cut > 0 ? cut : visibleLimit;
  return { visible: body.slice(0, at).trimEnd(), remainder: body.slice(at).trimStart() };
}

/** Estimated reading time for the unfold control, in whole minutes, at least 1. */
export function readingMinutes(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
