"use client";

import { Text } from "@react-three/drei";

const XMETA_ORANGE = "#FF6B00";

export function XMetaBanner() {
  return (
    <group position={[-8.5, 2.5, 14.75]} rotation={[0, Math.PI, 0]}>
      {/* Dark frame */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[3.6, 2.4, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
      </mesh>

      {/* Dark background */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3.3, 2.1]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>

      {/* Orange diagonal accent strip */}
      <mesh position={[-0.8, -0.6, 0.02]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[4.0, 0.15, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Neon border — top */}
      <mesh position={[0, 1.0, 0.02]}>
        <boxGeometry args={[3.3, 0.03, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -1.0, 0.02]}>
        <boxGeometry args={[3.3, 0.03, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Left */}
      <mesh position={[-1.64, 0, 0.02]}>
        <boxGeometry args={[0.03, 2.0, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Right */}
      <mesh position={[1.64, 0, 0.02]}>
        <boxGeometry args={[0.03, 2.0, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* X-META logo text */}
      <Text
        position={[0, 0.35, 0.03]}
        fontSize={0.45}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        X-META
      </Text>

      {/* Powerbank icon — simplified rectangle */}
      <mesh position={[0, -0.15, 0.03]}>
        <boxGeometry args={[0.8, 0.35, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Orange strip on powerbank icon */}
      <mesh position={[0, -0.15, 0.05]}>
        <boxGeometry args={[0.5, 0.04, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Tagline */}
      <Text
        position={[0, -0.6, 0.03]}
        fontSize={0.12}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        Portable Power. Unlimited Potential.
      </Text>

      {/* Bottom detail text */}
      <Text
        position={[0, -0.82, 0.03]}
        fontSize={0.08}
        color={XMETA_ORANGE}
        anchorX="center"
        anchorY="middle"
      >
        www.x-meta.com
      </Text>
    </group>
  );
}
