"use client";

import { useProgress } from "@react-three/drei";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { measureSections, stackScroll, subscribeStack, updateStage, type StackScroll } from "./scrollStore";

// The chrome every immersive page shares: preloader, smooth scroll, top bar,
// altimeter, readout, hero video and grain. Pages bring their own canvas,
// stage labels and copy.

export type NavItem = {
  href: string;
  label: string;
  cta?: boolean;
  current?: boolean;
  /** Stay visible on phones, where the rest of the nav collapses. */
  keep?: boolean;
};

export type StackShellProps = {
  /** One label per `data-stage` section, shown on the altimeter. */
  labels: string[];
  /** Rendered only when WebGL is available. */
  canvas: React.ReactNode;
  video: { src: string; poster: string };
  nav: NavItem[];
  /** Where the wordmark points. */
  home: string;
  loaderLabel: string;
  readout: (s: StackScroll, index: number, last: number) => string;
  /** Background for browsers without WebGL. */
  fallback?: string;
  /** Whether the canvas streams textures the loader should wait on. */
  assets?: boolean;
  className?: string;
  children: React.ReactNode;
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function Preloader({ label, assets, onDone }: { label: string; assets: boolean; onDone: () => void }) {
  const { progress: loaded, active } = useProgress();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forced, setForced] = useState(false);
  // Procedural scenes have nothing to download, so the count just runs up.
  const [tick, setTick] = useState(0);
  const progress = assets ? loaded : tick;
  const done = (minTimeElapsed && !active && progress >= 100) || forced;

  useEffect(() => {
    if (assets) return;
    const start = performance.now();
    let raf = 0;
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / 1000);
      setTick(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [assets]);

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
        <span className="stack-mono">{label}</span>
        <span className="stack-loader__count">{Math.round(done ? 100 : progress).toString().padStart(3, "0")}</span>
        <span className="stack-loader__bar">
          <span style={{ transform: `scaleX(${(done ? 100 : progress) / 100})` }} />
        </span>
      </div>
    </div>
  );
}

export function StackShell({
  labels,
  canvas,
  video,
  nav,
  home,
  loaderLabel,
  readout,
  fallback,
  assets = true,
  className = "",
  children,
}: StackShellProps) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  // Latest props without re-running the scroll effect.
  const config = useRef({ labels, readout });
  useEffect(() => {
    config.current = { labels, readout };
  });

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
      const { labels: names, readout: format } = config.current;
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
      const idx = Math.min(names.length - 1, Math.floor(s.stage));
      if (labelRef.current && labelRef.current.textContent !== names[idx]) {
        labelRef.current.textContent = names[idx];
      }
      if (readoutRef.current) readoutRef.current.textContent = format(s, idx, names.length - 1);
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
    <div className={`stack-home ${className} ${loaded || webgl === false ? "is-loaded" : ""}`}>
      <div className="stack-stage" aria-hidden>
        {webgl && canvas}
        {webgl === false && (
          <div className="stack-fallback" style={fallback ? { backgroundImage: `url("${fallback}")` } : undefined} />
        )}
      </div>

      <div ref={videoRef} className="stack-video" aria-hidden>
        <video src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="auto" />
      </div>

      <div className="stack-grain" aria-hidden />

      <header className="stack-topbar">
        <NavLink href={home} className="stack-wordmark">
          <span className="stack-wordmark__mark">KV</span>
          <span className="hidden sm:inline">Keith Vergara</span>
        </NavLink>
        <nav aria-label="Primary" className="stack-nav">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              className={item.cta ? "stack-nav__cta" : item.keep ? "stack-nav__keep" : undefined}
              current={item.current}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <aside className="stack-altimeter" aria-hidden>
        <span className="stack-altimeter__rail">
          <span ref={markerRef} className="stack-altimeter__marker" />
        </span>
        <span ref={labelRef} className="stack-altimeter__label">
          {labels[0]}
        </span>
      </aside>

      <span ref={readoutRef} className="stack-readout" aria-hidden />

      {webgl && !loaded && <Preloader label={loaderLabel} assets={assets} onDone={() => setLoaded(true)} />}

      <div className="stack-content">{children}</div>
    </div>
  );
}

function NavLink({
  href,
  className,
  current,
  children,
}: {
  href: string;
  className?: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  // In-page anchors stay plain <a> so the smooth-scroll handler catches them.
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
