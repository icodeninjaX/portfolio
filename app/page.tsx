import Link from "next/link";
import { resumeData } from "@/lib/data";
import { Header } from "@/components/header";
import { Summary } from "@/components/summary";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { StickyNav } from "@/components/sticky-nav";

function Divider() {
  return (
    <div className="decorative-divider" aria-hidden="true">
      <span className="decorative-divider-dot" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background px-3 py-6 sm:px-6 sm:py-16">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Link
        href="/creative"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
      >
        Enter 3D
      </Link>
      <ScrollProgress />
      <StickyNav />
      <ThemeToggle />
      <main id="main-content" role="main" className="mx-auto max-w-2xl pt-8 sm:pt-4">
        <div className="animate-fade-in-up delay-0">
          <Header data={resumeData} />
        </div>
        <div className="mt-5 sm:mt-8">
          <Divider />
          <div className="mt-4 animate-fade-in-up delay-1 sm:mt-6">
            <Summary text={resumeData.summary} />
          </div>
          <Divider />
          <div className="mt-4 animate-fade-in-up delay-2 sm:mt-6">
            <Experience items={resumeData.experience} />
          </div>
          <Divider />
          <div className="mt-4 animate-fade-in-up delay-3 sm:mt-6">
            <Skills skills={resumeData.skills} />
          </div>
          <Divider />
          <div className="mt-4 animate-fade-in-up delay-4 sm:mt-6">
            <Projects items={resumeData.projects} />
          </div>
          <Divider />
          <div className="mt-4 animate-fade-in-up delay-5 sm:mt-6">
            <Education items={resumeData.education} />
          </div>
        </div>
        <div className="animate-fade-in-up delay-5">
          <Footer data={resumeData} />
        </div>
      </main>
    </div>
  );
}
