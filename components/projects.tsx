"use client";

import { useState } from "react";

type ProjectItem = {
  name: string;
  description: string;
  details: string;
  tech: string[];
  status: "live" | "development" | "local";
  link: string;
};

type ProjectsProps = {
  items: ProjectItem[];
};

const statusConfig = {
  live: {
    label: "Live",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  development: {
    label: "In Dev",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
  },
  local: {
    label: "Local",
    className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    dot: "bg-slate-400",
  },
};

export function Projects({ items }: ProjectsProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleProject = (i: number) => {
    setExpanded(expanded === i ? null : i);
  };

  return (
    <section
      id="projects"
      className="rounded-xl bg-card p-4 shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-6"
    >
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-5">
        Projects
      </h2>
      <div className="space-y-3 sm:space-y-5">
        {items.map((item, i) => {
          const isOpen = expanded === i;
          const status = statusConfig[item.status];

          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={`${item.name} — ${status.label}. Click to ${isOpen ? "collapse" : "expand"} details`}
              onClick={() => toggleProject(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleProject(i);
                }
              }}
              className={`group cursor-pointer rounded-lg border p-3 transition-all sm:p-4 ${
                isOpen
                  ? "border-accent/40 border-l-2 border-l-accent bg-section-bg/30"
                  : "border-border hover:border-accent/40 hover:border-l-accent hover:border-l-2 hover:bg-section-bg/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold sm:text-[15px]">{item.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium sm:text-[11px] ${status.className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                    {status.label}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="text-[11px] font-medium text-accent opacity-60 transition-opacity hover:opacity-100 sm:text-xs"
                    >
                      View &rarr;
                    </a>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className={`h-4 w-4 text-muted-light transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted sm:mt-1.5 sm:text-sm">
                {item.description}
              </p>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="rounded-md bg-background/50 p-3 text-xs leading-relaxed text-muted sm:text-sm">
                    {item.details}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
                {item.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-tag-bg px-2 py-0.5 text-[10px] font-medium text-tag-text border border-tag-border sm:px-2.5 sm:text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
