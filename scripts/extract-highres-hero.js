const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const VIDEO_PATH = path.join(process.cwd(), "public", "uploads", "anhherrosection", "1.mp4");
const OUTPUT_DIR = path.join(process.cwd(), "public", "sequences", "hero");

console.log("FFmpeg path:", ffmpeg);
console.log("Video source:", VIDEO_PATH);
console.log("Output directory:", OUTPUT_DIR);

if (!fs.existsSync(VIDEO_PATH)) {
  console.error("Source video not found at:", VIDEO_PATH);
  process.exit(1);
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Get video info
try {
  const probeOutput = execSync(`"${ffmpeg}" -i "${VIDEO_PATH}" 2>&1`, { encoding: "utf8" });
  console.log("--- Video Stream Info ---");
  const videoStreamLine = probeOutput.split("\n").find(l => l.includes("Stream #") && l.includes("Video:"));
  console.log(videoStreamLine || "Could not parse video stream line");
} catch (err) {
  const errOutput = err.stdout || err.stderr || err.message;
  const match = errOutput.match(/Stream #\d+:\d+.*Video: .*/);
  if (match) console.log("Stream info:", match[0]);
}

// 2. Extract high quality 1080p/2K WebP frames
// Scale width to 1920 (Full HD crystal clear, keeps aspect ratio), fps=2.25 to get ~242 frames
// Using WebP format with quality 88 for crisp fidelity at small file size (~70KB - 120KB per frame)
console.log("\nExtracting high-resolution WebP frames...");
const framePattern = path.join(OUTPUT_DIR, "frame_%04d.webp");

// First clean existing frames
const existing = fs.readdirSync(OUTPUT_DIR);
for (const f of existing) {
  if (f.startsWith("frame_") && (f.endsWith(".jpg") || f.endsWith(".webp"))) {
    fs.unlinkSync(path.join(OUTPUT_DIR, f));
  }
}

const cmd = `"${ffmpeg}" -y -i "${VIDEO_PATH}" -vf "fps=2.25,scale=1920:-2" -c:v libwebp -quality 88 -preset drawing "${framePattern}"`;
console.log("Running command:", cmd);
execSync(cmd, { stdio: "inherit" });

const newFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith("frame_") && f.endsWith(".webp"));
console.log(`\nSuccessfully extracted ${newFiles.length} crisp WebP frames!`);

// Write metadata
const meta = {
  totalFrames: newFiles.length,
  format: "webp",
  width: 1920,
  quality: 88,
  videoUrl: "/uploads/anhherrosection/1.mp4",
  updatedAt: new Date().toISOString()
};

fs.writeFileSync(path.join(OUTPUT_DIR, "meta.json"), JSON.stringify(meta, null, 2));
console.log("Updated meta.json:", meta);
