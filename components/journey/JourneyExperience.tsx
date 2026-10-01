"use client";

import dynamic from "next/dynamic";
import { StackShell } from "@/components/stack/StackShell";
import { travelled } from "./activity";
import { JOURNEY_KEYS } from "./stages";
import { elevation } from "./terrain";

const JourneyCanvas = dynamic(() => import("./JourneyCanvas"), { ssr: false });

const LABELS = JOURNEY_KEYS.map((k) => k.label);

export function JourneyExperience({ children }: { children: React.ReactNode }) {
  return (
    <StackShell
      className="stack-journey"
      labels={LABELS}
      canvas={<JourneyCanvas />}
      assets={false}
      video={{ src: "/journey/hero-route.mp4", poster: "/journey/hero-poster.webp" }}
      fallback="/journey/hero-poster.webp"
      home="/"
      nav={[
        { href: "/#work", label: "Work", keep: true },
        { href: "/about", label: "About" },
        { href: "/experience", label: "Journey", current: true },
        { href: "#contact", label: "Contact", cta: true },
      ]}
      loaderLabel="Plotting the route"
      readout={(s, idx, last) =>
        `ELEV ${String(elevation(travelled(s.stage))).padStart(4, "0")}m · ${String(idx).padStart(2, "0")}/${last}`
      }
    >
      {children}
    </StackShell>
  );
}
