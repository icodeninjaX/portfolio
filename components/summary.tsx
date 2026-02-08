type SummaryProps = {
  text: string;
};

export function Summary({ text }: SummaryProps) {
  return (
    <section id="about" className="rounded-xl bg-card p-4 shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-3">
        About
      </h2>
      <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{text}</p>
    </section>
  );
}
