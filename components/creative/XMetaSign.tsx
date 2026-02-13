"use client";

import { Text } from "@react-three/drei";

const XMETA_ORANGE = "#FF6B00";

export function XMetaSign() {
  return (
    <group position={[0, 4.2, 14.75]} rotation={[0, Math.PI, 0]}>
      {/* Backplate */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[6, 1.2, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Neon border — top */}
      <mesh position={[0, 0.55, -0.01]}>
        <boxGeometry args={[5.8, 0.03, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.55, -0.01]}>
        <boxGeometry args={[5.8, 0.03, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Left */}
      <mesh position={[-2.89, 0, -0.01]}>
        <boxGeometry args={[0.03, 1.1, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Right */}
      <mesh position={[2.89, 0, -0.01]}>
        <boxGeometry args={[0.03, 1.1, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* "X-META" text */}
      <Text
        position={[0, 0.1, 0.01]}
        fontSize={0.55}
        color={XMETA_ORANGE}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        X-META
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -0.3, 0.01]}
        fontSize={0.14}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        POWER YOUR WORLD
      </Text>

      {/* Glow point light */}
      <pointLight
        position={[0, 0, 0.5]}
        color={XMETA_ORANGE}
        intensity={0.8}
        distance={4}
        decay={2}
      />
    </group>
  );
}
