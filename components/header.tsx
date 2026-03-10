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
  const openToWorkBadge = (
    <span className="open-work-badge inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-display text-[10px] font-medium text-emerald-600 dark:text-emerald-400 lg:px-3 lg:py-1 lg:text-[11px]">
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Open to Work
    </span>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="section-box">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between lg:flex-col lg:items-start lg:gap-6">
        <div className="flex items-center gap-4 sm:items-start">
          <div className="flex flex-col items-start lg:gap-3">
            <Image
              src="/profile.webp"
              alt={data.name}
              width={80}
              height={80}
              className="h-16 w-16 rounded-full object-cover ring-1 ring-border-hover transition-all duration-500 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
              priority
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <h1
                className="glitch-name text-2xl text-foreground sm:text-3xl lg:whitespace-nowrap lg:text-[2rem]"
                data-text={data.name}
              >
                {data.name}
              </h1>
              <div className="hidden lg:flex">{openToWorkBadge}</div>
            </div>
            <div className="mt-1.5 lg:mt-2">
              <div className="h-4 overflow-hidden lg:h-5">
                <p
                  key={titleIndex}
                  className="title-enter whitespace-nowrap font-display text-[11px] font-medium tracking-tight text-accent sm:text-xs lg:text-sm"
                >
                  {titles[titleIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end lg:w-full lg:items-start lg:gap-4">
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end lg:hidden">
            {openToWorkBadge}
          </div>

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2.5 font-display sm:w-auto lg:hidden">
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuGraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[11px] text-muted sm:text-xs lg:text-[13px]">Information Systems</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuMapPin className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[11px] text-muted sm:text-xs lg:text-[13px]">Based on Philippines</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuMail className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <a
                href={`mailto:${data.email}`}
                className="text-[11px] text-muted transition-colors hover:text-accent sm:text-xs lg:text-[13px]"
              >
                {data.email}
              </a>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuLayers className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[11px] text-muted sm:text-xs lg:text-[13px]">5 working projects</span>
            </div>
          </div>

          <div className="hidden w-full font-display lg:grid lg:grid-cols-[max-content_max-content] lg:justify-between lg:gap-x-6 lg:gap-y-3">
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuGraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[13px] text-muted">Information Systems</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuMapPin className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[13px] text-muted">Based on Philippines</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuMail className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <a
                href={`mailto:${data.email}`}
                className="text-[13px] text-muted transition-colors hover:text-accent"
              >
                {data.email}
              </a>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <LuLayers className="h-3.5 w-3.5 shrink-0 text-muted-light" />
              <span className="text-[13px] text-muted">5 working projects</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
