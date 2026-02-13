"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ThrownBallProps {
  startPos: [number, number, number];
  targetPos: [number, number, number];
  createdAt: number;
  color: string;
  onHit: () => void;
  onDone: () => void;
}

const FLIGHT_DURATION = 1.0;
const BOUNCE_DURATION = 1.5;
const ARC_HEIGHT = 3.5;

export function ThrownBall({ startPos, targetPos, createdAt, color, onHit, onDone }: ThrownBallProps) {
  const ref = useRef<THREE.Mesh>(null);
  const hit = useRef(false);
  const bouncing = useRef(false);
  const bounceOrigin = useRef(new THREE.Vector3());
  const bounceVel = useRef(new THREE.Vector3());
  const bounceT0 = useRef(0);

  useFrame(() => {
    if (!ref.current) return;
    const now = performance.now() / 1000;
    const elapsed = now - createdAt;

    if (!bouncing.current) {
      // Parabolic flight phase
      const t = Math.min(elapsed / FLIGHT_DURATION, 1);
      const x = THREE.MathUtils.lerp(startPos[0], targetPos[0], t);
      const z = THREE.MathUtils.lerp(startPos[2], targetPos[2], t);
      const baseY = THREE.MathUtils.lerp(startPos[1], targetPos[1], t);
      const y = baseY + ARC_HEIGHT * Math.sin(Math.PI * t);

      ref.current.position.set(x, y, z);
      ref.current.rotation.x += 0.15;
      ref.current.rotation.z += 0.08;

      if (t >= 1 && !hit.current) {
        hit.current = true;
        onHit();
        bouncing.current = true;
        bounceOrigin.current.set(x, y, z);
        bounceVel.current.set(
          (Math.random() - 0.5) * 3,
          2 + Math.random() * 2,
          (Math.random() - 0.5) * 3,
        );
        bounceT0.current = now;
      }
    } else {
      // Bounce + fade phase
      const bt = now - bounceT0.current;
      const gravity = 9.8;
      ref.current.position.set(
        bounceOrigin.current.x + bounceVel.current.x * bt,
        bounceOrigin.current.y + bounceVel.current.y * bt - 0.5 * gravity * bt * bt,
        bounceOrigin.current.z + bounceVel.current.z * bt,
      );
      ref.current.rotation.x += 0.2;
      ref.current.rotation.z += 0.12;

      const fade = 1 - Math.min(bt / BOUNCE_DURATION, 1);
      ref.current.scale.setScalar(fade);

      if (bt > BOUNCE_DURATION) {
        onDone();
      }
    }
  });

  return (
    <mesh ref={ref} position={startPos}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}
