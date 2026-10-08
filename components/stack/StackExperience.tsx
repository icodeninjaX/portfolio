"use client";

import { useMemo } from "react";
import { SceneSequence } from "./SceneSequence";
import { StackShell } from "./StackShell";

export type StackStage = {
  /** Scene id in `sceneManifest.ts` (falls back to the previous scene when missing). */
  scene: string;
  /** Short label for the HUD altimeter. */
  label: string;
};

export function StackExperience({ stages, children }: { stages: StackStage[]; children: React.ReactNode }) {
  const labels = useMemo(() => stages.map((s) => s.label), [stages]);
  const sceneIds = useMemo(() => stages.map((s) => s.scene), [stages]);

  return (
    <StackShell
      labels={labels}
      canvas={<SceneSequence sceneIds={sceneIds} />}
      webglOnly={false}
      assets={false}
      home="#top"
      nav={[
        { href: "#work", label: "Work" },
        { href: "/about", label: "About" },
        { href: "/experience", label: "Journey" },
        { href: "/resume", label: "Simple mode", cta: true },
        { href: "#contact", label: "Contact", cta: true },
      ]}
      loaderLabel="Booting the stack"
      readout={(s, idx, last) =>
        `SCENE ${String(idx).padStart(2, "0")}/${last} · ${(s.progress * 100).toFixed(0).padStart(3, "0")}%`
      }
    >
      {children}
    </StackShell>
  );
}
