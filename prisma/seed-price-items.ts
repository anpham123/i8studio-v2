// prisma/seed-price-items.ts
// Seed PriceItem records from hardcoded SOLUTIONS data
// Run: npx tsx prisma/seed-price-items.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PRICE_ITEMS = [
  {
    serviceSlug: "cg-perspective",
    icon: "🖼️",
    titleJa: "CGパース",
    titleEn: "CG Perspective",
    bulletsJson: JSON.stringify(["1カット", "4Kレンダリング", "3回修正", "家具コーディネート"]),
    bulletsEnJson: JSON.stringify(["1 Cut", "4K Rendering", "3 Revisions", "Furniture Styling"]),
    priceFrom: "¥35,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 1,
  },
  {
    serviceSlug: "cg-video",
    icon: "🎬",
    titleJa: "CG動画",
    titleEn: "CG Video",
    bulletsJson: JSON.stringify(["60秒", "4K", "BGM付き", "カラーグレーディング"]),
    bulletsEnJson: JSON.stringify(["60 Seconds", "4K Quality", "Background Music", "Color Grading"]),
    priceFrom: "¥150,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 2,
  },
  {
    serviceSlug: "photo-composite",
    icon: "📷",
    titleJa: "写真合成",
    titleEn: "Photo Compositing",
    bulletsJson: JSON.stringify(["1カット", "高精度合成", "3回修正"]),
    bulletsEnJson: JSON.stringify(["1 Cut", "High-precision Compositing", "3 Revisions"]),
    priceFrom: "¥25,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 3,
  },
  {
    serviceSlug: "virtual-staging",
    icon: "🛋️",
    titleJa: "バーチャルステージング",
    titleEn: "Virtual Staging",
    bulletsJson: JSON.stringify(["1部屋", "プレミアム家具", "2回修正"]),
    bulletsEnJson: JSON.stringify(["1 Room", "Premium Furniture", "2 Revisions"]),
    priceFrom: "¥15,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 4,
  },
  {
    serviceSlug: "vr360",
    icon: "🌐",
    titleJa: "VR360",
    titleEn: "VR360",
    bulletsJson: JSON.stringify(["6シーン", "カスタムUI", "BGM"]),
    bulletsEnJson: JSON.stringify(["6 Scenes", "Custom UI", "Background Music"]),
    priceFrom: "¥80,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 5,
  },
  {
    serviceSlug: "vr-walkthrough",
    icon: "🚶",
    titleJa: "VRウォークスルー",
    titleEn: "VR Walkthrough",
    bulletsJson: JSON.stringify(["複数フロア", "カスタムUI", "インタラクション"]),
    bulletsEnJson: JSON.stringify(["Multi-floor", "Custom UI", "Interactive Elements"]),
    priceFrom: "¥200,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 6,
  },
  {
    serviceSlug: "digital-model",
    icon: "🏗️",
    titleJa: "デジタル模型",
    titleEn: "Digital Model",
    bulletsJson: JSON.stringify(["1棟", "断面表示", "アノテーション"]),
    bulletsEnJson: JSON.stringify(["1 Building", "Section View", "Annotations"]),
    priceFrom: "¥120,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 7,
  },
  {
    serviceSlug: "ar",
    icon: "📱",
    titleJa: "AR",
    titleEn: "AR",
    bulletsJson: JSON.stringify(["3モデル", "カスタムUI", "アニメーション"]),
    bulletsEnJson: JSON.stringify(["3 Models", "Custom UI", "Animation"]),
    priceFrom: "¥100,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 8,
  },
  {
    serviceSlug: "exe-content",
    icon: "💻",
    titleJa: "EXEコンテンツ",
    titleEn: "EXE Content",
    bulletsJson: JSON.stringify(["複数シーン", "カスタムUI", "データ連携"]),
    bulletsEnJson: JSON.stringify(["Multiple Scenes", "Custom UI", "Data Integration"]),
    priceFrom: "¥300,000〜",
    priceLabelJa: "参考価格",
    priceLabelEn: "Starting from",
    order: 9,
  },
];

async function main() {
  console.log("🌱 Seeding PriceItem records...");

  // Delete existing items (including DEMO)
  await prisma.priceItem.deleteMany();

  for (const item of PRICE_ITEMS) {
    await prisma.priceItem.create({ data: item });
    console.log(`  ✅ ${item.titleEn} — ${item.priceFrom}`);
  }

  console.log(`\n✅ ${PRICE_ITEMS.length} price items seeded successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
