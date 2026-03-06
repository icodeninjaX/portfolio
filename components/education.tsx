import { LuGraduationCap } from "react-icons/lu";

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
    <section id="education" className="section-box">
      <h2 className="section-heading mb-5 text-xl text-accent sm:mb-6 sm:text-2xl">
        Education
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-lg border border-border-hover p-4 sm:p-5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-section-bg ring-1 ring-border-hover sm:h-10 sm:w-10">
              <LuGraduationCap className="h-4 w-4 text-muted-light sm:h-5 sm:w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">
                {item.degree}
              </h3>
              <p className="mt-0.5 font-display text-[11px] text-foreground/60 sm:text-xs">
                {item.institution}
              </p>
              <p className="mt-0.5 font-display text-[10px] text-muted-light sm:text-[11px]">
                {item.location}
                {item.graduationDate && <> &middot; {item.graduationDate}</>}
              </p>
              {item.details.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.details.map((d, j) => (
                    <span
                      key={j}
                      className="rounded-full border border-tag-border bg-tag-bg px-2 py-px font-display text-[9px] font-medium text-tag-text sm:text-[10px]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
