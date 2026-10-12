"use client";

import { useEffect, useRef } from "react";
import { SCENE_MANIFEST } from "./sceneManifest";
import { stackScroll, subscribeStack } from "./scrollStore";

// The homepage background: me, filmed scene by scene. Each `data-stage`
// section holds on one still; between sections the transition clip
// (pre-cut into frames by scripts/scenes/build-frames.mjs) is scrubbed by
// scroll and drawn to a 2D canvas, so it plays forwards and backwards.

const { base, scenes, focus: FOCUS, pan: PAN, frames } = SCENE_MANIFEST;
const SEGMENTS = frames.length;

/** On portrait screens the scene fills this much of the height and fades into the copy below. */
const PORTRAIT_SCENE = 0.72;

/**
 * Decoded frames kept ready to draw, nearest the reader first. Drawing an
 * <img> whose decoded pixels the browser has evicted re-decodes it on the main
 * thread mid-scroll (visible stutter on phones), so frames are drawn from
 * ImageBitmaps sized for this screen instead, within a memory budget.
 */
const BITMAP_BUDGET_MB = { m: 180, d: 380 };

/** A transition starts this far into a section and ends this far into the next. */
const HOLD = 0.7;
const SPAN = 0.5;

const smooth = (t: number) => t * t * (3 - 2 * t);
const key = (seg: number, f: number) => `${seg}-${f}`;
const still = (scene: number): [number, number] =>
  scene < SEGMENTS ? [scene, 0] : [SEGMENTS - 1, frames[SEGMENTS - 1] - 1];

/** Continuous section position: integer while a section holds, fractional during a transition. */
function sectionPosition(stage: number, count: number, reduced: boolean) {
  if (reduced) return Math.min(count - 1, Math.max(0, Math.round(stage - 0.2)));
  const u = stage - HOLD;
  const k = Math.floor(u);
  const x = k + smooth(Math.min(1, Math.max(0, (u - k) / SPAN)));
  return Math.min(count - 1, Math.max(0, x));
}

export function SceneSequence({ sceneIds }: { sceneIds: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Section i shows scene map[i]; a section without its own scene keeps the previous one.
    const map: number[] = [];
    sceneIds.forEach((id, i) => {
      const s = (scenes as readonly string[]).indexOf(id);
      map.push(s >= 0 ? s : (map[i - 1] ?? 0));
    });

    // Portrait screens get frames pre-cropped around me (see build-frames.mjs).
    const set = window.innerWidth < window.innerHeight ? "m" : "d";
    const portrait = set === "m";
    const stage = canvas.parentElement;
    if (stage && portrait) {
      // Size against the largest viewport so the address bar sliding in and
      // out never resizes (and so reallocates) the canvas.
      stage.classList.add("is-portrait");
      stage.style.height = `${PORTRAIT_SCENE * 100}${CSS.supports("height", "1lvh") ? "lvh" : "vh"}`;
    }
    const url = (seg: number, f: number) =>
      `${base}/${set}/${String(seg).padStart(2, "0")}-${String(f).padStart(3, "0")}.webp`;

    const loaded = new Map<string, HTMLImageElement>();
    const requested = new Set<string>();
    let dirty = true;
    let disposed = false;

    const bitmaps = new Map<string, ImageBitmap>();
    const making = new Set<string>();
    let generation = 0;
    let windowDirty = true;
    const lowMemory = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
    const budget = BITMAP_BUDGET_MB[set] * (lowMemory ? 0.6 : 1) * 1024 * 1024;

    // ---- loading: every scene's still first, then whole clips nearest to the reader ----
    const queue: [number, number][] = [];
    let inFlight = 0;
    const pump = () => {
      while (inFlight < 6 && queue.length) {
        const [seg, f] = queue.shift()!;
        const k = key(seg, f);
        if (requested.has(k)) continue;
        requested.add(k);
        inFlight++;
        const img = new Image();
        img.decoding = "async";
        img.src = url(seg, f);
        img
          .decode()
          .then(() => {
            if (disposed) return;
            loaded.set(k, img);
            dirty = true;
            windowDirty = true;
          })
          .catch(() => {})
          .finally(() => {
            inFlight--;
            if (!disposed) pump();
          });
      }
    };
    const enqueueSegment = (seg: number, front = false) => {
      const items: [number, number][] = [];
      // Coarse pass first so a fast scroll still has something close to show.
      for (const step of [8, 2, 1]) {
        for (let f = 0; f < frames[seg]; f += step) {
          if (!items.some(([, g]) => g === f)) items.push([seg, f]);
        }
      }
      if (front) queue.unshift(...items);
      else queue.push(...items);
    };
    for (let s = 0; s < scenes.length; s++) queue.push(still(s));
    // Data saver: stills only; the draw falls back to crossfading them.
    const lite = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const planned = new Set<number>(lite ? Array.from({ length: SEGMENTS }, (_, i) => i) : []);
    const planAround = (scene: number) => {
      const order = Array.from({ length: SEGMENTS }, (_, i) => i).sort(
        (a, b) => Math.abs(a - scene + 0.5) - Math.abs(b - scene + 0.5),
      );
      for (const seg of order.slice(0, 3).reverse()) {
        if (!planned.has(seg)) {
          planned.add(seg);
          enqueueSegment(seg, true);
        }
      }
      // Keyframes stay ahead of everything.
      for (let s = scenes.length - 1; s >= 0; s--) if (!loaded.has(key(...still(s)))) queue.unshift(still(s));
      pump();
    };
    planAround(0);
    // Then the rest in reading order, once the page is idle.
    const idle = window.setTimeout(() => {
      for (let seg = 0; seg < SEGMENTS; seg++) {
        if (!planned.has(seg)) {
          planned.add(seg);
          enqueueSegment(seg);
        }
      }
      pump();
    }, 2500);

    // ---- drawing ----
    /** Closest ready frame: a bitmap if one is near, else the still, else the raw image. */
    const nearest = (seg: number, f: number): CanvasImageSource | undefined => {
      for (let d = 0; d < frames[seg]; d++) {
        const a = bitmaps.get(key(seg, f - d)) ?? bitmaps.get(key(seg, f + d));
        if (a) return a;
      }
      return loaded.get(key(seg, f));
    };
    const ready = (k: string): CanvasImageSource | undefined => bitmaps.get(k) ?? loaded.get(k);

    let w = 0;
    let h = 0;
    let sizedWidth = -1;
    const resize = () => {
      // Phones resize every time the address bar slides in or out; only a real
      // width change (rotation) is worth reallocating the canvas and frames for.
      if (portrait && window.innerWidth === sizedWidth) return;
      sizedWidth = window.innerWidth;
      // 2x is already finer than the 1152px source frames on any phone, and
      // every extra pixel is re-uploaded to the GPU on each scroll frame.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      w = Math.round(box.width * dpr);
      h = Math.round(box.height * dpr);
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingQuality = "high";
      bitmaps.forEach((b) => b.close());
      bitmaps.clear();
      generation++;
      windowDirty = true;
      dirty = true;
    };
    resize();

    const pointer = { x: 0, y: 0 };
    // Desktop overscans a little for the pointer parallax; phones have no pointer.
    const ZOOM = portrait ? 1 : 1.045;
    // Phone frames are already centred on me; show them a little above centre.
    const PORTRAIT_Y = 0.35;

    /** Region of a source frame a bitmap keeps, and the size it is decoded to. */
    const bitmapRect = (iw: number, ih: number) => {
      const scale = Math.max(w / iw, h / ih) * ZOOM;
      // Never decode larger than the source: the GPU upscales for free.
      const down = Math.min(1, scale);
      if (!portrait) return { sx: 0, sy: 0, sw: iw, sh: ih, rw: Math.round(iw * down), rh: Math.round(ih * down) };
      // Phones: keep exactly the visible box, so drawing it is a plain copy.
      const sw = w / scale;
      const sh = h / scale;
      return {
        sx: (iw - sw) * 0.5,
        sy: (ih - sh) * PORTRAIT_Y,
        sw,
        sh,
        rw: Math.round(sw * down),
        rh: Math.round(sh * down),
      };
    };

    const cover = (src: CanvasImageSource, focus: number, alpha: number, pan = 0) => {
      ctx.globalAlpha = alpha;
      if (src instanceof ImageBitmap && portrait) {
        ctx.drawImage(src, 0, 0, w, h);
        return;
      }
      const iw = src instanceof HTMLImageElement ? src.naturalWidth : (src as ImageBitmap).width;
      const ih = src instanceof HTMLImageElement ? src.naturalHeight : (src as ImageBitmap).height;
      const scale = Math.max(w / iw, h / ih) * ZOOM;
      const dw = iw * scale;
      const dh = ih * scale;
      const spareX = dw - w;
      const spareY = dh - h;
      const fx = portrait ? 0.5 : focus;
      const x = -spareX * Math.min(1, Math.max(0, fx + pointer.x * 0.04)) + pan * w;
      const y = -spareY * (portrait ? PORTRAIT_Y : 0.5 + pointer.y * 0.18);
      ctx.drawImage(src, x, y, dw, dh);
    };

    // Desktop pan: the strip uncovered on the left fades into the page colour.
    const edge = (pan: number) => {
      if (pan <= 0) return;
      const x = pan * w;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, Math.ceil(x), h);
      const g = ctx.createLinearGradient(x, 0, x + w * 0.14, 0);
      g.addColorStop(0, "rgba(10, 9, 8, 1)");
      g.addColorStop(1, "rgba(10, 9, 8, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, w * 0.14, h);
    };

    // Portrait: the canvas only covers the top of the screen (CSS); melt its
    // bottom edge into the page colour below.
    const floor = () => {
      if (!portrait) return;
      const g = ctx.createLinearGradient(0, h * 0.55, 0, h);
      g.addColorStop(0, "rgba(10, 9, 8, 0)");
      g.addColorStop(1, "rgba(10, 9, 8, 1)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    // Shade the half opposite the subject, where the section copy sits.
    const shade = (focus: number) => {
      const side = (focus - 0.5) * 2;
      if (Math.abs(side) < 0.05 || portrait) return;
      const g = side > 0 ? ctx.createLinearGradient(0, 0, w * 0.62, 0) : ctx.createLinearGradient(w, 0, w * 0.38, 0);
      g.addColorStop(0, `rgba(10, 9, 8, ${(0.82 * Math.min(1, Math.abs(side) / 0.4)).toFixed(3)})`);
      g.addColorStop(1, "rgba(10, 9, 8, 0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = () => {
      const count = map.length;
      const x = sectionPosition(stackScroll.stage, count, stackScroll.reducedMotion);
      const k = Math.min(count - 1, Math.floor(x));
      const t = x - k;
      const from = map[k];
      const to = map[Math.min(count - 1, k + 1)];
      const focus = FOCUS[from] + (FOCUS[to] - FOCUS[from]) * t;
      const pan = portrait ? 0 : PAN[from] + (PAN[to] - PAN[from]) * t;
      // Where the reader is in the film, for the bitmap window.
      if (t > 0 && to === from + 1 && from < SEGMENTS) here = { seg: from, f: t * (frames[from] - 1) };
      else here = { seg: Math.min(from, SEGMENTS - 1), f: from < SEGMENTS ? 0 : frames[SEGMENTS - 1] - 1 };

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, w, h);
      paint(from, to, t, focus, pan);
      edge(pan);
      shade(focus);
      floor();
    };

    const paint = (from: number, to: number, t: number, focus: number, pan: number) => {
      if (t > 0 && to === from + 1 && from < SEGMENTS) {
        // Scrub the clip that joins the two scenes, blending neighbouring frames.
        const pos = t * (frames[from] - 1);
        const f0 = Math.floor(pos);
        const a = nearest(from, f0);
        const b = ready(key(from, Math.min(frames[from] - 1, f0 + 1)));
        if (a) cover(a, focus, 1, pan);
        if (b && a !== b) cover(b, focus, pos - f0, pan);
        if (a || b) return;
      }
      // Holding on a scene, or two scenes without a clip between them: crossfade stills.
      const sa = ready(key(...still(from)));
      const sb = ready(key(...still(to)));
      if (sa) cover(sa, focus, 1, pan);
      if (sb && t > 0 && to !== from) cover(sb, focus, t, pan);
    };

    // ---- bitmap window: decode the frames around the reader, release the rest ----
    let here = { seg: 0, f: 0 };
    let lastHere = "";
    const offsets: number[] = [];
    frames.reduce((acc, n, i) => ((offsets[i] = acc), acc + n), 0);
    const globalIndex = (seg: number, f: number) => offsets[seg] + f;
    const stillKeys = new Set(Array.from({ length: scenes.length }, (_, s) => key(...still(s))));

    const refreshWindow = () => {
      windowDirty = false;
      const sample = loaded.values().next().value;
      if (!sample || w === 0) return;
      const r = bitmapRect(sample.naturalWidth, sample.naturalHeight);
      const per = r.rw * r.rh * 4;
      // Stills always stay; the rest of the budget goes to frames nearest the reader.
      const reach = Math.max(4, Math.floor(budget / per) - stillKeys.size);
      const centre = globalIndex(here.seg, Math.round(here.f));
      const wanted: string[] = [...stillKeys];
      for (let d = 0; wanted.length < stillKeys.size + reach && d < offsets[SEGMENTS - 1] + frames[SEGMENTS - 1]; d++) {
        for (const g of d === 0 ? [centre] : [centre + d, centre - d]) {
          let seg = SEGMENTS - 1;
          while (seg >= 0 && offsets[seg] > g) seg--;
          if (seg < 0 || g - offsets[seg] >= frames[seg]) continue;
          wanted.push(key(seg, g - offsets[seg]));
        }
      }
      const keep = new Set(wanted);
      bitmaps.forEach((b, k) => {
        if (!keep.has(k)) {
          b.close();
          bitmaps.delete(k);
        }
      });
      const gen = generation;
      for (const k of wanted) {
        if (making.size >= 3) break;
        if (bitmaps.has(k) || making.has(k)) continue;
        const img = loaded.get(k);
        if (!img) continue;
        making.add(k);
        const b = bitmapRect(img.naturalWidth, img.naturalHeight);
        // Decode from the file bytes (already in the HTTP cache): browsers do
        // that off the main thread, unlike decoding from an <img>.
        fetch(img.src)
          .then((res) => res.blob())
          .then((blob) =>
            createImageBitmap(blob, b.sx, b.sy, b.sw, b.sh, { resizeWidth: b.rw, resizeHeight: b.rh, resizeQuality: "high" }),
          )
          .then((bmp) => {
            if (disposed || gen !== generation) return bmp.close();
            bitmaps.set(k, bmp);
            dirty = true;
          })
          .catch(() => {})
          .finally(() => {
            making.delete(k);
            windowDirty = true;
          });
      }
    };

    let raf = 0;
    let lastScene = -1;
    const loop = () => {
      // Ease the parallax toward the real pointer so it never snaps.
      const tx = stackScroll.reducedMotion ? 0 : stackScroll.pointer.x;
      const ty = stackScroll.reducedMotion ? 0 : stackScroll.pointer.y;
      if (Math.abs(tx - pointer.x) > 0.001 || Math.abs(ty - pointer.y) > 0.001) {
        pointer.x += (tx - pointer.x) * 0.06;
        pointer.y += (ty - pointer.y) * 0.06;
        dirty = true;
      }
      if (dirty) {
        dirty = false;
        draw();
        const at = `${here.seg}:${Math.round(here.f / 2)}`;
        if (at !== lastHere) {
          lastHere = at;
          windowDirty = true;
        }
      }
      if (windowDirty) refreshWindow();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const unsub = subscribeStack((s) => {
      dirty = true;
      const scene = map[Math.min(map.length - 1, Math.max(0, Math.floor(s.stage)))] ?? 0;
      if (scene !== lastScene) {
        lastScene = scene;
        planAround(scene);
      }
    });
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      unsub();
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.removeEventListener("resize", resize);
      bitmaps.forEach((b) => b.close());
      bitmaps.clear();
    };
  }, [sceneIds]);

  return (
    <div className="stack-scenes" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
