"use client";

import { Text } from "@react-three/drei";

const STICKY_NOTES = [
  { color: "#fde047", x: -0.6, y: 0.15, rot: 0.08 },
  { color: "#86efac", x: -0.2, y: 0.2, rot: -0.05 },
  { color: "#f9a8d4", x: 0.25, y: 0.12, rot: 0.1 },
  { color: "#93c5fd", x: 0.65, y: 0.18, rot: -0.07 },
];

const MARKERS = [
  { color: "#3b82f6", x: -0.15 },
  { color: "#ef4444", x: 0 },
  { color: "#22c55e", x: 0.15 },
];

export function Whiteboard() {
  return (
    <group position={[-3.5, 2.5, -14.85]}>
      {/* Gray frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.6, 1.8, 0.06]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* White surface */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.4, 1.6]} />
        <meshStandardMaterial color="#fafafa" roughness={0.3} />
      </mesh>

      {/* Marker tray at bottom */}
      <mesh position={[0, -0.85, 0.12]}>
        <boxGeometry args={[1.2, 0.08, 0.12]} />
        <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Markers on tray */}
      {MARKERS.map(({ color, x }) => (
        <mesh key={color} position={[x, -0.82, 0.14]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}

      {/* Scribbled text */}
      <Text
        position={[-0.5, 0.45, 0.07]}
        fontSize={0.12}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        API → DB
      </Text>
      <Text
        position={[0.4, 0.45, 0.07]}
        fontSize={0.1}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        TODO: refactor
      </Text>
      <Text
        position={[0, -0.1, 0.07]}
        fontSize={0.14}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        Sprint #42
      </Text>

      {/* Sticky notes */}
      {STICKY_NOTES.map(({ color, x, y, rot }) => (
        <group key={color} position={[x, y, 0.07]} rotation={[0, 0, rot]}>
          <mesh>
            <planeGeometry args={[0.25, 0.25]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
