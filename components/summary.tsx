type SummaryProps = {
  text: string;
};

export function Summary({ text }: SummaryProps) {
  return (
    <section id="about" className="section-box">
      <h2 className="section-heading mb-3 text-xl text-accent sm:text-2xl">
        About Me
      </h2>
      <p className="font-display text-xs leading-relaxed text-foreground/80 text-justify sm:text-sm">{text}</p>
    </section>
  );
}
