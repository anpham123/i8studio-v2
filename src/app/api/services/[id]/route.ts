import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServiceSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.service.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rawBody = await req.json();
    const parsed = ServiceSchema.partial().parse(rawBody);
    // Only update keys that were actually sent in the request body so Zod's .default() does not overwrite existing order/fields
    const data = Object.fromEntries(
      Object.entries(parsed).filter(([key]) => key in rawBody)
    );
    const item = await prisma.service.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: item });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
