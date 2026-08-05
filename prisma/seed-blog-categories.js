var p = require("@prisma/client");
var c = new p.PrismaClient();

var cats = [
  { slug: "case-study", nameEn: "Case Study", nameJa: "\u30b1\u30fc\u30b9\u30b9\u30bf\u30c7\u30a3", order: 1 },
  { slug: "technique", nameEn: "Technique Sharing", nameJa: "\u6280\u8853\u5171\u6709", order: 2 },
  { slug: "knowledge", nameEn: "Knowledge", nameJa: "\u5efa\u7bc9\u77e5\u8b58", order: 3 },
  { slug: "ai", nameEn: "AI Column", nameJa: "AI\u7279\u96c6", order: 4 },
  { slug: "life-gallery", nameEn: "I8 Life Gallery", nameJa: "I8 \u30e9\u30a4\u30d5\u30ae\u30e3\u30e9\u30ea\u30fc", order: 5 },
];

async function main() {
  for (var i = 0; i < cats.length; i++) {
    var cat = cats[i];
    var existing = await c.blogCategory.findFirst({ where: { slug: cat.slug } });
    if (!existing) {
      await c.blogCategory.create({ data: cat });
      console.log("Created: " + cat.slug);
    } else {
      console.log("Exists: " + cat.slug);
    }
  }
  await c.$disconnect();
}
main();
