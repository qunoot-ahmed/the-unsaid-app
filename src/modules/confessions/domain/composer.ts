// The Letter composer state machine (DESIGN.md, The Letter).
// Business state changes only on events. "released" is reachable only from a server
// confirmation; no state depends on an animation finishing.
import { CONTENT_NOTES, type ContentNote } from "./letters";
import { isMoodId, type MoodId } from "./moods";

export const BODY_MIN = 10;
export const BODY_MAX = 2000;

export type Visibility = "open" | "sealed";

export interface Draft {
  body: string;
  mood: MoodId | null;
  visibility: Visibility;
  contentNote: ContentNote | null;
}

export type ComposerStep = "writing" | "sealing" | "publishing" | "released" | "failed";

export interface ComposerState {
  step: ComposerStep;
  draft: Draft;
  /** Field errors from the last validation, keyed by field. */
  errors: Partial<Record<keyof Draft, string>>;
  failureMessage: string | null;
}

export type ComposerEvent =
  | { type: "edit"; body: string }
  | { type: "continue" }
  | { type: "back" }
  | { type: "setMood"; mood: MoodId }
  | { type: "setVisibility"; visibility: Visibility }
  | { type: "setContentNote"; contentNote: ContentNote }
  | { type: "submit" }
  | { type: "serverConfirmed" }
  | { type: "serverFailed"; message: string }
  | { type: "serverRejected"; errors: ComposerState["errors"] }
  | { type: "startAgain" };

export const emptyDraft: Draft = { body: "", mood: null, visibility: "open", contentNote: null };

export function initialComposerState(draft: Draft = emptyDraft): ComposerState {
  return { step: "writing", draft, errors: {}, failureMessage: null };
}

export function validateBody(body: string): string | null {
  const length = body.trim().length;
  if (length < BODY_MIN) return `Write at least ${BODY_MIN} characters.`;
  if (body.length > BODY_MAX) return `Keep it to ${BODY_MAX} characters or fewer.`;
  return null;
}

/** Full release validation. The server runs the same function before accepting a release. */
export function validateRelease(draft: Draft): ComposerState["errors"] {
  const errors: ComposerState["errors"] = {};
  const bodyError = validateBody(draft.body);
  if (bodyError) errors.body = bodyError;
  if (!draft.mood || !isMoodId(draft.mood)) errors.mood = "Choose a mood.";
  if (draft.visibility === "sealed") {
    if (
      !draft.contentNote ||
      !(CONTENT_NOTES as ReadonlyArray<string>).includes(draft.contentNote)
    ) {
      errors.contentNote = "Choose what readers should know before opening it.";
    }
  }
  return errors;
}

export function composerReducer(state: ComposerState, event: ComposerEvent): ComposerState {
  const { step, draft } = state;
  switch (event.type) {
    case "edit":
      if (step !== "writing") return state;
      return { ...state, draft: { ...draft, body: event.body }, errors: {} };
    case "continue": {
      if (step !== "writing") return state;
      const bodyError = validateBody(draft.body);
      return bodyError
        ? { ...state, errors: { body: bodyError } }
        : { ...state, step: "sealing", errors: {} };
    }
    case "back":
      return step === "sealing" || step === "failed"
        ? { ...state, step: "writing", errors: {}, failureMessage: null }
        : state;
    case "setMood":
      return step === "sealing" || step === "failed"
        ? { ...state, draft: { ...draft, mood: event.mood }, errors: {} }
        : state;
    case "setVisibility":
      if (step !== "sealing" && step !== "failed") return state;
      return {
        ...state,
        draft: {
          ...draft,
          visibility: event.visibility,
          contentNote: event.visibility === "open" ? null : draft.contentNote,
        },
        errors: {},
      };
    case "setContentNote":
      return step === "sealing" || step === "failed"
        ? { ...state, draft: { ...draft, contentNote: event.contentNote }, errors: {} }
        : state;
    case "submit": {
      if (step !== "sealing" && step !== "failed") return state;
      const errors = validateRelease(draft);
      return Object.keys(errors).length > 0
        ? { ...state, step: "sealing", errors }
        : { ...state, step: "publishing", errors: {}, failureMessage: null };
    }
    case "serverConfirmed":
      return step === "publishing" ? { ...state, step: "released" } : state;
    case "serverFailed":
      // The draft is kept exactly as it was.
      return step === "publishing"
        ? { ...state, step: "failed", failureMessage: event.message }
        : state;
    case "serverRejected":
      // The server's validation wins; the writer returns to the seal step to fix it.
      return step === "publishing" ? { ...state, step: "sealing", errors: event.errors } : state;
    case "startAgain":
      return step === "released" ? initialComposerState() : state;
  }
}
