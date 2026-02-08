import Image from "next/image";
import { resumeData } from "@/lib/data";

type HeaderProps = {
  data: typeof resumeData;
};

export function Header({ data }: HeaderProps) {
  return (
    <header className="rounded-xl bg-card p-4 shadow-[var(--shadow-md)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3 items-center sm:gap-4 sm:items-start">
          <Image
            src="/profile.jpg"
            alt={data.name}
            width={80}
            height={80}
            className="animate-scale-in h-14 w-14 shrink-0 rounded-full object-cover border-2 border-accent/30 shadow-[var(--shadow)] sm:h-20 sm:w-20"
            priority
          />
          <div>
            <h1 className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-4xl">
              {data.name}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 sm:mt-1">
              <p className="text-base font-medium text-foreground/80 sm:text-lg">
                {data.title}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 sm:text-xs">
                <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Available
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-light sm:text-sm">
              {data.location}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:flex-col sm:gap-1.5 sm:text-sm sm:items-end">
          <a
            href={`mailto:${data.email}`}
            className="text-muted transition-colors hover:text-accent"
          >
            {data.email}
          </a>
          <span className="text-muted">{data.phone}</span>
          {data.github && (
            <a
              href={`https://${data.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              GitHub
            </a>
          )}
          {data.linkedin && (
            <a
              href={`https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
