"use client";

import Link from "next/link";
import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import { resumeData } from "@/lib/data";

type FooterProps = {
  data: typeof resumeData;
};

function normalizeExternalUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function formatLinkLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

export function Footer({ data }: FooterProps) {
  const githubUrl = normalizeExternalUrl(data.github);
  const linkedinUrl = normalizeExternalUrl(data.linkedin);
  const contactLinks = (
    <>
      <a
        href={`mailto:${data.email}`}
        className="inline-flex items-center gap-2 font-display text-[11px] text-muted transition-colors hover:text-foreground sm:text-xs"
      >
        <LuMail className="h-3.5 w-3.5 shrink-0" />
        <span>{data.email}</span>
      </a>

      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-[11px] text-muted transition-colors hover:text-foreground sm:text-xs"
        >
          <LuGithub className="h-3.5 w-3.5 shrink-0" />
          <span>{formatLinkLabel(data.github)}</span>
        </a>
      )}

      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-[11px] text-muted transition-colors hover:text-foreground sm:text-xs"
        >
          <LuLinkedin className="h-3.5 w-3.5 shrink-0" />
          <span>{data.name}</span>
        </a>
      )}

      {!linkedinUrl && (
        <span className="inline-flex items-center gap-2 font-display text-[11px] text-muted-light sm:text-xs">
          <LuLinkedin className="h-3.5 w-3.5 shrink-0" />
          <span>LinkedIn</span>
        </span>
      )}
    </>
  );

  return (
    <>
      <footer className="section-box">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-heading text-lg text-accent sm:text-xl">Get in touch</h2>
            <p className="mt-1 font-display text-[10px] text-muted sm:text-[11px]">
              Available for full-time roles, contract work, and impactful projects.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end lg:hidden">
            {contactLinks}
          </div>

          <div className="hidden lg:ml-auto lg:flex lg:flex-col lg:items-start lg:gap-2">
            {contactLinks}
          </div>
        </div>
      </footer>

      <div className="mt-4 flex justify-center">
        <Link
          href="/creative"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-hover bg-card/80 px-3 py-1 font-display text-[11px] text-muted transition-colors hover:border-foreground/30 hover:text-foreground active:scale-95"
        >
          <span>🎮 Step into my 3D Office Mode</span>
        </Link>
      </div>

      <blockquote className="mt-4 text-center font-display text-[11px] italic leading-relaxed text-foreground/75 sm:text-xs">
        &ldquo;{data.quote.text}&rdquo;
      </blockquote>
      <p className="mt-1 text-center font-display text-[10px] text-muted sm:text-[11px]">
        &mdash; {data.quote.author}
      </p>

      <p className="mt-3 text-center font-display text-[10px] text-muted sm:text-[11px]">
        &copy; 2026 Keith Vergara. All rights reserved.
      </p>
    </>
  );
}
