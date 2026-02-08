type SummaryProps = {
  text: string;
};

export function Summary({ text }: SummaryProps) {
  return (
    <section id="about" className="rounded-xl border-l-4 border-l-accent bg-card/50 p-4 pl-5 backdrop-blur-sm sm:p-6 sm:pl-7">
      <h2 className="section-heading mb-2 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-3">
        About
      </h2>
      <p className="text-sm italic leading-relaxed text-muted sm:text-base">{text}</p>
    </section>
  );
}
