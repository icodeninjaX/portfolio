"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const DUST_COUNT = 80;

export function OfficeAmbience() {
  const pointsRef = useRef<THREE.Points>(null);
  const { scene } = useThree();

  // Light outdoor fog for depth
  useMemo(() => {
    scene.fog = new THREE.Fog("#87ceeb", 30, 70);
  }, [scene]);

  // Floating dust motes in sunbeams
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const vel = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 26;
      pos[i3 + 1] = 0.5 + Math.random() * 4;
      pos[i3 + 2] = (Math.random() - 0.5) * 26;
      vel[i3] = (Math.random() - 0.5) * 0.05;
      vel[i3 + 1] = 0.02 + Math.random() * 0.06;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < DUST_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] * delta;
      posArray[i3 + 1] += velocities[i3 + 1] * delta;
      posArray[i3 + 2] += velocities[i3 + 2] * delta;

      if (posArray[i3 + 1] > 4.8) {
        posArray[i3] = (Math.random() - 0.5) * 26;
        posArray[i3 + 1] = 0.3;
        posArray[i3 + 2] = (Math.random() - 0.5) * 26;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={DUST_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffeebb"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
