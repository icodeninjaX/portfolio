import { resumeData } from "@/lib/data";

// The homepage is a single tower of exploded layers. Every DOM section marked
// with `data-stage` maps, in order, onto one camera keyframe below.

export const LAYER_Y = {
  silicon: 0,
  network: 5,
  data: 10,
  interface: 16,
  crown: 23,
} as const;

export const PROJECT_COUNT = resumeData.projects.length;

export const PANEL_RING = { radius: 6.2, y: 16.9, startDeg: 330, stepDeg: 360 / Math.max(PROJECT_COUNT, 1) };

export function panelAngleDeg(index: number) {
  return PANEL_RING.startDeg + index * PANEL_RING.stepDeg;
}

/**
 * Cylindrical camera keyframe. Angles are in degrees and intentionally keep
 * growing past 360 so interpolation always orbits forward around the tower.
 */
export type CameraKey = {
  r: number;
  a: number;
  y: number;
  /** Look-at target, also cylindrical. */
  tr: number;
  ta: number;
  ty: number;
  /** Horizontal framing shift (fraction of viewport) to make room for copy. */
  shift: number;
  /** Which layer glows while this stage is in view ("all" lights the whole tower). */
  layer: keyof typeof LAYER_Y | "all";
  /** Short label for the HUD altimeter. */
  label: string;
};

const projectKey = (i: number): CameraKey => ({
  r: 16.2,
  a: panelAngleDeg(i),
  y: 17.6,
  tr: PANEL_RING.radius,
  ta: panelAngleDeg(i),
  ty: PANEL_RING.y,
  shift: 0.36,
  layer: "interface",
  label: "L4 · Interface",
});

export const CAMERA_KEYS: CameraKey[] = [
  { r: 7.6, a: 18, y: 1.7, tr: 0, ta: 0, ty: 0.3, shift: 0, layer: "silicon", label: "Boot" },
  { r: 10.2, a: 42, y: 5, tr: 0, ta: 0, ty: 0, shift: 0.3, layer: "silicon", label: "L1 · Silicon" },
  { r: 12.5, a: 150, y: 9.8, tr: 0, ta: 0, ty: 5, shift: -0.3, layer: "network", label: "L2 · Signal" },
  { r: 12, a: 252, y: 14.5, tr: 0, ta: 0, ty: 10, shift: 0.3, layer: "data", label: "L3 · Data" },
  ...Array.from({ length: PROJECT_COUNT }, (_, i) => projectKey(i)),
  { r: 47, a: panelAngleDeg(PROJECT_COUNT - 1) + 70, y: 17, tr: 0, ta: 0, ty: 11.2, shift: -0.34, layer: "all", label: "Now" },
  { r: 2.6, a: panelAngleDeg(PROJECT_COUNT - 1) + 122, y: 38, tr: 0, ta: 0, ty: 8, shift: 0, layer: "crown", label: "Contact" },
];

export const PROJECT_STAGE_OFFSET = 4;
