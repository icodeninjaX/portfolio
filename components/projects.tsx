import Link from "next/link";
import Image from "next/image";
import { LuExternalLink, LuArrowRight, LuTerminal } from "react-icons/lu";

type ProjectImage = string | { src: string; label: string; caption?: string };

type ProjectItem = {
  slug: string;
  name: string;
  description: string;
  details?: string;
  problem?: string;
  role?: string;
  decision?: string;
  result?: string;
  tech: string[];
  status: "current" | "internship" | "personal";
  link: string;
  images?: ProjectImage[];
};

type ProjectsProps = {
  items: ProjectItem[];
};

const statusConfig = {
  current: { label: "Work Project", class: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  internship: { label: "Internship", class: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  personal: { label: "Personal Project", class: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
};

function getFirstImage(images?: ProjectImage[]): string | null {
  if (!images || images.length === 0) return null;
  const first = images[0];
  return typeof first === "string" ? first : first.src;
}

export function Projects({ items }: ProjectsProps) {
  return (
    <section id="projects" className="section-box">
      <div className="mb-5 flex items-center justify-between sm:mb-6">
        <div>
          <h2 className="section-heading text-xl text-accent sm:text-2xl">
            Featured Projects
          </h2>
          <p className="mt-0.5 font-display text-[11px] text-muted sm:text-xs">
            Real-world systems built for operational telemetry, financial workflows, and automation.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => {
          const thumbnail = getFirstImage(item.images);
          const status = statusConfig[item.status];

          return (
            <div
              key={i}
              className="group relative rounded-lg border border-border-hover bg-card/60 p-3.5 transition-all duration-300 hover:border-foreground/20 hover:shadow-md sm:p-4"
            >
              <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:gap-4">
                {/* Thumbnail */}
                <Link
                  href={`/projects/${item.slug}`}
                  className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md border border-border-hover bg-section-bg transition-colors group-hover:border-foreground/20 sm:w-44 md:w-48"
                  aria-label={`View ${item.name} case study`}
                >
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={`${item.name} interface preview`}
                      width={400}
                      height={250}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-muted-light">
                      <LuTerminal className="h-6 w-6 text-muted" />
                      <span className="font-mono text-[10px] text-muted">
                        {item.slug}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${item.slug}`}
                          className="font-display text-sm font-semibold text-foreground transition-colors hover:text-accent sm:text-base"
                        >
                          {item.name}
                        </Link>
                        {status && (
                          <span
                            className={`rounded-full border px-2 py-0.5 font-display text-[9px] font-medium sm:text-[10px] ${status.class}`}
                          >
                            {status.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/projects/${item.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-border-hover bg-card px-2.5 py-0.5 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg sm:text-[11px]"
                        >
                          Case Study
                          <LuArrowRight className="h-3 w-3" />
                        </Link>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-border-hover bg-card px-2.5 py-0.5 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg sm:text-[11px]"
                            title="Open live production demo"
                          >
                            Live
                            <LuExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-[13px]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-tag-border bg-tag-bg px-2 py-px font-display text-[9px] font-medium text-tag-text sm:text-[10px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
