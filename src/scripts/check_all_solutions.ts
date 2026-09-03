import { prisma } from "../lib/prisma";

async function main() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true, nameJa: true, heroDescJa: true, heroDescEn: true }
  });
  console.log("=== ALL SOLUTIONS HERO DESCRIPTIONS ===");
  services.forEach((s) => {
    console.log(`\n--- [${s.slug}] ${s.nameJa} / ${s.name} ---`);
    console.log("JA:", JSON.stringify(s.heroDescJa));
    console.log("EN:", JSON.stringify(s.heroDescEn));
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
