import { CAMERA_KEYS, LAYER_Y } from "./stages";
import { stackScroll } from "./scrollStore";

/** 0..1 — how much the given layer is "in focus" at the current scroll. */
export function layerActivity(layer: keyof typeof LAYER_Y) {
  let best = 0;
  for (let i = 0; i < CAMERA_KEYS.length; i++) {
    const key = CAMERA_KEYS[i].layer;
    if (key !== layer && key !== "all") continue;
    const d = Math.abs(stackScroll.stage - (i + 0.5));
    const weight = key === "all" ? 0.8 : 1;
    best = Math.max(best, (1 - Math.min(1, d / 1.1)) * weight);
  }
  return best;
}

/** Deterministic PRNG so generated geometry is identical on every load. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const AMBER = "#ff7a1a";
export const PLATE_SIZE = 7;
