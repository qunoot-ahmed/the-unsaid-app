import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Server-only database access. Never import this module from a Client Component.

export function createPrismaClient(connectionString = process.env.DATABASE_URL): PrismaClient {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and start the database.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

const globalForPrisma = globalThis as unknown as { unsaidPrisma?: PrismaClient };

// One client per process; cached on globalThis so development reloads do not open new pools.
export function getPrisma(): PrismaClient {
  globalForPrisma.unsaidPrisma ??= createPrismaClient();
  return globalForPrisma.unsaidPrisma;
}
