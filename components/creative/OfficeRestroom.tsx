"use client";

import { Text } from "@react-three/drei";

const WALL_H = 3;
const WALL_THICK = 0.1;

export const RESTROOM_POS: [number, number, number] = [-13, 0, 0];

export function OfficeRestroom() {
  return (
    <group position={RESTROOM_POS}>
      {/* ── Room shell ── */}
      {/* Back wall */}
      <mesh position={[0, WALL_H / 2, -2.5]}>
        <boxGeometry args={[4, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Right wall (with doorway) */}
      <mesh position={[2, WALL_H / 2, -0.75]}>
        <boxGeometry args={[WALL_THICK, WALL_H, 2.5]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      <mesh position={[2, WALL_H / 2, 1.75]}>
        <boxGeometry args={[WALL_THICK, WALL_H, 1]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      <mesh position={[2, WALL_H - 0.3, 0.7]}>
        <boxGeometry args={[WALL_THICK, 0.6, 1.6]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, WALL_H / 2, 2.5]}>
        <boxGeometry args={[4, WALL_H, WALL_THICK]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Room floor (tile look) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[3.8, 4.8]} />
        <meshStandardMaterial color="#cdd5db" roughness={0.6} />
      </mesh>
      {/* Door label */}
      <Text
        position={[2.06, 2.6, 0.7]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.2}
        color="#6b7280"
        anchorX="center"
      >
        Restroom
      </Text>

      {/* ── Two stalls ── */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i} position={[x, 0, -1.5]}>
          {/* Stall walls */}
          <mesh position={[-0.55, 1.0, 0]}>
            <boxGeometry args={[0.06, 2.0, 1.2]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.6} />
          </mesh>
          <mesh position={[0.55, 1.0, 0]}>
            <boxGeometry args={[0.06, 2.0, 1.2]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.6} />
          </mesh>
          {/* Stall door */}
          <mesh position={[0, 1.0, 0.57]}>
            <boxGeometry args={[0.9, 1.8, 0.05]} />
            <meshStandardMaterial color="#c4bfb5" roughness={0.7} />
          </mesh>
          {/* Toilet */}
          <mesh position={[0, 0.35, -0.2]}>
            <boxGeometry args={[0.35, 0.35, 0.45]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, -0.35]}>
            <boxGeometry args={[0.3, 0.3, 0.1]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── Sinks along front wall ── */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={i} position={[x, 0, 1.8]}>
          {/* Sink basin */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[0.5, 0.06, 0.35]} />
            <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Pedestal */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.4} />
          </mesh>
          {/* Faucet */}
          <mesh position={[0, 0.92, -0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Mirror above */}
          <mesh position={[0, 1.5, 0.18]}>
            <planeGeometry args={[0.45, 0.6]} />
            <meshStandardMaterial color="#b0c4de" roughness={0.05} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Overhead light */}
      <pointLight color="#f0f4ff" intensity={0.5} distance={6} position={[0, 2.8, 0]} />
    </group>
  );
}
