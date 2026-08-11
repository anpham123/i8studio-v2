const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

p.blogPost.findMany({
  where: { isPublished: true },
  select: { slug: true, title: true, introDropcap: true, sections: true, heroImage: true, coverImage: true }
}).then(d => {
  d.forEach(r => {
    const t = r.title.replace(/<[^>]*>/g, '').substring(0, 40);
    console.log(r.slug + ' | ' + t + ' | hero:' + (r.heroImage ? 'Y' : 'N') + ' | cover:' + (r.coverImage ? 'Y' : 'N') + ' | intro:' + (r.introDropcap ? 'Y' : 'N') + ' | sec:' + (r.sections || '').length);
  });
  p.$disconnect();
});
