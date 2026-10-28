"use server";

// Server Action for the Milestone 1 reader demonstration. It keeps the story graph on the server
// and returns only the per-reader view. Progress is held in the page and is not saved
// (persistent progress arrives in Milestone 6).
import { buildReaderView, resolvePath, type ReaderView } from "../domain/reader-view";
import { DEMO_STORY } from "./demo-story";

export type ChooseResult =
  | { ok: true; view: ReaderView; path: string[]; completed: string[][] }
  | { ok: false; message: string };

function isStringArray(value: unknown, max = 50): value is string[] {
  return (
    Array.isArray(value) && value.length <= max && value.every((item) => typeof item === "string")
  );
}

export async function chooseInDemoStory(
  path: unknown,
  completed: unknown,
  choiceId: unknown,
): Promise<ChooseResult> {
  const failure = {
    ok: false as const,
    message: "That choice is no longer available. Reload the story.",
  };
  if (!isStringArray(path) || typeof choiceId !== "string") return failure;
  if (
    !Array.isArray(completed) ||
    completed.length > 20 ||
    !completed.every((item) => isStringArray(item))
  ) {
    return failure;
  }
  const nextPath = [...path, choiceId];
  const resolved = resolvePath(DEMO_STORY, nextPath);
  if (!resolved.ok) return failure;
  const view = buildReaderView(DEMO_STORY, nextPath, completed);
  if (!view) return failure;
  const nextCompleted = view.scene.isEnding ? [...completed, nextPath] : completed;
  return { ok: true, view, path: nextPath, completed: nextCompleted };
}

export async function restartDemoStory(completed: unknown): Promise<ChooseResult> {
  const safeCompleted =
    Array.isArray(completed) &&
    completed.length <= 20 &&
    completed.every((item) => isStringArray(item))
      ? (completed as string[][])
      : [];
  const view = buildReaderView(DEMO_STORY, [], safeCompleted);
  return view
    ? { ok: true, view, path: [], completed: safeCompleted }
    : { ok: false, message: "The story could not be restarted. Reload the page." };
}
