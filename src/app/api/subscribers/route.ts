import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic"

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional().default(""),
  source: z.enum(["EXIT_POPUP", "FOOTER", "INLINE", "INSIGHTS"]).optional().default("INLINE"),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const subs = await prisma.emailSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: subs });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limit subscription attempts
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`subscribers:${ip}`, RATE_LIMITS.FORM_SUBMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const sub = await prisma.emailSubscriber.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });
    return NextResponse.json({ data: sub }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
