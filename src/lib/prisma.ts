import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
  __prismaVersion: string | undefined;
};

const CLIENT_VERSION = "2026_10_23_solution_hero_cta";

function getClient(): PrismaClient {
  if (!globalForPrisma.__prisma || globalForPrisma.__prismaVersion !== CLIENT_VERSION) {
    if (globalForPrisma.__prisma) {
      globalForPrisma.__prisma.$disconnect().catch(() => {});
    }
    globalForPrisma.__prisma = new PrismaClient();
    globalForPrisma.__prismaVersion = CLIENT_VERSION;
  }
  return globalForPrisma.__prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    return (client as any)[prop];
  },
});
