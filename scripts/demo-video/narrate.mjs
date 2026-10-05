// Adds a voice-over and background music to a rendered case-study video, fully
// offline: each line in scripts/demo-video/<name>.voice.json is spoken with
// Piper (open-source TTS) and placed at its `at` time; the score for <name> is
// synthesised by music.py (numpy) and ducked under the voice; the mix is
// loudness-normalised and muxed into public/videos/<name>-demo.{mp4,webm}. The
// video stream is copied, not re-encoded, so this can be re-run after editing
// the script or the score. Set "music": false in the voice file to skip music.
//
//   PIPER=/path/to/piper PIPER_VOICES=/path/to/voices PYTHON=/path/to/python-with-numpy \
//     node scripts/demo-video/narrate.mjs atlas
//
// Voices are Piper models (<voice>.onnx + .onnx.json). Missing ones are
// downloaded from huggingface.co/rhasspy/piper-voices. Use only voices whose
// model card allows this kind of use: en_US-joe-medium is CC0.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const name = process.argv[2];
const here = path.dirname(new URL(import.meta.url).pathname);
const scriptFile = path.join(here, `${name}.voice.json`);
if (!name || !existsSync(scriptFile)) {
  console.error("usage: node scripts/demo-video/narrate.mjs <atlas|coop|plantpal>");
  process.exit(1);
}
const { voice, lines, music = true } = JSON.parse(readFileSync(scriptFile, "utf8"));
const root = path.resolve(here, "../..");
const video = (ext) => path.join(root, "public/videos", `${name}-demo${ext}`);
const piper = process.env.PIPER || "piper";
const voices = process.env.PIPER_VOICES || path.join(homedir(), ".local/share/piper-voices");
const work = mkdtempSync(path.join(tmpdir(), `${name}-voice-`));
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ["pipe", "pipe", "inherit"], ...opts });
const seconds = (file) => Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

// 1. Voice model.
mkdirSync(voices, { recursive: true });
const model = path.join(voices, `${voice}.onnx`);
for (const file of [model, `${model}.json`]) {
  if (existsSync(file)) continue;
  const [lang, speaker, quality] = [voice.split("_")[0], voice.split("-")[1], voice.split("-")[2]];
  const url = `https://huggingface.co/rhasspy/piper-voices/resolve/main/${lang}/${voice.split("-")[0]}/${speaker}/${quality}/${path.basename(file)}`;
  console.log(`downloading ${path.basename(file)}`);
  run("curl", ["-sfL", "--retry", "3", "-o", file, url]);
}

// 2. Speak each line and check it fits before the next one (and the video's end).
const duration = seconds(video(".mp4"));
const clips = lines.map((line, i) => {
  const wav = path.join(work, `line-${i}.wav`);
  run(piper, ["-m", model, "-f", wav, "--sentence-silence", "0.15"], { input: line.text });
  const len = seconds(wav);
  const limit = (lines[i + 1]?.at ?? duration - 0.3) - 0.15;
  const end = line.at + len;
  console.log(`${line.at.toFixed(1).padStart(5)}s → ${end.toFixed(1).padStart(5)}s  ${line.text}`);
  if (end > limit) throw new Error(`line ${i + 1} runs to ${end.toFixed(2)}s but must end by ${limit.toFixed(2)}s; shorten it or move it`);
  return { wav, at: line.at };
});

// 3. Place and mix the voice into one track the length of the video.
const speech = path.join(work, "speech.wav");
const inputs = clips.flatMap((c) => ["-i", c.wav]);
const placed = clips.map((c, i) => `[${i}:a]aresample=48000,adelay=${Math.round(c.at * 1000)}:all=1[a${i}]`).join(";");
const voiceMix = `${placed};${clips.map((_, i) => `[a${i}]`).join("")}amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${duration},loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
run("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", voiceMix, "-map", "[out]", "-ar", "48000", "-ac", "2", speech]);

// 4. Music: synthesise the score, sit it well below the voice and duck it a
// further ~8 dB while someone is speaking (sidechain keyed by the voice).
const narration = path.join(work, "narration.wav");
const fadeOut = `afade=t=out:st=${(duration - 0.6).toFixed(2)}:d=0.6`;
if (music) {
  const score = path.join(work, "music.wav");
  run(process.env.PYTHON || "python3", [path.join(here, "music.py"), name, String(duration), score]);
  const graph = [
    "[0:a]asplit=2[voice][key]",
    "[1:a]loudnorm=I=-25:TP=-6:LRA=11,aresample=48000[bed]",
    "[bed][key]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=600:makeup=1[ducked]",
    `[voice][ducked]amix=inputs=2:normalize=0,alimiter=limit=0.84:level=false,atrim=0:${duration},${fadeOut}[out]`,
  ].join(";");
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", speech, "-i", score, "-filter_complex", graph, "-map", "[out]", "-ar", "48000", "-ac", "2", narration]);
} else {
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", speech, "-af", fadeOut, narration]);
}

// 5. Mux into both encodes (video copied as-is).
for (const [ext, codec] of [[".mp4", ["-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart"]], [".webm", ["-c:a", "libopus", "-b:a", "96k"]]]) {
  const tmp = path.join(work, `out${ext}`);
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", video(ext), "-i", narration, "-map", "0:v", "-map", "1:a", "-c:v", "copy", ...codec, "-shortest", tmp]);
  copyFileSync(tmp, video(ext)); // copy, not rename: the temp dir may be on another filesystem
}
rmSync(work, { recursive: true, force: true });
console.log(`done: voice-over${music ? " and music" : ""} muxed into public/videos/${name}-demo.{mp4,webm}`);
