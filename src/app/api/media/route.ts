import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const uploadDir = join(process.cwd(), "public", "uploads");
    const files = await readdir(uploadDir).catch(() => []);
    const fileData = await Promise.all(
      files
        .filter((f) => !f.startsWith(".") && /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .map(async (filename) => {
          const filePath = join(uploadDir, filename);
          const stats = await stat(filePath).catch(() => null);
          return {
            filename,
            url: `/uploads/${filename}`,
            size: stats?.size ?? 0,
            createdAt: stats?.birthtime ?? new Date(),
          };
        })
    );
    fileData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ data: fileData });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename } = await req.json();
  if (!filename || filename.includes(".."))
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });

  await unlink(join(process.cwd(), "public", "uploads", filename)).catch(() => {});
  return NextResponse.json({ success: true });
}
