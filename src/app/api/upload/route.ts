import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Invalid file type. Use jpg, png, webp, mp4, or webm." }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "File too large. Max 50MB." }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^.]+$/, "");

    // 1. If Video: save directly without sharp
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      let ext = "mp4";
      if (file.type === "video/webm") ext = "webm";
      else if (file.type === "video/quicktime") ext = "mov";
      else if (file.name.includes(".")) {
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        if (fileExt && ["mp4", "webm", "mov"].includes(fileExt)) ext = fileExt;
      }
      const filename = `${timestamp}-${safeName}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    }

    // 2. If Image: resize and convert to WebP with sharp
    const ext = "webp";
    const filename = `${timestamp}-${safeName}.${ext}`;
    const resized = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    await writeFile(join(uploadDir, filename), resized);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
