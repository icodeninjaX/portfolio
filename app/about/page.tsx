import Link from "next/link";
import { resumeData } from "@/lib/data";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuArrowLeft } from "react-icons/lu";

export const metadata = {
  title: "About Me | Keith Vergara",
  description: "Learn more about Keith Vergara — background, interests, and career goals.",
};

export default function AboutPage() {
  const { about } = resumeData;

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
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

        <section className="mt-8">
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Who I Am
          </h2>
          <p className="mt-3 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
            {about.bio}
          </p>
        </section>

        <hr className="my-8 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            My Background
          </h2>
          <p className="mt-3 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
            {about.background}
          </p>
        </section>

        <hr className="my-8 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Interests & Hobbies
          </h2>
          <p className="mt-3 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
            {about.interests}
          </p>
        </section>

        <hr className="my-8 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            What Motivates Me
          </h2>
          <p className="mt-3 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
            {about.motivation}
          </p>
        </section>

        <hr className="my-8 border-border-hover" />

        <section>
          <h2 className="font-display text-sm font-semibold text-foreground sm:text-base">
            Career Goals
          </h2>
          <p className="mt-3 text-justify font-display text-xs leading-relaxed text-muted sm:text-sm">
            {about.goals}
          </p>
        </section>
      </main>
    </div>
  );
}
