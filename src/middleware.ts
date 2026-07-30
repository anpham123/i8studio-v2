import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: ["en", "ja"],
  defaultLocale: "en",
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
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 301 redirect: legacy /blog → /blogs
  const blogRedirect = pathname.match(/^\/(en|ja)\/blog(?:\/(.*))?$/);
  if (blogRedirect) {
    const [, locale, rest] = blogRedirect;
    const dest = rest ? `/${locale}/blogs/${rest}` : `/${locale}/blogs`;
    return NextResponse.redirect(new URL(dest, request.url), 301);
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

