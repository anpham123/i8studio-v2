import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  localeDetection: false,
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

  const normalizedPath = pathname.replace(/\/$/, "");

  // 301 redirect: Malformed LinkedIn external link
  if (normalizedPath.includes("linkedin.com/in/i8-studio")) {
    return NextResponse.redirect("https://www.linkedin.com/in/i8-studio/", 301);
  }

  // 301 redirects: Legacy routes, old services, deleted projects to current active pages
  const LEGACY_URL_REDIRECTS: Record<string, string> = {
    // 1. Missing / New 404 Routes
    "/market-news": "/ja/news",
    "/ja/market-news": "/ja/news",
    "/en/market-news": "/en/news",
    "/vr360": "/ja/service/vr360",
    "/ja/vr360": "/ja/service/vr360",
    "/en/vr360": "/en/service/vr360",
    "/bim-rxiepcax4z": "/ja/service/bim-services",
    "/ja/bim-rxiepcax4z": "/ja/service/bim-services",
    "/en/bim-rxiepcax4z": "/en/service/bim-services",

    // 2. Deleted projects / portfolio items -> redirect to Works page
    "/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool": "/ja/works",
    "/ja/hotel-mokurea-on-kouri-island-okinawa-all-rooms-have-ocean-views-and-terraces-and-an-infinity-pool": "/ja/works",
    "/en/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool": "/en/works",
    "/ja/hotel-moclea-in-kouri-island-okinawa-all-rooms-with-ocean-views-and-terraces-featuring-an-infinity-pool": "/ja/works",
    "/en/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city": "/en/works",
    "/ja/residence-design-that-luxuriously-embraces-the-nature-of-miura-harmonizing-elegantly-with-the-city": "/ja/works",
    "/kudochi-sauna": "/ja/works",
    "/ja/kudochi-sauna": "/ja/works",
    "/en/kudochi-sauna": "/en/works",
    "/apa-hotel": "/ja/works",
    "/ja/apa-hotel": "/ja/works",
    "/en/apa-hotel": "/en/works",
    "/hiroshima-gate-park-taisei-design-planners-architects-engineers": "/ja/works",
    "/ja/hiroshima-gate-park-taisei-design-planners-architects-engineers": "/ja/works",
    "/en/hiroshima-gate-park-taisei-design-planners-architects-engineers": "/en/works",
    "/neko-house": "/ja/works",
    "/ja/neko-house": "/ja/works",
    "/en/neko-house": "/en/works",
    "/hotel-lobby": "/ja/works",
    "/ja/hotel-lobby": "/ja/works",
    "/en/hotel-lobby": "/en/works",
    "/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto": "/ja/works",
    "/ja/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto": "/ja/works",
    "/en/we-pursue-new-ways-of-living-while-cherishing-the-rich-nature-that-is-unique-to-shimamoto": "/en/works",
    "/club": "/ja/works",
    "/ja/club": "/ja/works",
    "/en/club": "/en/works",
    "/l465rgyua3": "/ja",
    "/ja/l465rgyua3": "/ja",
    "/en/l465rgyua3": "/en",

    // 3. Legacy service / category routes to current routes
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

  if (LEGACY_URL_REDIRECTS[normalizedPath]) {
    return NextResponse.redirect(
      new URL(LEGACY_URL_REDIRECTS[normalizedPath], request.url),
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

