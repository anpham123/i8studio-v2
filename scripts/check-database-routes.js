const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({ select: { id: true, slug: true, title: true, category: true, status: true } });
  const services = await prisma.service.findMany({ select: { id: true, slug: true, name: true, nameJa: true } });
  const caseStudies = await prisma.caseStudy.findMany({ select: { id: true, slug: true, title: true, titleJa: true } });
  const blogPosts = await prisma.blogPost.findMany({ select: { id: true, slug: true, title: true, isPublished: true } });
  const works = await prisma.work.findMany({ select: { id: true, title: true, category: true } });
  const collections = await prisma.collection.findMany({ select: { id: true, slug: true, titleJa: true } });

  console.log('=== SERVICES ===');
  console.log(JSON.stringify(services, null, 2));

  console.log('=== CASE STUDIES ===');
  console.log(JSON.stringify(caseStudies, null, 2));

  console.log('=== BLOG POSTS ===');
  console.log(JSON.stringify(blogPosts, null, 2));

  console.log('=== POSTS (News/Blog) ===');
  console.log(JSON.stringify(posts, null, 2));

  console.log('=== WORKS ===');
  console.log(JSON.stringify(works, null, 2));

  console.log('=== COLLECTIONS ===');
  console.log(JSON.stringify(collections, null, 2));
}

main().finally(() => prisma.$disconnect());
