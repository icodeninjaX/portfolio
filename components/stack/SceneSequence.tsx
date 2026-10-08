"use client";

import { useEffect, useRef } from "react";
import { SCENE_MANIFEST } from "./sceneManifest";
import { stackScroll, subscribeStack } from "./scrollStore";

// The homepage background: me, filmed scene by scene. Each `data-stage`
// section holds on one still; between sections the transition clip
// (pre-cut into frames by scripts/scenes/build-frames.mjs) is scrubbed by
// scroll and drawn to a 2D canvas, so it plays forwards and backwards.

const { base, scenes, focus: FOCUS, frames } = SCENE_MANIFEST;
const SEGMENTS = frames.length;

/** On portrait screens the scene fills this much of the height and fades into the copy below. */
const PORTRAIT_SCENE = 0.72;

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
    const url = (seg: number, f: number) =>
      `${base}/${set}/${String(seg).padStart(2, "0")}-${String(f).padStart(3, "0")}.webp`;

    const loaded = new Map<string, HTMLImageElement>();
    const requested = new Set<string>();
    let dirty = true;
    let disposed = false;

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
    const nearest = (seg: number, f: number) => {
      for (let d = 0; d < frames[seg]; d++) {
        const a = loaded.get(key(seg, f - d));
        if (a) return a;
        const b = loaded.get(key(seg, f + d));
        if (b) return b;
      }
      return undefined;
    };

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.round(window.innerWidth * dpr);
      h = Math.round(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      dirty = true;
    };
    resize();

    const pointer = { x: 0, y: 0 };
    // Height the scene is drawn into; on portrait screens the rest is the copy's dark floor.
    const sceneH = () => (set === "m" ? Math.round(h * PORTRAIT_SCENE) : h);
    const cover = (img: HTMLImageElement, focus: number, alpha: number) => {
      const zoom = 1.045;
      const boxH = sceneH();
      const scale = Math.max(w / img.naturalWidth, boxH / img.naturalHeight) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const spareX = dw - w;
      const spareY = dh - boxH;
      // Phone frames are already centred on me.
      const fx = set === "m" ? 0.5 : focus;
      const x = -spareX * Math.min(1, Math.max(0, fx + pointer.x * 0.04));
      const y = -spareY * (set === "m" ? 0.35 : 0.5 + pointer.y * 0.18);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, x, y, dw, dh);
    };

    // Portrait: melt the bottom of the scene into the page colour.
    const floor = () => {
      if (set !== "m") return;
      const boxH = sceneH();
      const g = ctx.createLinearGradient(0, boxH * 0.55, 0, boxH);
      g.addColorStop(0, "rgba(10, 9, 8, 0)");
      g.addColorStop(1, "rgba(10, 9, 8, 1)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, boxH);
      // The zoomed frame overhangs the scene box; keep the floor solid below it.
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, boxH, w, h - boxH);
    };

    // Shade the half opposite the subject, where the section copy sits.
    const shade = (focus: number) => {
      const side = (focus - 0.5) * 2;
      if (Math.abs(side) < 0.05 || set === "m") return;
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

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, w, h);
      paint(from, to, t, focus);
      shade(focus);
      floor();
    };

    const paint = (from: number, to: number, t: number, focus: number) => {
      if (t > 0 && to === from + 1 && from < SEGMENTS) {
        // Scrub the clip that joins the two scenes, blending neighbouring frames.
        const pos = t * (frames[from] - 1);
        const f0 = Math.floor(pos);
        const a = nearest(from, f0);
        const b = loaded.get(key(from, Math.min(frames[from] - 1, f0 + 1)));
        if (a) cover(a, focus, 1);
        if (b && a !== b) cover(b, focus, pos - f0);
        if (a || b) return;
      }
      // Holding on a scene, or two scenes without a clip between them: crossfade stills.
      const sa = loaded.get(key(...still(from)));
      const sb = loaded.get(key(...still(to)));
      if (sa) cover(sa, focus, 1);
      if (sb && t > 0 && to !== from) cover(sb, focus, t);
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
      }
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
    };
  }, [sceneIds]);

  return (
    <div className="stack-scenes" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
