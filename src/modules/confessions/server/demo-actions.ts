"use server";

// Server Actions for the Milestone 1 demonstration. Nothing is stored: these actions validate
// input and return results so the interface can be built against the real boundary.
// Persistence, authorization and rate limits arrive in Milestones 2 and 3.
import { catalogueMark } from "../domain/catalogue";
import { validateRelease, type ComposerState, type Draft } from "../domain/composer";
import { DEMO_LETTERS } from "./demo-letters";

export type RevealResult = { ok: true; body: string } | { ok: false; message: string };

/** Returns the text of one sealed letter after an explicit reader request. */
export async function revealSealedLetter(id: unknown): Promise<RevealResult> {
  if (typeof id !== "string") {
    return { ok: false, message: "This letter could not be opened. Try again." };
  }
  const letter = DEMO_LETTERS.find((record) => record.publicId === id && record.sealed !== null);
  return letter
    ? { ok: true, body: letter.body }
    : { ok: false, message: "This letter could not be opened. Try again." };
}

export type PreviewReleaseResult =
  | { ok: true; catalogueMark: string; day: string }
  | { ok: false; kind: "invalid"; errors: ComposerState["errors"] }
  | { ok: false; kind: "server"; message: string };

/**
 * Validates a draft exactly as a real release will, then reports what would happen.
 * It never stores anything. simulateFailure lets the interface demonstrate the failure path.
 */
export async function previewRelease(
  draft: Draft,
  simulateFailure: boolean,
): Promise<PreviewReleaseResult> {
  const errors = validateRelease(draft);
  if (Object.keys(errors).length > 0) {
    return { ok: false, kind: "invalid", errors };
  }
  if (simulateFailure) {
    return {
      ok: false,
      kind: "server",
      message: "Your letter is still here, exactly as you left it.",
    };
  }
  const previewId = `preview-${draft.body.length}-${draft.mood}`;
  return { ok: true, catalogueMark: catalogueMark(previewId), day: "Today" };
}
