import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { resumeData } from "@/lib/data";
import { PrintButton, StudioControls } from "@/components/cinematic/controls";
import { ResumeHeader } from "@/components/resume/ResumeHeader";
import { HarvardResume } from "@/components/resume/HarvardResume";
import { AtAGlance, Education, Experience, Growth, Profile, Projects, Skills } from "@/components/resume/ResumeBody";
import "../studio.css";
import "./resume.css";

export const metadata = {
  title: "Resume | Keith Vergara",
  description: `${resumeData.name}, ${resumeData.title}. Experience, software and hardware skills, projects, education and certifications.`,
  alternates: { canonical: "/resume" },
};

export default function Resume() {
  return (
    <div className="portfolio-studio rs">
      <a href="#main-content" className="skip-link">Skip to resume</a>
      <div className="rs-toolbar print-hidden">
        <Link href="/" className="rs-back"><LuArrowLeft aria-hidden="true" /> Portfolio</Link>
        <div className="rs-toolbar-actions"><StudioControls /><PrintButton label={<><span className="rs-wide-only">Download </span>PDF<span className="rs-wide-only"> (ATS)</span> ↓</>} /></div>
      </div>
      <main id="main-content" className="rs-sheet" tabIndex={-1}>
        <ResumeHeader />
        <AtAGlance />
        <Profile index={1} />
        <Skills index={2} />
        <Experience index={3} />
        <Projects index={4} />
        <Growth index={5} />
        <Education index={6} />
        <footer className="rs-foot">
          <div>
            <p className="rs-signature">{resumeData.name}</p>
            <p>Open to full-stack roles · References available on request</p>
          </div>
          <p><a href={`mailto:${resumeData.email}`}>{resumeData.email}</a><br />{resumeData.location}</p>
        </footer>
      </main>
      <HarvardResume />
    </div>
  );
}
