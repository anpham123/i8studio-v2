import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QASchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await prisma.qA.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ data });
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = QASchema.parse(await req.json());
    const item = await prisma.qA.create({ data });
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
