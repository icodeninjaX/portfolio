"use client";

import { LuGithub, LuLinkedin, LuMail, LuArrowRight } from "react-icons/lu";
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
      <footer className="section-box relative overflow-hidden">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 font-display text-[11px] font-medium text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Available for Hire & Contract</span>
            </div>

            <h2 className="section-heading mt-2 text-2xl text-accent sm:text-3xl">
              Let&apos;s Build Together.
            </h2>
            <p className="mt-2 text-justify font-display text-xs leading-relaxed text-foreground/80 sm:text-sm">
              Need a full-stack engineer who takes ownership of internal tools, telemetry dashboards, or automation workflows? I&apos;m ready to contribute to your team or turn your next product idea into production software.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border-hover/60 pt-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-display text-xs font-semibold text-background transition-transform duration-200 hover:scale-[1.02] active:scale-95 sm:text-sm"
              >
                <LuMail className="h-4 w-4" />
                <span>Email Keith</span>
                <LuArrowRight className="h-3.5 w-3.5" />
              </a>

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-hover bg-card px-3.5 py-2 font-display text-xs font-medium text-foreground transition-colors hover:bg-section-bg active:scale-95 sm:text-sm"
                >
                  <LuLinkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-hover bg-card px-3.5 py-2 font-display text-xs font-medium text-foreground transition-colors hover:bg-section-bg active:scale-95 sm:text-sm"
                >
                  <LuGithub className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}
            </div>

            <div className="text-left sm:text-right">
              <span className="font-display text-[11px] text-muted-light block">
                Philippines (UTC+8)
              </span>
              <span className="font-display text-[11px] text-muted block">
                Typical reply: within 24 hrs
              </span>
            </div>
          </div>
        </div>
      </footer>

      <blockquote className="mt-5 text-center font-display text-[11px] italic leading-relaxed text-foreground/75 sm:text-xs">
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
