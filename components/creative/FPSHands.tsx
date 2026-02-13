"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FPSHandsProps {
  handOffsetRef: MutableRefObject<{ x: number; y: number }>;
  visible: boolean;
}

const SWAY_AMOUNT = 0.04;
const LEFT_BASE: [number, number, number] = [-0.35, -0.35, -0.6];
const RIGHT_BASE: [number, number, number] = [0.35, -0.35, -0.6];

function Hand({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? -1 : 1;

  return (
    <group>
      {/* Palm */}
      <mesh>
        <boxGeometry args={[0.08, 0.04, 0.1]} />
        <meshStandardMaterial color="#d4a57b" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Fingers */}
      {[-0.025, -0.008, 0.008, 0.025].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0, -0.08]}>
          <capsuleGeometry args={[0.008, 0.04, 4, 6]} />
          <meshStandardMaterial color="#d4a57b" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* Thumb */}
      <mesh
        position={[mirror * 0.05, 0, -0.02]}
        rotation={[0, 0, mirror * -0.6]}
      >
        <capsuleGeometry args={[0.009, 0.03, 4, 6]} />
        <meshStandardMaterial color="#d4a57b" roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function FPSHands({ handOffsetRef, visible }: FPSHandsProps) {
  const rootRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(visible ? 1 : 0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!rootRef.current || !leftRef.current || !rightRef.current) return;

    // Follow camera
    rootRef.current.position.copy(camera.position);
    rootRef.current.quaternion.copy(camera.quaternion);

    // Smooth scale for visibility
    const targetScale = visible ? 1 : 0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 1 - Math.pow(0.001, delta));
    const s = scaleRef.current;
    rootRef.current.scale.set(s, s, s);

    // Hand sway from mouse offset
    const ox = handOffsetRef.current.x * SWAY_AMOUNT;
    const oy = handOffsetRef.current.y * SWAY_AMOUNT;

    const lerpFactor = 1 - Math.pow(0.001, delta);

    leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, LEFT_BASE[0] + ox, lerpFactor);
    leftRef.current.position.y = THREE.MathUtils.lerp(leftRef.current.position.y, LEFT_BASE[1] + oy, lerpFactor);
    leftRef.current.position.z = LEFT_BASE[2];

    rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, RIGHT_BASE[0] + ox, lerpFactor);
    rightRef.current.position.y = THREE.MathUtils.lerp(rightRef.current.position.y, RIGHT_BASE[1] + oy, lerpFactor);
    rightRef.current.position.z = RIGHT_BASE[2];
  });

  return (
    <group ref={rootRef}>
      <group ref={leftRef} position={LEFT_BASE}>
        <Hand side="left" />
      </group>
      <group ref={rightRef} position={RIGHT_BASE}>
        <Hand side="right" />
      </group>
    </group>
  );
}
