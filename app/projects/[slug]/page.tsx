import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resumeData } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuArrowLeft, LuExternalLink } from "react-icons/lu";
import { type IconType } from "react-icons";
import {
  SiJavascript,
  SiPhp,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiMysql,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiHtmx,
} from "react-icons/si";

const techIcons: Record<string, { icon: IconType; color: string }> = {
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss3, color: "#1572B6" },
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  PHP: { icon: SiPhp, color: "#777BB4" },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  React: { icon: SiReact, color: "#61DAFB" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Supabase: { icon: SiSupabase, color: "#3FCF8E" },
  "Next.js": { icon: SiNextdotjs, color: "currentColor" },
  HTMX: { icon: SiHtmx, color: "#3366CC" },
};

export function generateStaticParams() {
  return resumeData.projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const project = resumeData.projects.find((p) => p.slug === slug);
    if (!project) return { title: "Project Not Found" };
    return {
      title: `${project.name} | Keith Vergara`,
      description: project.description,
    };
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = resumeData.projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const statusLabel = {
    current: "Work Project",
    internship: "Internship",
    personal: "Personal Project",
  }[project.status];

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 font-display text-xs text-muted transition-colors hover:text-foreground"
        >
          <LuArrowLeft className="h-3 w-3" />
          Back to portfolio
        </Link>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {project.name}
            </h1>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-hover px-3 py-1 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg sm:text-[11px]"
              >
                Live
                <LuExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <p className="mt-4 text-justify font-display text-sm leading-relaxed text-muted sm:text-base">
            {project.description}
          </p>

          <div className="mt-4">
            <span className="rounded-full border border-border-hover bg-section-bg px-2.5 py-0.5 font-display text-[10px] font-medium text-muted sm:text-[11px]">
              {statusLabel}
            </span>
          </div>
        </div>

        <hr className="my-8 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Overview
          </h2>
          <p className="mt-3 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
            {project.details}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Tech Stack
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {project.tech.map((t) => {
              const entry = techIcons[t];
              return (
                <div key={t} className="flex flex-col items-center gap-1" title={t}>
                  {entry ? (
                    <entry.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: entry.color }} />
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-tag-bg font-display text-[8px] font-bold text-tag-text sm:h-6 sm:w-6">
                      {t.slice(0, 2)}
                    </span>
                  )}
                  <span className="font-display text-[9px] text-muted sm:text-[10px]">{t}</span>
                </div>
              );
            })}
          </div>
        </section>

        {project.images && project.images.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
              Project UI
            </h2>
            <div className="mt-4 space-y-6">
              {project.images.map((img, i) => {
                const src = typeof img === "string" ? img : img.src;
                const label = typeof img === "string" ? `Screenshot ${i + 1}` : img.label;
                return (
                  <div key={i}>
                    <h3 className="mb-2 font-display text-xs font-medium text-muted sm:text-sm">
                      {label}
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-border-hover">
                      <Image
                        src={src}
                        alt={label}
                        width={1200}
                        height={800}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
