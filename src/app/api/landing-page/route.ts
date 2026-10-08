import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LANDING_SECTIONS,
  getLandingLayoutConfig,
  saveLandingLayoutConfig,
} from "@/lib/landingpage-data";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const layoutConfig = await getLandingLayoutConfig();

    const hasModel = "landingPageSection" in prisma;
    const dbSections = hasModel
      ? await (prisma as any).landingPageSection.findMany()
      : await prisma.$queryRawUnsafe("SELECT * FROM LandingPageSection").catch(() => []);
    const map = new Map((dbSections as any[]).map((s) => [s.sectionKey, s]));

    // Sắp xếp các sections theo layoutConfig.order
    const sectionsWithMeta = LANDING_SECTIONS.map((sec) => {
      const dbItem = map.get(sec.key);
      const orderIndex = layoutConfig.order.indexOf(sec.key);
      return {
        ...sec,
        order: orderIndex !== -1 ? orderIndex + 1 : sec.order,
        backgroundColor: layoutConfig.backgroundColors[sec.key] || "#0b0d11",
        visible: layoutConfig.visible[sec.key] !== false,
        isCustomized: !!dbItem,
        updatedAt: dbItem?.updatedAt ? new Date(dbItem.updatedAt).toISOString() : null,
      };
    });

    sectionsWithMeta.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      data: sectionsWithMeta,
      layoutConfig,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load sections" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updatedLayout = await saveLandingLayoutConfig(body);

    try {
      revalidatePath("/[locale]/landingpage", "page");
      revalidatePath("/ja/landingpage", "page");
      revalidatePath("/en/landingpage", "page");
      revalidatePath("/landingpage", "page");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      data: updatedLayout,
      message: "Đã lưu thứ tự và màu nền các Section thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update layout" },
      { status: 500 }
    );
  }
}

