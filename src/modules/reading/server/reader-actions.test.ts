import { describe, expect, it } from "vitest";
import { chooseInDemoStory, restartDemoStory } from "./reader-actions";

describe("[READ-THREAD-002] reader actions validate every request", () => {
  it("advances along a valid choice", async () => {
    const result = await chooseInDemoStory([], [], "open");
    expect(result).toMatchObject({ ok: true, path: ["open"], completed: [] });
  });

  it("refuses malformed or invalid input with one message", async () => {
    const cases: Array<[unknown, unknown, unknown]> = [
      ["not an array", [], "open"],
      [[], [], 7],
      [[], "x", "open"],
      [["open"], [], "burn"],
    ];
    for (const [path, completed, choiceId] of cases) {
      await expect(chooseInDemoStory(path, completed, choiceId)).resolves.toEqual({
        ok: false,
        message: "That choice is no longer available. Reload the story.",
      });
    }
  });

  it("records a completed path when an ending is reached and keeps it after restarting", async () => {
    const ending = await chooseInDemoStory(["hale"], [], "ask");
    expect(ending.ok && ending.view.scene.isEnding).toBe(true);
    expect(ending.ok && ending.completed).toEqual([["hale", "ask"]]);

    const restarted = await restartDemoStory(ending.ok ? ending.completed : []);
    expect(restarted.ok && restarted.view.scene.key).toBe("envelope");
    expect(restarted.ok && restarted.view.endings.found).toEqual(["Number Nine"]);
  });
});
