"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CarProps {
  isMoving: boolean;
}

export function Car({ isMoving }: CarProps) {
  const wheelFL = useRef<THREE.Mesh>(null);
  const wheelFR = useRef<THREE.Mesh>(null);
  const wheelBL = useRef<THREE.Mesh>(null);
  const wheelBR = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const wheels = [wheelFL, wheelFR, wheelBL, wheelBR];
    for (const w of wheels) {
      if (w.current && isMoving) {
        w.current.rotation.x += 8 * delta;
      }
    }
  });

  return (
    <group>
      {/* Main body — neon purple base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.6, 0.35, 3.0]} />
        <meshStandardMaterial
          color="#1a0a3e"
          emissive="#8b00ff"
          emissiveIntensity={0.25}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* Hood */}
      <mesh position={[0, 0.25, -1.1]}>
        <boxGeometry args={[1.4, 0.15, 0.7]} />
        <meshStandardMaterial
          color="#1a0a3e"
          emissive="#8b00ff"
          emissiveIntensity={0.2}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* Cabin windshield */}
      <mesh position={[0, 0.45, 0.15]}>
        <boxGeometry args={[1.3, 0.3, 1.2]} />
        <meshStandardMaterial
          color="#0a0a30"
          emissive="#00d9ff"
          emissiveIntensity={0.08}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>

      {/* Neon trim stripe — top */}
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[1.62, 0.02, 3.02]} />
        <meshStandardMaterial color="#00d9ff" emissive="#00d9ff" emissiveIntensity={1.2} />
      </mesh>
      {/* Neon trim stripe — bottom */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[1.62, 0.02, 3.02]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} />
      </mesh>

      {/* Neon side strips — left */}
      <mesh position={[-0.81, 0.15, 0]}>
        <boxGeometry args={[0.02, 0.12, 2.8]} />
        <meshStandardMaterial color="#00d9ff" emissive="#00d9ff" emissiveIntensity={0.9} />
      </mesh>
      {/* Neon side strips — right */}
      <mesh position={[0.81, 0.15, 0]}>
        <boxGeometry args={[0.02, 0.12, 2.8]} />
        <meshStandardMaterial color="#00d9ff" emissive="#00d9ff" emissiveIntensity={0.9} />
      </mesh>

      {/* Headlights — bright neon cyan */}
      <mesh position={[-0.55, 0.15, -1.52]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.55, 0.15, -1.52]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>

      {/* Tail lights — hot neon pink */}
      <mesh position={[-0.55, 0.15, 1.52]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.55, 0.15, 1.52]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>

      {/* Wheels */}
      <mesh ref={wheelFL} position={[-0.85, -0.08, -0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh ref={wheelFR} position={[0.85, -0.08, -0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh ref={wheelBL} position={[-0.85, -0.08, 0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh ref={wheelBR} position={[0.85, -0.08, 0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Neon hub caps */}
      <mesh position={[-0.93, -0.08, -0.9]}>
        <circleGeometry args={[0.08, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.93, -0.08, -0.9]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.08, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.93, -0.08, 0.9]}>
        <circleGeometry args={[0.08, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.93, -0.08, 0.9]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.08, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}
