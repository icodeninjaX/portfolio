"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";

type Shot = { src: string; width: number; height: number; label: string; caption: string };

// Desktop screenshots as one app window on a lit stage: a browser bar with the
// project's address, ghost windows stacked behind, a swipeable/scroll-snapped
// viewport, one live caption and a numbered filmstrip to jump between views.
// Without JS it is still a native horizontal scroller; in print every
// screenshot is listed (see the print rules in simple.css).
export function DesktopShowcase({ shots, name, host, figStart }: { shots: Shot[]; name: string; host: string; figStart: number }) {
  const viewport = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const many = shots.length > 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  const fig = (i: number) => pad(figStart + i + 1);

  // The window keeps one shape per project: the median screenshot ratio.
  const ratios = shots.map((s) => s.width / s.height).sort((a, b) => a - b);
  const ratio = ratios[Math.floor(ratios.length / 2)];

  // Where the viewport is heading. Arrows and keys step from here rather than
  // from `active`, so quick repeated presses never lose a step mid-scroll.
  const target = useRef(0);

  const go = useCallback((i: number) => {
    const el = viewport.current;
    if (!el) return;
    const next = (i + shots.length) % shots.length;
    target.current = next;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, [shots.length]);

  // Active slide follows the scroll position, so swipes, buttons and keys agree.
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
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); clearTimeout(settle); };
  }, []);

  // Print lists every screenshot, so load the ones nobody has swiped to yet.
  useEffect(() => {
    const eager = () => viewport.current?.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
    window.addEventListener("beforeprint", eager);
    return () => window.removeEventListener("beforeprint", eager);
  }, []);

  // Keep the current thumbnail in view inside the filmstrip.
  useEffect(() => {
    const thumb = rail.current?.children[active] as HTMLElement | undefined;
    const strip = rail.current;
    if (!thumb || !strip) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(target.current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(target.current - 1); }
  };

  const current = shots[Math.min(active, shots.length - 1)];
  const path = current.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="rs-showcase" role="region" aria-roledescription="carousel" aria-label={`${name} on a desktop`} onKeyDown={onKey}>
      <div className={many ? "rs-window rs-window-stacked" : "rs-window"}>
        <div className="rs-window-bar" aria-hidden="true">
          <span className="rs-window-lights"><i /><i /><i /></span>
          <span className="rs-window-address"><b>{host}</b>/{path}</span>
          {many && <span className="rs-window-count">{pad(active + 1)} <em>/ {pad(shots.length)}</em></span>}
        </div>
        <div className="rs-window-viewport" ref={viewport} tabIndex={0} aria-label={many ? "Screenshots, use the arrow keys to move between them" : undefined}>
          {shots.map((s, i) => (
            // Taller than the window: fill it from the top. Wider: fit the whole width.
            <figure key={s.src} className={s.width / s.height < ratio - 0.01 ? "rs-window-slide rs-window-slide-tall" : "rs-window-slide"} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${shots.length}: ${s.label}`} style={{ aspectRatio: String(ratio) }}>
              <a href={s.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${s.label} at full size (new tab)`} tabIndex={i === active ? 0 : -1}>
                <Image src={s.src} alt={`${name}: ${s.label}`} width={s.width} height={s.height} sizes="(max-width: 899px) 94vw, 720px" priority={i === 0} />
              </a>
              <figcaption className="rs-window-print-caption"><span>Fig. {fig(i)}</span> {s.label}. {s.caption}</figcaption>
            </figure>
          ))}
        </div>
        {many && (
          <>
            <button type="button" className="rs-window-nav rs-window-prev" onClick={() => go(target.current - 1)} aria-label="Previous screenshot"><LuArrowLeft aria-hidden="true" /></button>
            <button type="button" className="rs-window-nav rs-window-next" onClick={() => go(target.current + 1)} aria-label="Next screenshot"><LuArrowRight aria-hidden="true" /></button>
          </>
        )}
      </div>

      <div className="rs-showcase-caption" aria-live="polite">
        <p className="rs-showcase-title"><span>Fig. {fig(active)}</span> {current.label}</p>
        <p className="rs-showcase-text">{current.caption}</p>
        <a className="rs-showcase-open" href={current.src} target="_blank" rel="noopener noreferrer">Full size <LuArrowUpRight aria-hidden="true" /></a>
      </div>

      {many && (
        <ol className="rs-showcase-rail" ref={rail} aria-label="All desktop views">
          {shots.map((s, i) => (
            <li key={s.src}>
              <button type="button" onClick={() => go(i)} aria-current={i === active ? "true" : undefined} aria-label={`Show ${s.label}`}>
                <span className="rs-rail-thumb"><Image src={s.src} alt="" width={s.width} height={s.height} sizes="150px" /></span>
                <span className="rs-rail-label"><em>{fig(i)}</em> {s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
