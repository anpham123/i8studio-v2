import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LANDING_SECTIONS } from "@/lib/landingpage-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hasModel = "landingPageSection" in prisma;
    console.log("hasModel landingPageSection:", hasModel, "prisma keys:", Object.keys(prisma));
    const dbSections = hasModel
      ? await (prisma as any).landingPageSection.findMany()
      : await prisma.$queryRawUnsafe("SELECT * FROM LandingPageSection").catch(() => []);
    const map = new Map((dbSections as any[]).map((s) => [s.sectionKey, s]));

    const result = LANDING_SECTIONS.map((sec) => {
      const dbItem = map.get(sec.key);
      return {
        ...sec,
        isCustomized: !!dbItem,
        updatedAt: dbItem?.updatedAt.toISOString() || null,
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load sections" },
      { status: 500 }
    );
  }
}
