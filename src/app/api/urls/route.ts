import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Danh sách 27 URLs gặp lỗi 404 từ Google Search Console
const GSC_404_URLS = [
  {
    url: "https://i8studio.vn/service/3d-animation",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Cấu trúc link cũ thiếu mã ngôn ngữ và sai slug dịch vụ.",
    suggestedRedirect: "/ja/service/cg-video",
    currentEquivalent: "/ja/service/cg-video & /en/service/cg-video",
  },
  {
    url: "https://i8studio.vn/animation",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ cấp root. Hệ thống hiện tại dùng route /service/cg-video.",
    suggestedRedirect: "/ja/service/cg-video",
    currentEquivalent: "/ja/service/cg-video",
  },
  {
    url: "https://i8studio.vn/service/3dcg-visualization",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Slug cũ 3dcg-visualization. Slug chuẩn hiện tại là cg-perspective.",
    suggestedRedirect: "/ja/service/cg-perspective",
    currentEquivalent: "/ja/service/cg-perspective",
  },
  {
    url: "https://i8studio.vn/en/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city",
    status: "KHONG_CO",
    statusLabel: "Không có (Bài viết/Dự án cũ đã xóa)",
    reason: "Dự án cũ trên bản web trước, hiện không còn trong database mới.",
    suggestedRedirect: "/en/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool",
    status: "KHONG_CO",
    statusLabel: "Không có (Bài viết/Dự án cũ đã xóa)",
    reason: "Dự án cũ trên bản web trước, hiện không còn trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/en/service/www.linkedin.com/in/i8-studio",
    status: "SAI_CU_PHAP",
    statusLabel: "Sai cú pháp URL (Lỗi link ngoài bị hiểu là link nội bộ)",
    reason: "Do link LinkedIn bên ngoài thiếu tiền tố https:// nên trình duyệt hiểu nhầm là link con của /en/service/.",
    suggestedRedirect: "https://www.linkedin.com/in/i8-studio/",
    currentEquivalent: "https://www.linkedin.com/in/i8-studio/",
  },
  {
    url: "https://i8studio.vn/en/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ tiếng Anh đã xóa)",
    reason: "Dự án cũ trên bản web trước, hiện không còn trong database mới.",
    suggestedRedirect: "/en/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/pachinko-slot",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ. Slug dịch vụ Pachinko & Slot chuẩn hiện tại là /service/pachinko-slot-cg.",
    suggestedRedirect: "/ja/service/pachinko-slot-cg",
    currentEquivalent: "/ja/service/pachinko-slot-cg",
  },
  {
    url: "https://i8studio.vn/l465rgyua3",
    status: "KHONG_CO",
    statusLabel: "Không có (Link rác / ID tạm thời cũ)",
    reason: "Slug rác hoặc URL thử nghiệm từ web cũ, không có nội dung.",
    suggestedRedirect: "/ja",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/pachinko-slot-qbc3ph24gt",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Slug tự sinh cũ của mục Pachinko Slot.",
    suggestedRedirect: "/ja/service/pachinko-slot-cg",
    currentEquivalent: "/ja/service/pachinko-slot-cg",
  },
  {
    url: "https://i8studio.vn/cg",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ cấp root. Trang dịch vụ chuẩn là /ja/service/cg-perspective.",
    suggestedRedirect: "/ja/service/cg-perspective",
    currentEquivalent: "/ja/service/cg-perspective",
  },
  {
    url: "https://i8studio.vn/bim",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ. Dịch vụ BIM chuẩn hiện tại là /ja/service/bim-services.",
    suggestedRedirect: "/ja/service/bim-services",
    currentEquivalent: "/ja/service/bim-services",
  },
  {
    url: "https://i8studio.vn/kudochi-sauna",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/blog-2",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Đường dẫn phân trang cũ của blog WordPress cũ. Trang blog hiện tại là /ja/blogs.",
    suggestedRedirect: "/ja/blogs",
    currentEquivalent: "/ja/blogs",
  },
  {
    url: "https://i8studio.vn/apa-hotel",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/vr",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ. Trang dịch vụ VR hiện tại là /ja/service/vr360.",
    suggestedRedirect: "/ja/service/vr360",
    currentEquivalent: "/ja/service/vr360",
  },
  {
    url: "https://i8studio.vn/3dcg",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ. Dịch vụ 3DCG hiện tại là /ja/service/cg-perspective.",
    suggestedRedirect: "/ja/service/cg-perspective",
    currentEquivalent: "/ja/service/cg-perspective",
  },
  {
    url: "https://i8studio.vn/hiroshima-gate-park-taisei-design-planners-architects-engineers",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/en/animation",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route tiếng Anh cũ của Animation. Link chuẩn là /en/service/cg-video.",
    suggestedRedirect: "/en/service/cg-video",
    currentEquivalent: "/en/service/cg-video",
  },
  {
    url: "https://i8studio.vn/neko-house",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/hotel-lobby",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới (Hiện có Big Lobby, Origami Lobby).",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/en/3d-cg",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route tiếng Anh cũ của 3D CG. Link chuẩn là /en/service/cg-perspective.",
    suggestedRedirect: "/en/service/cg-perspective",
    currentEquivalent: "/en/service/cg-perspective",
  },
  {
    url: "https://i8studio.vn/vr-rcxsqfh3zc",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Slug tự sinh cũ của VR. Link chuẩn là /ja/service/vr360.",
    suggestedRedirect: "/ja/service/vr360",
    currentEquivalent: "/ja/service/vr360",
  },
  {
    url: "https://i8studio.vn/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto",
    status: "KHONG_CO",
    statusLabel: "Không có (Bài viết/Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/club",
    status: "KHONG_CO",
    statusLabel: "Không có (Dự án cũ đã xóa)",
    reason: "Dự án cũ không có trong database mới.",
    suggestedRedirect: "/ja/works",
    currentEquivalent: null,
  },
  {
    url: "https://i8studio.vn/en/3dcg",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route tiếng Anh cũ của 3DCG. Link chuẩn là /en/service/cg-perspective.",
    suggestedRedirect: "/en/service/cg-perspective",
    currentEquivalent: "/en/service/cg-perspective",
  },
  {
    url: "https://i8studio.vn/anime",
    status: "SAI_CAN_REDIRECT",
    statusLabel: "Sai đường dẫn (Cần Redirect 301)",
    reason: "Route cũ. Dịch vụ Anime chuẩn hiện tại là /ja/service/anime-illustration.",
    suggestedRedirect: "/ja/service/anime-illustration",
    currentEquivalent: "/ja/service/anime-illustration",
  },
];

const LOCALES = ["ja", "en"];
const STATIC_PAGES = [
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
];

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://i8studio.vn";

    // 1. Lấy dữ liệu động từ Database
    const [services, blogPosts, posts, caseStudies, collections] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        select: { slug: true, name: true, nameJa: true },
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, title: true, titleJp: true },
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, title: true, category: true },
      }),
      prisma.caseStudy.findMany({
        select: { slug: true, title: true, titleJa: true },
      }),
      prisma.collection.findMany({
        where: { active: true },
        select: { slug: true, titleJa: true, titleEn: true },
      }),
    ]);

    // 2. Tổng hợp tất cả active URLs trên hệ thống
    const activeUrls: Array<{ url: string; type: string; title: string }> = [];

    // Static pages
    for (const locale of LOCALES) {
      for (const p of STATIC_PAGES) {
        activeUrls.push({
          url: `${baseUrl}/${locale}${p}`,
          type: "Static Page",
          title: `${locale.toUpperCase()} - ${p || "Trang chủ"}`,
        });
      }
    }

    // Dynamic services
    for (const locale of LOCALES) {
      for (const s of services) {
        activeUrls.push({
          url: `${baseUrl}/${locale}/service/${s.slug}`,
          type: "Service Detail",
          title: locale === "ja" ? (s.nameJa || s.name) : s.name,
        });
      }
    }

    // Dynamic blog posts
    for (const locale of LOCALES) {
      for (const bp of blogPosts) {
        activeUrls.push({
          url: `${baseUrl}/${locale}/blogs/${bp.slug}`,
          type: "Blog Post",
          title: locale === "ja" ? (bp.titleJp || bp.title) : bp.title,
        });
      }
    }

    // Dynamic news posts
    for (const locale of LOCALES) {
      for (const post of posts) {
        const path = post.category === "NEWS" ? "news" : "blogs";
        activeUrls.push({
          url: `${baseUrl}/${locale}/${path}/${post.slug}`,
          type: "News / Post",
          title: post.title,
        });
      }
    }

    // Dynamic case studies
    for (const locale of LOCALES) {
      for (const cs of caseStudies) {
        activeUrls.push({
          url: `${baseUrl}/${locale}/case-studies/${cs.slug}`,
          type: "Case Study",
          title: locale === "ja" ? (cs.titleJa || cs.title) : cs.title,
        });
      }
    }

    // Dynamic collections
    for (const locale of LOCALES) {
      for (const col of collections) {
        activeUrls.push({
          url: `${baseUrl}/${locale}/collection/${encodeURIComponent(col.slug)}`,
          type: "Collection",
          title: locale === "ja" ? col.titleJa : col.titleEn,
        });
      }
    }

    // 3. Phân loại tổng kết GSC URLs
    const summary = {
      totalGscErrors: GSC_404_URLS.length,
      saiCanRedirect: GSC_404_URLS.filter((u) => u.status === "SAI_CAN_REDIRECT").length,
      khongCoDaXoa: GSC_404_URLS.filter((u) => u.status === "KHONG_CO").length,
      saiCuPhap: GSC_404_URLS.filter((u) => u.status === "SAI_CU_PHAP").length,
      totalActiveSystemUrls: activeUrls.length,
    };

    return NextResponse.json(
      {
        success: true,
        summary,
        gsc404UrlsAnalysis: GSC_404_URLS,
        activeSystemUrls: activeUrls,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
