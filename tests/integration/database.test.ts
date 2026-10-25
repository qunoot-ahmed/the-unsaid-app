import { afterAll, describe, expect, it } from "vitest";
import { createPrismaClient } from "@/shared/lib/db";
import { checkDatabase } from "@/shared/lib/db-health";

const prisma = createPrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("[FND-DB-001] database connectivity", () => {
  it("connects through Prisma and the pg adapter and reaches PostgreSQL 17", async () => {
    const health = await checkDatabase(prisma);

    expect(health.ok).toBe(true);
    expect(health.serverMajorVersion).toBe(17);
  });
});
