"use client";

import Link from "next/link";
import { SectionOverlay } from "./SectionOverlay";

const SECTION_COLORS: Record<string, string> = {
  summary: "#2563eb",
  projects: "#d946ef",
  experience: "#16a34a",
  skills: "#ea580c",
  education: "#7c3aed",
};

const SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
};

interface OfficeHUDProps {
  activeSection: string | null;
  pointerLocked: boolean;
  nearbyNPC?: string | null;
  talkingTo?: string | null;
}

export function OfficeHUD({ activeSection, pointerLocked, nearbyNPC, talkingTo }: OfficeHUDProps) {
  const color = activeSection ? SECTION_COLORS[activeSection] || "#2563eb" : null;

  return (
    <>
      {/* Back button - top left */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          color: "#374151",
          fontSize: 14,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textDecoration: "none",
          border: "1px solid #d1d5db",
          padding: "8px 16px",
          borderRadius: 8,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          zIndex: 20,
        }}
      >
        &larr; Back to Resume
      </Link>

      {/* Active section label - top center */}
      {activeSection && color && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color,
            fontSize: 14,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "8px 20px",
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid #d1d5db",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 20,
          }}
        >
          {SECTION_LABELS[activeSection]}
        </div>
      )}

      {/* Crosshair - screen center (hidden during conversation) */}
      {pointerLocked && !talkingTo && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
      )}

      {/* Nearby NPC prompt */}
      {nearbyNPC && !talkingTo && pointerLocked && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ffffff",
            fontSize: 14,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            padding: "8px 20px",
            borderRadius: 8,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            pointerEvents: "none",
            zIndex: 20,
            textAlign: "center",
          }}
        >
          Press E to talk to {nearbyNPC}
        </div>
      )}

      {/* Instructions - bottom center (hidden during conversation) */}
      {pointerLocked && !talkingTo && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#6b7280",
            fontSize: 12,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 20,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            padding: "6px 16px",
            borderRadius: 6,
          }}
        >
          WASD to move &bull; Mouse to look &bull; ESC to unlock
        </div>
      )}

      {/* Section overlay panel - right side */}
      <SectionOverlay activeSection={activeSection} />
    </>
  );
}
