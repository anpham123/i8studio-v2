import fs from "fs";
import path from "path";
import sharp from "sharp";

const imageAspectRatioCache = new Map<string, number>();

export async function getImageAspectRatio(imageUrl?: string): Promise<number | undefined> {
  if (!imageUrl) return undefined;
  if (imageAspectRatioCache.has(imageUrl)) {
    return imageAspectRatioCache.get(imageUrl);
  }

  try {
    if (imageUrl.startsWith("/")) {
      const cleanUrl = imageUrl.split("?")[0];
      const localPath = path.join(process.cwd(), "public", cleanUrl);
      if (fs.existsSync(localPath)) {
        const metadata = await sharp(localPath).metadata();
        if (metadata.width && metadata.height) {
          const ratio = Number((metadata.width / metadata.height).toFixed(4));
          imageAspectRatioCache.set(imageUrl, ratio);
          return ratio;
        }
      }
    }
  } catch {
    // fallback gracefully
  }

  return undefined;
}
