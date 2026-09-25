"use client";

import { useProgress } from "@react-three/drei";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PanelProject } from "./InterfaceLayer";
import { measureSections, stackScroll, subscribeStack, updateStage } from "./scrollStore";
import { CAMERA_KEYS } from "./stages";

const StackCanvas = dynamic(() => import("./StackCanvas"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const { progress, active } = useProgress();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forced, setForced] = useState(false);
  const done = (minTimeElapsed && !active && progress >= 100) || forced;

  useEffect(() => {
    const a = setTimeout(() => setMinTimeElapsed(true), 1100);
    // Never trap a visitor behind a loader on a flaky connection.
    const b = setTimeout(() => setForced(true), 7000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  return (
    <div className={`stack-loader ${done ? "is-done" : ""}`} aria-hidden>
      <div className="stack-loader__inner">
        <span className="stack-mono">Booting the stack</span>
        <span className="stack-loader__count">{Math.round(done ? 100 : progress).toString().padStart(3, "0")}</span>
        <span className="stack-loader__bar">
          <span style={{ transform: `scaleX(${(done ? 100 : progress) / 100})` }} />
        </span>
      </div>
    </div>
  );
}

export function StackExperience({
  projects,
  children,
}: {
  projects: PanelProject[];
  children: React.ReactNode;
}) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Feature detection has to run in the browser, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(hasWebGL());
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stackScroll.reducedMotion = reduced;
    document.documentElement.classList.add("stack-root");

    const sections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    let els = sections();

    const onResize = () => {
      stackScroll.isMobile = window.innerWidth < 768;
      els = sections();
      measureSections();
      updateStage(window.scrollY);
    };
    onResize();

    const onPointer = (e: PointerEvent) => {
      stackScroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stackScroll.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    let lenis: Lenis | null = null;
    let raf = 0;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      lenis.on("scroll", ({ scroll }: { scroll: number }) => updateStage(scroll));
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const onNativeScroll = () => {
      if (!lenis) updateStage(window.scrollY);
    };

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { duration: 2.2 });
      else el.scrollIntoView();
    };

    // Section copy fades on its own local progress, written as a CSS var so
    // no React render happens during scroll.
    const unsub = subscribeStack((s) => {
      els.forEach((el, i) => {
        const p = Math.min(1, Math.max(0, s.stage - i));
        el.style.setProperty("--p", p.toFixed(4));
      });
      if (videoRef.current) {
        const v = 1 - Math.min(1, Math.max(0, (s.stage - 0.55) / 0.45));
        videoRef.current.style.opacity = v.toFixed(3);
        videoRef.current.style.visibility = v <= 0.001 ? "hidden" : "visible";
      }
      if (markerRef.current) markerRef.current.style.transform = `translateY(${(s.progress * 100).toFixed(2)}%)`;
      const idx = Math.min(CAMERA_KEYS.length - 1, Math.floor(s.stage));
      if (labelRef.current && labelRef.current.textContent !== CAMERA_KEYS[idx].label) {
        labelRef.current.textContent = CAMERA_KEYS[idx].label;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = `ALT ${(s.progress * 38).toFixed(1).padStart(4, "0")}m · ${String(idx).padStart(2, "0")}/${CAMERA_KEYS.length - 1}`;
      }
    });
    updateStage(window.scrollY);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("click", onAnchor);
    // Fonts and images shift layout after first paint.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      unsub();
      cancelAnimationFrame(raf);
      lenis?.destroy();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onAnchor);
      document.documentElement.classList.remove("stack-root");
    };
  }, []);

  return (
    <div className={`stack-home ${loaded || webgl === false ? "is-loaded" : ""}`}>
      <div className="stack-stage" aria-hidden>
        {webgl && <StackCanvas projects={projects} />}
        {webgl === false && <div className="stack-fallback" />}
      </div>

      <div ref={videoRef} className="stack-video" aria-hidden>
        <video src="/stack/hero-silicon.mp4" poster="/stack/hero-poster.webp" autoPlay muted loop playsInline preload="auto" />
      </div>

      <div className="stack-grain" aria-hidden />

      <header className="stack-topbar">
        <a href="#top" className="stack-wordmark">
          <span className="stack-wordmark__mark">KV</span>
          <span className="hidden sm:inline">Keith Vergara</span>
        </a>
        <nav aria-label="Primary" className="stack-nav">
          <a href="#work">Work</a>
          <Link href="/about">About</Link>
          <Link href="/experience">Journey</Link>
          <a href="#contact" className="stack-nav__cta">
            Contact
          </a>
        </nav>
      </header>

      <aside className="stack-altimeter" aria-hidden>
        <span className="stack-altimeter__rail">
          <span ref={markerRef} className="stack-altimeter__marker" />
        </span>
        <span ref={labelRef} className="stack-altimeter__label">
          Boot
        </span>
      </aside>

      <span ref={readoutRef} className="stack-readout" aria-hidden>
        ALT 00.0m · 00/10
      </span>

      {webgl && !loaded && <Preloader onDone={() => setLoaded(true)} />}

      <div className="stack-content">{children}</div>
    </div>
  );
}
