import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic"

const ALLOWED_EVENT_TYPES = ["pageview", "click", "scroll", "form_submit", "video_play", "download"];

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(`analytics:${ip}`, RATE_LIMITS.ANALYTICS);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    });
  }

  try {
    const { type, page, metadata } = await req.json();

    // Validate event type
    if (!type || typeof type !== "string" || !ALLOWED_EVENT_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // Validate page length
    if (page && (typeof page !== "string" || page.length > 500)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: { type, page: page || "", metadata: JSON.stringify(metadata || {}) },
    });
    return NextResponse.json({ success: true }, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Require authentication to view analytics
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const type = searchParams.get("type"); // optional filter e.g. "pageview"
  const groupBy = searchParams.get("groupBy"); // "day" | "page"

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (type) where.type = type;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  // Group by day — return daily counts
  if (groupBy === "day") {
    const events = await prisma.analyticsEvent.findMany({
      where,
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Bucket by date string (YYYY-MM-DD)
    const buckets: Record<string, number> = {};
    for (const e of events) {
      const d = e.createdAt.toISOString().slice(0, 10);
      buckets[d] = (buckets[d] || 0) + 1;
    }

    return NextResponse.json({
      data: Object.entries(buckets).map(([date, count]) => ({ date, count })),
      total: events.length,
    });
  }

  // Group by page — return top pages
  if (groupBy === "page") {
    const events = await prisma.analyticsEvent.findMany({
      where,
      select: { page: true },
    });

    const pageCounts: Record<string, number> = {};
    for (const e of events) {
      const p = e.page || "(unknown)";
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    }

    const sorted = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({ data: sorted });
  }

  // Default: return raw events
  const events = await prisma.analyticsEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ data: events, total: events.length });
}
