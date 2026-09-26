import Link from "next/link";
import { resumeData } from "@/lib/data";

type Data = typeof resumeData;

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

export function SurfaceSection({ data }: { data: Data }) {
  return (
    <section id="top" data-stage className="stack-section stack-section--hero" aria-label="Introduction">
      <div className="stack-sticky">
        <div className="stack-hero">
          <p className="stack-hero__kicker stack-reveal" style={{ ["--d" as string]: "0.1s" }}>
            <span className="stack-dot" /> About — {data.name}
          </p>
          <h1 className="stack-hero__title">
            <span className="stack-line">
              <span className="stack-reveal" style={{ ["--d" as string]: "0.2s" }}>
                The human
              </span>
            </span>
            <span className="stack-line">
              <em className="stack-reveal" style={{ ["--d" as string]: "0.34s" }}>
                in the loop.
              </em>
            </span>
          </h1>
          <div className="stack-hero__foot">
            <p className="stack-hero__lede stack-reveal" style={{ ["--d" as string]: "0.5s" }}>
              You&apos;ve seen the stack. This is the person running it. Scroll inward, one ring at a time, to whatever
              keeps it all turning.
            </p>
            <dl className="stack-hero__meta stack-reveal" style={{ ["--d" as string]: "0.62s" }}>
              <div>
                <dt>Based</dt>
                <dd>{data.location}</dd>
              </div>
              <div>
                <dt>In tech since</dt>
                <dd>{START_YEAR}</dd>
              </div>
            </dl>
          </div>
        </div>
        <a href="#origin" className="stack-scrollcue stack-reveal" style={{ ["--d" as string]: "0.8s" }}>
          <span>Scroll inward</span>
          <span className="stack-scrollcue__line" />
        </a>
      </div>
    </section>
  );
}

export function OriginSection({ data }: { data: Data }) {
  const years = new Date().getFullYear() - START_YEAR;
  return (
    <section id="origin" data-stage className="stack-section" aria-labelledby="origin-title">
      <div className="stack-sticky">
        <article className="stack-copy">
          <Chapter index="R1" name="Origin" meta="Las Piñas, PH" />
          <h2 id="origin-title" className="stack-h2">
            Built from the ground up, <em>like the machines I learned on.</em>
          </h2>
          <p className="stack-body">{data.about.bio}</p>
          <dl className="stack-stats">
            <div>
              <dt>Years in tech</dt>
              <dd>{years}</dd>
            </div>
            <div>
              <dt>Products shipped</dt>
              <dd>{String(data.projects.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Tools in rotation</dt>
              <dd>{data.skills.length}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

export function OrbitSection({ data }: { data: Data }) {
  const { journey } = data;
  return (
    <section
      id="orbit"
      data-stage
      className="stack-section stack-section--right stack-section--tall"
      aria-labelledby="orbit-title"
    >
      <div className="stack-sticky">
        <article className="stack-copy stack-copy--wide">
          <Chapter index="R2" name="Orbit" meta={`${START_YEAR} — Present`} />
          <h2 id="orbit-title" className="stack-h2">
            Every year added <em>another ring.</em>
          </h2>
          <p className="stack-body">
            Hardware first, then code, then the business around the code. Each stage wrapped around the last one.
          </p>
          <ol className="stack-orbit" style={{ ["--n" as string]: journey.length }}>
            {journey.map((j, i) => (
              <li key={j.title} style={{ ["--i" as string]: i }}>
                <span className="stack-orbit__when">{j.year}</span>
                <span className="stack-orbit__what">{j.title.split(":")[0]}</span>
              </li>
            ))}
          </ol>
          <Link href="/experience" className="stack-textlink">
            The full journey <span aria-hidden>→</span>
          </Link>
        </article>
      </div>
    </section>
  );
}

export function OffHoursSection({ data }: { data: Data }) {
  return (
    <section id="off-hours" data-stage className="stack-section" aria-labelledby="off-hours-title">
      <div className="stack-sticky">
        <article className="stack-copy">
          <Chapter index="R3" name="Off-hours" meta="Satellites" />
          <h2 id="off-hours-title" className="stack-h2">
            What I do when <em>nothing&apos;s compiling.</em>
          </h2>
          <p className="stack-body">{data.about.interests}</p>
          <ul className="stack-moons" aria-label="Interests">
            {data.about.interestList.map((item, i) => (
              <li key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export function DriveSection({ data }: { data: Data }) {
  return (
    <section id="drive" data-stage className="stack-section stack-section--right" aria-labelledby="drive-title">
      <div className="stack-sticky">
        <article className="stack-copy">
          <Chapter index="R4" name="Drive" meta="The core" />
          <h2 id="drive-title" className="stack-h2">
            Nothing beats seeing it <em>work in production.</em>
          </h2>
          <p className="stack-body">{data.about.motivation}</p>
          <figure className="stack-quote">
            <blockquote>&ldquo;{data.quote.text}&rdquo;</blockquote>
            <figcaption>{data.quote.author}</figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}

export function TrajectorySection({ data }: { data: Data }) {
  return (
    <section id="trajectory" data-stage className="stack-section" aria-labelledby="trajectory-title">
      <div className="stack-sticky">
        <article className="stack-copy stack-copy--wide">
          <Chapter index="R5" name="Trajectory" meta="Next" />
          <h2 id="trajectory-title" className="stack-h2">
            It all lines up <em>once you know where you&apos;re headed.</em>
          </h2>
          <p className="stack-body">{data.about.goals}</p>
          <dl className="stack-case">
            <div>
              <dt>Next</dt>
              <dd>Senior engineering, then technical leadership.</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>Fintech, developer tools and enterprise software.</dd>
            </div>
            <div>
              <dt>Always</dt>
              <dd>AI integration, modern frameworks, and the fundamentals under both.</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

export function CoreSection({ data }: { data: Data }) {
  const github = `https://${data.github}`;
  return (
    <section id="contact" data-stage className="stack-section stack-section--contact" aria-labelledby="core-title">
      <div className="stack-sticky">
        <div className="stack-contact">
          <Chapter index="R0" name="Core" meta="Open to work" />
          <h2 id="core-title" className="stack-contact__title">
            Now you know <em>who&apos;s behind it.</em>
          </h2>
          <div className="stack-contact__ctas">
            <Link href="/#work" className="stack-link">
              See the work <span aria-hidden>→</span>
            </Link>
            <Link href="/experience" className="stack-link stack-link--ghost">
              Walk the journey <span aria-hidden>→</span>
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
