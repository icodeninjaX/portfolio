type ExperienceItem = {
  company: string;
  shortName: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
};

type ExperienceProps = {
  items: ExperienceItem[];
};

const colors = [
  "bg-blue-500/15 text-blue-600",
  "bg-violet-500/15 text-violet-600",
  "bg-rose-500/15 text-rose-600",
  "bg-emerald-500/15 text-emerald-600",
];

function getDuration(start: string, end: string): string {
  const parseDate = (s: string) => {
    const [month, year] = s.split(" ");
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    return new Date(Number(year), months[month] ?? 0);
  };

  const startDate = parseDate(start);
  const endDate = end === "Present" ? new Date() : parseDate(end);
  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) return `${years}yr ${months}mo`;
  if (years > 0) return `${years}yr`;
  return `${months}mo`;
}

export function Experience({ items }: ExperienceProps) {
  return (
    <section
      id="experience"
      className="rounded-xl bg-card p-4 shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-6"
    >
      <h2 className="section-heading mb-4 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-5">
        Experience
      </h2>
      <div className="relative space-y-0">
        {items.map((item, i) => {
          const duration = getDuration(item.startDate, item.endDate);

          return (
            <div key={i} className="relative pb-5 pl-5 last:pb-0 sm:pb-6 sm:pl-6">
              {/* Timeline line */}
              {i < items.length - 1 && (
                <div className="absolute left-[5px] top-[10px] h-full w-px bg-border" />
              )}
              {/* Timeline dot — pulses if current role */}
              <div className="absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full border-2 border-accent bg-card" />
              {item.endDate === "Present" && (
                <div className="animate-pulse-dot absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full bg-accent/30" />
              )}

              <div className="flex items-start gap-3">
                {/* Growth stage avatar */}
                <div
                  className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg sm:flex ${colors[i % colors.length]}`}
                  aria-hidden="true"
                  title={i === 0 ? "Current role" : "Starting out"}
                >
                  {/* Newest role = most "grown", last role = baby */}
                  {i === items.length - 1 ? "👶" : i === 0 ? "🧑‍💻" : "🧑"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h3 className="text-sm font-semibold sm:text-[15px]">{item.role}</h3>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent sm:text-[11px]">
                      {duration}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-xs text-muted-light sm:text-sm">
                      {item.company} &middot; {item.location}
                    </p>
                    <span className="text-[11px] font-medium text-muted-light sm:text-xs">
                      {item.startDate} &ndash; {item.endDate}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 sm:mt-2.5 sm:space-y-1.5">
                    {item.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="relative pl-3 text-xs leading-relaxed text-muted before:absolute before:left-0 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-muted-light sm:pl-4 sm:text-sm sm:before:top-[9px]"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
