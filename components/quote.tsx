type QuoteProps = {
  text: string;
};

export function Quote({ text }: QuoteProps) {
  return (
    <section id="quote" className="section-box">
      <blockquote className="font-display text-sm italic leading-relaxed text-foreground/85 sm:text-base">
        &ldquo;{text}&rdquo;
      </blockquote>
    </section>
  );
}
