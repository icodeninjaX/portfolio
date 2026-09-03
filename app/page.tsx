import { resumeData } from "@/lib/data";
import { Header } from "@/components/header";
import { Summary } from "@/components/summary";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { StickyNav } from "@/components/sticky-nav";

export default function Home() {
  return (
    <div className="home-shell relative min-h-screen overflow-x-clip bg-background">
      <div className="home-desktop-backdrop pointer-events-none absolute inset-0 hidden lg:block" />
      <div className="home-desktop-grid pointer-events-none absolute inset-0 hidden lg:block" />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <StickyNav />
      <main
        id="main-content"
        role="main"
        className="relative mx-auto max-w-2xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24 lg:max-w-7xl lg:px-8 lg:pb-24 lg:pt-28 xl:px-12"
      >
        <div className="lg:mx-auto lg:max-w-[44rem]">
          <div className="animate-fade-in-up delay-0">
            <Header data={resumeData} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-1">
            <Summary text={resumeData.summary} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-2">
            <Experience items={resumeData.experience} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-3">
            <Skills skills={resumeData.skills} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-4">
            <Projects items={resumeData.projects} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-5">
            <Education items={resumeData.education} />
          </div>

          <div className="mt-10 animate-fade-in-up delay-5">
            <Footer data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
}
