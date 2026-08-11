const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

p.blogPost.updateMany({
  where: { slug: '建築パースの基礎役割と活用方法をやさしく解説' },
  data: { slug: 'architectural-perspective-basics' }
}).then(r => {
  console.log('Updated', r.count, 'posts');
  return p.$disconnect();
}).catch(e => { console.error(e); process.exit(1); });
