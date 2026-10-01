import Link from "next/link";
import { resumeData } from "@/lib/data";
import { WAYPOINT_U } from "./stages";
import { elevation } from "./terrain";

type Data = typeof resumeData;
type Milestone = Data["journey"][number];

const START_YEAR = 2014;

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

/** "Internship: Real-World Experience" → plain lead + italic tail, the house headline style. */
function headline(title: string) {
  const colon = title.indexOf(":");
  if (colon > -1) return { lead: `${title.slice(0, colon)},`, tail: title.slice(colon + 1).trim() };
  const space = title.indexOf(" ");
  return { lead: title.slice(0, space), tail: title.slice(space + 1) };
}

export function TrailheadSection({ data }: { data: Data }) {
  const now = data.experience[0];
  return (
    <section id="top" data-stage className="stack-section stack-section--hero" aria-label="Introduction">
      <div className="stack-sticky">
        <div className="stack-hero">
          <p className="stack-hero__kicker stack-reveal" style={{ ["--d" as string]: "0.1s" }}>
            <span className="stack-dot" /> Journey — {data.name}
          </p>
          <h1 className="stack-hero__title">
            <span className="stack-line">
              <span className="stack-reveal" style={{ ["--d" as string]: "0.2s" }}>
                The long
              </span>
            </span>
            <span className="stack-line">
              <em className="stack-reveal" style={{ ["--d" as string]: "0.34s" }}>
                way up.
              </em>
            </span>
          </h1>
          <div className="stack-hero__foot">
            <p className="stack-hero__lede stack-reveal" style={{ ["--d" as string]: "0.5s" }}>
              No shortcuts. It started at a workbench with a screwdriver in {START_YEAR} and it&apos;s still climbing.
              Scroll to walk the route, one waypoint at a time.
            </p>
            <dl className="stack-hero__meta stack-reveal" style={{ ["--d" as string]: "0.62s" }}>
              <div>
                <dt>Trailhead</dt>
                <dd>{START_YEAR}, Las Piñas</dd>
              </div>
              <div>
                <dt>Waypoints</dt>
                <dd>{String(data.journey.length).padStart(2, "0")} so far</dd>
              </div>
              <div>
                <dt>Current stretch</dt>
                <dd>{now.company.replace(" Inc.", "")}</dd>
              </div>
            </dl>
          </div>
        </div>
        <a href="#wp-01" className="stack-scrollcue stack-reveal" style={{ ["--d" as string]: "0.8s" }}>
          <span>Scroll to set out</span>
          <span className="stack-scrollcue__line" />
        </a>
      </div>
    </section>
  );
}

export function WaypointSection({ item, index, total }: { item: Milestone; index: number; total: number }) {
  const id = `wp-${String(index + 1).padStart(2, "0")}`;
  const { lead, tail } = headline(item.title);
  const elev = elevation(WAYPOINT_U[index]);
  const right = index % 2 === 1;
  return (
    <section
      id={id}
      data-stage
      className={`stack-section stack-section--waypoint ${right ? "stack-section--right" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="stack-sticky">
        <article className="stack-copy stack-copy--wide">
          <Chapter
            index={`WP${String(index + 1).padStart(2, "0")}`}
            name={item.year}
            meta={`Elev ${String(elev).padStart(4, "0")} m`}
          />
          <h2 id={`${id}-title`} className="stack-h2 stack-h2--waypoint">
            {lead} <em>{tail}</em>
          </h2>
          <p className="stack-body">{item.description}</p>
          <div className="stack-kit">
            <span className="stack-kit__label">Picked up here</span>
            <ul className="stack-tags" aria-label="Picked up here">
              {item.kit.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
          <p className="stack-waypoint__count" aria-hidden>
            <span>{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
          </p>
        </article>
      </div>
    </section>
  );
}

export function LedgerSection({ data }: { data: Data }) {
  const school = data.education[0];
  return (
    <section id="ledger" data-stage className="stack-section stack-section--right" aria-labelledby="ledger-title">
      <div className="stack-sticky">
        <article className="stack-copy stack-copy--wide">
          <Chapter index="LOG" name="The ledger" meta="Positions held" />
          <h2 id="ledger-title" className="stack-h2">
            The stretches <em>on the clock.</em>
          </h2>
          <ol className="stack-ledger">
            {data.experience.map((job) => (
              <li key={job.company}>
                <div className="stack-ledger__head">
                  <strong>{job.role}</strong>
                  <span className="stack-ledger__when">
                    {job.startDate} — {job.endDate}
                  </span>
                </div>
                <span className="stack-ledger__where">{job.company}</span>
                <p>{job.description}</p>
                <ul className="stack-tags">
                  {job.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <div className="stack-ledger__head">
                <strong>{school.degree}</strong>
                <span className="stack-ledger__when">Degree</span>
              </div>
              <span className="stack-ledger__where">{school.institution}</span>
            </li>
          </ol>
        </article>
      </div>
    </section>
  );
}

export function SummitSection({ data }: { data: Data }) {
  const github = `https://${data.github}`;
  return (
    <section id="contact" data-stage className="stack-section stack-section--contact" aria-labelledby="summit-title">
      <div className="stack-sticky">
        <div className="stack-contact">
          <Chapter index="WP∞" name="Summit" meta="Open to work" />
          <h2 id="summit-title" className="stack-contact__title">
            The road <em>keeps going.</em>
          </h2>
          <div className="stack-contact__ctas">
            <Link href="/#work" className="stack-link">
              See the work <span aria-hidden>→</span>
            </Link>
            <Link href="/about" className="stack-link stack-link--ghost">
              Meet the human <span aria-hidden>→</span>
            </Link>
          </div>
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
              <Link href="/">Home</Link>
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
