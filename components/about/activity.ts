import { stackScroll } from "@/components/stack/scrollStore";
import { STAGE, type StageName } from "./stages";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function smooth(edge0: number, edge1: number, v: number) {
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** 0..1: how much the given chapter is in focus right now. */
export function focus(name: StageName) {
  const d = Math.abs(stackScroll.stage - (STAGE[name] + 0.5));
  return 1 - Math.min(1, d / 1.1);
}

/** 0..1 progress through a chapter's own section. */
export function chapterProgress(name: StageName) {
  return clamp01(stackScroll.stage - STAGE[name]);
}

/** 0 while the gyroscope tumbles, 1 once every ring has settled into one plane. */
export function alignment() {
  return smooth(STAGE.drive + 0.55, STAGE.trajectory + 0.45, stackScroll.stage);
}

/** 0..1 as the trajectory beam fires up out of the core. */
export function launch() {
  return smooth(STAGE.trajectory + 0.1, STAGE.trajectory + 0.75, stackScroll.stage);
}
