import { resumeData } from "@/lib/data";
import * as THREE from "three";
import { ROUTE, SUMMIT, waypointU } from "./terrain";

// The Journey page travels along instead of up (homepage) or in (About): one
// road spiralling up a mountain, a survey monolith at every milestone. Every
// DOM section marked `data-stage` maps, in order, onto one key below.

export const WAYPOINTS = resumeData.journey;
export const WAYPOINT_U = waypointU(WAYPOINTS.length);

/** Camera trailing a point on the road: behind it, out from the slope, above it. */
export type RouteShot = {
  kind: "route";
  /** Which waypoint the shot is framed on. */
  waypoint: number;
  back: number;
  side: number;
  lift: number;
  /** How far up the monolith to aim. */
  look: number;
  shift: number;
};

/** Camera parked anywhere, looking at a fixed point. */
export type FreeShot = {
  kind: "free";
  pos: [number, number, number];
  target: [number, number, number];
  /** Where the lit trail should have reached, 0..1 of the road. */
  travel: number;
  shift: number;
};

export type JourneyKey = (RouteShot | FreeShot) & { label: string };

const label = (i: number) => `WP${String(i + 1).padStart(2, "0")} · ${WAYPOINTS[i].year}`;
const last = WAYPOINTS.length - 1;

// The road winds too tightly near the top for a trailing camera, so the
// summit waypoint gets a composed shot: back down the final approach,
// looking up at the last monolith against the sky.
const approach = ROUTE.getPointAt(0.9).sub(SUMMIT).setY(0).normalize();
export const summitStop: FreeShot & { label: string } = {
  kind: "free",
  pos: SUMMIT.clone().addScaledVector(approach, 6.5).add(new THREE.Vector3(0, 1.6, 0)).toArray(),
  target: SUMMIT.clone().add(new THREE.Vector3(0, 1.4, 0)).toArray(),
  travel: WAYPOINT_U[last],
  shift: last % 2 ? -0.3 : 0.3,
  label: label(last),
};

const stops: JourneyKey[] = WAYPOINTS.map((_, i) =>
  i === last
    ? summitStop
    : {
        kind: "route",
        waypoint: i,
        back: 4.4,
        // Alternate the framing so the monolith sits opposite the copy.
        side: i % 2 ? 2.8 : 3.8,
        lift: 1.6 + (i % 3) * 0.3,
        look: 1,
        shift: i % 2 ? -0.3 : 0.3,
        label: label(i),
      },
);

export const JOURNEY_KEYS: JourneyKey[] = [
  { kind: "free", pos: [-15, 21, 46], target: [1.5, 3.4, 0], travel: 0, shift: 0, label: "Trailhead" },
  ...stops,
  { kind: "free", pos: [4, 50, 30], target: [0, 0, 1], travel: 1, shift: -0.3, label: "The ledger" },
  { kind: "free", pos: [15, 12.5, 13], target: [0, 12, 0], travel: 1, shift: 0, label: "Summit" },
];

export const STAGE = {
  trailhead: 0,
  firstWaypoint: 1,
  ledger: WAYPOINTS.length + 1,
  summit: WAYPOINTS.length + 2,
} as const;
