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

export default function Home() {
  return (
    <div className="min-h-screen bg-background px-3 py-6 sm:px-6 sm:py-16">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <StickyNav />
      <ThemeToggle />
      <main id="main-content" role="main" className="mx-auto max-w-2xl pt-8 sm:pt-4">
        <div className="animate-fade-in-up delay-0">
          <Header data={resumeData} />
        </div>
        <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
          <div className="animate-fade-in-up delay-1">
            <Summary text={resumeData.summary} />
          </div>
          <div className="animate-fade-in-up delay-2">
            <Experience items={resumeData.experience} />
          </div>
          <div className="animate-fade-in-up delay-3">
            <Skills skills={resumeData.skills} />
          </div>
          <div className="animate-fade-in-up delay-4">
            <Projects items={resumeData.projects} />
          </div>
          <div className="animate-fade-in-up delay-5">
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
