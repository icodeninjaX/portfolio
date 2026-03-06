import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resumeData } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuArrowLeft, LuExternalLink } from "react-icons/lu";

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
    current: "Current Role",
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
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border-hover bg-section-bg px-2.5 py-0.5 font-display text-[10px] font-medium text-muted sm:text-[11px]">
              {statusLabel}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            {project.name}
          </h1>

          <p className="mt-4 font-display text-sm leading-relaxed text-muted sm:text-base">
            {project.description}
          </p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border-hover px-4 py-1.5 font-display text-[11px] font-medium text-foreground transition-colors hover:bg-section-bg sm:text-xs"
            >
              View on GitHub
              <LuExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <hr className="my-8 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Overview
          </h2>
          <p className="mt-3 font-display text-xs leading-relaxed text-muted sm:text-sm">
            {project.details}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Tech Stack
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-display text-[10px] font-medium text-tag-text sm:text-[11px]"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {project.images && project.images.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
              Screenshots
            </h2>
            <div className="relative mt-4 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
              <div className="marquee-track gap-4">
                {[...project.images, ...project.images].map((src, i) => (
                  <div
                    key={i}
                    className="w-[280px] shrink-0 overflow-hidden rounded-lg border border-border-hover sm:w-[400px]"
                  >
                    <Image
                      src={src}
                      alt={`${project.name} screenshot ${(i % project.images!.length) + 1}`}
                      width={800}
                      height={500}
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
