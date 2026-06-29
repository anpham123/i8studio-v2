const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Composite Examples (Production)...");
  
  // Clean existing ones
  await prisma.compositeExample.deleteMany({});
  
  const examples = [
    {
      title: "Riverside Residence",
      titleJp: "リバーサイドレジデンス",
      category: "Residential",
      location: "Da Nang, Vietnam",
      beforeImage: "/photo-composite/featured-before.jpg",
      afterImage: "/photo-composite/featured-after.jpg",
      isFeatured: true,
      order: 1,
      isPublished: true,
    },
    {
      title: "Urban Skyline Integration",
      titleJp: "都市スカイラインの統合",
      category: "Commercial",
      location: "Tokyo, Japan",
      beforeImage: "/photo-composite/featured-before.jpg",
      afterImage: "/photo-composite/featured-after.jpg",
      isFeatured: false,
      order: 2,
      isPublished: true,
    },
    {
      title: "Lakeside Luxury Villa",
      titleJp: "レイクサイドの豪華ヴィラ",
      category: "Hospitality",
      location: "Hakone, Japan",
      beforeImage: "/photo-composite/featured-before.jpg",
      afterImage: "/photo-composite/featured-after.jpg",
      isFeatured: false,
      order: 3,
      isPublished: true,
    },
    {
      title: "Mountain Eco-Resort",
      titleJp: "マウンテンエコリゾート",
      category: "Landscape",
      location: "Sapa, Vietnam",
      beforeImage: "/photo-composite/featured-before.jpg",
      afterImage: "/photo-composite/featured-after.jpg",
      isFeatured: false,
      order: 4,
      isPublished: true,
    }
  ];

  for (const ex of examples) {
    await prisma.compositeExample.create({ data: ex });
  }

  console.log("✅ Composite Examples seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
