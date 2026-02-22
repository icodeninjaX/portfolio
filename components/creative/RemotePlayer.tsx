"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import type { RemotePlayer as RemotePlayerType } from "@/lib/multiplayerTypes";
import { KnifeModel, WaterGunModel } from "./FPSHands";

const SHIRT_COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
const HAIR_COLORS = ["#1a1a1a", "#3d2b1f", "#8b6a4f", "#c9b99a", "#b44a2a"];
const SKIN_TONES = ["#d4a57b", "#c6956e", "#e8c4a0", "#f5d0b0", "#8d5e3c"];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

interface RemotePlayerProps {
  player: RemotePlayerType;
  isHit: boolean;
  remotePlayerPositionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
}

export function RemotePlayerMesh({ player, isHit, remotePlayerPositionsRef }: RemotePlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const flinchTimeRef = useRef(1);
  const wasHit = useRef(false);

  const hash = hashCode(player.id);
  const shirtColor = SHIRT_COLORS[hash % SHIRT_COLORS.length];
  const hairColor = HAIR_COLORS[(hash >> 3) % HAIR_COLORS.length];
  const skinTone = SKIN_TONES[(hash >> 6) % SKIN_TONES.length];
  const pantsColor = "#374151";
  const nameTagWidth = player.name.length * 0.085 + 0.16;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { currentState, prevState, receivedAt, prevReceivedAt } = player;
    const now = performance.now();
    const interval = receivedAt - prevReceivedAt;
    const elapsed = now - receivedAt;
    const t = interval > 0 ? Math.min(elapsed / interval, 2) : 1;

    // Interpolate position
    let targetX = currentState.x;
    let targetY = currentState.y;
    let targetZ = currentState.z;
    let targetYaw = currentState.yaw;

    if (prevState) {
      targetX = prevState.x + (currentState.x - prevState.x) * t;
      targetY = prevState.y + (currentState.y - prevState.y) * t;
      targetZ = prevState.z + (currentState.z - prevState.z) * t;

      // Interpolate yaw (handle wrapping)
      let yawDiff = currentState.yaw - prevState.yaw;
      if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
      if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
      targetYaw = prevState.yaw + yawDiff * t;
    }

    groupRef.current.position.set(targetX, targetY, targetZ);
    groupRef.current.rotation.y = targetYaw;

    // Update position ref for hit detection
    remotePlayerPositionsRef.current.set(
      player.id,
      new THREE.Vector3(targetX, targetY, targetZ)
    );

    // Walking animation based on velocity
    const isMoving = prevState && (
      Math.abs(currentState.x - prevState.x) > 0.01 ||
      Math.abs(currentState.z - prevState.z) > 0.01
    );

    if (isMoving) {
      const cycle = now * 0.006;
      const swing = Math.sin(cycle) * 0.4;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.6;
    } else {
      const sway = Math.sin(now * 0.002) * 0.03;
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, sway, 0.05);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -sway, 0.05);
    }

    // Hit flinch
    if (isHit && !wasHit.current) {
      flinchTimeRef.current = 0;
      wasHit.current = true;
    }
    if (!isHit) wasHit.current = false;

    if (flinchTimeRef.current < 1) {
      flinchTimeRef.current += delta * 2;
      const flinch = Math.sin(flinchTimeRef.current * Math.PI);
      groupRef.current.position.y += flinch * 0.08;
      groupRef.current.rotation.x = flinch * 0.15;
      groupRef.current.rotation.z = Math.sin(flinchTimeRef.current * Math.PI * 3) * flinch * 0.1;
    }

    // Attack animation on arm
    if (currentState.attacking) {
      if (currentState.weapon === "fists" || currentState.weapon === "knife") {
        if (rightArmRef.current) rightArmRef.current.rotation.x = -1.2;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Name tag */}
      <Billboard>
        <group position={[0, 2.12, 0]}>
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[nameTagWidth, 0.24]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.88} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.13, -0.004]}>
            <planeGeometry args={[nameTagWidth, 0.03]} />
            <meshBasicMaterial color={shirtColor} side={THREE.DoubleSide} />
          </mesh>
          <Text fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#000000">
            {player.name}
          </Text>
        </group>
      </Billboard>

      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color={skinTone} roughness={0.8} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.065, 1.68, 0.155]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[-0.065, 1.68, 0.185]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#3b2f1a" roughness={0.4} />
      </mesh>
      <mesh position={[-0.065, 1.68, 0.195]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
      </mesh>
      <mesh position={[0.065, 1.68, 0.155]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0.065, 1.68, 0.185]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#3b2f1a" roughness={0.4} />
      </mesh>
      <mesh position={[0.065, 1.68, 0.195]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.63, 0.17]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={skinTone} roughness={0.8} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.585, 0.16]}>
        <boxGeometry args={[0.06, 0.015, 0.02]} />
        <meshStandardMaterial color="#b5746a" roughness={0.6} />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.065, 1.72, 0.16]}>
        <boxGeometry args={[0.05, 0.012, 0.015]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.065, 1.72, 0.16]}>
        <boxGeometry args={[0.05, 0.012, 0.015]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.78, -0.04]}>
        <sphereGeometry args={[0.19, 10, 8]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.38, 0.5, 0.22]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.44, 0.08]}>
        <boxGeometry args={[0.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.25, 1.35, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.055, 0.28, 6, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color={skinTone} roughness={0.8} />
        </mesh>
      </group>

      {/* Right arm + weapon */}
      <group ref={rightArmRef} position={[0.25, 1.35, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.055, 0.28, 6, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color={skinTone} roughness={0.8} />
        </mesh>
        {/* Third-person weapon */}
        {player.currentState.weapon === "knife" && (
          <group position={[0, -0.45, 0.05]} scale={0.7}>
            <KnifeModel />
          </group>
        )}
        {player.currentState.weapon === "watergun" && (
          <group position={[0, -0.4, -0.1]} scale={0.6}>
            <WaterGunModel />
          </group>
        )}
      </group>

      {/* Belt */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.36, 0.08, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.1, 0.88, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.065, 0.35, 6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.1, 0.06, 0.18]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.1, 0.88, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.065, 0.35, 6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.1, 0.06, 0.18]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
