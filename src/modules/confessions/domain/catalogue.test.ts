import { describe, expect, it } from "vitest";
import { catalogueMark } from "./catalogue";

describe("[CONF-008] catalogue mark", () => {
  it("is four characters from an alphabet without ambiguous characters", () => {
    for (const id of ["k3x9m2ql", "p7r2w8vd", "a", "a much longer public identifier"]) {
      expect(catalogueMark(id)).toMatch(/^[2-9A-HJ-NP-Z]{4}$/);
    }
  });

  it("is deterministic for the same public id", () => {
    expect(catalogueMark("k3x9m2ql")).toBe(catalogueMark("k3x9m2ql"));
  });

  it("does not follow the order of the ids it is derived from", () => {
    const marks = ["id-1", "id-2", "id-3", "id-4", "id-5"].map(catalogueMark);
    expect(new Set(marks).size).toBe(marks.length);
    expect([...marks].sort()).not.toEqual(marks);
  });

  it("rejects an empty id", () => {
    expect(() => catalogueMark("")).toThrow();
  });
});
