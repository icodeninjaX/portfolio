import { LuExternalLink } from "react-icons/lu";

type ProjectItem = {
  name: string;
  description: string;
  details: string;
  tech: string[];
  status: "current" | "internship" | "personal";
  link: string;
  images?: string[];
};

type ProjectsProps = {
  items: ProjectItem[];
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
            className="rounded-lg border border-border-hover p-4 transition-all hover:border-foreground/15 sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">
                {item.name}
              </h3>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-hover px-3 py-1 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg sm:text-[11px]"
                >
                  Live
                  <LuExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <p className="mt-2 font-display text-[10px] leading-relaxed text-foreground/70 text-justify sm:text-[11px]">
              {item.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
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
