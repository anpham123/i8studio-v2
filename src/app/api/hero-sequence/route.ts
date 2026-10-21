import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const META_PATH = path.join(process.cwd(), "public", "sequences", "hero", "meta.json");
const OUTPUT_DIR = path.join(process.cwd(), "public", "sequences", "hero");
// Lighter frame set for phones (<640px) — used by ScrollSequenceHero when meta.mobile === true
const MOBILE_OUTPUT_DIR = path.join(OUTPUT_DIR, "m");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero-sequence");

// Frame encoding settings (perf 2026-10-05): 1600px/q72 desktop, 960px/q70 mobile
const DESKTOP_WIDTH = 1600;
const DESKTOP_QUALITY = 72;
const MOBILE_WIDTH = 960;
const MOBILE_QUALITY = 70;

function getFfmpegPath(): string {
  const binaryName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";

  // 1. Direct path in node_modules/ffmpeg-static
  const directPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", binaryName);
  if (fs.existsSync(directPath)) return directPath;

  // 2. Try require('ffmpeg-static')
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpegStatic = require("ffmpeg-static");
    if (typeof ffmpegStatic === "string" && fs.existsSync(ffmpegStatic)) {
      return ffmpegStatic;
    }
  } catch {}

  // 3. Common Linux paths (Docker container)
  if (fs.existsSync("/usr/bin/ffmpeg")) return "/usr/bin/ffmpeg";
  if (fs.existsSync("/usr/local/bin/ffmpeg")) return "/usr/local/bin/ffmpeg";

  // 4. Fallback to system PATH
  return "ffmpeg";
}

async function getVideoDuration(ffmpegPath: string, videoPath: string): Promise<number> {
  try {
    const { stderr } = await execFileAsync(ffmpegPath, ["-i", videoPath]).catch((e) => e);
    const match = String(stderr || "").match(/Duration:\s*(\d+):(\d+):(\d+\.?\d*)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) return totalSeconds;
    }
  } catch {}
  return 60; // default 60s
}

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
    if (!fs.existsSync(MOBILE_OUTPUT_DIR)) {
      fs.mkdirSync(MOBILE_OUTPUT_DIR, { recursive: true });
    }

    // 1. Save uploaded video
    const buffer = Buffer.from(await file.arrayBuffer());
    const videoFileName = `hero_${Date.now()}.mp4`;
    const videoFilePath = path.join(UPLOAD_DIR, videoFileName);
    fs.writeFileSync(videoFilePath, buffer);
    const videoPublicUrl = `/uploads/hero-sequence/${videoFileName}`;

    // 2. Locate ffmpeg binary
    const ffmpegPath = getFfmpegPath();

    // 3. Detect video duration & calculate adaptive FPS (always target ~240 frames for 100% smoothness)
    const duration = await getVideoDuration(ffmpegPath, videoFilePath);
    const TARGET_FRAMES = 240;
    const targetFps = Math.max(1, Math.min(30, TARGET_FRAMES / Math.max(1, duration)));
    const fps = `fps=${targetFps.toFixed(4)}`;

    // 4. Clean old sequence frames (desktop + mobile)
    for (const dir of [OUTPUT_DIR, MOBILE_OUTPUT_DIR]) {
      for (const f of fs.readdirSync(dir)) {
        if (f.startsWith("frame_") && (f.endsWith(".jpg") || f.endsWith(".webp"))) {
          fs.unlinkSync(path.join(dir, f));
        }
      }
    }

    // 5. Extract WebP frames: desktop + mobile in a single ffmpeg pass
    await execFileAsync(ffmpegPath, [
      "-y",
      "-i", videoFilePath,
      "-filter_complex",
      `[0:v]${fps},split=2[d][m];[d]scale=${DESKTOP_WIDTH}:-2[dout];[m]scale=${MOBILE_WIDTH}:-2[mout]`,
      "-map", "[dout]", "-c:v", "libwebp", "-quality", String(DESKTOP_QUALITY), "-preset", "photo",
      path.join(OUTPUT_DIR, "frame_%04d.webp"),
      "-map", "[mout]", "-c:v", "libwebp", "-quality", String(MOBILE_QUALITY), "-preset", "photo",
      path.join(MOBILE_OUTPUT_DIR, "frame_%04d.webp"),
    ], { maxBuffer: 1024 * 1024 * 16 });

    // 5. Count extracted frames
    const newFiles = fs
      .readdirSync(OUTPUT_DIR)
      .filter((f) => f.startsWith("frame_") && (f.endsWith(".webp") || f.endsWith(".jpg")));
    const totalFrames = newFiles.length;
    const mobileFrames = fs
      .readdirSync(MOBILE_OUTPUT_DIR)
      .filter((f) => f.startsWith("frame_") && f.endsWith(".webp")).length;

    if (totalFrames === 0) {
      throw new Error("Failed to extract frames from video");
    }

    // 6. Write new metadata (updatedAt is used by the client as a cache-busting version)
    const meta = {
      totalFrames,
      format: "webp",
      width: DESKTOP_WIDTH,
      quality: DESKTOP_QUALITY,
      mobile: mobileFrames === totalFrames,
      mobileWidth: MOBILE_WIDTH,
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
