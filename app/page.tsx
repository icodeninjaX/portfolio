import Image from "next/image";
import Link from "next/link";
import { buildLayers, resumeData, selectedWork } from "@/lib/data";
import { SkipLink, StudioControls } from "@/components/cinematic/controls";
import { SceneBoundary } from "@/components/cinematic/scene-boundary";
import { StudioPoster } from "@/components/cinematic/poster";
import "./studio.css";

export default function Home() {
  return <div className="portfolio-studio">
    <SkipLink />
    <header className="studio-header">
      <Link href="/" className="studio-brand" aria-label="Keith Vergara, home">kv<span className="brand-dot">.</span></Link>
      <nav aria-label="Main navigation"><Link href="#projects">Work</Link><Link href="#experience">Experience</Link><Link href="/resume" className="studio-mode-link">Simple mode <span aria-hidden="true">↗</span></Link><Link href="#contact">Contact <span aria-hidden="true">↗</span></Link></nav>
      <StudioControls />
    </header>
    <div className="studio-layout">
      <aside id="studio-stage" className="studio-stage" aria-label="Scroll-controlled product demonstrations">
        <div className="stage-topline" aria-hidden="true"><span>EXPLORE THE PRODUCT</span><span>KEITH VERGARA / WORK</span></div>
        <div className="stage-art" aria-hidden="true"><StudioPoster /><SceneBoundary /></div>
        <div className="stage-bottomline" aria-hidden="true"><span id="studio-caption">01 / Selected work in motion</span><span className="stage-scroll">SCROLL TO PLAY / REVERSE TO REWIND</span></div>
      </aside>
      <main id="main-content" className="studio-content" tabIndex={-1}>
        <section id="identity" className="studio-hero studio-chapter">
          <p className="studio-eyebrow"><span className="small-cross" aria-hidden="true">+</span> A DEVELOPER’S PERSPECTIVE</p>
          <h1>{resumeData.name.split(" ")[0]}<br /><span>{resumeData.name.split(" ").slice(1).join(" ")}</span><span className="name-period">.</span></h1>
          <p className="studio-role">{resumeData.title}</p>
          <p className="studio-intro">{resumeData.introduction}</p>
          <div className="studio-actions"><Link className="studio-button primary" href="#projects">View selected work <span aria-hidden="true">↘</span></Link><a className="studio-text-link" href={`mailto:${resumeData.email}`}>Contact me ↗</a></div>
          <Link className="studio-simple" href="/resume">Prefer the essentials? Resume / Simple view <span aria-hidden="true">↗</span></Link>
          <div className="hero-person"><Image src="/profile.webp" alt="" width={40} height={40} priority /><span>{resumeData.location}<br /><span className="muted">Building across the stack.</span></span></div>
        </section>
        <section id="projects" className="studio-work" aria-labelledby="work-title">
          <div className="chapter-heading"><p className="studio-eyebrow">02 — SELECTED WORK</p><h2 id="work-title">Practical problems.<br /><span>Purposeful software.</span></h2><p>A look at the interfaces, decisions, and systems behind my work.</p></div>
          {selectedWork.map((item, index) => {
            const project = resumeData.projects.find(p => p.slug === item.slug)!;
            const screenshot = project.images[0];
            return <article id={`work-${item.slug}`} key={item.slug} className="studio-project studio-chapter">
              <div className="project-overline"><span>0{index + 1} / {item.category}</span><span>{project.status === "current" ? "WORK PROJECT" : "PERSONAL PROJECT"}</span></div>
              <h3><Link href={`/projects/${item.slug}`}>{project.name} <span aria-hidden="true">↗</span></Link></h3>
              <p className="project-summary">{item.summary}</p>
              <Link href={`/projects/${item.slug}`} className="project-image" aria-label={`Explore ${project.name} case study`}><Image src={screenshot.src} alt={`${project.name}: ${screenshot.label}`} width={screenshot.width} height={screenshot.height} sizes="(min-width: 1024px) 40vw, 90vw" /></Link>
              <dl className="project-evidence"><div><dt>The problem</dt><dd>{item.problem}</dd></div><div><dt>My contribution</dt><dd>{item.contribution}</dd></div><div><dt>A key decision</dt><dd>{item.decision}</dd></div></dl>
              <ul className="studio-tags" aria-label={`${project.name} technologies`}>{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
              <div className="project-links"><Link className="studio-text-link" href={`/projects/${item.slug}`}>Read case study <span aria-hidden="true">↗</span></Link>{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">Visit project ↗</a>}</div>
            </article>;
          })}
          <Link className="studio-text-link all-projects" href="/resume#projects">All projects in the simple view ↗</Link>
        </section>
        <section id="how-i-build" className="studio-chapter studio-build">
          <p className="studio-eyebrow">03 — BENEATH THE INTERFACE</p><h2>One product.<br /><span>Every layer.</span></h2>
          <p className="section-description">I like understanding how the whole thing works, from the first interaction to the data behind it.</p>
          <div className="build-layers">{buildLayers.map((layer, i) => <article key={layer.name}><span className="layer-number">0{i + 1}</span><div><h3>{layer.name}</h3><p>{layer.description}</p><Link href={`/projects/${layer.slug}`}>{layer.evidence} ↗</Link><ul className="studio-tags">{layer.tech.map(t => <li key={t}>{t}</li>)}</ul></div></article>)}</div>
          <p className="studio-note">The product walkthroughs are animated demonstrations built from the project interfaces. Each project has its own architecture.</p>
        </section>
        <section id="experience" className="studio-chapter studio-experience">
          <p className="studio-eyebrow">04 — THE PERSON BEHIND IT</p><h2>Curiosity.<br /><span>Put to work.</span></h2>
          <div id="about" className="studio-person"><Image src="/profile.webp" alt={`Portrait of ${resumeData.name}`} width={88} height={88} /><div><h3>{resumeData.name}</h3><p>{resumeData.location}</p><Link href="/about">A little more about me ↗</Link></div></div>
          <p className="section-description">{resumeData.summary}</p>
          <div className="studio-timeline">{resumeData.experience.map(job => <article key={job.company}><p className="job-date">{job.startDate} — {job.endDate}</p><h3>{job.role}</h3><p className="job-company">{job.company}</p><p>{job.description}</p></article>)}</div>
          {resumeData.education.map(education => <div className="studio-education" key={education.institution}><p className="studio-eyebrow">EDUCATION</p><h3>{education.degree}</h3><p>{education.institution}</p></div>)}
          <Link className="studio-text-link" href="/experience">Explore my journey ↗</Link>
        </section>
        <section id="contact" className="studio-chapter studio-contact">
          <p className="studio-eyebrow">05 — THE NEXT CHAPTER</p><h2>Have a role or<br />project in mind?<br /><span>Let’s talk.</span></h2>
          <p className="section-description">Good work starts with a conversation.</p>
          <a className="studio-button primary" href={`mailto:${resumeData.email}`}>Email Keith <span aria-hidden="true">↗</span></a>
          <a className="contact-email" href={`mailto:${resumeData.email}`}>{resumeData.email}</a>
          <div className="contact-socials"><a href={`https://${resumeData.github}`} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><Link href="/resume">Resume ↗</Link></div>
          <footer className="studio-footer"><span>© 2026 {resumeData.name}</span><Link href="/creative">Explore the 3D office ↗</Link><Link href="#identity">Back to top ↑</Link></footer>
        </section>
      </main>
    </div>
  </div>;
}
