import { describe, expect, it } from "vitest";
import { checkDatabase } from "./db-health";

function clock(...readings: number[]) {
  return () => readings.shift() ?? 0;
}

describe("[FND-DB-002] checkDatabase", () => {
  it("reports the PostgreSQL major version and latency when the query succeeds", async () => {
    const client = { $queryRaw: async <T>() => [{ server_version_num: "170006" }] as T };

    const result = await checkDatabase(client, clock(100, 112));

    expect(result).toEqual({ ok: true, serverMajorVersion: 17, latencyMs: 12 });
  });

  it("reports failure without throwing when the query rejects", async () => {
    const client = {
      $queryRaw: async <T>(): Promise<T> => {
        throw new Error("connection refused");
      },
    };

    const result = await checkDatabase(client, clock(5, 9));

    expect(result).toEqual({ ok: false, serverMajorVersion: null, latencyMs: 4 });
  });

  it("reports failure when the server returns an unusable version", async () => {
    const client = { $queryRaw: async <T>() => [{ server_version_num: "unknown" }] as T };

    const result = await checkDatabase(client, clock(0, 1));

    expect(result.ok).toBe(false);
    expect(result.serverMajorVersion).toBeNull();
  });
});
