/**
 * Seed script: migrate 6 hardcoded collections into the database.
 * Run: npx tsx prisma/seed-collections.ts
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const COLLECTIONS = [
  {
    slug: "entrance",
    titleJa: "エントランス",
    titleEn: "Entrance",
    descJa: "訪れる人を最初に迎えるエントランス空間。光と素材の調和が、建物の第一印象を決定づけます。",
    descEn: "The entrance space that first greets visitors. The harmony of light and materials defines the building's first impression.",
    coverImage: "/uploads/collection-entrance.jpg",
    order: 1,
  },
  {
    slug: "bedroom",
    titleJa: "寝室",
    titleEn: "Bedroom",
    descJa: "安らぎと快適さを追求した寝室空間。柔らかな照明と上質な素材が、心地よい眠りを誘います。",
    descEn: "Bedroom spaces pursuing comfort and tranquility. Soft lighting and premium materials invite restful sleep.",
    coverImage: "/uploads/collection-bedroom.jpg",
    order: 2,
  },
  {
    slug: "bathroom",
    titleJa: "浴室",
    titleEn: "Bathroom",
    descJa: "清潔感と高級感を両立したバスルーム。水と光の演出が、日常をスパのような体験に変えます。",
    descEn: "Bathrooms balancing cleanliness and luxury. Water and light transform daily routines into spa-like experiences.",
    coverImage: "/uploads/collection-bathroom.jpg",
    order: 3,
  },
  {
    slug: "lobby",
    titleJa: "ロビー",
    titleEn: "Lobby",
    descJa: "開放感と格調を兼ね備えたロビー空間。スケール感と素材の質感で、特別な体験を演出します。",
    descEn: "Lobby spaces combining openness and dignity. Scale and material textures create special experiences.",
    coverImage: "/uploads/collection-lobby.jpg",
    order: 4,
  },
  {
    slug: "terrace",
    titleJa: "テラス",
    titleEn: "Terrace",
    descJa: "内と外をつなぐテラス空間。自然光と緑が調和した、開放的なリラクゼーションエリア。",
    descEn: "Terrace spaces connecting indoors and outdoors. Open relaxation areas harmonizing natural light and greenery.",
    coverImage: "/uploads/collection-terrace.jpg",
    order: 5,
  },
  {
    slug: "living",
    titleJa: "リビング",
    titleEn: "Living Room",
    descJa: "家族が集うリビング空間。広がりと温もりを感じるデザインで、暮らしの中心を彩ります。",
    descEn: "Living spaces where families gather. Designs with breadth and warmth color the center of daily life.",
    coverImage: "/uploads/collection-living.jpg",
    order: 6,
  },
];

async function main() {
  console.log("Seeding collections...");

  for (const col of COLLECTIONS) {
    const existing = await prisma.collection.findUnique({ where: { slug: col.slug } });
    if (existing) {
      console.log(`  ✓ "${col.slug}" already exists, skipping.`);
      continue;
    }
    await prisma.collection.create({
      data: {
        slug: col.slug,
        titleJa: col.titleJa,
        titleEn: col.titleEn,
        descJa: col.descJa,
        descEn: col.descEn,
        coverImage: col.coverImage,
        order: col.order,
        active: true,
      },
    });
    console.log(`  + Created "${col.slug}"`);
  }

  console.log("Done! 6 collections seeded.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
