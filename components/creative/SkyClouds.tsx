"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CLOUD_COUNT = 10;

interface CloudData {
  position: [number, number, number];
  speed: number;
  spheres: { offset: [number, number, number]; radius: number }[];
}

export function SkyClouds() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo<CloudData[]>(() => {
    const result: CloudData[] = [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const sphereCount = 3 + Math.floor(Math.random() * 3); // 3-5
      const spheres: CloudData["spheres"] = [];
      for (let s = 0; s < sphereCount; s++) {
        spheres.push({
          offset: [
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 1.5,
          ],
          radius: 1.2 + Math.random() * 1.5,
        });
      }
      result.push({
        position: [
          (Math.random() - 0.5) * 120,
          16 + Math.random() * 10,
          (Math.random() - 0.5) * 80,
        ],
        speed: 0.3 + Math.random() * 0.5,
        spheres,
      });
    }
    return result;
  }, []);

  // Store per-cloud x positions in a ref for mutation
  const xPositions = useRef<number[]>(clouds.map((c) => c.position[0]));

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      xPositions.current[i] += clouds[i].speed * delta;
      if (xPositions.current[i] > 60) {
        xPositions.current[i] = -60;
      }
      children[i].position.x = xPositions.current[i];
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, ci) => (
        <group
          key={ci}
          position={[cloud.position[0], cloud.position[1], cloud.position[2]]}
        >
          {cloud.spheres.map((sp, si) => (
            <mesh key={si} position={sp.offset}>
              <sphereGeometry args={[sp.radius, 12, 10]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.85}
                roughness={1}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
