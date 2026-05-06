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

export async function GET() {
  const events = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ data: events });
}
