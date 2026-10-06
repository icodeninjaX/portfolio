"use client";

import Image from "next/image";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { useSnapCarousel } from "./useSnapCarousel";

type Screen = { src: string; width: number; height: number; label: string; alt: string; caption: string };

// Phone screenshots as one live phone on a lit stage: the screens slide inside
// it, the previous and next views fan out behind it as tilted ghost phones, and
// the notes become a caption panel beside it (Fig. number, live caption,
// segmented progress and a numbered index of every view). On phones it stacks
// and you swipe the phone itself. Print lists every screen with its note.
export function PhoneShowcase({ screens, name, note }: { screens: Screen[]; name: string; note?: string }) {
  const { viewport, active, go, step, onKeyDown } = useSnapCarousel(screens.length);
  const many = screens.length > 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  const current = screens[active];
  const prev = screens[(active - 1 + screens.length) % screens.length];
  const next = screens[(active + 1) % screens.length];

  // One screen shape per project: the median screenshot ratio.
  const ratios = screens.map((s) => s.width / s.height).sort((a, b) => a - b);
  const ratio = ratios[Math.floor(ratios.length / 2)];

  return (
    <div className="rs-phones" role="region" aria-roledescription="carousel" aria-label={`${name} on a phone`} onKeyDown={onKeyDown}>
      <div className="rs-phones-stage">
        {many && screens.length > 2 && (
          <div className="rs-phones-fan" aria-hidden="true">
            <span className="rs-fan-phone rs-fan-prev" key={`p-${prev.src}`}><Image src={prev.src} alt="" width={prev.width} height={prev.height} sizes="180px" /></span>
            <span className="rs-fan-phone rs-fan-next" key={`n-${next.src}`}><Image src={next.src} alt="" width={next.width} height={next.height} sizes="180px" /></span>
          </div>
        )}
        <div className="rs-phone">
          <div className="rs-phone-screen" ref={viewport} tabIndex={0} aria-label={many ? "Phone screens, use the arrow keys to move between them" : undefined} style={{ aspectRatio: String(ratio) }}>
            {screens.map((s, i) => (
              <figure key={s.src} className="rs-phone-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${screens.length}: ${s.label}`}>
                <a href={s.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${s.label} at full size (new tab)`} tabIndex={i === active ? 0 : -1}>
                  <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 639px) 66vw, 270px" priority={i === 0} />
                </a>
                <figcaption className="rs-phone-print-caption"><span>Fig. {pad(i + 1)}</span> {s.label}. {s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        {many && (
          <>
            <button type="button" className="rs-phones-nav rs-phones-prev" onClick={() => step(-1)} aria-label="Previous screen"><LuArrowLeft aria-hidden="true" /></button>
            <button type="button" className="rs-phones-nav rs-phones-next" onClick={() => step(1)} aria-label="Next screen"><LuArrowRight aria-hidden="true" /></button>
          </>
        )}
      </div>

      <div className="rs-phones-notes">
        <div className="rs-phones-now" aria-live="polite">
          <p className="rs-phones-fig">Fig. <b>{pad(active + 1)}</b> <em>/ {pad(screens.length)}</em></p>
          <p className="rs-phones-title">{current.label}</p>
          <p className="rs-phones-text">{current.caption}</p>
        </div>
        {many && (
          <>
            <div className="rs-phones-progress" aria-hidden="true">
              {screens.map((s, i) => <i key={s.src} className={i < active ? "done" : i === active ? "on" : undefined} />)}
            </div>
            <ol className="rs-phones-index" aria-label="All phone views">
              {screens.map((s, i) => (
                <li key={s.src}>
                  <button type="button" onClick={() => go(i)} aria-current={i === active ? "true" : undefined}>
                    <em>{pad(i + 1)}</em> {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
        {note && <p className="rs-phones-source">{note}</p>}
      </div>
    </div>
  );
}
