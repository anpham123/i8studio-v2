const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const urlsToCheck = [
  // Image 1
  "https://i8studio.vn/service/3d-animation",
  "https://i8studio.vn/animation",
  "https://i8studio.vn/service/3dcg-visualization",
  "https://i8studio.vn/en/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city",
  "https://i8studio.vn/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool",
  "https://i8studio.vn/en/service/www.linkedin.com/in/i8-studio",
  "https://i8studio.vn/en/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool",
  "https://i8studio.vn/pachinko-slot",
  "https://i8studio.vn/l465rgyua3",
  "https://i8studio.vn/pachinko-slot-qbc3ph24gt",
  // Image 2
  "https://i8studio.vn/cg",
  "https://i8studio.vn/bim",
  "https://i8studio.vn/kudochi-sauna",
  "https://i8studio.vn/blog-2",
  "https://i8studio.vn/apa-hotel",
  "https://i8studio.vn/vr",
  "https://i8studio.vn/3dcg",
  "https://i8studio.vn/hiroshima-gate-park-taisei-design-planners-architects-engineers",
  "https://i8studio.vn/en/animation",
  "https://i8studio.vn/neko-house",
  // Image 3
  "https://i8studio.vn/hotel-lobby",
  "https://i8studio.vn/en/3d-cg",
  "https://i8studio.vn/vr-rcxsqfh3zc",
  "https://i8studio.vn/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto",
  "https://i8studio.vn/club",
  "https://i8studio.vn/en/3dcg",
  "https://i8studio.vn/anime"
];

async function run() {
  const services = await prisma.service.findMany();
  const caseStudies = await prisma.caseStudy.findMany();
  const blogPosts = await prisma.blogPost.findMany();
  const posts = await prisma.post.findMany();
  const works = await prisma.work.findMany();
  const collections = await prisma.collection.findMany();

  console.log('--- Services in DB ---');
  services.forEach(s => console.log(`Service: ${s.slug} (${s.name})`));

  console.log('\n--- Case Studies in DB ---');
  caseStudies.forEach(c => console.log(`CaseStudy: ${c.slug} (${c.title})`));

  console.log('\n--- Blog Posts in DB ---');
  blogPosts.forEach(b => console.log(`BlogPost: ${b.slug} (${b.title})`));

  console.log('\n--- Posts (News/Blog) in DB ---');
  posts.forEach(p => console.log(`Post: [${p.category}] ${p.slug} (${p.title})`));

  console.log('\n--- Works sample in DB ---');
  works.slice(0, 10).forEach(w => console.log(`Work: ${w.id} - ${w.title} (${w.category})`));

  console.log('\n================ URL ANALYSIS ================');
  
  for (const urlStr of urlsToCheck) {
    const parsed = new URL(urlStr);
    const pathname = parsed.pathname; // e.g. /service/3d-animation, /animation, /en/...
    console.log(`\nURL: ${urlStr}`);
    console.log(`Path: ${pathname}`);
  }
}

run().finally(() => prisma.$disconnect());
