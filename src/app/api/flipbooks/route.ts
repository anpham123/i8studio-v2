import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FlipbookSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  const where = session ? {} : { active: true };
  const data = await prisma.flipbook.findMany({ where, orderBy: { order: "asc" } });
  return NextResponse.json({ data });
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = FlipbookSchema.parse(await req.json());
    const item = await prisma.flipbook.create({ data });
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
