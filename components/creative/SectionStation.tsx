"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { DeskLabel } from "./NeonSign";

const WALL_H = 3;
const WALL_THICK = 0.1;
const ROOM_W = 5;   // width (x)
const ROOM_D = 4;   // depth (z)
const DOOR_W = 1.8;
const PARTITION_COLOR = "#e8e4dc";
const TRIM_COLOR = "#c4bfb5";

interface SectionStationProps {
  position: [number, number, number];
  label: string;
  color: string;
  wobbling?: boolean;
}

/* ── Room partition shell (3 walls + front wall with doorway) ── */
function RoomPartitions({ color }: { color: string }) {
  const halfW = ROOM_W / 2;
  const halfD = ROOM_D / 2;
  const sideW = (ROOM_W - DOOR_W) / 2;

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, WALL_H / 2, -halfD]}>
        <boxGeometry args={[ROOM_W, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfW, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_THICK, WALL_H, ROOM_D]} />
        <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfW, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_THICK, WALL_H, ROOM_D]} />
        <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
      </mesh>

      {/* Front wall — left section */}
      <mesh position={[-(DOOR_W / 2 + sideW / 2), WALL_H / 2, halfD]}>
        <boxGeometry args={[sideW, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
      </mesh>

      {/* Front wall — right section */}
      <mesh position={[(DOOR_W / 2 + sideW / 2), WALL_H / 2, halfD]}>
        <boxGeometry args={[sideW, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
      </mesh>

      {/* Front wall — header above door */}
      <mesh position={[0, WALL_H - 0.3, halfD]}>
        <boxGeometry args={[DOOR_W + 0.1, 0.6, WALL_THICK]} />
        <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
      </mesh>

      {/* Baseboard trim on all interior walls */}
      {/* Back */}
      <mesh position={[0, 0.06, -halfD + WALL_THICK / 2 + 0.01]}>
        <boxGeometry args={[ROOM_W - WALL_THICK, 0.12, 0.03]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>
      {/* Left */}
      <mesh position={[-halfW + WALL_THICK / 2 + 0.01, 0.06, 0]}>
        <boxGeometry args={[0.03, 0.12, ROOM_D - WALL_THICK]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>
      {/* Right */}
      <mesh position={[halfW - WALL_THICK / 2 - 0.01, 0.06, 0]}>
        <boxGeometry args={[0.03, 0.12, ROOM_D - WALL_THICK]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>

      {/* Room floor (slightly different shade from main) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[ROOM_W - WALL_THICK, ROOM_D - WALL_THICK]} />
        <meshStandardMaterial color="#d6cfc2" roughness={0.75} />
      </mesh>

      {/* Colored accent strip above door */}
      <mesh position={[0, WALL_H - 0.02, halfD + 0.01]}>
        <boxGeometry args={[ROOM_W, 0.06, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Office chair ── */
function OfficeChair() {
  return (
    <group position={[0, 0, 0.7]}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.45, 0.06, 0.45]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.6} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.72, -0.2]}>
        <boxGeometry args={[0.42, 0.5, 0.06]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.6} />
      </mesh>
      {/* Center pole */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Base star (5 legs) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.22, 0.06, Math.cos(angle) * 0.22]}
            rotation={[0, -angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.22, 6]} />
            <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
          </mesh>
        );
      })}
      {/* Casters */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={`c${i}`} position={[Math.sin(angle) * 0.3, 0.025, Math.cos(angle) * 0.3]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

export function SectionStation({ position, label, color, wobbling }: SectionStationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wobbleStart = useRef(0);
  const wasWobbling = useRef(false);

  useFrame(() => {
    if (!groupRef.current) return;

    if (wobbling) {
      if (!wasWobbling.current) {
        wobbleStart.current = Date.now();
        wasWobbling.current = true;
      }
      const elapsed = (Date.now() - wobbleStart.current) / 1000;
      const decay = Math.exp(-elapsed * 5);
      const wobbleAngle = Math.sin(elapsed * 20) * 0.08 * decay;
      groupRef.current.rotation.z = wobbleAngle;
    } else {
      wasWobbling.current = false;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Room shell (partitions) */}
      <RoomPartitions color={color} />

      {/* Desk + PC setup (wobbles on ball hit) */}
      <group ref={groupRef}>
        {/* === DESK === */}
        <mesh position={[0, 0.72, -0.3]}>
          <boxGeometry args={[2.4, 0.08, 1.2]} />
          <meshStandardMaterial color="#b08860" roughness={0.7} metalness={0.05} />
        </mesh>

        {/* Desk legs */}
        {[
          [-1.05, 0.36, -0.8],
          [1.05, 0.36, -0.8],
          [-1.05, 0.36, 0.2],
          [1.05, 0.36, 0.2],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.06, 0.72, 0.06]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.5} metalness={0.4} />
          </mesh>
        ))}

        {/* === MONITOR === */}
        <RoundedBox args={[1.6, 1.0, 0.06]} radius={0.03} smoothness={4} position={[0, 1.5, -0.5]}>
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.4}
            emissive={color}
            emissiveIntensity={0.12}
          />
        </RoundedBox>

        {/* Monitor bezel */}
        <RoundedBox args={[1.68, 1.08, 0.04]} radius={0.03} smoothness={4} position={[0, 1.5, -0.52]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
        </RoundedBox>

        {/* Screen content label */}
        <Text
          position={[0, 1.5, -0.46]}
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>

        {/* Monitor stand neck */}
        <mesh position={[0, 1.0, -0.5]}>
          <cylinderGeometry args={[0.04, 0.04, 0.24, 8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Monitor stand base */}
        <mesh position={[0, 0.8, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* === KEYBOARD === */}
        <mesh position={[0, 0.78, -0.05]}>
          <boxGeometry args={[0.9, 0.03, 0.35]} />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* === MOUSE === */}
        <mesh position={[0.65, 0.78, -0.05]}>
          <boxGeometry args={[0.15, 0.04, 0.22]} />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* === DESK NAMEPLATE === */}
        <DeskLabel text={label} color={color} position={[-0.8, 0.92, 0.2]} />
      </group>

      {/* Office chair */}
      <OfficeChair />

      {/* Overhead room light */}
      <pointLight color="#fff8f0" intensity={0.5} distance={6} position={[0, 2.8, 0]} />
    </group>
  );
}
