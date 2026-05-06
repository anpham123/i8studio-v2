require("dotenv").config({ path: ".env.local" });

const LOCALES = ["en", "ja"];

const STATIC_PATHS = [
  "",
  "/news",
  "/blog",
  "/works",
  "/about-us",
  "/service",
  "/qa",
  "/case-studies",
  "/insights",
  "/contact",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://i8studio.vn",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api"] },
    ],
  },
  exclude: ["/admin", "/admin/*", "/api", "/api/*"],
  additionalPaths: async (config) => {
    const results = [];

    // Static locale pages
    for (const locale of LOCALES) {
      for (const path of STATIC_PATHS) {
        results.push(await config.transform(config, `/${locale}${path}`));
      }
    }

    // Dynamic routes from database
    try {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();

      const [posts, services, caseStudies] = await Promise.all([
        prisma.post.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, category: true, updatedAt: true },
        }),
        prisma.service.findMany({ select: { slug: true } }),
        prisma.caseStudy.findMany({ select: { slug: true } }),
      ]);

      for (const locale of LOCALES) {
        for (const post of posts) {
          const section = post.category === "NEWS" ? "news" : "blog";
          results.push(
            await config.transform(config, `/${locale}/${section}/${post.slug}`)
          );
        }
        for (const service of services) {
          results.push(
            await config.transform(config, `/${locale}/service/${service.slug}`)
          );
        }
        for (const cs of caseStudies) {
          results.push(
            await config.transform(config, `/${locale}/case-studies/${cs.slug}`)
          );
        }
      }

      await prisma.$disconnect();
    } catch {
      // DB may not be available at build time — dynamic routes skipped
    }

    return results;
  },
};
