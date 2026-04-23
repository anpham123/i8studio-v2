import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FlipbookSchema } from "@/lib/validations";
import { z } from "zod";
import { unlink } from "fs/promises";
import { join } from "path";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.flipbook.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = FlipbookSchema.partial().parse(await req.json());
    const item = await prisma.flipbook.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: item });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const item = await prisma.flipbook.findUnique({ where: { id: params.id } });
  if (item?.pdfUrl) {
    try {
      await unlink(join(process.cwd(), "public", item.pdfUrl));
    } catch {}
  }
  await prisma.flipbook.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
