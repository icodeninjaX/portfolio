"use client";

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

  return (
    <>
      <footer className="section-box">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-heading text-lg text-accent sm:text-xl">Get in touch</h2>
            <p className="mt-1 font-display text-[10px] text-muted sm:text-[11px]">Open to collaborations.</p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
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
          </div>
        </div>
      </footer>

      <blockquote className="mt-3 text-center font-display text-[11px] italic leading-relaxed text-foreground/75 sm:text-xs">
        &ldquo;{data.quote.text}&rdquo;
      </blockquote>
      <p className="mt-1 text-center font-display text-[10px] text-muted sm:text-[11px]">
        &mdash; {data.quote.author}
      </p>

      <p className="mt-3 text-center font-display text-[10px] text-muted sm:text-[11px]">
        All rights reserved Keith Vergara 2026
      </p>
    </>
  );
}
