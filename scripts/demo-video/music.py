"""Original background music for the case-study demo videos, synthesised from
scratch with numpy: no samples, loops or third-party recordings, so there is
nothing to license. Each score is timed to its video's scenes.

    python music.py <atlas|coop|plantpal> <seconds> <out.wav>

  atlas     dark, cinematic synth: A minor pads, sub bass, a filtered pulse
            arpeggio and soft ticks; chords change with each carousel view.
  coop      bright, punchy, bar-locked to the video's hard cuts: C major
            marimba groove, kick, clap and shaker, a hit on every cut.
  kdv       a dark paper-storm drone, an impact at the snap, then a warm
            electric-piano groove that lifts at each service.
  newzion   a ticking clock under plucked strings, a minor 'before', then a
            bright G major groove with a counter bell on every order.
  tracky    a lo-fi beat with vinyl crackle, swung hats and mellow keys on
            jazzy sevenths.
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


def rhodes(m, dur=2.2, vel=1.0):
    """Electric-piano-ish FM tone: bright attack mellowing into a warm sine."""
    t = t_axis(dur)
    f = hz(m)
    index = 1.6 * vel * np.exp(-3.5 * t) + 0.15
    sig = np.sin(2 * np.pi * f * t + index * np.sin(2 * np.pi * f * t))
    sig *= 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)  # tremolo
    return sig * np.exp(-1.6 * t) * env(len(t), a=0.004, d=0.05, s=1, r=0.25)


def kdv(T):
    """Bar-locked to kdv.html (100 bpm): dark paper storm, an impact at the
    snap, then a warm electric-piano groove that lifts at each service and
    resolves on the end card."""
    tr = Track(T)
    beat = 60 / 100
    bar = 4 * beat
    snap, web, dash, app, wall, end = 5 * bar, 8 * bar, 10 * bar, 12 * bar, 14 * bar, 17 * bar
    # Chaos: a low D minor drone, rustling paper and a riser into the snap.
    tr.add(pad([38, 45, 50, 53], snap + 0.4, shape="saw", cutoff=520, detune=0.18), 0, 0.15)
    tr.add(sub(26, snap), 0, 0.14)
    for i in range(46):
        at = rng.uniform(0.3, snap - 0.4)
        tr.add(noise_hit(rng.uniform(0.08, 0.22), rng.uniform(3000, 7000), rng.uniform(18, 40)), at, rng.uniform(0.02, 0.06), pan=rng.uniform(-0.8, 0.8))
    n = int(2 * bar * SR)
    riser = rng.standard_normal(n) * np.linspace(0, 1, n) ** 2.4
    tr.add(riser - lowpass_fast(riser, 1800), snap - 2 * bar, 0.09)
    # The snap: a deep impact and a bright chord.
    tr.add(kick(0.9), snap, 0.75)
    tr.add(sub(29, 2.2), snap, 0.55)
    tr.add(noise_hit(1.4, 4000, 3.0), snap, 0.11)
    # Warm groove: Fmaj7 - Am7 - Dm9 - Bbmaj7, one chord per bar.
    chords = [[53, 57, 60, 64], [57, 60, 64, 67], [50, 57, 60, 64], [46, 53, 57, 62]]
    roots = [29, 33, 26, 34]
    k = 0
    t0 = snap
    while t0 < end - 0.01:
        c = chords[k % 4]
        full = t0 >= web
        tr.add(pad([x + 12 for x in c], bar + 0.3, shape="tri", cutoff=1600), t0, 0.12)
        for j, beat_at in enumerate([0, 1.5, 2.5] if full else [0, 2]):
            for m in c:
                tr.add(rhodes(m + 12, 1.8, 0.8 if j else 1.0), t0 + beat_at * beat, 0.07)
        bass = [roots[k % 4] + 12, roots[k % 4] + 12, roots[k % 4] + 19, roots[k % 4] + 12]
        for j, m in enumerate(bass):
            tr.add(sub(m, beat * 0.9), t0 + j * beat, 0.28 if full else 0.2)
        for j in range(4):
            if full or j in (0, 2):
                tr.add(kick(0.4), t0 + j * beat, 0.32 if full else 0.26)
            if j in (1, 3):
                tr.add(noise_hit(0.12, 2600, 30), t0 + j * beat, 0.08, pan=-0.1)
        if full:
            for j in range(8):
                tr.add(noise_hit(0.04, 9000, 120), t0 + j * beat / 2 + beat / 4, 0.03 if j % 2 else 0.045, pan=0.45)
        if t0 >= wall:  # lift: a bell arpeggio over the wall
            for j, m in enumerate([c[0] + 24, c[2] + 24, c[1] + 24, c[3] + 24]):
                tr.add(bell(m, 1.6), t0 + j * beat, 0.07, pan=-0.3 + 0.2 * j)
        t0 += bar
        k += 1
    # A hit on each service.
    for at in (web, dash, app, wall):
        tr.add(noise_hit(0.9, 5000, 4.0), at, 0.08, pan=0.2)
        tr.add(kick(0.6), at, 0.4)
    # End card: resolve on Fmaj9 with a long tail.
    tr.add(pad([41, 53, 57, 60, 64, 67], T - end, shape="tri", cutoff=1800), end, 0.5)
    tr.add(sub(29, T - end), end, 0.22)
    for j, m in enumerate([65, 69, 72, 76, 79]):
        tr.add(rhodes(m, 3.5), end + j * 0.18, 0.18)
    tr.add(bell(84, 3.0), end + 1.0, 0.1)
    return reverb(tr.buf, 2.2, 0.28)


def newzion(T):
    """Bar-locked to newzion.html (120 bpm, scenes at 0, 6, 14, 22, 30, 38, 46 s):
    a ticking clock under plucked strings, a sparse minor "before", a
    hazard-stripe whoosh into a bright G major groove with a counter bell on
    every order, and a resolve at close of day."""
    tr = Track(T)
    beat, bar = 0.5, 2.0

    def tick(at, gain):
        tr.add(noise_hit(0.03, 9500, 160), at, gain, pan=0.35)

    def whoosh(at):
        n = int(0.9 * SR)
        w = rng.standard_normal(n) * np.sin(np.linspace(0, np.pi, n)) ** 2
        tr.add(w - lowpass_fast(w, 1500), at - 0.45, 0.12, pan=-0.2)
        tr.add(kick(0.5), at, 0.4)

    # 0-6 s: the first call. A clock ticks; a light plucked motif.
    for i in range(12):
        tick(i * beat, 0.05 if i % 2 else 0.08)
    for i, m in enumerate([67, 71, 74, 79, 74, 71]):
        tr.add(pluck(m, 0.5, bright=2600, decay=7), 1.0 + i * beat, 0.26, pan=-0.2 + 0.08 * i)
    tr.add(pad([55, 59, 62, 67], 6.0, shape="tri", cutoff=1400), 0, 0.4)
    tr.add(sub(31, 6.0), 0, 0.18)
    # 6-14 s: before. E minor, slower ticks, paper clicks.
    tr.add(pad([40, 47, 52, 55], 8.2, shape="saw", cutoff=650, detune=0.15), 6, 0.22)
    tr.add(sub(28, 8), 6, 0.16)
    for i in range(16):
        tick(6 + i * beat, 0.06)
        if i % 4 == 0:
            tr.add(pluck(52 + [0, 3, 7, 10][i // 4 % 4], 0.8, bright=1400, decay=4), 6 + i * beat, 0.11)
    for i in range(22):
        tr.add(noise_hit(0.025, 6000, 200), rng.uniform(10.2, 13.5), 0.05, pan=rng.uniform(-0.6, 0.6))
    # 14-46 s: the working day. G - D - Em - C, plucked eighths, kick and ticks.
    chords = [[55, 59, 62], [50, 54, 57], [52, 55, 59], [48, 52, 55]]
    roots = [31, 26, 28, 24]
    t0, k = 14.0, 0
    while t0 < 46 - 0.01:
        c = chords[k % 4]
        tr.add(pad([n + 12 for n in c], bar + 0.2, shape="tri", cutoff=1700), t0, 0.11)
        tr.add(sub(roots[k % 4] + 12, bar), t0, 0.26)
        for j in range(8):
            at = t0 + j * beat / 2
            tr.add(pluck(c[[0, 1, 2, 1][j % 4]] + 12 + (12 if j in (3, 7) else 0), 0.3, bright=3000, decay=9), at, 0.12, pan=-0.25 + 0.5 * (j % 2))
            tick(at, 0.045 if j % 2 else 0.065)
            if j in (0, 4):
                tr.add(kick(0.35), at, 0.3)
            if j in (2, 6):
                tr.add(noise_hit(0.08, 3000, 45), at, 0.05)
        t0 += bar
        k += 1
    # Counter bell on each order landing in the queue, the delivered receipt and the stamps.
    for at in [15.8 + i * 0.75 + 0.6 for i in range(5)] + [28.4, 42.6, 43.1]:
        tr.add(bell(91, 1.2), at, 0.09, pan=0.3)
    for at in (22, 30, 38):
        tr.add(noise_hit(0.8, 5000, 4.5), at, 0.06)
    for at in (14, 38, 46):
        whoosh(at)
    # 46 s: close of day. Resolve on G with bells and a long tail.
    tr.add(pad([43, 55, 59, 62, 67, 71], T - 46, shape="tri", cutoff=1900), 46, 0.42)
    tr.add(sub(31, T - 46), 46, 0.2)
    for j, m in enumerate([79, 83, 86, 91]):
        tr.add(bell(m, 3.0), 46.4 + j * 0.3, 0.1, pan=-0.3 + 0.2 * j)
    return reverb(tr.buf, 1.8, 0.24)


def tracky(T):
    """Bar-locked to tracky.html (96 bpm, scenes at 0, 5, 12.5, 20, 25, 30,
    37.5 s): a lo-fi beat with vinyl crackle, swung hats and mellow sine keys
    on jazzy sevenths; a soft swell on every mint wipe and a resolve at the
    end."""
    tr = Track(T)
    beat = 60 / 96
    bar = 4 * beat
    # Vinyl crackle throughout.
    n = int(T * SR)
    crackle = np.zeros(n)
    idx = rng.integers(0, n, int(T * 60))
    crackle[idx] = rng.uniform(-1, 1, len(idx))
    crackle = crackle - lowpass_fast(crackle, 1200)
    hiss = rng.standard_normal(n) * 0.015
    tr.add(lowpass_fast(crackle + hiss, 7000), 0, 0.35)

    def keys(m, dur, gain, at):
        t = t_axis(dur)
        f = hz(m)
        sig = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-1.2 * t)
        sig *= env(len(t), a=0.01, d=0.1, s=1, r=0.3)
        tr.add(sig, at, gain)

    # Opening: just keys and crackle under the question.
    for j, m in enumerate([57, 60, 64, 67]):
        keys(m, 4.5, 0.09, 0.3 + j * 0.08)
    tr.add(pad([45, 57, 60, 64, 67], 5.2, shape="tri", cutoff=1100), 0, 0.45)
    # Am9 - Dm9 - G13 - Cmaj9, one chord per bar, from the river onward.
    chords = [[57, 60, 64, 67, 71], [50, 53, 57, 60, 64], [55, 59, 62, 64, 65], [48, 52, 55, 59, 62]]
    roots = [33, 26, 31, 24]
    t0, k = 5.0, 0
    end = 37.5
    while t0 < end - 0.01:
        c = chords[k % 4]
        for j, m in enumerate(c):
            keys(m + 12 if j else m, bar, 0.075, t0 + j * 0.03)
        tr.add(sub(roots[k % 4] + 12, bar * 0.95), t0, 0.3)
        for b in range(4):
            at = t0 + b * beat
            if b in (0, 2) or (b == 3 and k % 2):
                tr.add(kick(0.4), at + (beat / 2 if b == 3 else 0), 0.36)
            if b in (1, 3):
                tr.add(noise_hit(0.16, 2400, 22), at, 0.09, pan=-0.05)
            for s in (0, 1):  # swung eighths
                tr.add(noise_hit(0.03, 9000, 140), at + s * beat * 0.62, 0.035 if s else 0.05, pan=0.4)
        if k % 2 == 1:  # a short melodic answer every other bar
            for j, m in enumerate([c[4] + 12, c[3] + 12, c[2] + 12]):
                keys(m, 0.9, 0.06, t0 + 2 * beat + j * beat / 2)
        t0 += bar
        k += 1
    # A soft swell into every mint wipe.
    for at in (5, 12.5, 20, 25, 30, 37.5):
        m = int(0.6 * SR)
        sw = rng.standard_normal(m) * np.linspace(0, 1, m) ** 2
        tr.add(lowpass_fast(sw, 3000), at - 0.6, 0.05)
    # End: Cmaj9 resolve with a gentle tail.
    tr.add(pad([48, 55, 59, 62, 64, 67], T - end, shape="tri", cutoff=1500), end, 0.3)
    for j, m in enumerate([72, 76, 79, 83]):
        keys(m, 3.5, 0.08, end + 0.4 + j * 0.25)
    tr.add(sub(24 + 12, T - end), end, 0.18)
    return reverb(tr.buf, 1.6, 0.2)


SCORES = {"atlas": atlas, "coop": coop, "plantpal": plantpal, "kdv": kdv, "newzion": newzion, "tracky": tracky}


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
