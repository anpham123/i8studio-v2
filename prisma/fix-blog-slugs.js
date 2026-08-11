const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const posts = await p.blogPost.findMany({
    select: { id: true, slug: true, title: true }
  });
  
  console.log('=== All blog posts ===');
  posts.forEach(r => {
    const t = r.title.replace(/<[^>]*>/g, '').substring(0, 60);
    const bad = r.slug.includes('/') || r.slug.includes(' ') || !r.slug;
    console.log((bad ? '❌' : '✅') + ' slug="' + r.slug + '" | ' + t);
  });

  // Fix bad slugs
  const badPosts = posts.filter(r => r.slug.includes('/') || r.slug.includes(' ') || !r.slug);
  if (badPosts.length > 0) {
    console.log('\n=== Fixing ' + badPosts.length + ' bad slugs ===');
    for (const post of badPosts) {
      // Generate slug from title
      const title = post.title.replace(/<[^>]*>/g, '');
      const newSlug = title
        .toLowerCase()
        .replace(/[^\w\s\u3000-\u9fff-]/g, '')
        .replace(/[\s\u3000]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80)
        || 'post-' + post.id.substring(0, 8);
      
      await p.blogPost.update({
        where: { id: post.id },
        data: { slug: newSlug }
      });
      console.log('  Fixed: "' + post.slug + '" → "' + newSlug + '"');
    }
  } else {
    console.log('\nAll slugs look good!');
  }
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
