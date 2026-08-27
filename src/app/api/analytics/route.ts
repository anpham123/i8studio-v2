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

  // Group by channel — return traffic distribution across social & search channels
  if (groupBy === "channel") {
    const events = await prisma.analyticsEvent.findMany({
      where,
      select: { metadata: true, createdAt: true },
    });

    const channelCounts: Record<string, number> = {
      facebook: 0,
      instagram: 0,
      linkedin: 0,
      youtube: 0,
      google: 0,
      direct: 0,
      other: 0,
    };

    for (const e of events) {
      let ch = "direct";
      try {
        if (e.metadata) {
          const meta = typeof e.metadata === "string" ? JSON.parse(e.metadata) : e.metadata;
          if (meta.channel) {
            ch = meta.channel.toLowerCase();
          } else if (meta.referrer) {
            const r = meta.referrer.toLowerCase();
            if (r.includes("facebook") || r.includes("fb.me")) ch = "facebook";
            else if (r.includes("instagram")) ch = "instagram";
            else if (r.includes("linkedin") || r.includes("lnkd.in")) ch = "linkedin";
            else if (r.includes("youtube") || r.includes("youtu.be")) ch = "youtube";
            else if (r.includes("google") || r.includes("bing") || r.includes("yahoo")) ch = "google";
            else ch = "other";
          }
        }
      } catch {
        ch = "direct";
      }

      if (channelCounts[ch] !== undefined) {
        channelCounts[ch]++;
      } else {
        channelCounts["other"]++;
      }
    }

    const total = events.length;
    const channels = [
      { key: "facebook", name: "Facebook", icon: "📘", count: channelCounts.facebook, pct: total ? Math.round((channelCounts.facebook / total) * 100) : 0 },
      { key: "instagram", name: "Instagram", icon: "📸", count: channelCounts.instagram, pct: total ? Math.round((channelCounts.instagram / total) * 100) : 0 },
      { key: "linkedin", name: "LinkedIn", icon: "💼", count: channelCounts.linkedin, pct: total ? Math.round((channelCounts.linkedin / total) * 100) : 0 },
      { key: "youtube", name: "YouTube", icon: "▶️", count: channelCounts.youtube, pct: total ? Math.round((channelCounts.youtube / total) * 100) : 0 },
      { key: "google", name: "Google / Search", icon: "🔍", count: channelCounts.google, pct: total ? Math.round((channelCounts.google / total) * 100) : 0 },
      { key: "direct", name: "Trực tiếp / Direct", icon: "🌐", count: channelCounts.direct, pct: total ? Math.round((channelCounts.direct / total) * 100) : 0 },
      { key: "other", name: "Kênh khác / Other", icon: "📝", count: channelCounts.other, pct: total ? Math.round((channelCounts.other / total) * 100) : 0 },
    ];

    return NextResponse.json({ data: channels, total });
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
