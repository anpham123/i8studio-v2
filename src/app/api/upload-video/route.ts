import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";

export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
];
const MAX_SIZE = 200 * 1024 * 1024; // 200MB

/**
 * Check if ffmpeg is available on the system
 */
async function hasFfmpeg(): Promise<boolean> {
  try {
    await execFileAsync("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a video file to MP4 using ffmpeg (H.264 + AAC)
 * Returns the output file path
 */
async function convertToMp4(inputPath: string, outputPath: string): Promise<void> {
  await execFileAsync("ffmpeg", [
    "-i", inputPath,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "23",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart", // enables instant playback (moov atom at start)
    "-y", // overwrite output
    outputPath,
  ], { timeout: 300000 }); // 5 min timeout
}

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

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^.]+$/, "");

    const uploadDir = join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadDir, { recursive: true });

    // If .mov file → convert to .mp4 for browser compatibility
    if (file.type === "video/quicktime") {
      const tempMovPath = join(uploadDir, `${timestamp}-${safeName}.mov`);
      const mp4Filename = `${timestamp}-${safeName}.mp4`;
      const mp4Path = join(uploadDir, mp4Filename);

      // Write temp .mov file
      await writeFile(tempMovPath, buffer);

      // Try to convert with ffmpeg
      const ffmpegAvailable = await hasFfmpeg();
      if (ffmpegAvailable) {
        try {
          await convertToMp4(tempMovPath, mp4Path);
          // Remove original .mov after successful conversion
          await unlink(tempMovPath).catch(() => {});
          return NextResponse.json({ url: `/uploads/videos/${mp4Filename}` });
        } catch (err) {
          // ffmpeg failed — fall back to serving .mov as-is
          console.error("ffmpeg conversion failed:", err);
          const movFilename = `${timestamp}-${safeName}.mov`;
          return NextResponse.json({ url: `/uploads/videos/${movFilename}` });
        }
      } else {
        // No ffmpeg — serve .mov as-is
        const movFilename = `${timestamp}-${safeName}.mov`;
        return NextResponse.json({ url: `/uploads/videos/${movFilename}` });
      }
    }

    // MP4 and WebM — save directly
    const extMap: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm" };
    const ext = extMap[file.type] || "mp4";
    const filename = `${timestamp}-${safeName}.${ext}`;
    await writeFile(join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/videos/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
