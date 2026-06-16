import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
];
const MAX_SIZE = 200 * 1024 * 1024; // 200MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Invalid file type. Use MP4, WebM, or MOV." }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "File too large. Max 200MB." }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension from mimetype
    const extMap: Record<string, string> = {
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
    };
    const ext = extMap[file.type] || "mp4";
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^.]+$/, "");
    const filename = `${timestamp}-${safeName}.${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadDir, { recursive: true });

    await writeFile(join(uploadDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/videos/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
