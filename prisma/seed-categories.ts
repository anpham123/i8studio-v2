import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { slug: "case-study", nameJa: "事例紹介", nameEn: "Case Study", order: 0 },
  { slug: "technique-sharing", nameJa: "テクニック共有", nameEn: "Technique Sharing", order: 1 },
  { slug: "knowledge", nameJa: "ナレッジ", nameEn: "Knowledge", order: 2 },
  { slug: "ai-updates", nameJa: "AI最新情報", nameEn: "AI Updates", order: 3 },
  { slug: "i8-life-gallery", nameJa: "i8ライフギャラリー", nameEn: "I8 Life Gallery", order: 4 },
];

async function main() {
  for (const cat of defaultCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`✓ Category: ${cat.nameEn} (${cat.slug})`);
  }
  console.log("Done: seeded default blog categories.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
