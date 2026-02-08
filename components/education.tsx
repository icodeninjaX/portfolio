type EducationItem = {
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  details: string[];
};

type EducationProps = {
  items: EducationItem[];
};

export function Education({ items }: EducationProps) {
  return (
    <section id="education" className="p-4 sm:p-6">
      <h2 className="section-heading mb-4 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-5">
        Education
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border-l-2 border-border pl-4 transition-colors hover:border-accent">
            <h3 className="text-sm font-semibold sm:text-[15px]">{item.degree}</h3>
            <p className="mt-0.5 text-xs text-muted-light sm:text-sm">
              {item.institution} &middot; {item.location}
            </p>
            {item.graduationDate && (
              <span className="text-[11px] font-medium text-muted-light sm:text-xs">
                {item.graduationDate}
              </span>
            )}
            {item.details.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                {item.details.map((d, j) => (
                  <span
                    key={j}
                    className="rounded-md bg-section-bg px-2 py-0.5 text-[11px] text-muted sm:px-2.5 sm:py-1 sm:text-xs"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
