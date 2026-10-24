"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Section copy arrives like a film's titles: the scene line wipes on, the
// headline resolves letter by letter out of a blur while its tracking
// closes up, then the body rises line by line out of a mask. Each chapter's
// reveal is scrubbed by scroll, so it plays backwards on the way up. The
// hero keeps its own load-time entrance (`stack-reveal`); the CSS `--fade`
// still handles each chapter's fade in and out around this.

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

export function useFilmTitles(scope: RefObject<HTMLElement | null>) {
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
          if (!motion) return;
          scope.current?.querySelectorAll<HTMLElement>("[data-stage]").forEach((section) => {
            if (section.querySelector(".stack-hero")) return;
            chapterTimeline(section, wide);
          });
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
