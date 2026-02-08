"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
];

export function StickyNav() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 100) {
        setVisible(true);
      } else if (currentY > lastScrollY + 5) {
        setVisible(false);
      } else if (currentY < lastScrollY - 5) {
        setVisible(true);
      }
      setLastScrollY(currentY);

      let currentSection = "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentSection = section.id;
          }
        }
      }
      setActive(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`print-hidden fixed left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ${
        visible ? "top-3 opacity-100 sm:top-5" : "-top-16 opacity-0"
      }`}
    >
      <div className="flex items-center gap-0.5 rounded-full border border-border bg-card/80 px-1.5 py-1 shadow-[var(--shadow-lg)] backdrop-blur-md sm:gap-1 sm:px-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            aria-label={`Go to ${section.label} section`}
            aria-current={active === section.id ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs ${
              active === section.id
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-section-bg"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
