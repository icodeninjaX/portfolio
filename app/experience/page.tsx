import Link from "next/link";
import { resumeData } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuArrowLeft } from "react-icons/lu";

export const metadata = {
  title: "My Journey | Keith Vergara",
  description: "How I started programming and where I am today.",
};

export default function ExperiencePage() {
  const { journey, experience } = resumeData;

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <Link
          href="/#experience"
          className="inline-flex items-center gap-1.5 font-display text-xs text-muted transition-colors hover:text-foreground"
        >
          <LuArrowLeft className="h-3 w-3" />
          Back to portfolio
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold text-foreground sm:text-3xl">
          My Journey
        </h1>
        <p className="mt-3 text-justify font-display text-sm leading-relaxed text-muted sm:text-base">
          From writing my first lines of code to building production applications — here&apos;s how my developer journey unfolded.
        </p>

        <div className="relative mt-10">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border-hover sm:left-4" />

          <div className="space-y-8">
            {journey.map((item, i) => (
              <div key={i} className="relative pl-9 sm:pl-12">
                <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full border-2 border-accent bg-background sm:left-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="font-display text-[10px] font-medium text-muted-light sm:text-[11px]">
                  {item.year}
                </span>
                <h2 className="mt-1 font-display text-sm font-semibold text-foreground sm:text-base">
                  {item.title}
                </h2>
                <p className="mt-2 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-10 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Work Experience
          </h2>
          <div className="mt-4 space-y-4">
            {experience.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border-hover p-4 sm:p-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">
                      {item.role}
                    </h3>
                    <p className="font-display text-xs text-muted sm:text-sm">
                      {item.company}
                    </p>
                  </div>
                  <span className="font-display text-xs text-muted-light sm:text-sm">
                    {item.startDate} &ndash; {item.endDate}
                  </span>
                </div>
                <p className="mt-3 text-justify font-display text-[11px] leading-relaxed text-foreground/70 sm:text-xs">
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
      </main>
    </div>
  );
}
