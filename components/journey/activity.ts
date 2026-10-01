import { dwell } from "@/components/stack/CameraRig";
import { stackScroll } from "@/components/stack/scrollStore";
import { JOURNEY_KEYS, STAGE, WAYPOINT_U, type JourneyKey } from "./stages";

/** Road position (0..1) a key is framed on. */
export function keyTravel(k: JourneyKey) {
  return k.kind === "route" ? WAYPOINT_U[k.waypoint] : k.travel;
}

/**
 * The pair of keys the scroll sits between and how far along it is, with the
 * same hold-then-travel easing as the other pages' cameras.
 */
export function segment(stage = stackScroll.stage) {
  const t = Math.max(0, stage - 0.5);
  const i = Math.min(Math.floor(t), JOURNEY_KEYS.length - 1);
  const a = JOURNEY_KEYS[i];
  const b = JOURNEY_KEYS[Math.min(i + 1, JOURNEY_KEYS.length - 1)];
  return { a, b, f: dwell(t - i) };
}

/** 0..1: how far up the road the traveller has come. The trail is lit up to here. */
export function travelled(stage = stackScroll.stage) {
  const { a, b, f } = segment(stage);
  const ua = keyTravel(a);
  return ua + (keyTravel(b) - ua) * f;
}

/** 0..1: how much a waypoint's own chapter is in focus right now. */
export function waypointFocus(i: number) {
  const d = Math.abs(stackScroll.stage - (STAGE.firstWaypoint + i + 0.5));
  return 1 - Math.min(1, d / 1.1);
}

/** 0..1 once the reader reaches the closing summit shot. */
export function summitFocus() {
  const d = Math.abs(stackScroll.stage - (STAGE.summit + 0.5));
  return 1 - Math.min(1, d / 1.1);
}

/** 0..1 while the reader looks down at the whole route from above. */
export function ledgerFocus() {
  const d = Math.abs(stackScroll.stage - (STAGE.ledger + 0.5));
  return 1 - Math.min(1, d / 1.1);
}
