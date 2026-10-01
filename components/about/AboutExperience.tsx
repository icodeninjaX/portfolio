"use client";

import dynamic from "next/dynamic";
import { StackShell } from "@/components/stack/StackShell";
import { ABOUT_KEYS } from "./stages";

const AboutCanvas = dynamic(() => import("./AboutCanvas"), { ssr: false });

const LABELS = ABOUT_KEYS.map((k) => k.label);

export function AboutExperience({ children }: { children: React.ReactNode }) {
  return (
    <StackShell
      className="stack-about"
      labels={LABELS}
      canvas={<AboutCanvas />}
      assets={false}
      video={{ src: "/about/hero-core.mp4", poster: "/about/hero-poster.webp" }}
      fallback="/about/hero-poster.webp"
      home="/"
      nav={[
        { href: "/#work", label: "Work", keep: true },
        { href: "/about", label: "About", current: true },
        { href: "/experience", label: "Journey" },
        { href: "#contact", label: "Contact", cta: true },
      ]}
      loaderLabel="Finding the core"
      readout={(s, idx, last) =>
        `DEPTH ${String(Math.round(s.progress * 100)).padStart(3, "0")}% · ${String(idx).padStart(2, "0")}/${last}`
      }
    >
      {children}
    </StackShell>
  );
}
