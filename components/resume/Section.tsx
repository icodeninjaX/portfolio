import type { ReactNode } from "react";

// One resume block: a numbered label column on the left, content on the right
// (stacked on phones). Every section on /resume goes through this so the
// rhythm stays identical on screen and on paper.
export function ResumeSection({ index, title, id, children }: { index: number; title: string; id: string; children: ReactNode }) {
  return (
    <section className="rs-section" id={id} aria-labelledby={`${id}-title`}>
      <header className="rs-section-label">
        <span aria-hidden="true">{String(index).padStart(2, "0")}</span>
        <h2 id={`${id}-title`}>{title}</h2>
      </header>
      <div className="rs-section-body">{children}</div>
    </section>
  );
}

export function Chips({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="rs-chips" aria-label={label}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}
