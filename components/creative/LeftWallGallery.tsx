"use client";

import { Text } from "@react-three/drei";

const PLAQUES = [
  { label: "Full-Stack\nDeveloper", accent: "#a855f7", z: -6 },
  { label: "Cloud &\nDevOps", accent: "#3b82f6", z: 0 },
  { label: "Problem\nSolver", accent: "#22c55e", z: 6 },
];

export function LeftWallGallery() {
  return (
    <group>
      {PLAQUES.map(({ label, accent, z }) => (
        <group
          key={label}
          position={[-14.85, 2.8, z]}
          rotation={[0, Math.PI / 2, 0]}
        >
          {/* Dark wood frame */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[2.0, 1.4, 0.06]} />
            <meshStandardMaterial color="#3e2723" roughness={0.85} />
          </mesh>

          {/* Cream background */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.8, 1.2]} />
            <meshStandardMaterial color="#faf3e0" roughness={0.9} />
          </mesh>

          {/* Neon accent — top strip */}
          <mesh position={[0, 0.55, 0.02]}>
            <boxGeometry args={[1.8, 0.03, 0.01]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Bottom strip */}
          <mesh position={[0, -0.55, 0.02]}>
            <boxGeometry args={[1.8, 0.03, 0.01]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Left strip */}
          <mesh position={[-0.89, 0, 0.02]}>
            <boxGeometry args={[0.03, 1.1, 0.01]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Right strip */}
          <mesh position={[0.89, 0, 0.02]}>
            <boxGeometry args={[0.03, 1.1, 0.01]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Label text */}
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.22}
            color="#2a2a2a"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            textAlign="center"
          >
            {label}
          </Text>
        </group>
      ))}
    </group>
  );
}
