"use client";

import { type IconType } from "react-icons";
import {
  SiJavascript,
  SiPhp,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiMysql,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiNodedotjs,
  SiNpm,
  SiVercel,
  SiLinux,
  SiVite,
  SiBun,
  SiClaude,
  SiGooglegemini,
  SiOpenai,
  SiSupabase,
  SiPostgresql,
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
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss3, color: "#1572B6" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  React: { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "currentColor" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Git: { icon: SiGit, color: "#F05032" },
  GitHub: { icon: SiGithub, color: "currentColor" },
  "Node.JS": { icon: SiNodedotjs, color: "#339933" },
  NPM: { icon: SiNpm, color: "#CB3837" },
  Vercel: { icon: SiVercel, color: "currentColor" },
  WSL: { icon: SiLinux, color: "#FCC624" },
  Vite: { icon: SiVite, color: "#646CFF" },
  Bun: { icon: SiBun, color: "#FBF0DF" },
  "Claude Code": { icon: SiClaude, color: "#D97706" },
  Gemini: { icon: SiGooglegemini, color: "#8E75B2" },
  Codex: { icon: SiOpenai, color: "#10A37F" },
  Supabase: { icon: SiSupabase, color: "#3FCF8E" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
};

function SkillItem({ skill }: { skill: Skill }) {
  const entry = iconMap[skill.name];
  return (
    <div className="flex items-center gap-2 px-5 py-1.5 mx-1">
      {entry ? (
        <entry.icon className="h-3.5 w-3.5 shrink-0" style={{ color: entry.color }} />
      ) : (
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[8px] font-bold text-muted-light">
          {skill.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="whitespace-nowrap font-display text-[11px] font-medium text-muted sm:text-xs">
        {skill.name}
      </span>
    </div>
  );
}

function MarqueeRow({ skills, reverse = false }: { skills: Skill[]; reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden">
      <div className="marquee-fade-left" />
      <div className="marquee-fade-right" />
      <div
        className="marquee-track"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[...skills, ...skills].map((skill, i) => (
          <SkillItem key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  const mid = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, mid);
  const row2 = skills.slice(mid);

  return (
    <section id="skills" className="section-box overflow-hidden">
      <h2 className="section-heading mb-4 text-xl text-accent sm:mb-5 sm:text-2xl">
        Skills
      </h2>
      <div className="flex flex-col gap-2">
        <MarqueeRow skills={row1} />
        <MarqueeRow skills={row2} reverse />
      </div>
    </section>
  );
}
