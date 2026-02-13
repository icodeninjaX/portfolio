"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SectionStation } from "./SectionStation";

export interface StationConfig {
  key: string;
  label: string;
  position: [number, number, number];
  color: string;
}

export const STATIONS: StationConfig[] = [
  { key: "summary", label: "Summary", position: [0, 0, 0], color: "#2563eb" },
  { key: "projects", label: "Projects", position: [-8, 0, 8], color: "#d946ef" },
  { key: "experience", label: "Experience", position: [8, 0, 8], color: "#16a34a" },
  { key: "skills", label: "Skills", position: [-8, 0, -8], color: "#ea580c" },
  { key: "education", label: "Education", position: [8, 0, -8], color: "#7c3aed" },
];

const PROXIMITY_THRESHOLD = 5;

interface SectionStationsProps {
  charPosRef: MutableRefObject<THREE.Vector3>;
  onProximityChange: (sectionKey: string | null) => void;
  wobblingStations: Set<string>;
}

export function SectionStations({
  charPosRef,
  onProximityChange,
  wobblingStations,
}: SectionStationsProps) {
  const lastActiveRef = useRef<string | null>(null);

  useFrame(() => {
    const charPos = charPosRef.current;
    let closest: string | null = null;
    let closestDist = Infinity;

    for (const station of STATIONS) {
      const dx = charPos.x - station.position[0];
      const dz = charPos.z - station.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < PROXIMITY_THRESHOLD && dist < closestDist) {
        closest = station.key;
        closestDist = dist;
      }
    }

    if (closest !== lastActiveRef.current) {
      lastActiveRef.current = closest;
      onProximityChange(closest);
    }
  });

  return (
    <>
      {STATIONS.map((station) => (
        <SectionStation
          key={station.key}
          position={station.position}
          label={station.label}
          color={station.color}
          wobbling={wobblingStations.has(station.key)}
        />
      ))}
    </>
  );
}
