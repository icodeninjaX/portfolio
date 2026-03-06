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
        <div className="lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-8">
          <div className="space-y-6 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28 lg:self-start">
            <div className="animate-fade-in-up delay-0">
              <Header data={resumeData} />
            </div>

            <div className="animate-fade-in-up delay-1">
              <Summary text={resumeData.summary} />
            </div>
          </div>

          <div className="mt-6 animate-fade-in-up delay-2 lg:mt-0 lg:col-start-2 lg:row-start-1">
            <Experience items={resumeData.experience} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-3 lg:col-start-2 lg:row-start-2">
            <Skills skills={resumeData.skills} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-4 lg:col-start-2 lg:row-start-3">
            <Projects items={resumeData.projects} />
          </div>

          <div className="mt-6 animate-fade-in-up delay-5 lg:col-start-2 lg:row-start-4">
            <Education items={resumeData.education} />
          </div>

          <div className="mt-10 animate-fade-in-up delay-5 lg:mt-0 lg:col-start-1 lg:row-start-3 lg:self-start">
            <Footer data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
}
