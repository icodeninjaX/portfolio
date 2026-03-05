type ExperienceItem = {
  company: string;
  shortName: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  tech: string[];
};

type ExperienceProps = {
  items: ExperienceItem[];
};

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
    <section id="experience" className="section-box">
      <h2 className="section-heading mb-5 text-xl text-accent sm:mb-6 sm:text-2xl">
        Experience
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => {
          const duration = getDuration(item.startDate, item.endDate);

          return (
            <div
              key={i}
              className="rounded-lg border border-border-hover p-4 sm:p-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">
                    {item.role}
                  </h3>
                  <p className="font-display text-xs text-muted sm:text-sm">
                    {item.company} &middot; {item.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-display text-xs text-muted-light sm:text-sm">
                  <span>{item.startDate} &ndash; {item.endDate}</span>
                  <span className="font-mono text-[11px] text-foreground/50">{duration}</span>
                </div>
              </div>
              <p className="mt-3 font-display text-[11px] leading-relaxed text-foreground/70 text-justify sm:text-xs">
                {item.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-tag-border bg-tag-bg px-2 py-px font-display text-[9px] font-medium text-tag-text sm:text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
