import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSize = parseInt(searchParams.get("size") || "96", 10);
    const size = [16, 32, 48, 64, 96, 144, 180, 192, 512].includes(rawSize)
      ? rawSize
      : 96;

    const settings = await prisma.setting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    let iconBuffer: Buffer | null = null;
    let contentType = "image/png";

    const publicDir = path.join(process.cwd(), "public");
    const candidates = [
      settingsMap.faviconImage,
      settingsMap.logoImage,
      "/images/logo.webp",
      "/icon.png",
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      const imagePath = candidate.startsWith("/")
        ? path.join(publicDir, candidate)
        : path.join(publicDir, candidate);
      const resolvedPath = path.resolve(imagePath);

      if (
        resolvedPath.startsWith(path.resolve(publicDir)) &&
        fs.existsSync(resolvedPath)
      ) {
        iconBuffer = await sharp(resolvedPath)
          .resize(size, size, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .png()
          .toBuffer();
        contentType = "image/png";
        break;
      }
    }

    if (!iconBuffer) {
      const fallbackPath = path.join(publicDir, "favicon.ico");
      if (fs.existsSync(fallbackPath)) {
        iconBuffer = await fs.promises.readFile(fallbackPath);
        contentType = "image/x-icon";
      } else {
        iconBuffer = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          "base64"
        );
        contentType = "image/png";
      }
    }

    return new Response(new Uint8Array(iconBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating favicon:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
