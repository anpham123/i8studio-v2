import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: ["ja", "en"],
  defaultLocale: "ja",
});

/**
 * Simple in-middleware rate limiter for login attempts.
 * Uses in-memory Map (resets on server restart, but sufficient for brute-force protection).
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min window
    return true;
  }

  if (entry.count >= 5) return false; // Max 5 attempts per 15 min
  entry.count++;
  return true;
}

// Cleanup stale entries every 10 minutes
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of Array.from(loginAttempts)) {
      if (now > entry.resetAt) loginAttempts.delete(key);
    }
  };
  // Use setInterval only in Node.js runtime
  if (typeof setInterval !== "undefined") {
    setInterval(cleanup, 10 * 60 * 1000);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit login attempts (POST to NextAuth credentials endpoint)
  if (pathname.startsWith("/api/auth/callback/credentials") && request.method === "POST") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    if (!checkLoginRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "i8studio-super-secret-key-2026-auth-session",
    });

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 410 Gone: Permanently deleted old URLs (instruct Googlebot to drop immediately)
  const normalizedPath = pathname.replace(/\/$/, "");
  const DELETED_PERMANENT_PATHS = new Set([
    "/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool",
    "/ja/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool",
    "/en/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool",
    "/ja/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool",
    "/en/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city",
    "/ja/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city",
    "/kudochi-sauna",
    "/ja/kudochi-sauna",
    "/en/kudochi-sauna",
    "/apa-hotel",
    "/ja/apa-hotel",
    "/en/apa-hotel",
    "/hiroshima-gate-park-taisei-design-planners-architects-engineers",
    "/ja/hiroshima-gate-park-taisei-design-planners-architects-engineers",
    "/en/hiroshima-gate-park-taisei-design-planners-architects-engineers",
    "/neko-house",
    "/ja/neko-house",
    "/en/neko-house",
    "/hotel-lobby",
    "/ja/hotel-lobby",
    "/en/hotel-lobby",
    "/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto",
    "/ja/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto",
    "/en/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto",
    "/club",
    "/ja/club",
    "/en/club",
    "/l465rgyua3",
    "/ja/l465rgyua3",
    "/en/l465rgyua3",
  ]);

  if (DELETED_PERMANENT_PATHS.has(normalizedPath)) {
    return new NextResponse(
      "<!DOCTYPE html><html><head><meta name=\"robots\" content=\"noindex, nofollow\" /><title>410 Gone</title></head><body style=\"font-family:sans-serif;text-align:center;padding:50px;\"><h1>410 Gone</h1><p>Trang này đã bị xóa vĩnh viễn / This page has been permanently removed.</p><a href=\"/\" style=\"color:#2563eb;\">Quay lại trang chủ (Home)</a></body></html>",
      {
        status: 410,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      }
    );
  }

  // 301 redirect: Malformed LinkedIn external link
  if (normalizedPath.includes("www.linkedin.com/in/i8-studio")) {
    return NextResponse.redirect("https://www.linkedin.com/in/i8-studio/", 301);
  }

  // 301 redirects: Legacy service / category routes to current routes
  const LEGACY_SERVICE_REDIRECTS: Record<string, string> = {
    "/service/3d-animation": "/ja/service/cg-video",
    "/ja/service/3d-animation": "/ja/service/cg-video",
    "/en/service/3d-animation": "/en/service/cg-video",
    "/animation": "/ja/service/cg-video",
    "/ja/animation": "/ja/service/cg-video",
    "/en/animation": "/en/service/cg-video",
    "/service/3dcg-visualization": "/ja/service/cg-perspective",
    "/ja/service/3dcg-visualization": "/ja/service/cg-perspective",
    "/en/service/3dcg-visualization": "/en/service/cg-perspective",
    "/3dcg": "/ja/service/cg-perspective",
    "/ja/3dcg": "/ja/service/cg-perspective",
    "/en/3dcg": "/en/service/cg-perspective",
    "/cg": "/ja/service/cg-perspective",
    "/ja/cg": "/ja/service/cg-perspective",
    "/en/cg": "/en/service/cg-perspective",
    "/en/3d-cg": "/en/service/cg-perspective",
    "/ja/3d-cg": "/ja/service/cg-perspective",
    "/bim": "/ja/service/bim-services",
    "/ja/bim": "/ja/service/bim-services",
    "/en/bim": "/en/service/bim-services",
    "/pachinko-slot": "/ja/service/pachinko-slot-cg",
    "/ja/pachinko-slot": "/ja/service/pachinko-slot-cg",
    "/en/pachinko-slot": "/en/service/pachinko-slot-cg",
    "/pachinko-slot-qbc3ph24gt": "/ja/service/pachinko-slot-cg",
    "/ja/pachinko-slot-qbc3ph24gt": "/ja/service/pachinko-slot-cg",
    "/en/pachinko-slot-qbc3ph24gt": "/en/service/pachinko-slot-cg",
    "/vr": "/ja/service/vr360",
    "/ja/vr": "/ja/service/vr360",
    "/en/vr": "/en/service/vr360",
    "/vr-rcxsqfh3zc": "/ja/service/vr360",
    "/ja/vr-rcxsqfh3zc": "/ja/service/vr360",
    "/en/vr-rcxsqfh3zc": "/en/service/vr360",
    "/anime": "/ja/service/anime-illustration",
    "/ja/anime": "/ja/service/anime-illustration",
    "/en/anime": "/en/service/anime-illustration",
    "/blog-2": "/ja/blogs",
    "/ja/blog-2": "/ja/blogs",
    "/en/blog-2": "/en/blogs",
  };

  if (LEGACY_SERVICE_REDIRECTS[normalizedPath]) {
    return NextResponse.redirect(
      new URL(LEGACY_SERVICE_REDIRECTS[normalizedPath], request.url),
      301
    );
  }

  // 301 redirect: legacy /blog → /blogs
  const blogRedirect = pathname.match(/^\/(en|ja)\/blog(?:\/(.*))?$/);
  if (blogRedirect) {
    const [, locale, rest] = blogRedirect;
    const dest = rest ? `/${locale}/blogs/${rest}` : `/${locale}/blogs`;
    return NextResponse.redirect(new URL(dest, request.url), 301);
  }

  // 301 redirect: /blogs?category=X → /blogs/route-name
  const blogCategoryRedirects: Record<string, string> = {
    "case-study": "case-study",
    "technique": "tips",
    "knowledge": "knowledge",
    "ai": "ai-feature",
    "life-gallery": "life-gallery",
  };
  const blogCatMatch = pathname.match(/^\/(en|ja)\/blogs$/);
  if (blogCatMatch) {
    const category = request.nextUrl.searchParams.get("category");
    if (category && blogCategoryRedirects[category]) {
      const [, locale] = blogCatMatch;
      return NextResponse.redirect(
        new URL(`/${locale}/blogs/${blogCategoryRedirects[category]}`, request.url),
        301
      );
    }
  }

  // Apply i18n middleware for public routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-default.jpg|uploads|.*\\..*).*)",
  ],
};

