import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Invalid file type. Use jpg, png, or webp." }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "File too large. Max 50MB." }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Resize with sharp
    const ext = "webp";
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^.]+$/, "");
    const filename = `${timestamp}-${safeName}.${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const resized = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    await writeFile(join(uploadDir, filename), resized);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
