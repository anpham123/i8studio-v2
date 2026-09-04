import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function main() {
  let ffmpegPath = "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ffmpegPath = require("ffmpeg-static");
  } catch (e) {
    console.error("ffmpeg-static not found yet, will check PATH");
    ffmpegPath = "ffmpeg";
  }

  const inputVideo = path.join(process.cwd(), "public", "uploads", "anhherrosection", "1.mp4");
  const outputDir = path.join(process.cwd(), "public", "sequences", "hero");

  if (!fs.existsSync(inputVideo)) {
    console.error("Video file not found at:", inputVideo);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Extracting frames from:", inputVideo);
  console.log("Output directory:", outputDir);

  // Clean old frames
  fs.readdirSync(outputDir).forEach(f => {
    if (f.endsWith(".jpg") || f.endsWith(".webp")) {
      fs.unlinkSync(path.join(outputDir, f));
    }
  });

  // Extract 240 lightweight frames (optimal ~15MB total, zero memory lag)
  const cmd = `"${ffmpegPath}" -y -i "${inputVideo}" -vf "fps=2.25,scale=1280:-1" -q:v 5 "${path.join(outputDir, "frame_%04d.jpg")}"`;

  console.log("Running command:", cmd);
  execSync(cmd, { stdio: "inherit" });

  const files = fs.readdirSync(outputDir).filter(f => f.endsWith(".webp") || f.endsWith(".jpg"));
  console.log(`Successfully extracted ${files.length} frames across the full house walkthrough!`);
}

main().catch(console.error);
