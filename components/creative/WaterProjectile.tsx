"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WaterProjectileProps {
  startPos: [number, number, number];
  direction: [number, number, number];
  onDone: () => void;
  npcPositionsRef?: MutableRefObject<Map<string, THREE.Vector3>>;
  onHitNPC?: (name: string) => void;
}

const SPEED = 25;
const MAX_DIST = 30;
const HIT_RADIUS = 1.2;

export function WaterProjectile({ startPos, direction, onDone, npcPositionsRef, onHitNPC }: WaterProjectileProps) {
  const groupRef = useRef<THREE.Group>(null);
  const traveled = useRef(0);
  const hasHit = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const step = SPEED * delta;
    traveled.current += step;

    groupRef.current.position.x += direction[0] * step;
    groupRef.current.position.y += direction[1] * step - 0.5 * delta;
    groupRef.current.position.z += direction[2] * step;

    // Check NPC proximity for hit detection
    if (!hasHit.current && npcPositionsRef && onHitNPC) {
      const pos = groupRef.current.position;
      npcPositionsRef.current.forEach((npcPos, name) => {
        if (hasHit.current) return;
        const dx = pos.x - npcPos.x;
        const dy = pos.y - (npcPos.y + 1.2); // aim at body center
        const dz = pos.z - npcPos.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < HIT_RADIUS) {
          hasHit.current = true;
          onHitNPC(name);
        }
      });
    }

    if (traveled.current > MAX_DIST) {
      onDone();
    }
  });

  return (
    <group ref={groupRef} position={startPos}>
      {/* Main water blob */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#40a0ff"
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Trailing droplets */}
      <mesh position={[direction[0] * 0.1, direction[1] * 0.1, direction[2] * 0.1]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#60b0ff" transparent opacity={0.5} roughness={0.1} />
      </mesh>
      <mesh position={[direction[0] * 0.2, direction[1] * 0.2, direction[2] * 0.2]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#80c0ff" transparent opacity={0.35} roughness={0.1} />
      </mesh>
    </group>
  );
}
