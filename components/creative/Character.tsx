"use client";

import { useRef, useEffect, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Car } from "./Car";

interface CharacterProps {
  startPosition: [number, number, number];
  positionRef: MutableRefObject<THREE.Vector3>;
  onThrow: () => void;
  yawRef: MutableRefObject<number>;
  movementDisabled?: boolean;
}

const MOVE_SPEED = 5;
const BOUNDS = { minX: -13, maxX: 13, minZ: -13, maxZ: 30 };

export function Character({ startPosition, positionRef, onThrow, yawRef, movementDisabled }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const keys = useRef(new Set<string>());
  const timerRef = useRef(0);
  const phase = useRef<"idle" | "windup" | "release">("idle");
  const phaseTime = useRef(0);
  const threw = useRef(false);
  const movingRef = useRef(false);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(k)) keys.current.add(k);
    };
    const onUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !rightArmRef.current) return;

    // --- WASD movement (camera-relative) ---
    let inputX = 0;
    let inputZ = 0;
    if (!movementDisabled) {
      if (keys.current.has("w")) inputZ += 1;
      if (keys.current.has("s")) inputZ -= 1;
      if (keys.current.has("a")) inputX -= 1;
      if (keys.current.has("d")) inputX += 1;
    }

    const isMoving = inputX !== 0 || inputZ !== 0;
    movingRef.current = isMoving;

    if (isMoving) {
      const yaw = yawRef.current;
      const forwardX = -Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);
      const rightDirX = Math.cos(yaw);
      const rightDirZ = -Math.sin(yaw);

      const dirX = forwardX * inputZ + rightDirX * inputX;
      const dirZ = forwardZ * inputZ + rightDirZ * inputX;

      const len = Math.sqrt(dirX * dirX + dirZ * dirZ);
      const speed = MOVE_SPEED * delta;

      positionRef.current.x = THREE.MathUtils.clamp(
        positionRef.current.x + (dirX / len) * speed, BOUNDS.minX, BOUNDS.maxX
      );
      positionRef.current.z = THREE.MathUtils.clamp(
        positionRef.current.z + (dirZ / len) * speed, BOUNDS.minZ, BOUNDS.maxZ
      );
    }

    groupRef.current.position.x = positionRef.current.x;
    groupRef.current.position.z = positionRef.current.z;

    // Gentle bobbing
    const t = Date.now() * 0.002;
    groupRef.current.position.y = positionRef.current.y + Math.sin(t) * 0.04;

    // Car rotates to match camera yaw
    groupRef.current.rotation.y = yawRef.current;

    // --- Leg animation (seated bounce) ---
    if (isMoving && leftLegRef.current && rightLegRef.current) {
      const walkCycle = Date.now() * 0.008;
      leftLegRef.current.rotation.x = Math.sin(walkCycle) * 0.25;
      rightLegRef.current.rotation.x = Math.sin(walkCycle + Math.PI) * 0.25;
    } else if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
    }

    // --- Throw cycle ---
    timerRef.current += delta;

    if (phase.current === "idle") {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x, 0, 0.08
      );
      if (timerRef.current > 3) {
        phase.current = "windup";
        phaseTime.current = 0;
        threw.current = false;
      }
    }

    if (phase.current === "windup") {
      phaseTime.current += delta;
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x, -Math.PI * 0.7, 0.12
      );
      if (phaseTime.current > 0.45) {
        phase.current = "release";
        phaseTime.current = 0;
      }
    }

    if (phase.current === "release") {
      phaseTime.current += delta;
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x, Math.PI * 0.4, 0.25
      );
      if (!threw.current && phaseTime.current > 0.12) {
        onThrow();
        threw.current = true;
      }
      if (phaseTime.current > 0.5) {
        phase.current = "idle";
        timerRef.current = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={startPosition}>
      {/* ===== CAR (visible below camera) ===== */}
      <Car isMoving={movingRef.current} />

      {/* ===== ROBOT (hidden in FPS mode) ===== */}
      <group position={[0, 0.85, 0.15]} visible={false}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.25, 0.4, 8, 16]} />
          <meshStandardMaterial
            color="#0a2a4e"
            emissive="#00d9ff"
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#0a2a4e"
            emissive="#00d9ff"
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.7, 0.25]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.1, 0.7, 0.25]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
        </mesh>

        {/* Smile */}
        <mesh position={[0, 0.55, 0.27]}>
          <boxGeometry args={[0.12, 0.02, 0.01]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
        </mesh>

        {/* Left arm */}
        <group position={[-0.35, 0.1, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial
              color="#1a0a3e"
              emissive="#ff00ff"
              emissiveIntensity={0.25}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
        </group>

        {/* Right arm (throwing arm) */}
        <group ref={rightArmRef} position={[0.35, 0.1, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial
              color="#1a0a3e"
              emissive="#ff00ff"
              emissiveIntensity={0.25}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Legs */}
        <mesh ref={leftLegRef} position={[-0.12, -0.55, 0.15]}>
          <capsuleGeometry args={[0.07, 0.25, 4, 8]} />
          <meshStandardMaterial
            color="#1a0a3e"
            emissive="#ff00ff"
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <mesh ref={rightLegRef} position={[0.12, -0.55, 0.15]}>
          <capsuleGeometry args={[0.07, 0.25, 4, 8]} />
          <meshStandardMaterial
            color="#1a0a3e"
            emissive="#ff00ff"
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
          <meshStandardMaterial color="#00d9ff" emissive="#00d9ff" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}
