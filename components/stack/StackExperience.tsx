"use client";

import dynamic from "next/dynamic";
import type { PanelProject } from "./InterfaceLayer";
import { StackShell } from "./StackShell";
import { CAMERA_KEYS } from "./stages";

const StackCanvas = dynamic(() => import("./StackCanvas"), { ssr: false });

const LABELS = CAMERA_KEYS.map((k) => k.label);

export function StackExperience({
  projects,
  children,
}: {
  projects: PanelProject[];
  children: React.ReactNode;
}) {
  return (
    <StackShell
      labels={LABELS}
      canvas={<StackCanvas projects={projects} />}
      video={{ src: "/stack/hero-silicon.mp4", poster: "/stack/hero-poster.webp" }}
      home="#top"
      nav={[
        { href: "#work", label: "Work", keep: true },
        { href: "/about", label: "About" },
        { href: "/experience", label: "Journey" },
        { href: "#contact", label: "Contact", cta: true },
      ]}
      loaderLabel="Booting the stack"
      readout={(s, idx, last) =>
        `ALT ${(s.progress * 38).toFixed(1).padStart(4, "0")}m · ${String(idx).padStart(2, "0")}/${last}`
      }
    >
      {children}
    </StackShell>
  );
}
