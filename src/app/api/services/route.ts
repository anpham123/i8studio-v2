import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServiceSchema } from "@/lib/validations";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ data });
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.slug && body.name) body.slug = slugify(body.name);
    const data = ServiceSchema.parse(body);
    const item = await prisma.service.create({ data });
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
