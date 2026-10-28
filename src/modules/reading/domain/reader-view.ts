// Per-reader view of a branching story (DESIGN.md, The Thread). Pure functions, no framework imports.
// The browser receives only this view: the scene being read, the reader's own thread, and the titles
// of endings this reader has found. Destinations and undiscovered ending titles never leave the server.

export interface StoryChoice {
  id: string;
  label: string;
  /** Destination scene key. Server side only. */
  to: string;
}

export interface StoryScene {
  key: string;
  chapter: string | null;
  title: string;
  paragraphs: ReadonlyArray<string>;
  /** The question shown above the choices. */
  prompt?: string;
  choices: ReadonlyArray<StoryChoice>;
  /** Present only on endings. */
  endingTitle?: string;
}

export interface StoryGraph {
  slug: string;
  title: string;
  startKey: string;
  scenes: Readonly<Record<string, StoryScene>>;
  /** Choices made in earlier chapters, shown at the start of the thread. */
  prelude: ReadonlyArray<ThreadStep>;
}

export interface ThreadStep {
  label: string;
  chapter: string | null;
  /** Number of paths not taken at this choice. Labels of untaken paths are never sent. */
  untaken: number;
}

export interface ReaderView {
  storyTitle: string;
  scene: {
    key: string;
    chapter: string | null;
    title: string;
    paragraphs: ReadonlyArray<string>;
    isEnding: boolean;
    prompt: string | null;
    choices: ReadonlyArray<{ id: string; label: string }>;
  };
  lastChoice: string | null;
  thread: ReadonlyArray<ThreadStep>;
  endings: { total: number; found: ReadonlyArray<string> };
}

export type PathResult =
  | { ok: true; sceneKey: string; steps: ThreadStep[] }
  | { ok: false; reason: "invalid-choice" | "path-too-long" };

const MAX_PATH = 50;

/** Walks a path of choice ids from the start scene, rejecting any choice that does not belong to the current scene. */
export function resolvePath(graph: StoryGraph, path: ReadonlyArray<string>): PathResult {
  if (path.length > MAX_PATH) return { ok: false, reason: "path-too-long" };
  let scene = graph.scenes[graph.startKey];
  const steps: ThreadStep[] = [];
  for (const choiceId of path) {
    const choice = scene?.choices.find((candidate) => candidate.id === choiceId);
    const next = choice ? graph.scenes[choice.to] : undefined;
    if (!scene || !choice || !next) return { ok: false, reason: "invalid-choice" };
    steps.push({ label: choice.label, chapter: scene.chapter, untaken: scene.choices.length - 1 });
    scene = next;
  }
  return scene ? { ok: true, sceneKey: scene.key, steps } : { ok: false, reason: "invalid-choice" };
}

export function countEndings(graph: StoryGraph): number {
  return Object.values(graph.scenes).filter((scene) => scene.endingTitle !== undefined).length;
}

/** Ending titles reached by completed paths. Invalid or unfinished paths contribute nothing. */
export function foundEndingTitles(
  graph: StoryGraph,
  completedPaths: ReadonlyArray<ReadonlyArray<string>>,
): string[] {
  const titles = new Set<string>();
  for (const path of completedPaths) {
    const result = resolvePath(graph, path);
    const title = result.ok ? graph.scenes[result.sceneKey]?.endingTitle : undefined;
    if (title) titles.add(title);
  }
  return [...titles];
}

export function buildReaderView(
  graph: StoryGraph,
  path: ReadonlyArray<string>,
  completedPaths: ReadonlyArray<ReadonlyArray<string>>,
): ReaderView | null {
  const result = resolvePath(graph, path);
  if (!result.ok) return null;
  const scene = graph.scenes[result.sceneKey];
  if (!scene) return null;
  const isEnding = scene.endingTitle !== undefined;
  const allCompleted = isEnding ? [...completedPaths, path] : completedPaths;
  return {
    storyTitle: graph.title,
    scene: {
      key: scene.key,
      chapter: scene.chapter,
      title: scene.title,
      paragraphs: scene.paragraphs,
      isEnding,
      prompt: scene.prompt ?? null,
      choices: scene.choices.map(({ id, label }) => ({ id, label })),
    },
    lastChoice: result.steps.at(-1)?.label ?? null,
    thread: [...graph.prelude, ...result.steps],
    endings: { total: countEndings(graph), found: foundEndingTitles(graph, allCompleted) },
  };
}
