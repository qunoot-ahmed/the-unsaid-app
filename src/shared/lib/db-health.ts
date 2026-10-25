// Database connectivity check used by the integration tests and, later, by a health endpoint.

export interface DatabaseHealth {
  ok: boolean;
  serverMajorVersion: number | null;
  latencyMs: number;
}

interface RawQueryClient {
  $queryRaw<T>(query: TemplateStringsArray, ...values: unknown[]): PromiseLike<T>;
}

export async function checkDatabase(
  client: RawQueryClient,
  now: () => number = () => performance.now(),
): Promise<DatabaseHealth> {
  const started = now();
  try {
    const rows = await client.$queryRaw<{ server_version_num: string }[]>`
      SELECT current_setting('server_version_num') AS server_version_num
    `;
    const versionNumber = Number(rows[0]?.server_version_num);
    const ok = Number.isInteger(versionNumber) && versionNumber > 0;
    return {
      ok,
      serverMajorVersion: ok ? Math.floor(versionNumber / 10000) : null,
      latencyMs: now() - started,
    };
  } catch {
    return { ok: false, serverMajorVersion: null, latencyMs: now() - started };
  }
}
