import { resumeData } from "@/lib/data";

// The printed / "Save as PDF" version of /resume: a Harvard-style, ATS-friendly
// layout. One column, standard section headings, plain text in reading order
// (no icons, images, tables or columns), so applicant tracking systems parse it
// cleanly. Hidden on screen; resume.css swaps it in for print.

const d = resumeData;

const SITE = "portfolio.kdvwebsiteservices.com";
const plain = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

// Employer projects are already covered under Experience; PlantPal is left
// out to keep the printed resume to one page.
const SKIP = ["371admin", "new-z1on-lpg", "plantpal"];
const projects = d.projects.filter((p) => !SKIP.includes(p.slug));

// Skills under the plain headings ATS parsers and recruiters search for.
const group = (label: string) => [...d.skillGroups.software, ...d.skillGroups.hardware].find((g) => g.label === label)?.items ?? [];
const skills = [
  { label: "Languages", items: group("Languages") },
  { label: "Frameworks & Libraries", items: group("Frontend") },
  { label: "Backend & Databases", items: group("Backend & data") },
  { label: "Tools & Platforms", items: [...group("Tooling & delivery"), ...group("AI-assisted development")] },
  { label: "Hardware & Networking", items: d.skillGroups.hardware.flatMap((g) => g.items) },
];

function Entry({ left, right, sub, subRight, children }: { left: React.ReactNode; right?: string; sub?: React.ReactNode; subRight?: string; children?: React.ReactNode }) {
  return (
    <div className="hv-entry">
      <p className="hv-line"><strong>{left}</strong>{right && <span>{right}</span>}</p>
      {(sub || subRight) && <p className="hv-line"><em>{sub}</em>{subRight && <span>{subRight}</span>}</p>}
      {children}
    </div>
  );
}

export function HarvardResume() {
  const contact = [d.location, d.email, plain(d.linkedin), plain(d.github), SITE];

  return (
    <article className="hv" aria-label="Printable resume">
      <header className="hv-head">
        <h1>{d.name}</h1>
        <p>{contact.join(" | ")}</p>
      </header>

      <section>
        <h2>Summary</h2>
        <p>{d.summary}</p>
      </section>

      <section>
        <h2>Experience</h2>
        {d.experience.map((job) => (
          <Entry key={job.company} left={job.company} right={job.location || undefined} sub={job.role} subRight={`${job.startDate} – ${job.endDate}`}>
            <ul>
              {job.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </Entry>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.map((p) => (
          <Entry
            key={p.slug}
            left={<>{p.name}<span className="hv-normal"> | {p.tech.join(", ")}</span></>}
            right={p.link ? plain(p.link) : "stage" in p && p.stage ? p.stage : undefined}
          >
            <ul><li>{p.description}</li></ul>
          </Entry>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {d.education.map((e) => (
          <Entry key={e.degree} left={e.institution} right={e.location} sub={e.degree} subRight={e.graduationDate || undefined} />
        ))}
      </section>

      <section>
        <h2>Certifications</h2>
        <ul>
          {d.certifications.map((c) => <li key={c.name}><strong>{c.name}</strong>, {c.detail} | {c.issuer.split(" · ")[0]}, {c.year}</li>)}
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <ul className="hv-skills">
          {skills.map((g) => <li key={g.label}><strong>{g.label}:</strong> {g.items.join(", ")}</li>)}
        </ul>
      </section>
    </article>
  );
}
