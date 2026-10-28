// The eight moods of the Whisper Wall (DESIGN.md, mood accents). Pure data: no framework imports.

export const MOOD_IDS = [
  "longing",
  "regret",
  "relief",
  "fear",
  "tenderness",
  "anger",
  "shame",
  "hope",
] as const;

export type MoodId = (typeof MOOD_IDS)[number];

export interface Mood {
  id: MoodId;
  label: string;
  /** The room line shown when the room is open. */
  roomLine: string;
}

export const MOODS: Readonly<Record<MoodId, Mood>> = {
  longing: { id: "longing", label: "Longing", roomLine: "For the ones who are still missed." },
  regret: { id: "regret", label: "Regret", roomLine: "What people would undo." },
  relief: { id: "relief", label: "Relief", roomLine: "Weights finally set down." },
  fear: { id: "fear", label: "Fear", roomLine: "Said quietly, with the lights off." },
  tenderness: { id: "tenderness", label: "Tenderness", roomLine: "Love that went unspoken." },
  anger: { id: "anger", label: "Anger", roomLine: "What was swallowed instead." },
  shame: { id: "shame", label: "Shame", roomLine: "What people still carry alone." },
  hope: { id: "hope", label: "Hope", roomLine: "Small lights, kept going." },
};

export const ALL_ROOMS_LINE = "Things people never said aloud.";

export function isMoodId(value: unknown): value is MoodId {
  return typeof value === "string" && (MOOD_IDS as ReadonlyArray<string>).includes(value);
}

/** Reads the mood room from a URL parameter. Unknown or missing values open all rooms. */
export function parseMoodParam(value: string | string[] | undefined): MoodId | null {
  const single = Array.isArray(value) ? value[0] : value;
  return isMoodId(single) ? single : null;
}
