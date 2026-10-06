import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { resumeData } from "@/lib/data";
import { SimpleToolbar } from "@/components/resume/SimpleToolbar";
import { ResumeSection } from "@/components/resume/Section";
import { SimpleFooter } from "@/components/resume/SimpleFooter";
import { DemoVideo } from "@/components/resume/DemoVideo";
import { DesktopShowcase } from "@/components/resume/DesktopShowcase";
import { orderedProjects, projectKind, projectNumber } from "@/components/resume/projects";
import "../../studio.css";
import "../../simple.css";

export function generateStaticParams() {
  return resumeData.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = resumeData.projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} Case Study | Keith Vergara`,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
  };
}

// "Creator & Full-Stack Developer. Built the…" → ["Creator & Full-Stack Developer", "Built the…"]
function splitRole(role: string) {
  const i = role.indexOf(". ");
  return i === -1 ? ["", role] : [role.slice(0, i), role.slice(i + 2)];
}

// "Public landing · phone" / "Dashboard — phone demo" → "Public landing" / "Dashboard"; the stage already says it's a phone.
function deviceLabel(label: string) {
  return label.replace(/\s*[·—-]\s*phone( demo)?$/i, "");
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = orderedProjects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = orderedProjects[index];
  const prev = orderedProjects[index - 1];
  const next = orderedProjects[index + 1];
  const kind = projectKind(project);
  const stage = "stage" in project && project.stage ? project.stage : project.link ? "In production" : "Internal system";
  const source = "source" in project ? project.source : "";
  const mobileImages = ("mobileImages" in project ? project.mobileImages : undefined) ?? [];
  const [roleTitle, roleBody] = splitRole(project.role ?? project.details ?? "");

  // Numbered in order, skipping sections a project has no copy for.
  const sections = [
    { id: "challenge", title: "The challenge", body: project.problem ?? project.details },
    { id: "role", title: "My role", body: roleBody, lead: roleTitle },
    { id: "decision", title: "Key decision", body: project.decision },
    { id: "outcome", title: "Outcome", body: project.result },
  ].filter((s) => s.body);

  let n = 0;
  const desktopFigureStart = mobileImages.length;
  // Shown in the showcase's address bar: the live host, or a neutral label for internal tools.
  const domain = "domain" in project ? project.domain : "";
  const host = domain || (project.link ? new URL(project.link).host.replace(/^www\./, "") : `${project.slug}.internal`);

  return (
    <div className="portfolio-studio rs rs-case">
      <a href="#main-content" className="skip-link">Skip to case study</a>
      <SimpleToolbar back={{ href: "/resume#projects", label: "Résumé" }} />

      <main id="main-content" className="rs-sheet" tabIndex={-1}>
        <header className="rs-head rs-case-head">
          <div className="rs-letterhead">
            <span className="rs-monogram" aria-hidden="true">KV</span>
            <span>Case study {projectNumber(index)} / {projectNumber(orderedProjects.length - 1)}</span>
            <span className="rs-letterhead-date">{kind}</span>
          </div>
          <div className="rs-head-main">
            <p className="rs-case-kicker">{stage}</p>
            <h1 className="rs-case-title">{project.name}</h1>
            <p className="rs-case-lead">{project.description}</p>
            {(project.link || source) && (
              <p className="rs-case-actions">
                {project.link && <a className="rs-btn rs-btn-primary" href={project.link} target="_blank" rel="noopener noreferrer">{project.stage === "Live website" ? "Visit website" : "Open live app"} <LuArrowUpRight aria-hidden="true" /></a>}
                {source && <a className="rs-btn" href={source} target="_blank" rel="noopener noreferrer">Source code <LuArrowUpRight aria-hidden="true" /></a>}
              </p>
            )}
          </div>
        </header>

        <dl className="rs-glance rs-case-facts" aria-label="Project facts">
          <div><dt>Type</dt><dd>{kind}</dd></div>
          <div><dt>Status</dt><dd>{stage}</dd></div>
          <div><dt>Role</dt><dd>{roleTitle || "Developer"}</dd></div>
          <div><dt>Stack</dt><dd>{project.tech.length} technologies</dd></div>
        </dl>

        {"video" in project && project.video && (
          <ResumeSection index={++n} title="Product demo" id="demo" wide>
            <figure className="rs-demo">
              <DemoVideo mp4={project.video.mp4} webm={project.video.webm} poster={project.video.poster} label={project.video.label} />
              <figcaption className="rs-note">{project.video.caption}</figcaption>
            </figure>
          </ResumeSection>
        )}

        {sections.map((s) => (
          <ResumeSection key={s.id} index={++n} title={s.title} id={s.id}>
            {s.lead && <p className="rs-case-role">{s.lead}</p>}
            <p className="rs-lead">{s.body}</p>
          </ResumeSection>
        ))}

        <ResumeSection index={++n} title="Built with" id="stack">
          <ul className="rs-case-stack">
            {project.tech.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </ResumeSection>

        {(project.images.length > 0 || mobileImages.length > 0) && (
          <ResumeSection index={++n} title="Gallery" id="gallery" wide>
            {mobileImages.length > 0 && (
              <>
                <h3 className="rs-case-subhead">On a phone <span>{mobileImages.length} {mobileImages.length === 1 ? "view" : "views"}</span></h3>
                {/* Phone views as devices on a stage (a swipeable row on phones); the longer notes sit below. */}
                <div className={mobileImages.length > 3 ? "rs-devices rs-devices-many" : "rs-devices"}>
                  {mobileImages.map((img, i) => (
                    <figure key={img.src} className="rs-device">
                      <a href={img.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${img.label} at full size (new tab)`}>
                        <span className="rs-device-frame">
                          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 639px) 62vw, 230px" />
                        </span>
                      </a>
                      <figcaption><span>{projectNumber(i)}</span> {deviceLabel(img.label)}</figcaption>
                    </figure>
                  ))}
                </div>
                {"mobileNote" in project && project.mobileNote && <p className="rs-note rs-device-source">{project.mobileNote}</p>}
                <ol className="rs-device-notes" aria-label="Notes on the phone views">
                  {mobileImages.map((img, i) => <li key={img.src}><span>Fig. {projectNumber(i)}</span>{img.caption}</li>)}
                </ol>
              </>
            )}
            {project.images.length > 0 && (
              <>
                {mobileImages.length > 0 && <h3 className="rs-case-subhead">On a desktop <span>{project.images.length} {project.images.length === 1 ? "view" : "views"}</span></h3>}
                <DesktopShowcase shots={project.images} name={project.name} host={host} figStart={desktopFigureStart} />
              </>
            )}
          </ResumeSection>
        )}

        <nav className="rs-case-pager" aria-label="Other case studies">
          {prev ? (
            <Link href={`/projects/${prev.slug}`}>
              <span><LuArrowLeft aria-hidden="true" /> Previous · {projectNumber(index - 1)}</span>
              <strong>{prev.name}</strong>
            </Link>
          ) : (
            <Link href="/resume#projects"><span><LuArrowLeft aria-hidden="true" /> Back</span><strong>All projects</strong></Link>
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="rs-case-pager-next">
              <span>Next · {projectNumber(index + 1)} <LuArrowRight aria-hidden="true" /></span>
              <strong>{next.name}</strong>
            </Link>
          ) : (
            <Link href="/resume#projects" className="rs-case-pager-next"><span>Back <LuArrowRight aria-hidden="true" /></span><strong>All projects</strong></Link>
          )}
        </nav>

        <SimpleFooter />
      </main>
    </div>
  );
}
