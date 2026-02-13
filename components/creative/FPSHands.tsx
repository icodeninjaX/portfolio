"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type WeaponType = "fists" | "knife" | "watergun";

interface FPSHandsProps {
  handOffsetRef: MutableRefObject<{ x: number; y: number }>;
  visible: boolean;
  weapon: WeaponType;
  attacking: boolean;
}

const SWAY_AMOUNT = 0.04;
const LEFT_BASE: [number, number, number] = [-0.35, -0.35, -0.6];
const RIGHT_BASE: [number, number, number] = [0.35, -0.35, -0.6];

const SKIN = "#d4a57b";
const SKIN_DARK = "#c49468";

/* ── Open hand (off-hand for knife) ── */
function Hand({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? -1 : 1;
  return (
    <group>
      {/* Forearm */}
      <mesh position={[0, 0, 0.12]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.055, 0.035, 0.04]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Palm */}
      <mesh>
        <boxGeometry args={[0.08, 0.04, 0.1]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Fingers */}
      {[-0.025, -0.008, 0.008, 0.025].map((xOff, i) => (
        <group key={i}>
          <mesh position={[xOff, 0, -0.065]}>
            <capsuleGeometry args={[0.008, 0.03, 4, 6]} />
            <meshStandardMaterial color={SKIN} roughness={0.8} />
          </mesh>
          <mesh position={[xOff, 0, -0.1]}>
            <capsuleGeometry args={[0.007, 0.02, 4, 6]} />
            <meshStandardMaterial color={SKIN} roughness={0.8} />
          </mesh>
          {/* Fingernail */}
          <mesh position={[xOff, 0.006, -0.115]}>
            <boxGeometry args={[0.01, 0.003, 0.01]} />
            <meshStandardMaterial color="#e8c8b0" roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* Thumb */}
      <mesh position={[mirror * 0.05, 0, -0.02]} rotation={[0, 0, mirror * -0.6]}>
        <capsuleGeometry args={[0.009, 0.03, 4, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Knuckle bumps */}
      {[-0.025, -0.008, 0.008, 0.025].map((xOff, i) => (
        <mesh key={`k${i}`} position={[xOff, 0.02, -0.045]}>
          <sphereGeometry args={[0.007, 6, 6]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Fist (closed hand with forearm) ── */
function Fist({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? -1 : 1;
  return (
    <group>
      {/* Forearm */}
      <mesh position={[0, 0, 0.12]}>
        <capsuleGeometry args={[0.028, 0.1, 6, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[0.06, 0.04, 0.04]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Closed palm */}
      <mesh>
        <boxGeometry args={[0.08, 0.065, 0.08]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Curled fingers — top row */}
      <mesh position={[0, 0.01, -0.055]}>
        <boxGeometry args={[0.078, 0.04, 0.025]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Curled fingers — knuckle row */}
      <mesh position={[0, 0.025, -0.04]}>
        <boxGeometry args={[0.078, 0.02, 0.04]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.85} />
      </mesh>
      {/* Finger tips tucked in */}
      <mesh position={[0, -0.005, -0.05]}>
        <boxGeometry args={[0.07, 0.025, 0.015]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Thumb wrapped over */}
      <mesh position={[mirror * 0.045, -0.005, -0.03]} rotation={[0.2, mirror * -0.3, mirror * -0.3]}>
        <capsuleGeometry args={[0.012, 0.035, 4, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Knuckle highlights */}
      {[-0.025, -0.008, 0.008, 0.025].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0.035, -0.04]}>
          <sphereGeometry args={[0.009, 6, 6]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Knife ── */
function KnifeModel() {
  return (
    <group rotation={[-0.3, 0, 0]}>
      {/* Pommel (end cap) */}
      <mesh position={[0, -0.07, 0.02]}>
        <cylinderGeometry args={[0.018, 0.016, 0.02, 8]} />
        <meshStandardMaterial color="#666666" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Handle core */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.028, 0.12, 0.024]} />
        <meshStandardMaterial color="#1a0f05" roughness={0.85} />
      </mesh>
      {/* Handle grip wrapping */}
      {[-0.04, -0.02, 0, 0.02, 0.04].map((y, i) => (
        <mesh key={i} position={[0, y, 0.02]}>
          <boxGeometry args={[0.033, 0.012, 0.028]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#2a1a0e" : "#1a0f05"} roughness={0.9} />
        </mesh>
      ))}
      {/* Guard / crossguard */}
      <mesh position={[0, 0.068, 0.02]}>
        <boxGeometry args={[0.07, 0.012, 0.028]} />
        <meshStandardMaterial color="#777777" roughness={0.25} metalness={0.8} />
      </mesh>
      {/* Guard end caps */}
      {[-0.038, 0.038].map((x) => (
        <mesh key={x} position={[x, 0.068, 0.02]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial color="#888888" roughness={0.25} metalness={0.8} />
        </mesh>
      ))}
      {/* Blade — main body */}
      <mesh position={[0, 0.18, 0.02]}>
        <boxGeometry args={[0.028, 0.22, 0.005]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.12} metalness={0.95} />
      </mesh>
      {/* Fuller (blood groove) */}
      <mesh position={[0, 0.17, 0.024]}>
        <boxGeometry args={[0.008, 0.15, 0.002]} />
        <meshStandardMaterial color="#999999" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Blade sharp edge */}
      <mesh position={[-0.016, 0.18, 0.02]}>
        <boxGeometry args={[0.003, 0.21, 0.004]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={1} />
      </mesh>
      {/* Blade spine (thicker back edge) */}
      <mesh position={[0.016, 0.18, 0.02]}>
        <boxGeometry args={[0.004, 0.21, 0.006]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Blade tip — angled to a point */}
      <mesh position={[-0.005, 0.3, 0.02]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.02, 0.02, 0.005]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.95} />
      </mesh>
      {/* Ricasso (unsharpened section near guard) */}
      <mesh position={[0, 0.085, 0.02]}>
        <boxGeometry args={[0.03, 0.02, 0.006]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.2} metalness={0.85} />
      </mesh>
    </group>
  );
}

/* ── Water Gun ── */
function WaterGunModel() {
  return (
    <group rotation={[-0.15, 0, 0]}>
      {/* Receiver / main body */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[0.065, 0.085, 0.22]} />
        <meshStandardMaterial color="#ff6b00" roughness={0.35} />
      </mesh>
      {/* Body side panels (textured) */}
      {[-0.034, 0.034].map((x) => (
        <mesh key={x} position={[x, 0, -0.06]}>
          <boxGeometry args={[0.003, 0.07, 0.18]} />
          <meshStandardMaterial color="#e05500" roughness={0.5} />
        </mesh>
      ))}
      {/* Top rail */}
      <mesh position={[0, 0.046, -0.06]}>
        <boxGeometry args={[0.03, 0.008, 0.18]} />
        <meshStandardMaterial color="#cc5500" roughness={0.4} />
      </mesh>
      {/* Rear sight */}
      <mesh position={[0, 0.055, 0.03]}>
        <boxGeometry args={[0.025, 0.015, 0.01]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Front sight */}
      <mesh position={[0, 0.055, -0.14]}>
        <boxGeometry args={[0.008, 0.015, 0.008]} />
        <meshStandardMaterial color="#ff3300" roughness={0.4} />
      </mesh>
      {/* Grip / handle */}
      <mesh position={[0, -0.065, 0.01]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.055, 0.1, 0.045]} />
        <meshStandardMaterial color="#ff8c33" roughness={0.5} />
      </mesh>
      {/* Grip texture lines */}
      {[-0.03, -0.01, 0.01, 0.03].map((y) => (
        <mesh key={y} position={[0, -0.065 + y, 0.035]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.058, 0.005, 0.002]} />
          <meshStandardMaterial color="#cc7020" roughness={0.7} />
        </mesh>
      ))}
      {/* Trigger guard */}
      <mesh position={[0, -0.025, -0.015]}>
        <boxGeometry args={[0.028, 0.04, 0.065]} />
        <meshStandardMaterial color="#cc5500" roughness={0.5} />
      </mesh>
      {/* Trigger */}
      <mesh position={[0, -0.03, -0.02]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.012, 0.028, 0.008]} />
        <meshStandardMaterial color="#222222" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.015, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.026, 0.14, 10]} />
        <meshStandardMaterial color="#ff6b00" roughness={0.35} />
      </mesh>
      {/* Barrel inner bore */}
      <mesh position={[0, 0.015, -0.275]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.01, 8]} />
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </mesh>
      {/* Barrel tip / nozzle */}
      <mesh position={[0, 0.015, -0.275]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.022, 0.04, 10]} />
        <meshStandardMaterial color="#ffaa00" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Nozzle ring */}
      <mesh position={[0, 0.015, -0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.018, 0.003, 8, 16]} />
        <meshStandardMaterial color="#ffcc00" roughness={0.25} metalness={0.4} />
      </mesh>
      {/* Water tank */}
      <mesh position={[0, 0.075, -0.07]}>
        <boxGeometry args={[0.055, 0.06, 0.13]} />
        <meshStandardMaterial color="#3090e0" transparent opacity={0.65} roughness={0.15} />
      </mesh>
      {/* Tank frame */}
      {[-0.029, 0.029].map((x) => (
        <mesh key={x} position={[x, 0.075, -0.07]}>
          <boxGeometry args={[0.003, 0.065, 0.135]} />
          <meshStandardMaterial color="#ff8c33" roughness={0.4} />
        </mesh>
      ))}
      {/* Water level inside tank */}
      <mesh position={[0, 0.065, -0.07]}>
        <boxGeometry args={[0.048, 0.04, 0.12]} />
        <meshStandardMaterial color="#50b0ff" transparent opacity={0.5} roughness={0.1} />
      </mesh>
      {/* Tank cap */}
      <mesh position={[0, 0.11, -0.07]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.012, 10]} />
        <meshStandardMaterial color="#dddddd" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Pump slide */}
      <mesh position={[0, 0.05, 0.04]}>
        <boxGeometry args={[0.045, 0.035, 0.07]} />
        <meshStandardMaterial color="#ff8c33" roughness={0.5} />
      </mesh>
      {/* Pump grip ridges */}
      {[-0.02, 0, 0.02].map((z) => (
        <mesh key={z} position={[0, 0.05, 0.04 + z]}>
          <boxGeometry args={[0.05, 0.005, 0.015]} />
          <meshStandardMaterial color="#e07020" roughness={0.6} />
        </mesh>
      ))}
      {/* Pressure gauge */}
      <mesh position={[0.035, 0.02, 0.01]}>
        <cylinderGeometry args={[0.012, 0.012, 0.006, 10]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.3} />
      </mesh>
      <mesh position={[0.035, 0.02, 0.014]}>
        <cylinderGeometry args={[0.009, 0.009, 0.003, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Gauge needle */}
      <mesh position={[0.035, 0.024, 0.016]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.001, 0.008, 0.001]} />
        <meshStandardMaterial color="#ff0000" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Grip hand (wrapping a weapon) ── */
function GripHand({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? -1 : 1;
  return (
    <group>
      {/* Forearm */}
      <mesh position={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.025, 0.08, 6, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.055, 0.035, 0.03]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Palm wrapping around */}
      <mesh>
        <boxGeometry args={[0.07, 0.05, 0.07]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Fingers curled around */}
      <mesh position={[0, -0.015, -0.045]}>
        <boxGeometry args={[0.065, 0.04, 0.025]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Finger tips */}
      <mesh position={[0, -0.01, -0.06]}>
        <boxGeometry args={[0.06, 0.03, 0.015]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.8} />
      </mesh>
      {/* Thumb */}
      <mesh position={[mirror * 0.04, 0, -0.01]} rotation={[0, 0, mirror * -0.4]}>
        <capsuleGeometry args={[0.01, 0.03, 4, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Knuckle bumps */}
      {[-0.02, 0, 0.02].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0.025, -0.03]}>
          <sphereGeometry args={[0.007, 6, 6]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export function FPSHands({ handOffsetRef, visible, weapon, attacking }: FPSHandsProps) {
  const rootRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(visible ? 1 : 0);
  const attackTimeRef = useRef(1);
  const wasAttacking = useRef(false);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!rootRef.current || !leftRef.current || !rightRef.current) return;

    rootRef.current.position.copy(camera.position);
    rootRef.current.quaternion.copy(camera.quaternion);

    const targetScale = visible ? 1 : 0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 1 - Math.pow(0.001, delta));
    const s = scaleRef.current;
    rootRef.current.scale.set(s, s, s);

    // Attack animation timer
    if (attacking && !wasAttacking.current) {
      attackTimeRef.current = 0;
    }
    wasAttacking.current = attacking;
    if (attackTimeRef.current < 1) {
      attackTimeRef.current += delta * 3;
    }

    const lerpFactor = 1 - Math.pow(0.001, delta);
    const ox = handOffsetRef.current.x * SWAY_AMOUNT;
    const oy = handOffsetRef.current.y * SWAY_AMOUNT;

    let attackOx = 0, attackOy = 0, attackOz = 0, attackRotX = 0, attackRotZ = 0;

    if (attackTimeRef.current < 1) {
      const t = attackTimeRef.current;
      if (weapon === "fists") {
        const punch = Math.sin(t * Math.PI);
        attackOz = -punch * 0.25;
        attackOy = punch * 0.05;
      } else if (weapon === "knife") {
        const slash = Math.sin(t * Math.PI);
        attackOx = -slash * 0.15;
        attackOy = slash * 0.1;
        attackOz = -slash * 0.15;
        attackRotZ = -slash * 0.8;
      } else if (weapon === "watergun") {
        const recoil = Math.sin(t * Math.PI) * Math.exp(-t * 3);
        attackOz = recoil * 0.08;
        attackRotX = recoil * 0.15;
      }
    }

    if (weapon === "fists") {
      leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, LEFT_BASE[0] + ox, lerpFactor);
      leftRef.current.position.y = THREE.MathUtils.lerp(leftRef.current.position.y, LEFT_BASE[1] + 0.05 + oy, lerpFactor);
      leftRef.current.position.z = LEFT_BASE[2];
      rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, RIGHT_BASE[0] + ox + attackOx, lerpFactor);
      rightRef.current.position.y = THREE.MathUtils.lerp(rightRef.current.position.y, RIGHT_BASE[1] + 0.05 + oy + attackOy, lerpFactor);
      rightRef.current.position.z = RIGHT_BASE[2] + attackOz;
      leftRef.current.rotation.set(0, 0, 0);
      rightRef.current.rotation.set(0, 0, attackRotZ);
    } else if (weapon === "knife") {
      leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, LEFT_BASE[0] + ox - 0.05, lerpFactor);
      leftRef.current.position.y = THREE.MathUtils.lerp(leftRef.current.position.y, LEFT_BASE[1] - 0.1 + oy, lerpFactor);
      leftRef.current.position.z = LEFT_BASE[2];
      rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, 0.25 + ox + attackOx, lerpFactor);
      rightRef.current.position.y = THREE.MathUtils.lerp(rightRef.current.position.y, -0.25 + oy + attackOy, lerpFactor);
      rightRef.current.position.z = -0.5 + attackOz;
      leftRef.current.rotation.set(0, 0, 0);
      rightRef.current.rotation.set(0, 0, attackRotZ);
    } else {
      const gunX = 0.2, gunY = -0.3, gunZ = -0.55;
      rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, gunX + ox + attackOx, lerpFactor);
      rightRef.current.position.y = THREE.MathUtils.lerp(rightRef.current.position.y, gunY + oy + attackOy, lerpFactor);
      rightRef.current.position.z = gunZ + attackOz;
      rightRef.current.rotation.set(attackRotX, 0, 0);
      leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, gunX - 0.04 + ox + attackOx, lerpFactor);
      leftRef.current.position.y = THREE.MathUtils.lerp(leftRef.current.position.y, gunY + 0.02 + oy + attackOy, lerpFactor);
      leftRef.current.position.z = gunZ - 0.1 + attackOz;
      leftRef.current.rotation.set(attackRotX, 0, 0);
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={leftRef} position={LEFT_BASE}>
        {weapon === "fists" && <Fist side="left" />}
        {weapon === "knife" && <Hand side="left" />}
        {weapon === "watergun" && <GripHand side="left" />}
      </group>
      <group ref={rightRef} position={RIGHT_BASE}>
        {weapon === "fists" && <Fist side="right" />}
        {weapon === "knife" && (
          <group>
            <GripHand side="right" />
            <KnifeModel />
          </group>
        )}
        {weapon === "watergun" && (
          <group>
            <GripHand side="right" />
            <WaterGunModel />
          </group>
        )}
      </group>
    </group>
  );
}
