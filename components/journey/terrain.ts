import * as THREE from "three";

// The world of the Journey page: one mountain, one road up it. Everything is
// a pure function of position so the terrain mesh, the road, the monoliths
// and the camera all agree on where the ground is.

export const PEAK = 9;
const SIGMA = 11;

/** Far ranges that give the horizon a skyline. [x, z, height, spread] */
const RANGES: [number, number, number, number][] = [
  [-34, -20, 5.5, 9],
  [30, -30, 6.5, 10],
  [-40, 22, 3.8, 8],
  [38, 16, 4.2, 9],
  [4, -46, 7, 13],
];

/** Ground height at a point on the map. */
export function heightAt(x: number, z: number) {
  const r = Math.hypot(x, z);
  const theta = Math.atan2(z, x);
  // The massif: a gaussian peak with a few ridges running off it.
  // Faded out at the peak, where the angle is undefined and would tear a seam.
  const ridged = THREE.MathUtils.smoothstep(r, 0.8, 6);
  const ridges = 1 + ridged * (0.1 * Math.sin(theta * 3 + r * 0.35) + 0.05 * Math.sin(theta * 7 - r * 0.2));
  let h = PEAK * Math.exp(-((r / SIGMA) ** 2)) * ridges;
  for (const [cx, cz, ch, cs] of RANGES) {
    const d2 = (x - cx) ** 2 + (z - cz) ** 2;
    h += ch * Math.exp(-d2 / (cs * cs));
  }
  // Rolling foothills, kept off the upper slopes so the summit stays clean.
  const foot = THREE.MathUtils.smoothstep(r, 6, 20);
  h +=
    foot *
    (0.55 * Math.sin(x * 0.21 + 1.3) * Math.cos(z * 0.17 - 0.4) +
      0.3 * Math.sin(x * 0.47 - z * 0.39 + 2.1) +
      0.16 * Math.sin(x * 0.93 + z * 0.81));
  return h;
}

const TURNS = 1.55;
const R_START = 25;
const R_END = 1.1;
const THETA_0 = 2.35;

/** Raw spiral, s in 0..1: foot of the mountain to the summit. */
function spiral(s: number, out = new THREE.Vector3()) {
  const theta = THETA_0 - s * TURNS * Math.PI * 2;
  const r = R_END + (R_START - R_END) * Math.pow(1 - s, 1.15);
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;
  return out.set(x, heightAt(x, z) + 0.05, z);
}

/** The road, parameterised by arc length through `getPointAt(u)`. */
export const ROUTE = new THREE.CatmullRomCurve3(
  Array.from({ length: 420 }, (_, i) => spiral(i / 419)),
  false,
  "centripetal",
);
ROUTE.arcLengthDivisions = 2000;

export const SUMMIT = ROUTE.getPointAt(1);

/** Arc-length position of each waypoint on the road; the last one is the summit. */
export function waypointU(count: number) {
  return Array.from({ length: count }, (_, i) => 0.035 + (i / (count - 1)) * 0.965);
}

const tmpT = new THREE.Vector3();

/** Horizontal unit vector pointing away from the mountain at a road position. */
export function outwardAt(p: THREE.Vector3, out = new THREE.Vector3()) {
  out.set(p.x, 0, p.z);
  if (out.lengthSq() < 1e-6) return out.set(0, 0, 1);
  return out.normalize();
}

/** Horizontal unit tangent along the road. */
export function tangentAt(u: number, out = new THREE.Vector3()) {
  ROUTE.getTangentAt(THREE.MathUtils.clamp(u, 0, 1), tmpT);
  out.set(tmpT.x, 0, tmpT.z);
  return out.lengthSq() < 1e-6 ? out.set(1, 0, 0) : out.normalize();
}

/** Metres climbed at a road position; always rises, whatever the foothills do. */
export const SUMMIT_ELEVATION = 1062;
export function elevation(u: number) {
  return Math.round(THREE.MathUtils.clamp(u, 0, 1) * SUMMIT_ELEVATION);
}
