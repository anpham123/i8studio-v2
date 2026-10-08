import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HomeMediaSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.homeMedia.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // Auto-assign order to end
    const maxOrder = await prisma.homeMedia.aggregate({ _max: { order: true } });
    const data = HomeMediaSchema.parse(await req.json());
    data.order = (maxOrder._max.order || 0) + 1;
    const item = await prisma.homeMedia.create({ data });
    revalidatePath("/", "layout");
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }
    await prisma.homeMedia.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, count: ids.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

