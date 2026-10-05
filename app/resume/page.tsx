import { resumeData } from "@/lib/data";
import { PrintButton } from "@/components/cinematic/controls";
import { SimpleToolbar } from "@/components/resume/SimpleToolbar";
import { SimpleFooter } from "@/components/resume/SimpleFooter";
import { ResumeHeader } from "@/components/resume/ResumeHeader";
import { HarvardResume } from "@/components/resume/HarvardResume";
import { AtAGlance, Education, Experience, Growth, Profile, Projects, Skills } from "@/components/resume/ResumeBody";
import "../studio.css";
import "../simple.css";

export const metadata = {
  title: "Resume | Keith Vergara",
  description: `${resumeData.name}, ${resumeData.title}. Experience, software and hardware skills, projects, education and certifications.`,
  alternates: { canonical: "/resume" },
};

export default function Resume() {
  return (
    <div className="portfolio-studio rs rs-resume">
      <a href="#main-content" className="skip-link">Skip to resume</a>
      <SimpleToolbar back={{ href: "/", label: "Portfolio" }}>
        <PrintButton label={<><span className="rs-wide-only">Download </span>PDF<span className="rs-wide-only"> (ATS)</span> ↓</>} />
      </SimpleToolbar>
      <main id="main-content" className="rs-sheet" tabIndex={-1}>
        <ResumeHeader />
        <AtAGlance />
        <Profile index={1} />
        <Skills index={2} />
        <Experience index={3} />
        <Projects index={4} />
        <Growth index={5} />
        <Education index={6} />
        <SimpleFooter />
      </main>
      <HarvardResume />
    </div>
  );
}
