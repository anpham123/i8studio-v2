import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WorkSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const category = searchParams.get("category") || "";
  const where = { ...(category && { category }) };
  const [data, total] = await Promise.all([
    prisma.work.findMany({ where, orderBy: { order: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.work.count({ where }),
  ]);
  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = WorkSchema.parse(await req.json());
    const work = await prisma.work.create({ data });
    return NextResponse.json({ data: work }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
