import { sceneStops } from "./chapters";

export type ScrollState = { progress: number; visible: boolean; mobile: boolean };
export type JourneyController = {
  state: ScrollState;
  subscribe: (callback: () => void) => () => void;
  notify: () => void;
};
export function createJourneyController(): JourneyController {
  const listeners = new Set<() => void>();
  return {
    state: { progress: 0, visible: true, mobile: false },
    subscribe(callback) { listeners.add(callback); return () => { listeners.delete(callback); }; },
    notify() { listeners.forEach(callback => callback()); },
  };
}

/** One passive observer feeds a ref, never React state on every scroll. */
export function observeJourney(state: ScrollState, changed: () => void) {
  let positions: number[] = [];
  let frame = 0;
  const stage = document.getElementById("studio-stage");
  const measure = () => {
    state.mobile = window.innerWidth < 1024;
    const offset = state.mobile ? (stage?.getBoundingClientRect().bottom ?? 320) + 24 : window.innerHeight * 0.24;
    positions = sceneStops.map(({ id }, index) => index === 0 ? 0 : Math.max(0, (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY - offset));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    positions[positions.length - 1] = Math.min(positions.at(-1) ?? max, max);
    update();
  };
  const update = () => {
    frame = 0;
    const y = window.scrollY;
    let i = 0;
    while (i < positions.length - 1 && y >= positions[i + 1]) i++;
    const span = (positions[i + 1] ?? positions[i]) - positions[i];
    state.progress = i + (span > 0 ? Math.min(1, Math.max(0, (y - positions[i]) / span)) : 0);
    state.visible = !document.hidden;
    if (state.visible) changed();
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  const resize = new ResizeObserver(measure);
  resize.observe(document.getElementById("main-content") ?? document.body);
  if (stage) resize.observe(stage);
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pageshow", measure);
  document.addEventListener("visibilitychange", update);
  window.visualViewport?.addEventListener("resize", measure);
  let disposed = false;
  document.fonts.ready.then(() => { if (!disposed) measure(); });
  measure();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect();
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", measure);
    window.removeEventListener("pageshow", measure);
    document.removeEventListener("visibilitychange", update);
    window.visualViewport?.removeEventListener("resize", measure);
  };
}
