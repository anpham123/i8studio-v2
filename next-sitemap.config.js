require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const LOCALES = ["ja", "en"];

const STATIC_PATHS = [
  "",
  "/works",
  "/solution",
  "/solution/photo-composite",
  "/price",
  "/about-us",
  "/about-us/portfolio",
  "/about-us/workflow",
  "/contact",
  "/blogs",
  "/blogs/case-study",
  "/blogs/tips",
  "/blogs/knowledge",
  "/blogs/ai-feature",
  "/blogs/life-gallery",
  "/news",
  "/qa",
  "/insights",
  "/service",
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
    const siteUrl = config.siteUrl || "https://i8studio.vn";
    const isJa = path.startsWith("/ja");

    // Lấy route gốc bỏ tiền tố ngôn ngữ để tạo cặp thẻ song ngữ hreflang
    let cleanPath = path;
    if (path.startsWith("/ja")) {
      cleanPath = path.substring(3);
    } else if (path.startsWith("/en")) {
      cleanPath = path.substring(3);
    }
    if (!cleanPath.startsWith("/")) {
      cleanPath = cleanPath ? `/${cleanPath}` : "";
    }
    if (cleanPath === "/") {
      cleanPath = "";
    }

    const jaUrl = `${siteUrl}/ja${cleanPath}`;
    const enUrl = `${siteUrl}/en${cleanPath}`;

    return {
      loc: path,
      changefreq: config.changefreq || "daily",
      priority: isJa ? 1.0 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: jaUrl,
          hreflang: "ja",
          hrefIsAbsolute: true,
        },
        {
          href: enUrl,
          hreflang: "en",
          hrefIsAbsolute: true,
        },
        {
          href: jaUrl,
          hreflang: "x-default",
          hrefIsAbsolute: true,
        },
      ],
    };
  },
  additionalPaths: async (config) => {
    const results = [];
    const siteUrl = config.siteUrl || "https://i8studio.vn";

    // Hàm chuyển đổi đường dẫn ảnh thành URL đối tượng hợp lệ của next-sitemap
    // Tránh in ra chữ "undefined" do next-sitemap đọc thuộc tính .href của URL
    const toImageEntry = (imgUrl) => {
      if (!imgUrl || typeof imgUrl !== "string") return null;
      const trimmed = imgUrl.trim();
      if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
      try {
        const fullUrl =
          trimmed.startsWith("http://") || trimmed.startsWith("https://")
            ? trimmed
            : `${siteUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
        return { loc: new URL(fullUrl) };
      } catch {
        return null;
      }
    };

    // 1. Các trang tĩnh cho từng ngôn ngữ
    for (const locale of LOCALES) {
      for (const path of STATIC_PATHS) {
        const item = await config.transform(config, `/${locale}${path}`);
        if (path === "" || path === "/blogs" || path === "/works") {
          const ogImg = toImageEntry("/og-default.jpg");
          if (ogImg) item.images = [ogImg];
        }
        results.push(item);
      }
    }

    // 2. Tự động truy vấn toàn bộ nội dung động đã publish từ Database / CMS
    try {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();

      const [services, blogPosts, posts, caseStudies, collections] = await Promise.all([
        prisma.service.findMany({
          where: { isPublished: true },
          select: { slug: true, image: true, heroImage: true, createdAt: true },
        }),
        prisma.blogPost.findMany({
          where: { isPublished: true },
          select: { slug: true, coverImage: true, heroImage: true, sections: true, updatedAt: true },
        }),
        prisma.post.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, category: true, coverImage: true, updatedAt: true },
        }),
        prisma.caseStudy.findMany({
          select: { slug: true, beforeImage: true, afterImage: true, createdAt: true },
        }),
        prisma.collection.findMany({
          where: { active: true },
          select: { slug: true, coverImage: true, createdAt: true },
        }),
      ]);

      for (const locale of LOCALES) {
        // Dịch vụ (Service & Solution detail)
        for (const service of services) {
          const serviceItem = await config.transform(config, `/${locale}/service/${service.slug}`);
          const solutionItem = await config.transform(config, `/${locale}/solution/${service.slug}`);

          if (service.createdAt) {
            serviceItem.lastmod = new Date(service.createdAt).toISOString();
            solutionItem.lastmod = new Date(service.createdAt).toISOString();
          }

          const imgs = [service.image, service.heroImage]
            .map(toImageEntry)
            .filter(Boolean);
          if (imgs.length > 0) {
            serviceItem.images = imgs;
            solutionItem.images = imgs;
          }

          results.push(serviceItem);
          results.push(solutionItem);
        }

        // Bài viết Blog từ CMS
        for (const bp of blogPosts) {
          const item = await config.transform(config, `/${locale}/blogs/${bp.slug}`);
          if (bp.updatedAt) {
            item.lastmod = new Date(bp.updatedAt).toISOString();
          }

          const blogImgs = [];
          if (bp.coverImage) blogImgs.push(bp.coverImage);
          if (bp.heroImage && bp.heroImage !== bp.coverImage) blogImgs.push(bp.heroImage);
          try {
            const secList = JSON.parse(bp.sections || "[]");
            for (const sec of secList) {
              if (sec.image) blogImgs.push(sec.image);
            }
          } catch {}

          const validBlogImgs = blogImgs.map(toImageEntry).filter(Boolean);
          if (validBlogImgs.length > 0) {
            item.images = validBlogImgs.slice(0, 10);
          }
          results.push(item);
        }

        // Tin tức / Bài viết Post
        for (const post of posts) {
          const section = post.category === "NEWS" ? "news" : "blogs";
          const item = await config.transform(config, `/${locale}/${section}/${post.slug}`);
          if (post.updatedAt) {
            item.lastmod = new Date(post.updatedAt).toISOString();
          }
          if (post.coverImage) {
            const postImg = toImageEntry(post.coverImage);
            if (postImg) item.images = [postImg];
          }
          results.push(item);
        }

        // Case Studies
        for (const cs of caseStudies) {
          const item = await config.transform(config, `/${locale}/case-studies/${cs.slug}`);
          if (cs.createdAt) {
            item.lastmod = new Date(cs.createdAt).toISOString();
          }
          const csImgs = [cs.beforeImage, cs.afterImage].map(toImageEntry).filter(Boolean);
          if (csImgs.length > 0) item.images = csImgs;
          results.push(item);
        }

        // Collections
        for (const col of collections) {
          const item = await config.transform(config, `/${locale}/collection/${encodeURIComponent(col.slug)}`);
          if (col.coverImage) {
            const colImg = toImageEntry(col.coverImage);
            if (colImg) item.images = [colImg];
          }
          results.push(item);
        }
      }

      await prisma.$disconnect();
    } catch {
      // Trường hợp DB chưa sẵn sàng khi build, Next.js vẫn build bình thường mà không bị crash
    }

    // Loại bỏ các URL trùng lặp (nếu có)
    const seen = new Set();
    const uniqueResults = [];
    for (const item of results) {
      if (!seen.has(item.loc)) {
        seen.add(item.loc);
        uniqueResults.push(item);
      }
    }

    return uniqueResults;
  },
};
