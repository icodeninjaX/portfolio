"""Original background music for the case-study demo videos, synthesised from
scratch with numpy: no samples, loops or third-party recordings, so there is
nothing to license. Each score is timed to its video's scenes.

    python music.py <atlas|coop|plantpal> <seconds> <out.wav>

  atlas     dark, cinematic synth: A minor pads, sub bass, a filtered pulse
            arpeggio and soft ticks; chords change with each carousel view.
  coop      bright, punchy, bar-locked to the video's hard cuts: C major
            marimba groove, kick, clap and shaker, a hit on every cut.
  plantpal  warm and organic: D major pentatonic kalimba in 3/4, a soft pad
            and wind, a chime as each specimen is pressed, a harp gliss as
            the flower blooms.
"""
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env(n, a=0.01, d=0.1, s=0.7, r=0.2):
    """ADSR envelope over n samples (r taken from the end)."""
    e = np.full(n, s, dtype=np.float64)
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na, nd, nr = min(na, n), min(nd, max(n - na, 0)), min(nr, n)
    e[:na] = np.linspace(0, 1, na, endpoint=False)
    e[na:na + nd] = np.linspace(1, s, nd, endpoint=False)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or a per-sample array."""
    c = np.broadcast_to(np.asarray(cutoff, dtype=np.float64), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def lowpass_fast(x, cutoff):
    """Static one-pole low-pass via an IIR in blocks (fast path for long buffers)."""
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    # Equivalent to y[n] = y[n-1] + a (x[n] - y[n-1]); use lfilter-free recursion in chunks.
    y = np.empty_like(x)
    acc = 0.0
    for start in range(0, len(x), 4096):
        seg = x[start:start + 4096]
        out = np.empty_like(seg)
        for i, v in enumerate(seg):
            acc += a * (v - acc)
            out[i] = acc
        y[start:start + 4096] = out
    return y


def tone(freq, dur, shape="sine", harmonics=6):
    t = t_axis(dur)
    if shape == "sine":
        return np.sin(2 * np.pi * freq * t)
    if shape == "tri":
        return (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * freq * t))
    if shape == "saw":  # band-limited-ish additive saw
        return sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, harmonics + 1)) * 0.6
    raise ValueError(shape)


class Track:
    def __init__(self, seconds):
        self.n = int(seconds * SR)
        self.buf = np.zeros((self.n, 2))

    def add(self, sig, at, gain=1.0, pan=0.0):
        i = int(at * SR)
        if i >= self.n:
            return
        sig = sig[: self.n - i]
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.buf[i:i + len(sig), 0] += sig * gain * left
        self.buf[i:i + len(sig), 1] += sig * gain * right


def reverb(stereo, seconds=2.4, mix=0.3):
    """Convolution reverb with a decaying-noise impulse (FFT, per channel)."""
    n = int(seconds * SR)
    out = stereo.copy()
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
        ir = lowpass_fast(ir, 6000)
        ir /= np.sqrt(np.sum(ir ** 2))
        size = 1 << int(np.ceil(np.log2(len(stereo) + n)))
        wet = np.fft.irfft(np.fft.rfft(stereo[:, ch], size) * np.fft.rfft(ir, size), size)[: len(stereo)]
        out[:, ch] = (1 - mix) * stereo[:, ch] + mix * wet
    return out


# ---------------------------------------------------------------- instruments

def pad(notes, dur, shape="saw", cutoff=1400, detune=0.12):
    t = t_axis(dur)
    sig = np.zeros(len(t))
    for m in notes:
        for d in (-detune, 0, detune):
            sig += tone(hz(m + d), dur, shape, harmonics=8)
    sig = lowpass_fast(sig / (len(notes) * 3), cutoff)
    return sig * env(len(t), a=min(1.2, dur / 3), d=0.4, s=0.85, r=min(1.2, dur / 3))


def pluck(m, dur=0.6, bright=3500, decay=6.0):
    t = t_axis(dur)
    sig = tone(hz(m), dur, "saw", harmonics=10) * np.exp(-decay * t)
    return lowpass_fast(sig, bright) * env(len(t), a=0.003, d=0.05, s=1, r=0.05)


def marimba(m, dur=0.5):
    t = t_axis(dur)
    f = hz(m)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-9 * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-30 * t)
    return sig * env(len(t), a=0.002, d=0.02, s=1, r=0.03)


def kalimba(m, dur=1.6):
    t = t_axis(dur)
    f = hz(m)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-3.2 * t) + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-16 * t)
    return sig * env(len(t), a=0.002, d=0.02, s=1, r=0.1)


def bell(m, dur=2.5):
    t = t_axis(dur)
    f = hz(m)
    parts = [(1, 1, 2.0), (2.76, .45, 3.5), (5.4, .25, 6), (8.93, .12, 9)]
    sig = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-k * t) for r, a, k in parts)
    return sig * env(len(t), a=0.003, d=0.02, s=1, r=0.2) * 0.6


def sub(m, dur):
    t = t_axis(dur)
    return np.sin(2 * np.pi * hz(m) * t) * env(len(t), a=0.3, d=0.2, s=0.9, r=0.6)


def kick(dur=0.35):
    t = t_axis(dur)
    f = 110 * np.exp(-18 * t) + 42
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-9 * t)


def noise_hit(dur=0.08, cutoff=7000, decay=60):
    t = t_axis(dur)
    n = rng.standard_normal(len(t)) * np.exp(-decay * t)
    return n - lowpass_fast(n, cutoff)  # high-passed noise


def wind(dur):
    n = rng.standard_normal(int(dur * SR))
    swell = 0.5 + 0.5 * np.sin(2 * np.pi * t_axis(dur) / 7.3) * np.sin(2 * np.pi * t_axis(dur) / 3.1)
    return lowpass_fast(n, 900) * swell * 0.6


# --------------------------------------------------------------------- scores

def atlas(T):
    tr = Track(T)
    beat = 60 / 96
    # Intro: Am(add9) swell + sub.
    tr.add(pad([57, 64, 71, 72], 8.6, cutoff=900), 0.0, 0.5)
    tr.add(sub(33, 8.8), 0.2, 0.55)
    tr.add(bell(81, 4), 1.0, 0.18, pan=0.3)
    # Pulse enters with the headline.
    for i in range(int((8.6 - 4.2) / (beat / 2))):
        at = 4.2 + i * beat / 2
        tr.add(pluck([45, 52, 57, 60][i % 4], 0.4, bright=900 + i * 40), at, 0.16, pan=-0.2 + 0.4 * (i % 2))
    # Carousel: Am – F – C – G, one chord per 2.5 s view (8 views from 8.6 s).
    prog = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]]
    roots = [33, 29, 36, 31]
    for k in range(8):
        at = 8.6 + k * 2.5
        c = prog[k % 4]
        tr.add(pad([n + 12 for n in c], 2.8, cutoff=1200 + 200 * (k % 4)), at - 0.15, 0.32)
        tr.add(sub(roots[k % 4], 2.6), at, 0.5)
        arp = [c[0], c[1], c[2], c[1] + 12, c[2], c[1]]
        for j in range(int(2.5 / (beat / 2))):
            tr.add(pluck(arp[j % len(arp)] + 12, 0.35, bright=2200), at + j * beat / 2, 0.11, pan=0.35 * np.sin(j))
            if j % 2 == 1:
                tr.add(noise_hit(0.06), at + j * beat / 2, 0.05, pan=0.4)
    # End card: resolve to Am with bells, long tail.
    tr.add(pad([57, 64, 69, 72, 76], 5.2, cutoff=1600), 28.6, 0.45)
    tr.add(sub(33, 5.2), 28.8, 0.5)
    for i, m in enumerate([76, 81, 84, 88]):
        tr.add(bell(m, 3.5), 29.3 + i * 0.35, 0.14, pan=-0.3 + 0.2 * i)
    return reverb(tr.buf, 2.8, 0.35)


def clap(dur=0.18):
    """Three quick noise taps then a short tail, band-limited around 1-3 kHz."""
    t = t_axis(dur)
    n = rng.standard_normal(len(t))
    e = np.exp(-28 * t)
    for k in (0.0, 0.011, 0.022):
        e += np.where((t >= k) & (t < k + 0.008), 1.0, 0.0)
    body = lowpass_fast(n, 3200)
    return (body - lowpass_fast(body, 900)) * e


def coop(T):
    """Bar-locked to coop.html (112 bpm): every cut in the video lands on a hit."""
    tr = Track(T)
    beat = 60 / 112
    bar = 4 * beat
    prog = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
    roots = [36, 31, 33, 29]

    def stab(chord, at, gain=0.3):
        for j, m in enumerate(chord):
            tr.add(marimba(m + 12, 0.5), at, gain, pan=-0.3 + 0.3 * j)
        tr.add(kick(), at, 0.45)
        tr.add(clap(), at, 0.22, pan=0.1)

    # Bar 0: one hit per word cut (Members. Loans. Shares. Dividends.).
    for i, c in enumerate([prog[0], prog[3], prog[1], prog[2]]):
        stab(c, i * beat)
        tr.add(sub(roots[[0, 3, 1, 2][i]] + 12, beat), i * beat, 0.3)
    # Bar 1: the wordmark, a bright bell arpeggio over a C pad.
    tr.add(pad([60, 64, 67, 72], bar + 0.3, shape="tri", cutoff=2600), bar, 0.28)
    for i, m in enumerate([72, 76, 79, 84, 88]):
        tr.add(bell(m, 2.2), bar + i * beat / 2, 0.14, pan=-0.4 + 0.2 * i)
    # Bar 2: "Five spreadsheets": a tense, ticking Am bar with a riser into the snap.
    tr.add(pad([45, 52, 57, 60], bar, shape="saw", cutoff=700), 2 * bar, 0.3)
    for j in range(16):
        tr.add(noise_hit(0.03, 9000, 120), 2 * bar + j * beat / 4, 0.03 if j % 2 else 0.05, pan=0.4)
        if j % 3 == 2:
            tr.add(marimba(45 + 12 * (j % 2), 0.3), 2 * bar + j * beat / 4, 0.18, pan=-0.3)
    riser = rng.standard_normal(int(bar * SR)) * np.linspace(0, 1, int(bar * SR)) ** 2
    tr.add(riser - lowpass_fast(riser, 2500), 2 * bar, 0.05)

    def groove(start, bars, drums=True):
        for k in range(bars):
            t0 = start + k * bar
            c = prog[k % 4]
            tr.add(pad([n + 12 for n in c], bar + 0.2, shape="tri", cutoff=1800), t0, 0.14)
            tr.add(sub(roots[k % 4] + 12, bar), t0, 0.32)
            for j in range(8):
                at = t0 + j * beat / 2
                if j in (0, 3, 6):
                    tr.add(marimba(c[[0, 2, 1][j // 3]] + 12, 0.45), at, 0.3, pan=-0.25)
                if j in (2, 5, 7):
                    tr.add(marimba(c[(j + 1) % 3] + 24, 0.35), at, 0.17, pan=0.3)
                tr.add(noise_hit(0.05, 8000, 80), at, 0.04 if j % 2 else 0.025, pan=0.5)
                if drums and j % 2 == 0:
                    tr.add(kick(), at, 0.4)
                if drums and j in (2, 6):
                    tr.add(clap(), at, 0.16, pan=-0.1)

    # Bars 3-10: the groove, from the bento snap through the six app views,
    # with a splash on every cut.
    groove(3 * bar, 8)
    for k in [3] + list(range(5, 11)):
        tr.add(noise_hit(0.9, 5000, 4.5), k * bar, 0.07, pan=0.2 if k % 2 else -0.2)
    # Bars 11-13: the dividend. A hit on each line of the formula, a rising
    # run under the result, then a lighter groove under the proof panel.
    for i, c in enumerate([prog[2], prog[3], prog[1]]):
        stab(c, 11 * bar + i * bar / 2, 0.32)
        tr.add(pad([n + 12 for n in c], bar / 2 + 0.3, shape="tri", cutoff=1500), 11 * bar + i * bar / 2, 0.18)
    for i, m in enumerate([60, 64, 67, 72, 76, 79, 84, 88]):
        tr.add(marimba(m, 0.5), 12 * bar + i * beat / 4, 0.2, pan=-0.4 + 0.1 * i)
    groove(12.5 * bar, 3, drums=False)
    # Bar 14: end card, a big C chord with bells.
    stab([48, 60, 64, 67], 14 * bar, 0.3)
    tr.add(pad([48, 60, 64, 67, 72], T - 14 * bar, shape="tri", cutoff=2400), 14 * bar, 0.36)
    tr.add(bell(84, 3), 14 * bar + beat, 0.15)
    tr.add(bell(88, 3), 14 * bar + 1.5 * beat, 0.11, pan=0.3)
    return reverb(tr.buf, 1.6, 0.22)


def plantpal(T):
    tr = Track(T)
    beat = 60 / 66
    scale = [62, 64, 66, 69, 71, 74, 76, 78, 81]  # D major pentatonic
    # Warm pad (D – G – Bm – A) and wind throughout.
    chords = [[50, 57, 62, 66], [55, 59, 62, 67], [47, 54, 59, 62], [45, 52, 57, 61]]
    t, k = 0.3, 0
    while t < T - 1:
        tr.add(pad(chords[k % 4], 6.4, shape="tri", cutoff=1100, detune=0.08), t, 0.26)
        t += 6.0
        k += 1
    tr.add(wind(T), 0, 0.05)
    # Kalimba in 3/4: a slow, gently varying figure.
    melody = [0, 2, 4, 3, 5, 4, 2, 3, 1, 2, 4, 6, 5, 4, 3, 2]
    i, t = 0, 1.2
    while t < 29.5:
        m = scale[melody[i % len(melody)]]
        tr.add(kalimba(m, 1.6), t, 0.28 if i % 3 == 0 else 0.18, pan=-0.3 + 0.6 * ((i * 7) % 5) / 4)
        t += beat
        i += 1
    # A chime as each specimen is pressed onto the page.
    for k, at in enumerate(5.2 + 3.7 * k for k in range(6)):
        tr.add(bell(scale[[5, 6, 7, 6, 8, 7][k]], 2.5), at, 0.13, pan=0.4 if k % 2 else -0.4)
    # Harp gliss as the flower blooms, then a settled ending.
    for j, m in enumerate(scale + [86, 88]):
        tr.add(kalimba(m, 1.4), 26.5 + j * 0.07, 0.15, pan=-0.5 + j * 0.1)
    tr.add(pad([50, 57, 62, 66, 69], 6.5, shape="tri", cutoff=1300), 29.4, 0.32)
    for j, m in enumerate([74, 78, 81]):
        tr.add(kalimba(m, 2.0), 31.2 + j * 0.45, 0.2)
    return reverb(tr.buf, 3.2, 0.4)


SCORES = {"atlas": atlas, "coop": coop, "plantpal": plantpal}


def main():
    name, seconds, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    audio = SCORES[name](seconds)
    fade = int(1.2 * SR)
    audio[-fade:] *= np.linspace(1, 0, fade)[:, None]
    audio /= np.max(np.abs(audio)) / 0.89
    pcm = (audio * 32767).astype("<i2")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
