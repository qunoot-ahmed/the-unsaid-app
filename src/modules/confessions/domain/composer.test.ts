import { describe, expect, it } from "vitest";
import {
  composerReducer,
  initialComposerState,
  validateRelease,
  type ComposerEvent,
  type ComposerState,
} from "./composer";

const BODY = "I never told her I was the one who called.";

function run(state: ComposerState, ...events: ComposerEvent[]) {
  return events.reduce(composerReducer, state);
}

const sealing = run(initialComposerState(), { type: "edit", body: BODY }, { type: "continue" });

describe("[CONF-PUB-001] composer: writing and sealing", () => {
  it("keeps the writer on the letter until it has at least 10 characters", () => {
    const state = run(
      initialComposerState(),
      { type: "edit", body: "Too short" },
      { type: "continue" },
    );
    expect(state.step).toBe("writing");
    expect(state.errors.body).toBe("Write at least 10 characters.");
  });

  it("moves to the seal step with a valid letter", () => {
    expect(sealing.step).toBe("sealing");
    expect(sealing.errors).toEqual({});
  });

  it("requires a mood before release", () => {
    const state = run(sealing, { type: "submit" });
    expect(state.step).toBe("sealing");
    expect(state.errors.mood).toBe("Choose a mood.");
  });

  it("[CONF-SEAL-001] requires a content note for a sealed letter, and clears it when opened again", () => {
    const sealed = run(
      sealing,
      { type: "setMood", mood: "regret" },
      { type: "setVisibility", visibility: "sealed" },
      { type: "submit" },
    );
    expect(sealed.errors.contentNote).toBeDefined();

    const noted = run(
      sealed,
      { type: "setContentNote", contentNote: "Grief and loss" },
      { type: "setVisibility", visibility: "open" },
    );
    expect(noted.draft.contentNote).toBeNull();
  });

  it("validates exactly as the server will", () => {
    expect(
      validateRelease({ body: BODY, mood: "hope", visibility: "open", contentNote: null }),
    ).toEqual({});
    expect(
      Object.keys(
        validateRelease({ body: "", mood: null, visibility: "sealed", contentNote: null }),
      ).sort(),
    ).toEqual(["body", "contentNote", "mood"]);
  });
});

describe("[CONF-PUB-002] composer: publication is decided by the server", () => {
  const publishing = run(sealing, { type: "setMood", mood: "hope" }, { type: "submit" });

  it("enters publishing on a valid submission", () => {
    expect(publishing.step).toBe("publishing");
  });

  it("reaches released only from a server confirmation", () => {
    expect(run(publishing, { type: "serverConfirmed" }).step).toBe("released");
    expect(run(sealing, { type: "serverConfirmed" }).step).toBe("sealing");
  });

  it("keeps the draft exactly as it was when the server fails", () => {
    const failed = run(publishing, { type: "serverFailed", message: "Could not release." });
    expect(failed.step).toBe("failed");
    expect(failed.draft).toEqual(publishing.draft);
    expect(failed.failureMessage).toBe("Could not release.");
  });

  it("can retry after a failure", () => {
    const retried = run(publishing, { type: "serverFailed", message: "x" }, { type: "submit" });
    expect(retried.step).toBe("publishing");
    expect(retried.failureMessage).toBeNull();
  });

  it("returns to the seal step with the server's errors when the server rejects the draft", () => {
    const rejected = run(publishing, {
      type: "serverRejected",
      errors: { mood: "Choose a mood." },
    });
    expect(rejected.step).toBe("sealing");
    expect(rejected.errors.mood).toBe("Choose a mood.");
  });

  it("ignores edits while publishing, so nothing changes under the request", () => {
    expect(run(publishing, { type: "edit", body: "changed" }).draft.body).toBe(BODY);
  });

  it("starts a fresh letter only after release", () => {
    const released = run(publishing, { type: "serverConfirmed" });
    expect(run(released, { type: "startAgain" })).toEqual(initialComposerState());
    expect(run(sealing, { type: "startAgain" }).step).toBe("sealing");
  });
});
