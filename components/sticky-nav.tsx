"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
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
  const [menuOpen, setMenuOpen] = useState(false);
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
        setMenuOpen(false);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <>
      <nav
        aria-label="Section navigation"
        className={`print-hidden fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3 sm:px-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
            aria-label="Scroll to top"
          >
            <Image
              src="/logo.webp"
              alt="KV"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-border-hover"
            />
          </button>

          <div className="flex items-center gap-2">
            {theme && (
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border-hover bg-card/80 text-muted backdrop-blur-xl transition-colors hover:text-foreground"
              >
                {theme === "dark" ? (
                  <LuSun className="h-3.5 w-3.5" />
                ) : (
                  <LuMoon className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={`group relative flex h-8 w-8 items-center justify-center rounded-full border border-border-hover bg-card/80 backdrop-blur-xl transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] ${
                menuOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              <div className="relative h-4 w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] rounded-full bg-foreground transition-all ease-[cubic-bezier(0.77,0,0.18,1)] ${
                    menuOpen
                      ? "top-1/2 w-4 -translate-y-1/2 rotate-45 duration-500 delay-100"
                      : "top-0.5 w-4 duration-500 delay-0 group-hover:w-3"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[1.5px] -translate-y-1/2 rounded-full bg-foreground transition-all ease-[cubic-bezier(0.77,0,0.18,1)] ${
                    menuOpen
                      ? "w-0 translate-x-2 opacity-0 duration-300 delay-0"
                      : "w-2.5 opacity-100 duration-300 delay-150 group-hover:w-4"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] rounded-full bg-foreground transition-all ease-[cubic-bezier(0.77,0,0.18,1)] ${
                    menuOpen
                      ? "top-1/2 w-4 -translate-y-1/2 -rotate-45 duration-500 delay-100"
                      : "bottom-0.5 w-3 duration-500 delay-0 group-hover:w-2.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`print-hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Menu panel */}
      <div
        className={`print-hidden fixed right-0 top-0 z-40 h-full w-72 border-l border-border-hover bg-card/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col px-7 pt-20">
          <div className="flex items-center gap-3 border-b border-border-hover pb-6">
            <Image
              src="/logo.webp"
              alt="KV"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-border-hover"
            />
            <div>
              <p className="font-display text-sm font-semibold text-foreground">
                Keith Vergara
              </p>
              <p className="font-display text-[10px] text-muted">
                Full-Stack Web Developer
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-0.5">
            {sections.map((section, i) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                style={{
                  transitionDelay: menuOpen ? `${i * 50 + 100}ms` : "0ms",
                }}
                className={`rounded-lg px-3 py-2.5 text-left font-display text-sm transition-all duration-300 ${
                  menuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                } ${
                  active === section.id
                    ? "bg-foreground/10 font-medium text-foreground"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
