"""Turn a raw voice take (e.g. a 24 kHz Higgsfield Seed Audio WAV) into a clean
clip for a voice file's "file" line.

    python voiceclip.py <raw.wav> voice/<name>/line-N.flac

Resamples to 48 kHz in float (Seed Audio takes overshoot past full scale when
upsampled, which clipped the old 16-bit/Opus clips), trims on a 10 ms RMS
envelope with a little padding, drops isolated breaths or pops at either end,
removes DC, fades in and out so the clip never starts or stops on a click, and
peaks at -3 dBFS. Saved as lossless FLAC so nothing is re-encoded twice.
"""
import subprocess
import sys

import numpy as np

SR = 48000
WIN = SR // 100  # 10 ms


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def speech_bounds(x, threshold_db=-46):
    n = len(x) // WIN
    db = 20 * np.log10(np.sqrt(np.mean(x[: n * WIN].reshape(n, WIN) ** 2, 1)) + 1e-9)
    loud = np.nonzero(db > threshold_db)[0]
    runs = np.split(loud, np.nonzero(np.diff(loud) > 1)[0] + 1)
    # A blip of 80 ms or less, 150 ms or more away from the speech, is a breath or pop.
    while len(runs) > 1 and len(runs[-1]) <= 8 and runs[-1][0] - runs[-2][-1] >= 15:
        runs.pop()
    while len(runs) > 1 and len(runs[0]) <= 8 and runs[1][0] - runs[0][-1] >= 15:
        runs.pop(0)
    # End a little tighter than the start: the last 4 dB of decay is lost under the music anyway.
    end = np.nonzero(db[: runs[-1][-1] + 1] > threshold_db + 4)[0][-1] + 1
    return runs[0][0] * WIN, end * WIN


def clean(x):
    start, end = speech_bounds(x)
    y = x[max(0, start - int(0.02 * SR)) : min(len(x), end + int(0.03 * SR))].copy()
    y -= y.mean()
    fade_in, fade_out = int(0.012 * SR), int(0.03 * SR)
    y[:fade_in] *= np.sin(np.linspace(0, np.pi / 2, fade_in)) ** 2
    y[-fade_out:] *= np.cos(np.linspace(0, np.pi / 2, fade_out)) ** 2
    return y * (10 ** (-3 / 20) / np.abs(y).max())


if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    clip = clean(load(src)).astype(np.float32)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "flac", "-sample_fmt", "s16", out], input=clip.tobytes(), check=True)
    print(f"{out}  {len(clip) / SR:.2f}s")
