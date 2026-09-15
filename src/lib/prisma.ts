import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
  __prismaVersion: string | undefined;
};

const CLIENT_VERSION = "2026_09_15_v2_cover_orientation";

if (!globalForPrisma.__prisma || globalForPrisma.__prismaVersion !== CLIENT_VERSION) {
  if (globalForPrisma.__prisma) {
    globalForPrisma.__prisma.$disconnect().catch(() => {});
  }
  globalForPrisma.__prisma = new PrismaClient();
  globalForPrisma.__prismaVersion = CLIENT_VERSION;
}

export const prisma = globalForPrisma.__prisma;
