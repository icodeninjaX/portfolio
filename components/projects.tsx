import Link from "next/link";
import { LuExternalLink, LuArrowRight } from "react-icons/lu";

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
};

type ProjectsProps = {
  items: ProjectItem[];
};

const statusLabels: Record<ProjectItem["status"], string> = {
  current: "Work Project",
  internship: "Internship",
  personal: "Personal",
};

export function Projects({ items }: ProjectsProps) {
  return (
    <section id="projects" className="section-box">
      <h2 className="section-heading mb-5 text-xl text-accent sm:mb-6 sm:text-2xl">
        Projects
      </h2>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="group rounded-lg border border-border-hover bg-card p-4 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:bg-section-bg sm:p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/projects/${item.slug}`}
                  className="font-display text-sm font-semibold text-foreground transition-colors hover:text-accent sm:text-base"
                >
                  {item.name}
                </Link>
                <span className="font-display text-[10px] text-muted-light sm:text-[11px]">
                  &middot; {statusLabels[item.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/projects/${item.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-hover px-3 py-1 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg active:scale-95 sm:text-[11px]"
                >
                  <span>Case Study</span>
                </Link>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-hover px-3 py-1 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg active:scale-95 sm:text-[11px]"
                  >
                    <span>Live</span>
                    <LuExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <p className="mt-3 text-justify font-display text-xs leading-relaxed text-foreground/75 sm:text-[13px]">
              {item.description}
            </p>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
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
        ))}
      </div>
    </section>
  );
}
