// Shared scroll state between the DOM (sections) and the WebGL scene.
// Plain mutable object on purpose: the canvas reads it every frame, so
// routing it through React state would re-render the tree 60 times a second.

export type StackScroll = {
  /** Continuous stage value: section index + progress inside that section. */
  stage: number;
  /** 0..1 over the whole document. */
  progress: number;
  /** Normalised pointer position, -1..1 on both axes. */
  pointer: { x: number; y: number };
  /** Section metrics, measured on resize. */
  sections: { top: number; height: number }[];
  reducedMotion: boolean;
  isMobile: boolean;
};

export const stackScroll: StackScroll = {
  stage: 0,
  progress: 0,
  pointer: { x: 0, y: 0 },
  sections: [],
  reducedMotion: false,
  isMobile: false,
};

type Listener = (s: StackScroll) => void;
const listeners = new Set<Listener>();

export function subscribeStack(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function measureSections() {
  const els = document.querySelectorAll<HTMLElement>("[data-stage]");
  stackScroll.sections = Array.from(els).map((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height };
  });
}

export function updateStage(scrollY: number) {
  const vh = window.innerHeight;
  const probe = scrollY + vh * 0.5;
  const { sections } = stackScroll;
  let stage = 0;
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (probe >= s.top) {
      stage = i + Math.min(1, (probe - s.top) / Math.max(1, s.height));
    }
  }
  stackScroll.stage = stage;
  const max = document.documentElement.scrollHeight - vh;
  stackScroll.progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  listeners.forEach((fn) => fn(stackScroll));
}
