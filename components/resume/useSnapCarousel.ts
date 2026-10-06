"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A horizontal scroll-snap track (one slide per viewport width) driven by
// swipes, buttons and keys alike: `active` follows the scroll position, and
// `step` moves from where the track is heading rather than from `active`, so
// quick repeated presses never lose a step mid-scroll. Print lists every
// slide, so images nobody has scrolled to are loaded before printing.
export function useSnapCarousel(count: number) {
  const viewport = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const [active, setActive] = useState(0);

  const go = useCallback((i: number) => {
    const el = viewport.current;
    if (!el) return;
    const next = (i + count) % count;
    target.current = next;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, [count]);

  const step = useCallback((d: number) => go(target.current + d), [go]);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let frame = 0;
    let settle = 0;
    const index = () => Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(index()));
      // Once a swipe comes to rest, steps continue from where it landed.
      clearTimeout(settle);
      settle = window.setTimeout(() => { target.current = index(); }, 150);
    };
    const eager = () => el.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeprint", eager);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeprint", eager);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  }, [step]);

  return { viewport, active: Math.min(active, count - 1), go, step, onKeyDown };
}
