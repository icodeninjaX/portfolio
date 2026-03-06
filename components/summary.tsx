import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

type SummaryProps = {
  text: string;
};

export function Summary({ text }: SummaryProps) {
  return (
    <section id="about" className="section-box">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-heading text-xl text-accent sm:text-2xl">
          About Me
        </h2>
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-hover px-3 py-1 font-display text-[10px] font-medium text-foreground transition-colors hover:bg-section-bg sm:text-[11px]"
        >
          Read more
          <LuArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <p className="font-display text-xs leading-relaxed text-foreground/80 text-justify sm:text-sm">{text}</p>
    </section>
  );
}
