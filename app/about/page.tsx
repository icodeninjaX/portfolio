import Link from "next/link";
import { resumeData } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageBackground } from "@/components/page-background";
import { LuArrowLeft } from "react-icons/lu";

export const metadata = {
  title: "About Me | Keith Vergara",
  description: "Learn more about Keith Vergara — background, interests, and career goals.",
};

export default function AboutPage() {
  const { about } = resumeData;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <PageBackground />
      <ThemeToggle />
      <main className="relative mx-auto max-w-2xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <Link
          href="/#about"
          className="inline-flex items-center gap-1.5 font-display text-xs text-muted transition-colors hover:text-foreground"
        >
          <LuArrowLeft className="h-3 w-3" />
          Back to portfolio
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold text-foreground sm:text-3xl">
          About Me
        </h1>

        <div className="mt-6 space-y-6">
          <section className="section-box">
            <h2 className="section-heading mb-3 text-lg text-accent sm:text-xl">
              Who I Am
            </h2>
            <p className="text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-sm">
              {about.bio}
            </p>
          </section>

          <section className="section-box">
            <h2 className="section-heading mb-3 text-lg text-accent sm:text-xl">
              My Background
            </h2>
            <p className="text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-sm">
              {about.background}
            </p>
          </section>

          <section className="section-box">
            <h2 className="section-heading mb-3 text-lg text-accent sm:text-xl">
              Interests & Hobbies
            </h2>
            <p className="text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-sm">
              {about.interests}
            </p>
          </section>

          <section className="section-box">
            <h2 className="section-heading mb-3 text-lg text-accent sm:text-xl">
              What Motivates Me
            </h2>
            <p className="text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-sm">
              {about.motivation}
            </p>
          </section>

          <section className="section-box">
            <h2 className="section-heading mb-3 text-lg text-accent sm:text-xl">
              Career Goals
            </h2>
            <p className="text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-sm">
              {about.goals}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
