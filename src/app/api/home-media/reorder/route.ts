import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/home-media/reorder
 * Body: { items: [{ id: string, order: number }] }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    await Promise.all(
      items.map((item: { id: string; order: number }) =>
        prisma.homeMedia.update({ where: { id: item.id }, data: { order: item.order } })
      )
    );

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
