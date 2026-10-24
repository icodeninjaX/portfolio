"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, type RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Section copy arrives like a film's titles: the scene line wipes on, the
// headline resolves letter by letter out of a blur while its tracking
// closes up, then the body rises line by line out of a mask. Each chapter's
// reveal is scrubbed by scroll, so it plays backwards on the way up. The
// hero title gets the same treatment as an opening title, played once when
// the loader lifts; the rest of the hero keeps its CSS entrance
// (`stack-reveal`), and the CSS `--fade` still handles each chapter's fade
// in and out around all this.

const TITLES = ".stack-h2, .stack-project__name, .stack-contact__title";
const BODY = ".stack-body, .stack-project__status";

function chapterTimeline(section: HTMLElement, blur: boolean) {
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: section,
      // Matches the `--p` the copy fades on: 0 when the section's top
      // crosses mid-screen, fully told by 0.4 of the way through.
      start: "top 50%",
      end: () => `+=${section.offsetHeight * 0.4}`,
      scrub: 0.8,
    },
  });

  const chapter = section.querySelector<HTMLElement>(".stack-chapter");
  if (chapter) {
    tl.fromTo(
      chapter,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.inOut" },
      0,
    );
  }

  section.querySelectorAll<HTMLElement>(TITLES).forEach((title) => {
    const split = SplitText.create(title, { type: "words,chars", aria: "auto" });
    tl.from(
      split.chars,
      {
        opacity: 0,
        yPercent: 18,
        filter: blur ? "blur(10px)" : "none",
        duration: 0.6,
        stagger: { amount: 0.5 },
      },
      0.15,
    ).from(title, { letterSpacing: "0.08em", duration: 1.1, ease: "power2.out" }, 0.15);
  });

  section.querySelectorAll<HTMLElement>(BODY).forEach((body) => {
    const split = SplitText.create(body, { type: "lines", mask: "lines", aria: "auto" });
    tl.from(split.lines, { yPercent: 100, duration: 0.5, stagger: 0.08 }, 0.6);
  });
}

// The opening title, timed to sit inside the hero's CSS entrance (kicker at
// 0.1s, lede at 0.5s): each line resolves out of a blur at its old `--d`.
function heroTimeline(title: HTMLElement, blur: boolean) {
  const split = SplitText.create(title, { type: "words,chars", aria: "auto" });
  // The lines are separate blocks, so the generated label would run them together.
  const lines = Array.from(title.querySelectorAll<HTMLElement>(".stack-line"));
  title.setAttribute("aria-label", lines.map((l) => l.textContent?.trim()).join(" "));
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  lines.forEach((line, i) => {
    const chars = split.chars.filter((c) => line.contains(c));
    tl.from(
      chars,
      {
        opacity: 0,
        yPercent: 22,
        filter: blur ? "blur(14px)" : "none",
        duration: 1.1,
        stagger: { amount: 0.55 },
      },
      0.2 + i * 0.14,
    );
  });
  // The italic line carries its own tracking, so it closes up separately.
  tl.from(
    [title, ...title.querySelectorAll("em")],
    { letterSpacing: "0.08em", duration: 1.9, ease: "power2.out" },
    0.2,
  );
  return tl;
}

export function useFilmTitles(scope: RefObject<HTMLElement | null>, loaded: boolean) {
  const hero = useRef<gsap.core.Timeline | null>(null);
  const loadedRef = useRef(loaded);

  useEffect(() => {
    loadedRef.current = loaded;
    if (loaded) hero.current?.play();
  }, [loaded]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          // A blur per letter, scrubbed, is too much compositing for phones.
          wide: "(min-width: 768px)",
        },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          const root = scope.current;
          if (!motion || !root) return;
          root.querySelectorAll<HTMLElement>("[data-stage]").forEach((section) => {
            if (section.querySelector(".stack-hero")) return;
            chapterTimeline(section, wide);
          });

          const title = root.querySelector<HTMLElement>(".stack-hero__title");
          if (!title) return;
          // Hands the title from its CSS entrance to the timeline. On the
          // title, not the root: React owns the root's className.
          title.dataset.film = "";
          const tl = heroTimeline(title, wide);
          // Rebuilt after load (crossing the phone breakpoint): just show it.
          if (loadedRef.current) tl.progress(1);
          hero.current = tl;
          return () => {
            hero.current = null;
            delete title.dataset.film;
          };
        },
      );
    },
    { scope },
  );
}

/** Lets Lenis run on GSAP's clock so smooth scroll and scrubbed reveals share one frame. */
export function driveLenis(lenis: { raf: (time: number) => void }) {
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => gsap.ticker.remove(tick);
}

export { ScrollTrigger };
