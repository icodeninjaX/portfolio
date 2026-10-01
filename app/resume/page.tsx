import Link from "next/link";
import Image from "next/image";
import { resumeData } from "@/lib/data";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";
import { PrintButton, StudioControls } from "@/components/cinematic/controls";
import "../studio.css";

export const metadata = { title: "Resume | Keith Vergara", alternates: { canonical: "/resume" } };
export default function Resume() {
  return <div className="portfolio-studio resume-view">
    <a href="#main-content" className="skip-link">Skip to resume</a>
    <div className="resume-toolbar print-hidden"><Link href="/">← Portfolio</Link><StudioControls /><PrintButton /></div>
    <main id="main-content" className="resume-content" tabIndex={-1}>
      <header className="resume-header"><Image src="/profile.webp" width={80} height={80} alt={`Portrait of ${resumeData.name}`} /><div><h1>{resumeData.name}</h1><p>{resumeData.title}</p><p>{resumeData.location}</p><a href={`mailto:${resumeData.email}`}>{resumeData.email}</a></div></header>
      <p className="resume-summary">{resumeData.summary}</p>
      <Experience items={resumeData.experience} />
      <section className="section-box"><h2 className="section-heading">Technologies</h2><ul className="studio-tags">{resumeData.skills.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul></section>
      <Projects items={resumeData.projects} /><Education items={resumeData.education} /><Footer data={resumeData} />
    </main>
  </div>;
}
