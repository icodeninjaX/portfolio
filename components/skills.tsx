"use client";

import { type IconType } from "react-icons";
import {
  SiJavascript,
  SiPhp,
  SiHtml5,
  SiTypescript,
  SiMysql,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGit,
  SiNodedotjs,
  SiSupabase,
  SiPostgresql,
  SiJest,
  SiZod,
} from "react-icons/si";

type Skill = {
  name: string;
  level: number;
};

type SkillsProps = {
  skills: Skill[];
};

const iconMap: Record<string, { icon: IconType; color: string }> = {
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  PHP: { icon: SiPhp, color: "#777BB4" },
  "HTML/CSS": { icon: SiHtml5, color: "#E34F26" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  React: { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Git: { icon: SiGit, color: "#F05032" },
  "Node.js": { icon: SiNodedotjs, color: "#339933" },
  Supabase: { icon: SiSupabase, color: "#3FCF8E" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  Jest: { icon: SiJest, color: "#C21325" },
  Zod: { icon: SiZod, color: "#3E67B1" },
};

function SkillIcon({ name }: { name: string }) {
  const entry = iconMap[name];
  if (!entry) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-section-bg text-[10px] font-bold text-muted sm:h-10 sm:w-10 sm:text-xs">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  const Icon = entry.icon;
  return (
    <Icon
      className="h-7 w-7 sm:h-9 sm:w-9"
      style={entry.color ? { color: entry.color } : undefined}
    />
  );
}

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5 px-4 sm:gap-2 sm:px-6">
      <SkillIcon name={skill.name} />
      <span className="whitespace-nowrap text-[10px] text-muted sm:text-xs">
        {skill.name}
      </span>
    </div>
  );
}

function Marquee({ skills, direction }: { skills: Skill[]; direction: "left" | "right" }) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="group relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-card to-transparent sm:w-12" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-card to-transparent sm:w-12" />

      <div className={`flex w-max ${animClass} group-hover:[animation-play-state:paused]`}>
        {/* Duplicate for seamless loop */}
        {[...skills, ...skills].map((skill, i) => (
          <SkillItem key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  const half = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, half);
  const row2 = skills.slice(half);

  return (
    <section
      id="skills"
      className="rounded-xl bg-card py-4 shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:py-6"
    >
      <h2 className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-accent sm:mb-5 sm:px-6">
        Skills
      </h2>
      <div className="space-y-4 sm:space-y-5">
        <Marquee skills={row1} direction="left" />
        <Marquee skills={row2} direction="right" />
      </div>
    </section>
  );
}
