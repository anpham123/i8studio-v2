import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { type, page, metadata } = await req.json();
    await prisma.analyticsEvent.create({
      data: { type, page: page || "", metadata: JSON.stringify(metadata || {}) },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
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
