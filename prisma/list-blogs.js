var p = require("@prisma/client");
var c = new p.PrismaClient();
c.blogPost.findMany({
  where: { isPublished: true },
  select: { id: true, slug: true, title: true, locale: true }
}).then(function(r) {
  r.forEach(function(x) {
    console.log(x.id, x.locale, x.slug);
  });
  c.$disconnect();
});
