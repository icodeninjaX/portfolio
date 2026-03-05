"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { resumeData } from "@/lib/data";
import { LuGraduationCap, LuMapPin, LuMail, LuLayers } from "react-icons/lu";

type HeaderProps = {
  data: typeof resumeData;
};

const titles = [
  "Full-Stack Web Developer",
  "Let's build your website",
  "Building Solutions",
  "Making your Life Easier",
  "Let's automate your business",
  "Let's track your sales",
];

export function Header({ data }: HeaderProps) {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="section-box">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4 items-center sm:items-start">
          <Image
            src="/profile.jpg"
            alt={data.name}
            width={80}
            height={80}
            className="h-16 w-16 rounded-full object-cover transition-all duration-500 sm:h-20 sm:w-20"
            priority
          />
          <div>
            <h1
              className="glitch-name text-2xl text-foreground sm:text-3xl"
              data-text={data.name}
            >
              {data.name}
            </h1>
            <div className="mt-1.5">
              <div className="h-4 overflow-hidden">
                <p
                  key={titleIndex}
                  className="title-enter whitespace-nowrap font-display text-[11px] font-medium tracking-tight text-accent sm:text-xs"
                >
                  {titles[titleIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <span className="open-work-badge inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-display text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Open to Work
          </span>

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2.5 font-display sm:w-auto">
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuGraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[11px] text-muted sm:text-xs">Information Systems</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuMapPin className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[11px] text-muted sm:text-xs">Based on Philippines</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuMail className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <a
                href={`mailto:${data.email}`}
                className="text-[11px] text-muted transition-colors hover:text-accent sm:text-xs"
              >
                {data.email}
              </a>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuLayers className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[11px] text-muted sm:text-xs">5 working projects</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
