import { resumeData } from "@/lib/data";
import type { CameraShot } from "@/components/stack/stages";

// The About page is the homepage turned inside out: instead of climbing a
// tower, you dive through a gyroscope of nested rings toward a core. Every
// DOM section marked `data-stage` maps, in order, onto one keyframe below.

export const STAGE = {
  surface: 0,
  origin: 1,
  orbit: 2,
  offhours: 3,
  drive: 4,
  trajectory: 5,
  core: 6,
} as const;

export type StageName = keyof typeof STAGE;

export type AboutKey = CameraShot & { label: string };

export const ABOUT_KEYS: AboutKey[] = [
  { r: 13, a: 0, y: 1, tr: 0, ta: 0, ty: -1.2, shift: 0, label: "Surface" },
  { r: 12.5, a: 35, y: 2.6, tr: 0, ta: 0, ty: 0, shift: 0.3, label: "R1 · Origin" },
  { r: 11.5, a: 125, y: 6, tr: 0, ta: 0, ty: 0, shift: -0.3, label: "R2 · Orbit" },
  { r: 10.5, a: 205, y: 0.6, tr: 0, ta: 0, ty: 0.2, shift: 0.3, label: "R3 · Off-hours" },
  // Threaded between the two innermost rings, eye to eye with the core.
  { r: 2.9, a: 290, y: 0.5, tr: 0, ta: 0, ty: 0, shift: -0.3, label: "R4 · Drive" },
  { r: 15, a: 350, y: 6.5, tr: 0, ta: 0, ty: 2.6, shift: 0.3, label: "R5 · Trajectory" },
  { r: 2, a: 410, y: 24, tr: 0, ta: 0, ty: 0, shift: 0, label: "Core" },
];

export type RingSpec = {
  stage: StageName;
  radius: number;
  band: number;
  /** Gimbal axis this ring pivots on inside its parent. */
  axis: "x" | "z";
  /** Resting tilt (radians) while the gyroscope is still tumbling. */
  tilt: number;
  wobble: number;
  spin: number;
  engraving: string;
};

const { about } = resumeData;

// Outermost first; each ring is mounted inside the previous one.
export const RINGS: RingSpec[] = [
  {
    stage: "origin",
    radius: 4.3,
    band: 0.22,
    axis: "x",
    tilt: 0.95,
    wobble: 0.22,
    spin: 0.05,
    engraving: `ORIGIN  ·  LAS PIÑAS CITY, PH  ·  14.45° N  120.98° E  ·  ${resumeData.name.toUpperCase()}  ·  EST. 2014`,
  },
  {
    stage: "orbit",
    radius: 3.3,
    band: 0.18,
    axis: "z",
    tilt: -1.15,
    wobble: 0.28,
    spin: -0.07,
    engraving: resumeData.journey.map((j) => j.year.toUpperCase()).join("  ·  "),
  },
  {
    stage: "offhours",
    radius: 2.35,
    band: 0.15,
    axis: "x",
    tilt: -0.7,
    wobble: 0.35,
    spin: 0.09,
    engraving: about.interestList.map((s) => s.toUpperCase()).join("  ·  "),
  },
  {
    stage: "drive",
    radius: 1.5,
    band: 0.12,
    axis: "z",
    tilt: 1.3,
    wobble: 0.4,
    spin: -0.12,
    engraving: "SHIP IT  ·  SEE IT WORK  ·  REPEAT",
  },
];

export const JOURNEY_COUNT = resumeData.journey.length;
