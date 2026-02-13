"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RubberDuck() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <group position={[0.9, 0.78, -0.4]} ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#fde047" roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.12, 0.04]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fde047" roughness={0.6} />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 0.1, 0.12]}>
        <boxGeometry args={[0.06, 0.03, 0.06]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.03, 0.14, 0.1]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#111" roughness={0.3} />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.03, 0.14, 0.1]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#111" roughness={0.3} />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0.04, -0.12]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.04]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>

      {/* Neon cyan sunglasses */}
      {/* Left lens */}
      <mesh position={[-0.035, 0.14, 0.11]}>
        <boxGeometry args={[0.035, 0.02, 0.01]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Right lens */}
      <mesh position={[0.035, 0.14, 0.11]}>
        <boxGeometry args={[0.035, 0.02, 0.01]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Bridge */}
      <mesh position={[0, 0.14, 0.11]}>
        <boxGeometry args={[0.015, 0.01, 0.01]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
