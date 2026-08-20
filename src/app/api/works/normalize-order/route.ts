import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/works/normalize-order
 * Normalize homeOrder for all featured works to be sequential (1, 2, 3, ...)
 * This ensures consistency when works were featured before homeOrder was introduced.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Get all featured works with images, sorted by current order
    const works = await prisma.work.findMany({
      where: { featured: true, image: { not: "" } },
      orderBy: [{ homeOrder: "asc" }, { createdAt: "desc" }],
      select: { id: true, homeOrder: true },
    });

    // Check if normalization is needed (any duplicate or zero homeOrder)
    const orders = works.map((w) => w.homeOrder);
    const needsNormalize = orders.some((o) => o === 0) ||
      new Set(orders).size !== orders.length;

    if (!needsNormalize) {
      return NextResponse.json({ normalized: false, message: "Already normalized" });
    }

    // Reassign sequential homeOrder
    await Promise.all(
      works.map((work, idx) =>
        prisma.work.update({
          where: { id: work.id },
          data: { homeOrder: idx + 1 },
        })
      )
    );

    // Purge cache
    revalidatePath("/", "layout");

    return NextResponse.json({
      normalized: true,
      count: works.length,
      time: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to normalize" }, { status: 500 });
  }
}
