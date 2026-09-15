require("dotenv").config({ path: ".env.local" });

const LOCALES = ["ja", "en"];

const STATIC_PATHS = [
  "",
  "/news",
  "/blogs",
  "/works",
  "/about-us",
  "/service",
  "/solution",
  "/solution/photo-composite",
  "/qa",
  "/case-studies",
  "/insights",
  "/contact",
  "/price",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://i8studio.vn",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Cohere-ai", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
    ],
  },
  exclude: ["/admin", "/admin/*", "/api", "/api/*"],
  transform: async (config, path) => {
    const isJa = path.startsWith("/ja");
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: isJa ? 1.0 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  additionalPaths: async (config) => {
    const results = [];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://i8studio.vn";

    const toAbs = (url) => {
      if (!url) return null;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      return `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    // Static locale pages
    for (const locale of LOCALES) {
      for (const path of STATIC_PATHS) {
        const item = await config.transform(config, `/${locale}${path}`);
        if (path === "" || path === "/blogs" || path === "/works") {
          item.images = [{ loc: `${siteUrl}/og-default.jpg` }];
        }
        results.push(item);
      }
    }

    // Dynamic routes from database with images
    try {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();

      const [posts, services, caseStudies, blogPosts] = await Promise.all([
        prisma.post.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, category: true, thumbnail: true, updatedAt: true },
        }),
        prisma.service.findMany({
          select: { slug: true, thumbnail: true, heroImage: true },
        }),
        prisma.caseStudy.findMany({
          select: { slug: true, thumbnail: true, heroImage: true },
        }),
        prisma.blogPost.findMany({
          where: { isPublished: true },
          select: { slug: true, coverImage: true, heroImage: true, sections: true, updatedAt: true },
        }),
      ]);

      for (const locale of LOCALES) {
        for (const post of posts) {
          const section = post.category === "NEWS" ? "news" : "blog";
          const item = await config.transform(config, `/${locale}/${section}/${post.slug}`);
          if (post.thumbnail) {
            item.images = [{ loc: toAbs(post.thumbnail) }];
          }
          results.push(item);
        }
        for (const service of services) {
          const item = await config.transform(config, `/${locale}/service/${service.slug}`);
          const imgs = [service.thumbnail, service.heroImage].filter(Boolean).map((img) => ({ loc: toAbs(img) }));
          if (imgs.length > 0) item.images = imgs;
          results.push(item);
        }
        for (const cs of caseStudies) {
          const item = await config.transform(config, `/${locale}/case-studies/${cs.slug}`);
          const imgs = [cs.thumbnail, cs.heroImage].filter(Boolean).map((img) => ({ loc: toAbs(img) }));
          if (imgs.length > 0) item.images = imgs;
          results.push(item);
        }
        for (const bp of blogPosts) {
          const item = await config.transform(config, `/${locale}/blogs/${bp.slug}`);
          const blogImgs = [];
          if (bp.coverImage) blogImgs.push({ loc: toAbs(bp.coverImage) });
          if (bp.heroImage && bp.heroImage !== bp.coverImage) blogImgs.push({ loc: toAbs(bp.heroImage) });
          try {
            const secList = JSON.parse(bp.sections || "[]");
            for (const sec of secList) {
              if (sec.image) blogImgs.push({ loc: toAbs(sec.image) });
            }
          } catch {}
          if (blogImgs.length > 0) item.images = blogImgs.slice(0, 10);
          results.push(item);
        }
      }

      await prisma.$disconnect();
    } catch {
      // DB may not be available at build time — dynamic routes skipped
    }

    return results;
  },
};

