import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSectionData, getDefaultSectionData } from "@/lib/landingpage-data";

export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  { params }: { params: { sectionKey: string } }
) {
  try {
    const { sectionKey } = params;
    const data = await getSectionData(sectionKey);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load section" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { sectionKey: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sectionKey } = params;
    const body = await req.json();
    const { contentEn, contentJa } = body;

    const enStr = typeof contentEn === "string" ? contentEn : JSON.stringify(contentEn || {});
    const jaStr = typeof contentJa === "string" ? contentJa : JSON.stringify(contentJa || {});

    let updated: any = null;
    if ("landingPageSection" in prisma) {
      updated = await (prisma as any).landingPageSection.upsert({
        where: { sectionKey },
        update: {
          contentEn: enStr,
          contentJa: jaStr,
        },
        create: {
          sectionKey,
          contentEn: enStr,
          contentJa: jaStr,
        },
      });
    } else {
      const now = new Date().toISOString();
      const existing: any = await (prisma as any).$queryRawUnsafe(
        "SELECT id FROM LandingPageSection WHERE sectionKey = ? LIMIT 1",
        sectionKey
      ).catch(() => []);

      if (existing && existing.length > 0) {
        await (prisma as any).$executeRawUnsafe(
          "UPDATE LandingPageSection SET contentEn = ?, contentJa = ?, updatedAt = ? WHERE sectionKey = ?",
          enStr, jaStr, now, sectionKey
        );
      } else {
        const id = `lps_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await (prisma as any).$executeRawUnsafe(
          "INSERT INTO LandingPageSection (id, sectionKey, contentEn, contentJa, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
          id, sectionKey, enStr, jaStr, now, now
        );
      }
      updated = {
        sectionKey,
        contentEn: enStr,
        contentJa: jaStr,
        updatedAt: new Date(),
      };
    }

    // Revalidate paths for landing pages
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
      data: {
        sectionKey: updated.sectionKey,
        contentEn: JSON.parse(updated.contentEn),
        contentJa: JSON.parse(updated.contentJa),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Failed to update section:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save section" },
      { status: 500 }
    );
  }
}
