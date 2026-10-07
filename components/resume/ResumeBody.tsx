import Link from "next/link";
import { LuArrowUpRight, LuCode, LuCpu } from "react-icons/lu";
import { resumeData } from "@/lib/data";
import { Chips, ResumeSection } from "./Section";
import { orderedProjects as projects, projectKind as kind, projectNumber } from "./projects";

const d = resumeData;

const MONTHS: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function duration(start: string, end: string) {
  const parse = (s: string) => { const [m, y] = s.split(" "); return new Date(Number(y), MONTHS[m] ?? 0); };
  const a = parse(start);
  const b = end === "Present" ? new Date() : parse(end);
  const total = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years} yr`, months && `${months} mo`].filter(Boolean).join(" ");
}

export function AtAGlance() {
  const stats = [
    { value: "2014", label: "First hands-on work with hardware, networks and code" },
    { value: String(d.experience.length), label: "Industry roles building production systems" },
    { value: String(d.projects.length), label: "Products shipped or in active development" },
    { value: "NC II · IV", label: "Hardware servicing and programming qualifications" },
  ];
  return (
    <dl className="rs-glance" aria-label="At a glance">
      {stats.map((s) => (
        <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
      ))}
    </dl>
  );
}

export function Profile({ index }: { index: number }) {
  return (
    <ResumeSection index={index} title="Profile" id="profile">
      <p className="rs-lead">{d.summary}</p>
    </ResumeSection>
  );
}

function SkillColumn({ title, icon: Icon, groups, tone }: { title: string; icon: typeof LuCode; groups: typeof d.skillGroups.software; tone: "software" | "hardware" }) {
  return (
    <div className={`rs-skill-col rs-tone-${tone}`}>
      <h3><Icon aria-hidden="true" />{title}</h3>
      <dl>
        {groups.map((g) => (
          <div key={g.label}>
            <dt>{g.label}</dt>
            <dd>
              {g.items.map((item, i) => (
                <span key={item}>
                  {(g.core as readonly string[]).includes(item) ? <strong>{item}</strong> : item}
                  {i < g.items.length - 1 && <span className="rs-sep" aria-hidden="true"> · </span>}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Skills({ index }: { index: number }) {
  return (
    <ResumeSection index={index} title="Core skills" id="skills">
      <div className="rs-skills">
        <SkillColumn title="Software" icon={LuCode} groups={d.skillGroups.software} tone="software" />
        <SkillColumn title="Hardware & systems" icon={LuCpu} groups={d.skillGroups.hardware} tone="hardware" />
      </div>
      <p className="rs-note">Bold marks the skills I use most in day-to-day work.</p>
    </ResumeSection>
  );
}

export function Experience({ index }: { index: number }) {
  return (
    <ResumeSection index={index} title="Experience" id="experience">
      <ol className="rs-list">
        {d.experience.map((job) => (
          <li key={job.company} className="rs-item">
            <div className="rs-item-head">
              <div>
                <h3>{job.role}</h3>
                <p className="rs-org">{job.company}</p>
              </div>
              <p className="rs-dates">
                {job.startDate} – {job.endDate}
                <span>{duration(job.startDate, job.endDate)}</span>
              </p>
            </div>
            <p className="rs-item-summary">{job.description}</p>
            <ul className="rs-bullets">
              {job.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <Chips items={job.tech} label={`Technologies used at ${job.company}`} />
          </li>
        ))}
      </ol>
    </ResumeSection>
  );
}

export function Projects({ index }: { index: number }) {
  return (
    <ResumeSection index={index} title="Selected projects" id="projects">
      <ul className="rs-projects">
        {projects.map((p, i) => (
          <li key={p.slug} className="rs-project">
            <p className="rs-project-meta">
              <span className="rs-project-no">{projectNumber(i)}</span>
              <span>{kind(p)}</span>
              {"stage" in p && p.stage ? <span>{p.stage}</span> : null}
            </p>
            <h3><Link href={`/projects/${p.slug}`}>{p.name}</Link></h3>
            <p>{p.description}</p>
            <Chips items={p.tech} label={`${p.name} technologies`} />
            <p className="rs-project-links">
              <Link href={`/projects/${p.slug}`}>Case study <LuArrowUpRight aria-hidden="true" /></Link>
              {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">Live site <LuArrowUpRight aria-hidden="true" /></a>}
            </p>
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
}

export function Growth({ index }: { index: number }) {
  return (
    <ResumeSection index={index} title="How my skills grew" id="growth">
      <ol className="rs-growth">
        {d.journey.map((step) => (
          <li key={step.title}>
            <p className="rs-growth-year">{step.year}</p>
            <div>
              <h3>{step.title.split(":")[0]}</h3>
              <Chips items={step.kit} label={`Skills from ${step.year}`} />
            </div>
          </li>
        ))}
      </ol>
      <p className="rs-note print-hidden"><Link href="/experience">Read the full story on the Journey page →</Link></p>
    </ResumeSection>
  );
}

export function Education({ index }: { index: number }) {
  return (
    <ResumeSection index={index} title="Education & certifications" id="education">
      <ol className="rs-list">
        {d.education.map((e) => (
          <li key={e.degree} className="rs-item">
            <div className="rs-item-head">
              <div>
                <h3>{e.degree}</h3>
                <p className="rs-org">{e.institution}</p>
              </div>
              <p className="rs-dates">{e.graduationDate || e.location}</p>
            </div>
          </li>
        ))}
        {d.certifications.map((c) => (
          <li key={c.name} className="rs-item">
            <div className="rs-item-head">
              <div>
                <h3>{c.name} <span className="rs-cert-detail">· {c.detail}</span></h3>
                <p className="rs-org">{c.issuer}</p>
              </div>
              <p className="rs-dates">{c.year}</p>
            </div>
          </li>
        ))}
      </ol>
    </ResumeSection>
  );
}
