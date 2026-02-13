"use client";

import { Text } from "@react-three/drei";

const WALL_H = 3;
const WALL_THICK = 0.1;

export const KITCHEN_POS: [number, number, number] = [13, 0, 0];

export function OfficeKitchen() {
  return (
    <group position={KITCHEN_POS}>
      {/* ── Room shell ── */}
      {/* Back wall */}
      <mesh position={[0, WALL_H / 2, -2.5]}>
        <boxGeometry args={[4, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Left wall (with doorway) */}
      <mesh position={[-2, WALL_H / 2, -0.75]}>
        <boxGeometry args={[WALL_THICK, WALL_H, 2.5]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      <mesh position={[-2, WALL_H / 2, 1.75]}>
        <boxGeometry args={[WALL_THICK, WALL_H, 1]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      <mesh position={[-2, WALL_H - 0.3, 0.7]}>
        <boxGeometry args={[WALL_THICK, 0.6, 1.6]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, WALL_H / 2, 2.5]}>
        <boxGeometry args={[4, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[3.8, 4.8]} />
        <meshStandardMaterial color="#d9d3c7" roughness={0.75} />
      </mesh>
      {/* Door label */}
      <Text
        position={[-2.06, 2.6, 0.7]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.2}
        color="#6b7280"
        anchorX="center"
      >
        Kitchen
      </Text>

      {/* ── Counter along back wall ── */}
      <mesh position={[0, 0.85, -2.1]}>
        <boxGeometry args={[3.6, 0.08, 0.7]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Counter base */}
      <mesh position={[0, 0.42, -2.1]}>
        <boxGeometry args={[3.6, 0.8, 0.65]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} />
      </mesh>

      {/* ── Fridge (tall box, right side) ── */}
      <mesh position={[1.5, 0.9, -2.0]}>
        <boxGeometry args={[0.7, 1.8, 0.65]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Fridge handle */}
      <mesh position={[1.2, 1.0, -1.65]}>
        <boxGeometry args={[0.04, 0.3, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* ── Coffee machine ── */}
      <mesh position={[-0.8, 0.95, -2.0]}>
        <boxGeometry args={[0.35, 0.4, 0.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} />
      </mesh>
      {/* Coffee pot */}
      <mesh position={[-0.8, 0.92, -1.75]}>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 8]} />
        <meshStandardMaterial color="#292524" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* ── Microwave ── */}
      <mesh position={[0.3, 0.95, -2.0]}>
        <boxGeometry args={[0.45, 0.3, 0.35]} />
        <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Microwave door */}
      <mesh position={[0.3, 0.95, -1.82]}>
        <planeGeometry args={[0.35, 0.22]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* ── Small table in center ── */}
      <mesh position={[0, 0.7, 0.5]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 16]} />
        <meshStandardMaterial color="#b08860" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.65, 8]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* ── Sink (on counter) ── */}
      <mesh position={[-0.2, 0.88, -2.1]}>
        <boxGeometry args={[0.4, 0.04, 0.3]} />
        <meshStandardMaterial color="#6b7280" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Overhead light */}
      <pointLight color="#fff8f0" intensity={0.5} distance={6} position={[0, 2.8, 0]} />
    </group>
  );
}
