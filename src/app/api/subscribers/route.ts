import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic"

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional().default(""),
  source: z.enum(["EXIT_POPUP", "FOOTER", "INLINE"]).optional().default("INLINE"),
});

export async function GET() {
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
