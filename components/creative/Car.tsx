"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CarProps {
  isMoving: boolean;
  isSprinting?: boolean;
  isCrouching?: boolean;
  isSliding?: boolean;
  isAirborne?: boolean;
  steerAngle?: number;
  hornTrigger?: number; // timestamp or counter
  speedRatio?: number;
}

export function Car({
  isMoving,
  isSprinting = false,
  isCrouching = false,
  isSliding = false,
  isAirborne = false,
  steerAngle = 0,
  hornTrigger = 0,
  speedRatio = 0,
}: CarProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const steerFL = useRef<THREE.Group>(null);
  const steerFR = useRef<THREE.Group>(null);
  const wheelFL = useRef<THREE.Mesh>(null);
  const wheelFR = useRef<THREE.Mesh>(null);
  const wheelBL = useRef<THREE.Mesh>(null);
  const wheelBR = useRef<THREE.Mesh>(null);

  // Thruster flames
  const flameLeftRef = useRef<THREE.Mesh>(null);
  const flameRightRef = useRef<THREE.Mesh>(null);

  // Horn shockwave ring
  const hornRingRef = useRef<THREE.Mesh>(null);
  const hornTimeRef = useRef(999);
  const lastHornTriggerRef = useRef(hornTrigger);

  useFrame((_, delta) => {
    // 1. Wheel rolling rotation
    const mult = (isSprinting ? 16 : isSliding ? 18 : 8) * (speedRatio > 0.05 ? speedRatio : isMoving ? 1 : 0);
    const wheels = [wheelFL, wheelFR, wheelBL, wheelBR];
    for (const w of wheels) {
      if (w.current && isMoving) {
        w.current.rotation.x += mult * delta;
      }
    }

    // 2. Front wheel steering angle (smooth lerp)
    if (steerFL.current && steerFR.current) {
      const targetSteer = THREE.MathUtils.clamp(steerAngle, -0.45, 0.45);
      steerFL.current.rotation.y = THREE.MathUtils.lerp(steerFL.current.rotation.y, targetSteer, 0.2);
      steerFR.current.rotation.y = THREE.MathUtils.lerp(steerFR.current.rotation.y, targetSteer, 0.2);
    }

    // 3. Thruster / booster flames animation
    const boosting = isSprinting || isSliding;
    if (flameLeftRef.current && flameRightRef.current) {
      if (boosting) {
        const flicker = 0.85 + Math.sin(Date.now() * 0.04) * 0.25;
        const targetScaleZ = isSliding ? 1.6 * flicker : 1.3 * flicker;
        flameLeftRef.current.scale.set(flicker, flicker, targetScaleZ);
        flameRightRef.current.scale.set(flicker, flicker, targetScaleZ);
        flameLeftRef.current.visible = true;
        flameRightRef.current.visible = true;
      } else {
        flameLeftRef.current.visible = false;
        flameRightRef.current.visible = false;
      }
    }

    // 4. Suspension pitch and vertical offset
    if (rootGroupRef.current) {
      const targetY = isCrouching ? -0.06 : 0;
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, targetY, 0.15);

      // Pitch tilt: tilts forward slightly on crouch/slide or airborne
      let targetPitch = 0;
      if (isAirborne) {
        targetPitch = -0.08;
      } else if (isSliding) {
        targetPitch = 0.04;
      } else if (isSprinting) {
        targetPitch = -0.02; // slight nose lift
      }
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetPitch, 0.15);
    }

    // 5. Horn shockwave ring expansion
    if (hornTrigger !== lastHornTriggerRef.current) {
      lastHornTriggerRef.current = hornTrigger;
      hornTimeRef.current = 0;
    }

    if (hornRingRef.current) {
      if (hornTimeRef.current < 0.6) {
        hornTimeRef.current += delta;
        const p = hornTimeRef.current / 0.6;
        const scale = 1 + p * 6;
        hornRingRef.current.scale.set(scale, scale, scale);
        const mat = hornRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, (1 - p) * 0.85);
        hornRingRef.current.visible = true;
      } else {
        hornRingRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
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

      {/* Exhaust Pipes (Left & Right) */}
      <mesh position={[-0.45, 0.08, 1.53]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.18, 12]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.45, 0.08, 1.53]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.18, 12]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Booster Exhaust Flame Cones */}
      <mesh ref={flameLeftRef} position={[-0.45, 0.08, 1.85]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <coneGeometry args={[0.12, 0.55, 12]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.85} />
      </mesh>
      <mesh ref={flameRightRef} position={[0.45, 0.08, 1.85]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <coneGeometry args={[0.12, 0.55, 12]} />
        <meshBasicMaterial color="#ff00aa" transparent opacity={0.85} />
      </mesh>

      {/* ===== STEERABLE FRONT WHEELS ===== */}
      {/* Front Left Wheel Assembly */}
      <group ref={steerFL} position={[-0.85, -0.08, -0.9]}>
        <mesh ref={wheelFL} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
        </mesh>
        <mesh position={[-0.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.08, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Front Right Wheel Assembly */}
      <group ref={steerFR} position={[0.85, -0.08, -0.9]}>
        <mesh ref={wheelFR} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.08, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* ===== REAR FIXED WHEELS ===== */}
      {/* Back Left Wheel */}
      <group position={[-0.85, -0.08, 0.9]}>
        <mesh ref={wheelBL} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
        </mesh>
        <mesh position={[-0.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.08, 8]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Back Right Wheel */}
      <group position={[0.85, -0.08, 0.9]}>
        <mesh ref={wheelBR} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.08, 8]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* ===== HORN SHOCKWAVE PULSE RING ===== */}
      <mesh ref={hornRingRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[1.6, 1.8, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
