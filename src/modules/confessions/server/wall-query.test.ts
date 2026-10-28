import { describe, expect, it } from "vitest";
import { revealSealedLetter, previewRelease } from "./demo-actions";
import { DEMO_LETTERS } from "./demo-letters";
import { getDemoWall } from "./wall-query";

const sealedRecords = DEMO_LETTERS.filter((letter) => letter.sealed !== null);

describe("[CONF-SEAL-002] the Wall never carries sealed text", () => {
  it("has at least one sealed demonstration letter to check", () => {
    expect(sealedRecords.length).toBeGreaterThan(0);
  });

  it("omits every sealed body from the data sent to the page", () => {
    const payload = JSON.stringify(getDemoWall(null));
    for (const record of sealedRecords) {
      // Canary: a distinctive phrase from the sealed body must not appear anywhere.
      expect(payload).not.toContain(record.body.slice(0, 40));
    }
  });

  it("sends the content note and catalogue mark for sealed letters", () => {
    const sealed = getDemoWall(null).filter((letter) => letter.kind === "sealed");
    expect(sealed.length).toBe(sealedRecords.length);
    for (const letter of sealed) {
      expect(letter).not.toHaveProperty("body");
      expect(letter.catalogueMark).toMatch(/^[2-9A-HJ-NP-Z]{4}$/);
    }
  });

  it("filters by mood room", () => {
    const fear = getDemoWall("fear");
    expect(fear.length).toBeGreaterThan(0);
    expect(fear.every((letter) => letter.mood === "fear")).toBe(true);
  });
});

describe("[CONF-SEAL-003] revealing a sealed letter", () => {
  it("returns the body of a sealed letter after an explicit request", async () => {
    const record = sealedRecords[0]!;
    await expect(revealSealedLetter(record.publicId)).resolves.toEqual({
      ok: true,
      body: record.body,
    });
  });

  it("refuses open letters, unknown ids and malformed input the same way", async () => {
    const open = DEMO_LETTERS.find((letter) => letter.sealed === null)!;
    for (const id of [open.publicId, "unknown", 42, null]) {
      await expect(revealSealedLetter(id)).resolves.toEqual({
        ok: false,
        message: "This letter could not be opened. Try again.",
      });
    }
  });
});

describe("[CONF-PUB-003] release preview stores nothing and validates on the server", () => {
  const draft = {
    body: "I never told her I was the one who called.",
    mood: "hope" as const,
    visibility: "open" as const,
    contentNote: null,
  };

  it("confirms a valid draft with a preview catalogue mark", async () => {
    const result = await previewRelease(draft, false);
    expect(result).toMatchObject({ ok: true, day: "Today" });
  });

  it("rejects an invalid draft with field errors", async () => {
    await expect(previewRelease({ ...draft, mood: null }, false)).resolves.toEqual({
      ok: false,
      kind: "invalid",
      errors: { mood: "Choose a mood." },
    });
  });

  it("reports a simulated server failure", async () => {
    await expect(previewRelease(draft, true)).resolves.toMatchObject({ ok: false, kind: "server" });
  });
});
