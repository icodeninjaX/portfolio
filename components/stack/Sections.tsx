import Link from "next/link";
import { resumeData } from "@/lib/data";

type Data = typeof resumeData;
type Project = Data["projects"][number];

const statusLabel: Record<Project["status"], string> = {
  current: "Production · Work",
  internship: "Internship · Solo build",
  personal: "Personal · Shipped",
};

function Chapter({ index, name, meta }: { index: string; name: string; meta: string }) {
  return (
    <p className="stack-chapter">
      <span className="stack-chapter__index">{index}</span>
      <span className="stack-chapter__rule" />
      <span>{name}</span>
      <span className="stack-chapter__meta">{meta}</span>
    </p>
  );
}

export function HeroSection({ data }: { data: Data }) {
  const current = data.experience[0];
  return (
    <section id="top" data-stage className="stack-section stack-section--hero" aria-label="Introduction">
      <div className="stack-sticky">
        <div className="stack-hero">
          <p className="stack-hero__kicker stack-reveal" style={{ ["--d" as string]: "0.1s" }}>
            <span className="stack-dot" /> {data.name} — {data.title}
          </p>
          <h1 className="stack-hero__title">
            <span className="stack-line">
              <span className="stack-reveal" style={{ ["--d" as string]: "0.2s" }}>
                Full stack,
              </span>
            </span>
            <span className="stack-line">
              <em className="stack-reveal" style={{ ["--d" as string]: "0.34s" }}>
                literally.
              </em>
            </span>
          </h1>
          <div className="stack-hero__foot">
            <p className="stack-hero__lede stack-reveal" style={{ ["--d" as string]: "0.5s" }}>
              I started out fixing computers and ended up building the software that runs on them. Scroll to climb
              the stack, from the silicon up to the products I ship.
            </p>
            <dl className="stack-hero__meta stack-reveal" style={{ ["--d" as string]: "0.62s" }}>
              <div>
                <dt>Now</dt>
                <dd>{current.role}, {current.company.replace(" Inc.", "")}</dd>
              </div>
              <div>
                <dt>Based</dt>
                <dd>{data.location}</dd>
              </div>
            </dl>
          </div>
        </div>
        <a href="#silicon" className="stack-scrollcue stack-reveal" style={{ ["--d" as string]: "0.8s" }}>
          <span>Scroll to climb</span>
          <span className="stack-scrollcue__line" />
        </a>
      </div>
    </section>
  );
}

export function SiliconSection({ data }: { data: Data }) {
  const voc = data.journey[0];
  return (
    <section id="silicon" data-stage className="stack-section" aria-labelledby="silicon-title">
      <div className="stack-sticky">
        <article className="stack-copy">
          <Chapter index="L1" name="Silicon" meta={voc.year} />
          <h2 id="silicon-title" className="stack-h2">
            It started with a screwdriver, <em>not a keyboard.</em>
          </h2>
          <p className="stack-body">
            Two years of vocational training taught me computers from the metal up: how the hardware works, how to
            repair it, and how networks connect it. Then came Java, Turbo C and Visual Basic 6, where I learned to think in
            logic before I learned to think in frameworks.
          </p>
          <ul className="stack-facts">
            <li>
              <span>NC II</span>Hardware servicing and networking
            </li>
            <li>
              <span>NC IV</span>Computer programming
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export function SignalSection({ data }: { data: Data }) {
  const intern = data.experience.find((e) => e.role.includes("Intern")) ?? data.experience[1];
  return (
    <section id="signal" data-stage className="stack-section stack-section--right" aria-labelledby="signal-title">
      <div className="stack-sticky">
        <article className="stack-copy">
          <Chapter index="L2" name="Signal" meta={`${intern.startDate} – ${intern.endDate}`} />
          <h2 id="signal-title" className="stack-h2">
            Then I learned how machines <em>talk to each other.</em>
          </h2>
          <p className="stack-body">
            My first real client was an LPG distributor running on paper slips. As a solo intern at {intern.company}, I
            built their POS and CMS and wired an SMS gateway that routes every order to the nearest branch
            automatically. Dispatch went from hours to seconds.
          </p>
          <ul className="stack-facts">
            <li>
              <span>SMS</span>Distance-based order routing
            </li>
            <li>
              <span>POS</span>Counter sales, deliveries, stock
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}

const DATA_TOOLS = ["MySQL", "PostgreSQL", "Supabase", "PHP", "TypeScript", "Node.JS"];

export function DataSection({ data }: { data: Data }) {
  const college = data.journey[1];
  const tools = data.skills.filter((s) => DATA_TOOLS.includes(s.name));
  return (
    <section id="data" data-stage className="stack-section" aria-labelledby="data-title">
      <div className="stack-sticky">
        <article className="stack-copy">
          <Chapter index="L3" name="Data" meta={college.year} />
          <h2 id="data-title" className="stack-h2">
            Every real system is a data problem <em>wearing a UI.</em>
          </h2>
          <p className="stack-body">
            A BS in Information Systems put the business around the code: database design, systems analysis, IT security,
            and how software actually moves through an organisation. It is why I design the schema before the screen.
          </p>
          <ul className="stack-meter" aria-label="Data tooling proficiency">
            {tools.map((t) => (
              <li key={t.name}>
                <span>{t.name}</span>
                <span className="stack-meter__bar" aria-label={`${t.level} of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={i < t.level ? "on" : ""} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function firstSentence(text: string) {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

export function ProjectSection({ project, index, total }: { project: Project; index: number; total: number }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <section
      id={index === 0 ? "work" : `work-${project.slug}`}
      data-stage
      className="stack-section stack-section--project"
      aria-labelledby={`p-${project.slug}`}
    >
      <div className="stack-sticky">
        <article className="stack-copy stack-copy--wide">
          <Chapter index="L4" name={index === 0 ? "Interface — Selected work" : "Interface"} meta={`${n} / ${String(total).padStart(2, "0")}`} />
          <p className="stack-project__status">{statusLabel[project.status]}</p>
          <h2 id={`p-${project.slug}`} className="stack-project__name">
            {project.name}
          </h2>
          <p className="stack-body stack-body--lead">{project.description}</p>
          <dl className="stack-case">
            <div>
              <dt>Problem</dt>
              <dd>{firstSentence(project.problem)}</dd>
            </div>
            <div>
              <dt>Decision</dt>
              <dd>{firstSentence(project.decision)}</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>{firstSentence(project.result)}</dd>
            </div>
          </dl>
          <div className="stack-project__foot">
            <ul className="stack-tags" aria-label="Tech stack">
              {project.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="stack-project__links">
              <Link href={`/projects/${project.slug}`} className="stack-link">
                Case study <span aria-hidden>→</span>
              </Link>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="stack-link stack-link--ghost">
                  Live <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function NowSection({ data }: { data: Data }) {
  return (
    <section id="now" data-stage className="stack-section stack-section--right stack-section--tall" aria-labelledby="now-title">
      <div className="stack-sticky">
        <article className="stack-copy stack-copy--wide">
          <Chapter index="L5" name="Now" meta="The whole stack" />
          <h2 id="now-title" className="stack-h2">
            Hardware, signal, data, interface. <em>One person, every layer.</em>
          </h2>
          <ol className="stack-timeline">
            {data.experience.map((e) => (
              <li key={e.company}>
                <span className="stack-timeline__when">
                  {e.startDate} – {e.endDate}
                </span>
                <span className="stack-timeline__what">
                  <strong>{e.role}</strong>
                  <span>{e.company}</span>
                </span>
              </li>
            ))}
          </ol>
          <ul className="stack-toolkit" aria-label="Toolkit">
            {data.skills.map((s) => (
              <li key={s.name} data-level={s.level}>
                {s.name}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export function ContactSection({ data }: { data: Data }) {
  const github = `https://${data.github}`;
  return (
    <section id="contact" data-stage className="stack-section stack-section--contact" aria-labelledby="contact-title">
      <div className="stack-sticky">
        <div className="stack-contact">
          <Chapter index="L6" name="Next layer" meta="Open to work" />
          <h2 id="contact-title" className="stack-contact__title">
            Let&apos;s build <em>the next layer.</em>
          </h2>
          <a href={`mailto:${data.email}`} className="stack-contact__mail">
            {data.email}
          </a>
          <ul className="stack-contact__links">
            <li>
              <a href={github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/creative">Walk the office (3D) ↗</Link>
            </li>
          </ul>
          <p className="stack-contact__fine">
            © {new Date().getFullYear()} {data.name} · {data.location}
          </p>
        </div>
      </div>
    </section>
  );
}
