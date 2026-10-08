"use client";

import { useMemo } from "react";
import { SceneSequence } from "./SceneSequence";
import { SCENE_MANIFEST } from "./sceneManifest";
import { StackShell } from "./StackShell";

export type StackStage = {
  /** Scene id in `sceneManifest.ts` (falls back to the previous scene when missing). */
  scene: string;
  /** Short label for the HUD altimeter. */
  label: string;
};

/** The film is one five-second clip per transition; show where the reader is as a 24 fps timecode. */
const FILM_SECONDS = SCENE_MANIFEST.frames.length * 5;
const FPS = 24;
function timecode(progress: number) {
  const total = Math.round(progress * FILM_SECONDS * FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(total / (60 * FPS)))}:${pad(Math.floor(total / FPS) % 60)}:${pad(total % FPS)}`;
}

export function StackExperience({ stages, children }: { stages: StackStage[]; children: React.ReactNode }) {
  const labels = useMemo(() => stages.map((s) => s.label), [stages]);
  const sceneIds = useMemo(() => stages.map((s) => s.scene), [stages]);

  return (
    <StackShell
      labels={labels}
      canvas={<SceneSequence sceneIds={sceneIds} />}
      webglOnly={false}
      className="stack-home--film"
      assets={false}
      home="#top"
      nav={[
        { href: "#work", label: "Work" },
        { href: "/about", label: "About" },
        { href: "/experience", label: "Journey" },
        { href: "/resume", label: "Simple mode", cta: true },
        { href: "#contact", label: "Contact", cta: true },
      ]}
      loaderLabel="Rolling film"
      readout={(s, idx, last) => `${timecode(s.progress)} · SC ${String(idx).padStart(2, "0")}/${last}`}
    >
      {children}
    </StackShell>
  );
}
