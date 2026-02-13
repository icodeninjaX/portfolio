"use client";

import { Text } from "@react-three/drei";

const POSTERS = [
  { label: "TypeScript", color: "#00d9ff", z: -6 },
  { label: "React", color: "#d946ef", z: 0 },
  { label: "Next.js", color: "#a855f7", z: 6 },
];

export function WallArt() {
  return (
    <group>
      {POSTERS.map(({ label, color, z }) => (
        <group
          key={label}
          position={[14.85, 2.5, z]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          {/* Dark frame */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[2.0, 1.4, 0.06]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
          </mesh>

          {/* Dark background */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.8, 1.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Neon border accent */}
          {/* Top */}
          <mesh position={[0, 0.55, 0.02]}>
            <boxGeometry args={[1.8, 0.03, 0.01]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Bottom */}
          <mesh position={[0, -0.55, 0.02]}>
            <boxGeometry args={[1.8, 0.03, 0.01]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Left */}
          <mesh position={[-0.89, 0, 0.02]}>
            <boxGeometry args={[0.03, 1.1, 0.01]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Right */}
          <mesh position={[0.89, 0, 0.02]}>
            <boxGeometry args={[0.03, 1.1, 0.01]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Label text */}
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.3}
            color={color}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {label}
          </Text>
        </group>
      ))}
    </group>
  );
}
