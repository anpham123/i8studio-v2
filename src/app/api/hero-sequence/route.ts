import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const META_PATH = path.join(process.cwd(), "public", "sequences", "hero", "meta.json");
const OUTPUT_DIR = path.join(process.cwd(), "public", "sequences", "hero");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero-sequence");

export async function GET() {
  try {
    if (fs.existsSync(META_PATH)) {
      const data = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
      return NextResponse.json({ success: true, ...data });
    }

    // Default fallback if meta.json doesn't exist
    const files = fs.existsSync(OUTPUT_DIR)
      ? fs.readdirSync(OUTPUT_DIR).filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"))
      : [];

    return NextResponse.json({
      success: true,
      totalFrames: files.length || 242,
      videoUrl: "/uploads/anhherrosection/1.mp4",
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to read meta" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 1. Save uploaded video
    const buffer = Buffer.from(await file.arrayBuffer());
    const videoFileName = `hero_${Date.now()}.mp4`;
    const videoFilePath = path.join(UPLOAD_DIR, videoFileName);
    fs.writeFileSync(videoFilePath, buffer);
    const videoPublicUrl = `/uploads/hero-sequence/${videoFileName}`;

    // 2. Locate ffmpeg binary
    let ffmpegPath = "ffmpeg";
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpegStatic = require("ffmpeg-static");
      if (ffmpegStatic) ffmpegPath = ffmpegStatic;
    } catch {
      // fallback to system ffmpeg
    }

    // 3. Clean old sequence frames
    const oldFiles = fs.readdirSync(OUTPUT_DIR);
    for (const f of oldFiles) {
      if (f.startsWith("frame_") && (f.endsWith(".jpg") || f.endsWith(".webp"))) {
        fs.unlinkSync(path.join(OUTPUT_DIR, f));
      }
    }

    // 4. Extract optimized frames (1280px width, quality 5, ~2.25fps for ~200-260 frames)
    const framePattern = path.join(OUTPUT_DIR, "frame_%04d.jpg");
    const cmd = `"${ffmpegPath}" -y -i "${videoFilePath}" -vf "fps=2.25,scale=1280:-1" -q:v 5 "${framePattern}"`;

    await execAsync(cmd);

    // 5. Count extracted frames
    const newFiles = fs
      .readdirSync(OUTPUT_DIR)
      .filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"));
    const totalFrames = newFiles.length;

    if (totalFrames === 0) {
      throw new Error("Failed to extract frames from video");
    }

    // 6. Write new metadata
    const meta = {
      totalFrames,
      videoUrl: videoPublicUrl,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `Extracted ${totalFrames} frames successfully!`,
      ...meta,
    });
  } catch (error: any) {
    console.error("Error processing hero sequence video:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process video" },
      { status: 500 }
    );
  }
}
