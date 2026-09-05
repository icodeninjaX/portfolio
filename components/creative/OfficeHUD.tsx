"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionOverlay } from "./SectionOverlay";
import type { WeaponType } from "./FPSHands";
import type { MovementState, VirtualControls } from "./Character";

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

const STATIONS: { key: string; label: string; hotkey: string; color: string }[] = [
  { key: "summary", label: "Summary", hotkey: "4", color: "#2563eb" },
  { key: "projects", label: "Projects", hotkey: "5", color: "#d946ef" },
  { key: "experience", label: "Experience", hotkey: "6", color: "#16a34a" },
  { key: "skills", label: "Skills", hotkey: "7", color: "#ea580c" },
  { key: "education", label: "Education", hotkey: "8", color: "#7c3aed" },
  { key: "kitchen", label: "Kitchen", hotkey: "9", color: "#06b6d4" },
  { key: "parking", label: "Parking", hotkey: "0", color: "#f59e0b" },
];

interface OfficeHUDProps {
  activeSection: string | null;
  pointerLocked: boolean;
  nearbyNPC?: string | null;
  talkingTo?: string | null;
  weapon?: WeaponType;
  onWeaponChange?: (weapon: WeaponType) => void;
  movementState?: MovementState;
  onTeleportStation?: (key: string) => void;
  onVirtualControlChange?: (ctrls: VirtualControls) => void;
  cameraMode?: "fps" | "tps";
  onToggleCameraMode?: () => void;
}

export function OfficeHUD({
  activeSection,
  pointerLocked,
  nearbyNPC,
  talkingTo,
  weapon = "fists",
  onWeaponChange,
  movementState,
  onTeleportStation,
  onVirtualControlChange,
  cameraMode = "fps",
  onToggleCameraMode,
}: OfficeHUDProps) {
  const [showTouchControls, setShowTouchControls] = useState(false);
  const color = activeSection ? SECTION_COLORS[activeSection] || "#2563eb" : null;

  // Derive movement status string & badge styling
  const isVehicle = movementState?.inVehicle ?? false;
  let movementBadge = isVehicle ? "PARKED" : "IDLE (MOCAP)";
  let badgeBg = "rgba(107, 114, 128, 0.4)";
  let badgeColor = "#d1d5db";
  let badgeBorder = "#4b5563";

  if (movementState?.isAirborne) {
    movementBadge = isVehicle ? "AIRBORNE" : "JUMPING";
    badgeBg = "rgba(168, 85, 247, 0.35)";
    badgeColor = "#c084fc";
    badgeBorder = "#a855f7";
  } else if (movementState?.isSliding) {
    movementBadge = isVehicle ? "DRIFT SLIDE" : "TACTICAL SLIDE";
    badgeBg = "rgba(236, 72, 153, 0.4)";
    badgeColor = "#f472b6";
    badgeBorder = "#ec4899";
  } else if (movementState?.isSprinting) {
    movementBadge = isVehicle ? "TURBO BOOST" : "SPRINTING";
    badgeBg = "rgba(6, 182, 212, 0.35)";
    badgeColor = "#22d3ee";
    badgeBorder = "#06b6d4";
  } else if (movementState?.isCrouching) {
    movementBadge = isVehicle ? "LOW SUSPENSION" : "CROUCHING";
    badgeBg = "rgba(245, 158, 11, 0.35)";
    badgeColor = "#fbbf24";
    badgeBorder = "#f59e0b";
  } else if ((movementState?.speed ?? 0) > 0.4) {
    movementBadge = isVehicle ? "CRUISING" : "WALKING";
    badgeBg = "rgba(16, 185, 129, 0.35)";
    badgeColor = "#34d399";
    badgeBorder = "#10b981";
  }

  const speedKmh = Math.round((movementState?.speed ?? 0) * 3.6);

  // Virtual control button helpers
  const handleVirtualButton = (partial: Partial<VirtualControls>) => {
    onVirtualControlChange?.({
      forward: 0,
      strafe: 0,
      ...partial,
    });
  };

  return (
    <>
      {/* Back button - top left */}
      <div style={{ position: "absolute", top: 24, left: 24, display: "flex", gap: 10, zIndex: 20 }}>
        <Link
          href="/"
          style={{
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
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          &larr; Back to Resume
        </Link>

        {/* Toggle on-screen controls */}
        <button
          onClick={() => setShowTouchControls((prev) => !prev)}
          title="Toggle On-Screen Virtual Controls"
          style={{
            color: showTouchControls ? "#2563eb" : "#4b5563",
            fontSize: 13,
            fontFamily: "system-ui, -apple-system, sans-serif",
            border: showTouchControls ? "1px solid #2563eb" : "1px solid #d1d5db",
            padding: "8px 14px",
            borderRadius: 8,
            background: showTouchControls ? "rgba(37, 99, 235, 0.1)" : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
          }}
        >
          &#x1F3AE; {showTouchControls ? "Touch Controls: ON" : "Touch Controls"}
        </button>

        {/* Toggle 1st / 3rd Person Camera */}
        {onToggleCameraMode && (
          <button
            onClick={onToggleCameraMode}
            title="Toggle 1st Person / 3rd Person View (HotKey: V)"
            style={{
              color: cameraMode === "tps" ? "#7c3aed" : "#4b5563",
              fontSize: 13,
              fontFamily: "system-ui, -apple-system, sans-serif",
              border: cameraMode === "tps" ? "1px solid #7c3aed" : "1px solid #d1d5db",
              padding: "8px 14px",
              borderRadius: 8,
              background: cameraMode === "tps" ? "rgba(124, 58, 237, 0.12)" : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            &#x1F4F7; {cameraMode === "tps" ? "3rd Person [V]" : "1st Person [V]"}
          </button>
        )}
      </div>

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

      {/* Fast Travel Bar - top center-right or right below section */}
      {!talkingTo && (
        <div
          style={{
            position: "absolute",
            top: activeSection ? 72 : 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 20,
            background: "rgba(17, 24, 39, 0.75)",
            backdropFilter: "blur(10px)",
            padding: "6px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              color: "#9ca3af",
              fontSize: 11,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 600,
              letterSpacing: 0.5,
              marginRight: 4,
              textTransform: "uppercase",
            }}
          >
            Fast Travel:
          </span>
          {STATIONS.map((st) => {
            const isActive = activeSection === st.key;
            return (
              <button
                key={st.key}
                onClick={() => onTeleportStation?.(st.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: isActive ? `1px solid ${st.color}` : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isActive ? `${st.color}33` : "rgba(255, 255, 255, 0.05)",
                  color: isActive ? "#ffffff" : "#d1d5db",
                  fontSize: 11,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{st.label}</span>
                <span
                  style={{
                    fontSize: 9,
                    color: isActive ? st.color : "#9ca3af",
                    fontFamily: "monospace",
                    background: "rgba(0,0,0,0.3)",
                    padding: "1px 4px",
                    borderRadius: 3,
                  }}
                >
                  [{st.hotkey}]
                </span>
              </button>
            );
          })}
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

      {/* Movement Telemetry & Speedometer - bottom left */}
      {!talkingTo && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            background: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(10px)",
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 140,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 700,
                color: movementState?.isSprinting ? "#00ffff" : "#f3f4f6",
                textShadow: movementState?.isSprinting ? "0 0 8px rgba(0,255,255,0.6)" : "none",
              }}
            >
              {speedKmh}{" "}
              <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af" }}>KM/H</span>
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: 9,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 700,
                letterSpacing: 0.5,
                background: badgeBg,
                color: badgeColor,
                border: `1px solid ${badgeBorder}`,
              }}
            >
              {movementBadge}
            </span>
          </div>

          {/* Speed / Boost bar */}
          <div
            style={{
              width: "100%",
              height: 4,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.round((movementState?.speedRatio ?? 0) * 100))}%`,
                height: "100%",
                background: movementState?.isSprinting
                  ? "linear-gradient(90deg, #06b6d4, #3b82f6)"
                  : movementState?.isSliding
                  ? "linear-gradient(90deg, #ec4899, #f43f5e)"
                  : "linear-gradient(90deg, #10b981, #06b6d4)",
                transition: "width 0.1s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Nearby NPC prompt */}
      {nearbyNPC && !talkingTo && (
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
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            pointerEvents: "none",
            zIndex: 20,
            textAlign: "center",
          }}
        >
          Press <strong style={{ color: "#00ffff" }}>E</strong> to talk to {nearbyNPC}
        </div>
      )}

      {/* On-Screen Touch / Virtual Controls */}
      {showTouchControls && !talkingTo && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 24,
            zIndex: 35,
            display: "flex",
            gap: 20,
            alignItems: "flex-end",
          }}
        >
          {/* Virtual D-Pad */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 44px)",
              gridTemplateRows: "repeat(3, 44px)",
              gap: 4,
              background: "rgba(0,0,0,0.5)",
              padding: 6,
              borderRadius: 12,
              backdropFilter: "blur(8px)",
            }}
          >
            <div />
            <button
              onMouseDown={() => handleVirtualButton({ forward: 1 })}
              onMouseUp={() => handleVirtualButton({ forward: 0 })}
              onTouchStart={() => handleVirtualButton({ forward: 1 })}
              onTouchEnd={() => handleVirtualButton({ forward: 0 })}
              style={{
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &uarr;
            </button>
            <div />
            <button
              onMouseDown={() => handleVirtualButton({ strafe: -1 })}
              onMouseUp={() => handleVirtualButton({ strafe: 0 })}
              onTouchStart={() => handleVirtualButton({ strafe: -1 })}
              onTouchEnd={() => handleVirtualButton({ strafe: 0 })}
              style={{
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &larr;
            </button>
            <button
              onMouseDown={() => handleVirtualButton({ forward: -1 })}
              onMouseUp={() => handleVirtualButton({ forward: 0 })}
              onTouchStart={() => handleVirtualButton({ forward: -1 })}
              onTouchEnd={() => handleVirtualButton({ forward: 0 })}
              style={{
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &darr;
            </button>
            <button
              onMouseDown={() => handleVirtualButton({ strafe: 1 })}
              onMouseUp={() => handleVirtualButton({ strafe: 0 })}
              onTouchStart={() => handleVirtualButton({ strafe: 1 })}
              onTouchEnd={() => handleVirtualButton({ strafe: 0 })}
              style={{
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &rarr;
            </button>
          </div>

          {/* Virtual Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onMouseDown={() => handleVirtualButton({ sprint: true })}
              onMouseUp={() => handleVirtualButton({ sprint: false })}
              onTouchStart={() => handleVirtualButton({ sprint: true })}
              onTouchEnd={() => handleVirtualButton({ sprint: false })}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "rgba(6, 182, 212, 0.35)",
                color: "#22d3ee",
                border: "1px solid #06b6d4",
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              BOOST
            </button>
            <button
              onClick={() => {
                handleVirtualButton({ jump: true });
                setTimeout(() => handleVirtualButton({ jump: false }), 200);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "rgba(168, 85, 247, 0.35)",
                color: "#c084fc",
                border: "1px solid #a855f7",
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              JUMP
            </button>
            <button
              onMouseDown={() => handleVirtualButton({ crouch: true })}
              onMouseUp={() => handleVirtualButton({ crouch: false })}
              onTouchStart={() => handleVirtualButton({ crouch: true })}
              onTouchEnd={() => handleVirtualButton({ crouch: false })}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "rgba(245, 158, 11, 0.35)",
                color: "#fbbf24",
                border: "1px solid #f59e0b",
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              CROUCH
            </button>
          </div>
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
            color: "#374151",
            fontSize: 11,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "right",
            pointerEvents: "none",
            zIndex: 20,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            padding: "8px 14px",
            borderRadius: 8,
            lineHeight: 1.6,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <strong>WASD / Arrows</strong>: Move &bull; <strong>Shift</strong>: Sprint
          </div>
          <div>
            <strong>Space</strong>: Jump &bull; <strong>C / Ctrl</strong>: Crouch / Slide
          </div>
          <div>
            <strong>V</strong>: 1st/3rd Person View &bull; <strong>F</strong>: Enter/Exit Vehicle
          </div>
          <div>
            <strong>H</strong>: Horn &bull; <strong>4-0</strong>: Stations &bull; <strong>ESC</strong>: Unlock
          </div>
        </div>
      )}

      {/* Section overlay panel - right side */}
      <SectionOverlay activeSection={activeSection} />
    </>
  );
}
