// Renders a case-study demo video from scripts/demo-video/<name>.html, frame
// by frame, and encodes it. Each composition exposes window.render(t),
// window.DURATION and window.POSTER_AT. Needs Playwright (Chromium) and ffmpeg
// with libx264 and libvpx.
//
//   node scripts/demo-video/render.mjs atlas
//   node scripts/demo-video/render.mjs coop
//
// Writes public/videos/<name>-demo.mp4, <name>-demo.webm and <name>-demo-poster.webp.
import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const name = process.argv[2];
const here = path.dirname(new URL(import.meta.url).pathname);
const html = path.join(here, `${name}.html`);
if (!name || !existsSync(html)) {
  console.error("usage: node scripts/demo-video/render.mjs <atlas|coop>");
  process.exit(1);
}

const FPS = 30;
const root = path.resolve(here, "../..");
const outDir = path.join(root, "public/videos");
const out = (ext) => path.join(outDir, `${name}-demo${ext}`);
const work = mkdtempSync(path.join(tmpdir(), `${name}-demo-`));
const master = path.join(work, "master.mp4");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }));
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file://" + html);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
const { duration, posterAt } = await page.evaluate(() => ({ duration: window.DURATION, posterAt: window.POSTER_AT }));
const frames = Math.round(duration * FPS);

// 1. Frames → high-quality 1080p master.
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", master], { stdio: ["pipe", "inherit", "inherit"] });
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.render(t), i / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % 150 === 0) console.log(`frame ${i}/${frames}`);
}
ff.stdin.end();
await new Promise((r, j) => ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg " + c)))));

// 2. Poster frame.
await page.evaluate((t) => window.render(t), posterAt);
const posterJpg = path.join(work, "poster.jpg");
await page.screenshot({ path: posterJpg, type: "jpeg", quality: 92 });
await browser.close();

// 3. Web encodes at 1600×900 (sharp at the case study's display size, small files).
const scale = ["-vf", "scale=1600:900:flags=lanczos"];
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", master, ...scale, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out(".mp4")]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", master, ...scale, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", out(".webm")]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", posterJpg, "-vf", "scale=1600:900", "-quality", "82", out("-poster.webp")]);

rmSync(work, { recursive: true, force: true });
console.log(`done: ${frames} frames → public/videos/${name}-demo.{mp4,webm} + poster`);
