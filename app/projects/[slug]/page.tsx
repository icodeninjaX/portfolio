import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resumeData } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageBackground } from "@/components/page-background";
import {
  LuArrowLeft,
  LuExternalLink,
  LuArrowRight,
  LuLayers,
  LuLightbulb,
  LuUserCheck,
  LuTrendingUp,
} from "react-icons/lu";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = resumeData.projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} Case Study | Keith Vergara`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectIndex = resumeData.projects.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) notFound();

  const project = resumeData.projects[projectIndex];
  const prevProject = projectIndex > 0 ? resumeData.projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < resumeData.projects.length - 1
      ? resumeData.projects[projectIndex + 1]
      : null;

  const statusLabel = {
    current: "Work Project",
    internship: "Internship",
    personal: "Personal Project",
  }[project.status];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <PageBackground />
      <ThemeToggle />
      <main className="relative mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        {/* Navigation back */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 font-display text-xs text-muted transition-colors hover:text-foreground"
        >
          <LuArrowLeft className="h-3.5 w-3.5" />
          Back to all projects
        </Link>

        {/* Header section */}
        <header className="section-box mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {project.name}
              </h1>
              <span className="rounded-full border border-border-hover bg-section-bg px-2.5 py-0.5 font-display text-[10px] font-medium text-muted sm:text-[11px]">
                {statusLabel}
              </span>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 font-display text-xs font-medium text-background transition-opacity hover:opacity-90 active:scale-95"
              >
                <span>Live Demo</span>
                <LuExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <p className="mt-4 font-display text-base leading-relaxed text-foreground/80 sm:text-lg">
            {project.description}
          </p>

          {/* Quick facts pill grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 font-display text-xs">
            <div className="rounded-lg border border-border-hover bg-card p-2.5 shadow-xs">
              <span className="block text-[10px] text-muted">Category</span>
              <span className="mt-0.5 font-medium text-foreground">{statusLabel}</span>
            </div>
            <div className="rounded-lg border border-border-hover bg-card p-2.5 shadow-xs">
              <span className="block text-[10px] text-muted">Primary Stack</span>
              <span className="mt-0.5 font-medium text-foreground">{project.tech[0]} + {project.tech[1] ?? ""}</span>
            </div>
            <div className="rounded-lg border border-border-hover bg-card p-2.5 shadow-xs">
              <span className="block text-[10px] text-muted">Role</span>
              <span className="mt-0.5 font-medium text-foreground">Full-Stack</span>
            </div>
            <div className="rounded-lg border border-border-hover bg-card p-2.5 shadow-xs">
              <span className="block text-[10px] text-muted">Deployment</span>
              <span className="mt-0.5 font-medium text-foreground">{project.link ? "Production" : "Internal"}</span>
            </div>
          </div>
        </header>

        {/* Case Study Body: Problem -> Role -> Decision -> Result */}
        <div className="mt-6 space-y-6">
          {/* 1. Problem & Challenge */}
          <section className="section-box">
            <div className="flex items-center gap-2 font-display text-sm font-semibold text-accent sm:text-base">
              <LuLightbulb className="h-4 w-4 text-amber-500" />
              <h2 className="section-heading text-lg sm:text-xl">The Challenge & Problem</h2>
            </div>
            <p className="mt-3 text-justify font-display text-xs leading-relaxed text-foreground/85 sm:text-sm">
              {project.problem ?? project.details}
            </p>
          </section>

          {/* 2. My Role & Architecture */}
          <section className="section-box">
            <div className="flex items-center gap-2 font-display text-sm font-semibold text-accent sm:text-base">
              <LuUserCheck className="h-4 w-4 text-blue-500" />
              <h2 className="section-heading text-lg sm:text-xl">Role & System Architecture</h2>
            </div>
            <p className="mt-3 text-justify font-display text-xs leading-relaxed text-foreground/85 sm:text-sm">
              {project.role ?? project.details}
            </p>
          </section>

          {/* 3. Key Technical Decisions */}
          {project.decision && (
            <section className="section-box">
              <div className="flex items-center gap-2 font-display text-sm font-semibold text-accent sm:text-base">
                <LuLayers className="h-4 w-4 text-purple-500" />
                <h2 className="section-heading text-lg sm:text-xl">Key Technical Decision</h2>
              </div>
              <p className="mt-3 text-justify font-display text-xs leading-relaxed text-foreground/85 sm:text-sm">
                {project.decision}
              </p>
            </section>
          )}

          {/* 4. Measurable Outcomes */}
          {project.result && (
            <section className="section-box">
              <div className="flex items-center gap-2 font-display text-sm font-semibold text-accent sm:text-base">
                <LuTrendingUp className="h-4 w-4 text-emerald-500" />
                <h2 className="section-heading text-lg sm:text-xl">Results & Impact</h2>
              </div>
              <p className="mt-3 text-justify font-display text-xs leading-relaxed text-foreground/85 sm:text-sm">
                {project.result}
              </p>
            </section>
          )}

          {/* Tech Stack Chips */}
          <section className="section-box">
            <h2 className="section-heading mb-4 text-xl text-accent sm:mb-5 sm:text-2xl">
              Technologies Utilized
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {project.tech.map((t) => {
                const entry = techIcons[t];
                return (
                  <div
                    key={t}
                    className="flex items-center gap-2 rounded-full border border-border-hover bg-card px-3 py-1 font-display text-xs text-foreground shadow-xs"
                  >
                    {entry && <entry.icon className="h-3.5 w-3.5" style={{ color: entry.color }} />}
                    <span>{t}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Interface Screenshots Showcase */}
          {project.images && project.images.length > 0 && (
            <section className="section-box">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="section-heading text-xl text-accent sm:text-2xl">
                    Interface Showcase
                  </h2>
                  <p className="mt-0.5 font-display text-xs text-muted">
                    Walkthrough of key modules and production screens.
                  </p>
                </div>
                <span className="rounded-full border border-border-hover bg-section-bg px-2.5 py-0.5 font-mono text-[10px] text-muted">
                  {project.images.length} views
                </span>
              </div>

              <div className="space-y-6">
                {project.images.map((img, i) => {
                  const src = typeof img === "string" ? img : img.src;
                  const label = typeof img === "string" ? `Screenshot ${i + 1}` : img.label;
                  const caption = typeof img === "object" ? img.caption : undefined;

                  return (
                    <div
                      key={i}
                      className="group overflow-hidden rounded-xl border border-border-hover bg-card shadow-xs transition-all hover:border-foreground/20"
                    >
                      <div className="border-b border-border-hover bg-section-bg px-4 py-2.5">
                        <h3 className="font-display text-xs font-semibold text-foreground sm:text-sm">
                          {label}
                        </h3>
                        {caption && (
                          <p className="mt-0.5 font-display text-[11px] text-muted sm:text-xs">
                            {caption}
                          </p>
                        )}
                      </div>
                      <div className="overflow-hidden bg-muted/10">
                        <Image
                          src={src}
                          alt={`${project.name} - ${label}`}
                          width={1200}
                          height={800}
                          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Previous / Next Project Navigation Footer */}
        <nav
          aria-label="Other case studies"
          className="section-box mt-6 flex items-center justify-between"
        >
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col items-start gap-1 font-display text-xs text-muted transition-colors hover:text-foreground"
            >
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-light group-hover:text-muted">
                <LuArrowLeft className="h-3 w-3" />
                Previous Project
              </span>
              <span className="font-semibold text-foreground group-hover:text-accent">
                {prevProject.name}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-end gap-1 font-display text-xs text-muted transition-colors hover:text-foreground"
            >
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-light group-hover:text-muted">
                Next Project
                <LuArrowRight className="h-3 w-3" />
              </span>
              <span className="font-semibold text-foreground group-hover:text-accent">
                {nextProject.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  );
}
