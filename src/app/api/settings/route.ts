import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET() {
  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json({ data: map }, {
    headers: { "Cache-Control": "no-store" },
  });
}

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import sharp from "sharp";

async function syncStaticFaviconFiles() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["faviconImage", "logoImage"] } },
    });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    const publicDir = path.join(process.cwd(), "public");
    const candidates = [map.faviconImage, map.logoImage, "/images/logo.webp"].filter(
      Boolean
    ) as string[];

    let srcPath: string | null = null;
    for (const candidate of candidates) {
      const resolved = path.resolve(path.join(publicDir, candidate));
      if (resolved.startsWith(path.resolve(publicDir)) && fs.existsSync(resolved)) {
        srcPath = resolved;
        break;
      }
    }
    if (!srcPath) return;

    const png48 = await sharp(srcPath)
      .resize(48, 48, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    const icoHeader = Buffer.alloc(22);
    icoHeader.writeUInt16LE(0, 0);
    icoHeader.writeUInt16LE(1, 2);
    icoHeader.writeUInt16LE(1, 4);
    icoHeader.writeUInt8(48, 6);
    icoHeader.writeUInt8(48, 7);
    icoHeader.writeUInt8(0, 8);
    icoHeader.writeUInt8(0, 9);
    icoHeader.writeUInt16LE(1, 10);
    icoHeader.writeUInt16LE(32, 12);
    icoHeader.writeUInt32LE(png48.length, 14);
    icoHeader.writeUInt32LE(22, 18);
    await fs.promises.writeFile(
      path.join(publicDir, "favicon.ico"),
      Buffer.concat([icoHeader, png48])
    );

    const png192 = await sharp(srcPath)
      .resize(192, 192, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();
    await fs.promises.writeFile(path.join(publicDir, "icon.png"), png192);

    const apple180 = await sharp(srcPath)
      .resize(156, 156, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .extend({
        top: 12,
        bottom: 12,
        left: 12,
        right: 12,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();
    await fs.promises.writeFile(
      path.join(publicDir, "apple-touch-icon.png"),
      apple180
    );
  } catch {}
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updates = Object.entries(body as Record<string, string>);
  await Promise.all(
    updates.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  if ("faviconImage" in body || "logoImage" in body) {
    await syncStaticFaviconFiles();
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/ja", "layout");
    revalidatePath("/en", "layout");
    revalidatePath("/ja/landingpage");
    revalidatePath("/en/landingpage");
  } catch {}

  return NextResponse.json({ success: true });
}
