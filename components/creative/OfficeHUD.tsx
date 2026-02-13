"use client";

import Link from "next/link";
import { SectionOverlay } from "./SectionOverlay";
import type { WeaponType } from "./FPSHands";

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

const WEAPONS: { key: WeaponType; label: string; icon: string; hotkey: string }[] = [
  { key: "fists", label: "Fists", icon: "\u270A", hotkey: "1" },
  { key: "knife", label: "Knife", icon: "\uD83D\uDD2A", hotkey: "2" },
  { key: "watergun", label: "Water Gun", icon: "\uD83D\uDD2B", hotkey: "3" },
];

interface OfficeHUDProps {
  activeSection: string | null;
  pointerLocked: boolean;
  nearbyNPC?: string | null;
  talkingTo?: string | null;
  weapon?: WeaponType;
  onWeaponChange?: (weapon: WeaponType) => void;
}

export function OfficeHUD({ activeSection, pointerLocked, nearbyNPC, talkingTo, weapon = "fists", onWeaponChange }: OfficeHUDProps) {
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
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          {/* Crosshair lines */}
          <div style={{ position: "absolute", top: -8, left: -1, width: 2, height: 6, background: "rgba(255,255,255,0.8)" }} />
          <div style={{ position: "absolute", bottom: -8, left: -1, width: 2, height: 6, background: "rgba(255,255,255,0.8)" }} />
          <div style={{ position: "absolute", left: -8, top: -1, width: 6, height: 2, background: "rgba(255,255,255,0.8)" }} />
          <div style={{ position: "absolute", right: -8, top: -1, width: 6, height: 2, background: "rgba(255,255,255,0.8)" }} />
          {/* Center dot */}
          <div style={{ position: "absolute", top: -2, left: -2, width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 2px rgba(0,0,0,0.5)" }} />
        </div>
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

      {/* Weapon selector - bottom center */}
      {pointerLocked && !talkingTo && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {WEAPONS.map((w) => {
            const isActive = weapon === w.key;
            return (
              <div
                key={w.key}
                onClick={() => onWeaponChange?.(w.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: isActive ? "rgba(255, 107, 0, 0.85)" : "rgba(0, 0, 0, 0.55)",
                  backdropFilter: "blur(8px)",
                  border: isActive ? "2px solid #ff8c33" : "1px solid rgba(255, 255, 255, 0.15)",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  minWidth: 64,
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? "0 0 12px rgba(255, 107, 0, 0.4)" : "none",
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{w.icon}</span>
                <span
                  style={{
                    color: isActive ? "#ffffff" : "#9ca3af",
                    fontSize: 10,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    marginTop: 4,
                  }}
                >
                  {w.label}
                </span>
                <span
                  style={{
                    color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    fontSize: 9,
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  [{w.hotkey}]
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions - top right (hidden during conversation) */}
      {pointerLocked && !talkingTo && (
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            color: "#6b7280",
            fontSize: 11,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "right",
            pointerEvents: "none",
            zIndex: 20,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px",
            borderRadius: 6,
            lineHeight: 1.6,
          }}
        >
          WASD move &bull; Mouse look &bull; Click attack<br />
          1/2/3 or Scroll to switch &bull; ESC unlock
        </div>
      )}

      {/* Section overlay panel - right side */}
      <SectionOverlay activeSection={activeSection} />
    </>
  );
}
