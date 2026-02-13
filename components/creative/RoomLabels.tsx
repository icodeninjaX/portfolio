"use client";

import { Text } from "@react-three/drei";

const XMETA_ORANGE = "#FF6B00";

interface RoomLabelConfig {
  label: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

/* Labels mounted above each room doorway (exterior facing) */
const LABELS: RoomLabelConfig[] = [
  // Summary [0,0,0] — door faces z=+2
  {
    label: "SUMMARY",
    color: "#2563eb",
    position: [0, 3.25, 2.06],
    rotation: [0, 0, 0],
  },
  // Projects [-8,0,8] — door faces z=+10
  {
    label: "PROJECTS",
    color: "#d946ef",
    position: [-8, 3.25, 10.06],
    rotation: [0, 0, 0],
  },
  // Experience [8,0,8] — door faces z=+10
  {
    label: "EXPERIENCE",
    color: "#16a34a",
    position: [8, 3.25, 10.06],
    rotation: [0, 0, 0],
  },
  // Skills [-8,0,-8] — door faces z=-6
  {
    label: "SKILLS",
    color: "#ea580c",
    position: [-8, 3.25, -5.94],
    rotation: [0, 0, 0],
  },
  // Education [8,0,-8] — door faces z=-6
  {
    label: "EDUCATION",
    color: "#7c3aed",
    position: [8, 3.25, -5.94],
    rotation: [0, 0, 0],
  },
];

function RoomLabel({ label, color, position, rotation }: RoomLabelConfig) {
  return (
    <group position={position} rotation={rotation}>
      {/* Sign backplate */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[2.8, 0.5, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Colored top bar */}
      <mesh position={[0, 0.22, -0.005]}>
        <boxGeometry args={[2.6, 0.04, 0.01]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Colored bottom bar */}
      <mesh position={[0, -0.22, -0.005]}>
        <boxGeometry args={[2.6, 0.04, 0.01]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Room name */}
      <Text
        position={[0, 0.02, 0.01]}
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {label}
      </Text>

      {/* Small orange X-Meta tag */}
      <mesh position={[1.1, -0.12, 0.005]}>
        <boxGeometry args={[0.5, 0.16, 0.01]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <Text
        position={[1.1, -0.12, 0.015]}
        fontSize={0.07}
        color={XMETA_ORANGE}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        X-META
      </Text>
    </group>
  );
}

export function RoomLabels() {
  return (
    <group>
      {LABELS.map((cfg) => (
        <RoomLabel key={cfg.label} {...cfg} />
      ))}
    </group>
  );
}
