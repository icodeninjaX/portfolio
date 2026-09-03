import Link from "next/link";
import { LuArrowRight, LuSparkles, LuGamepad2 } from "react-icons/lu";

export function CreativeBanner() {
  return (
    <section className="section-box relative overflow-hidden group">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
            <LuGamepad2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">
                Interactive 3D Virtual Office
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-display text-[9px] font-medium text-purple-400">
                <LuSparkles className="h-2.5 w-2.5" />
                Three.js / WebGL
              </span>
            </div>
            <p className="mt-1 text-justify font-display text-xs leading-relaxed text-muted sm:text-[13px]">
              Step inside a real-time, FPS-style walkable studio. Speak with office NPCs, inspect section stations, and experience a playful take on my portfolio in 3D.
            </p>
          </div>
        </div>

        <Link
          href="/creative"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-border-hover bg-card px-4 py-2 font-display text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-foreground hover:text-background active:scale-95"
        >
          <span>Launch 3D Office</span>
          <LuArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
