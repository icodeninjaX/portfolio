"use client";

import { useEffect, useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";

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
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

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

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`print-hidden fixed left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ${
        visible ? "top-3 opacity-100 sm:top-5" : "-top-16 opacity-0"
      }`}
    >
      <div className="flex items-center gap-0.5 rounded-full border border-border-hover bg-card/80 px-1 py-1 shadow-[var(--shadow-md)] backdrop-blur-xl sm:gap-0.5 sm:px-1.5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            aria-label={`Go to ${section.label} section`}
            aria-current={active === section.id ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 font-display text-[10px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-[11px] ${
              active === section.id
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            {section.label}
          </button>
        ))}

        <div className="mx-0.5 h-4 w-px bg-border-hover" />

        {theme && (
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
          >
            {theme === "dark" ? (
              <LuSun className="h-3.5 w-3.5" />
            ) : (
              <LuMoon className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
