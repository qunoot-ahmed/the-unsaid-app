import { describe, expect, it } from "vitest";
import { DEMO_STORY } from "../server/demo-story";
import { buildReaderView, foundEndingTitles, resolvePath } from "./reader-view";

const endingTitles = Object.values(DEMO_STORY.scenes)
  .map((scene) => scene.endingTitle)
  .filter((title): title is string => Boolean(title));

describe("[READ-THREAD-001] reader paths and the thread", () => {
  it("starts at the start scene with the prelude as the thread", () => {
    const view = buildReaderView(DEMO_STORY, [], [])!;
    expect(view.scene.key).toBe("envelope");
    expect(view.thread).toEqual(DEMO_STORY.prelude);
    expect(view.lastChoice).toBeNull();
  });

  it("adds each choice to the thread with the number of paths not taken", () => {
    const view = buildReaderView(DEMO_STORY, ["burn"], [])!;
    expect(view.scene.title).toBe("Ash");
    expect(view.lastChoice).toBe("Burn it in the grate");
    expect(view.thread.at(-1)).toEqual({
      label: "Burn it in the grate",
      chapter: "Chapter Three",
      untaken: 2,
    });
  });

  it("rejects a choice that does not belong to the current scene", () => {
    expect(resolvePath(DEMO_STORY, ["jar"])).toEqual({ ok: false, reason: "invalid-choice" });
    expect(resolvePath(DEMO_STORY, ["open", "open"])).toEqual({
      ok: false,
      reason: "invalid-choice",
    });
    expect(buildReaderView(DEMO_STORY, ["nope"], [])).toBeNull();
  });

  it("rejects paths longer than the limit", () => {
    expect(
      resolvePath(
        DEMO_STORY,
        Array.from({ length: 51 }, () => "open"),
      ),
    ).toEqual({ ok: false, reason: "path-too-long" });
  });
});

describe("[READ-MAP-001] the reader never receives undiscovered endings or destinations", () => {
  it("contains no ending titles before any ending is found", () => {
    // The story's own title is public and happens to contain an ending title ("Number Nine"),
    // so it is left out of this canary check. Every other field is checked.
    const { storyTitle, ...rest } = buildReaderView(DEMO_STORY, ["open"], [])!;
    expect(storyTitle).toBe(DEMO_STORY.title);
    const payload = JSON.stringify(rest);
    for (const title of endingTitles) {
      expect(payload).not.toContain(title);
    }
  });

  it("never includes choice destinations", () => {
    const view = buildReaderView(DEMO_STORY, [], [])!;
    for (const choice of view.scene.choices) {
      expect(Object.keys(choice).sort()).toEqual(["id", "label"]);
    }
  });

  it("names only the endings this reader has reached", () => {
    const atEnding = buildReaderView(DEMO_STORY, ["burn", "jar"], [["hale", "ask"]])!;
    expect(atEnding.scene.isEnding).toBe(true);
    expect([...atEnding.endings.found].sort()).toEqual(["Number Nine", "What the Smoke Said"]);
    const payload = JSON.stringify(atEnding);
    expect(payload).not.toContain("The Appointment");
    expect(payload).not.toContain("The Quiet Tenant");
  });

  it("ignores completed paths that are invalid or unfinished", () => {
    expect(foundEndingTitles(DEMO_STORY, [["open"], ["bogus"], []])).toEqual([]);
  });

  it("counts every ending in the story", () => {
    expect(buildReaderView(DEMO_STORY, [], [])!.endings.total).toBe(4);
  });
});
