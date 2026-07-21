import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    let iconBuffer: Buffer | null = null;
    let contentType = "image/x-icon";

    // Use dedicated favicon if set, otherwise fall back to logo
    const iconSource = settingsMap.faviconImage || settingsMap.logoImage;

    if (iconSource) {
      const imagePath = iconSource.startsWith("/")
        ? path.join(process.cwd(), "public", iconSource)
        : iconSource;

      if (fs.existsSync(imagePath)) {
        // Resize using sharp to 48x48 PNG
        iconBuffer = await sharp(imagePath)
          .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        contentType = "image/png";
      }
    }

    if (!iconBuffer) {
      // Fallback to the original favicon.ico at src/app/favicon.ico
      const fallbackPath = path.join(process.cwd(), "src", "app", "favicon.ico");
      if (fs.existsSync(fallbackPath)) {
        iconBuffer = await fs.promises.readFile(fallbackPath);
      } else {
        // Ultimate fallback to an empty transparent 1x1 png
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
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating favicon:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
