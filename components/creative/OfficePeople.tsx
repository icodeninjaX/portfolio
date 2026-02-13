"use client";

import { useRef, useMemo, MutableRefObject, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

/* ── Named characters with fixed appearances ── */
interface CharacterDef {
  name: string;
  shirtColor: string;
  pantsColor: string;
  skinTone: string;
  hairColor: string;
  shoeColor: string;
  hasTie: boolean;
  tieColor: string;
  female: boolean;
  eyeColor: string;
  lipColor: string;
  deskCenter: [number, number, number]; // their assigned office room center
}

const CHARACTERS: CharacterDef[] = [
  {
    name: "Carl",
    shirtColor: "#3b82f6",  // blue dress shirt
    pantsColor: "#1e293b",  // navy slacks
    skinTone: "#d4a57b",
    hairColor: "#1a1a1a",
    shoeColor: "#1a1a1a",
    hasTie: true,
    tieColor: "#b91c1c",   // red tie
    female: false,
    eyeColor: "#3b2f1a",
    lipColor: "#b5746a",
    deskCenter: [0, 0, 0],  // Summary room
  },
  {
    name: "Charo",
    shirtColor: "#a3c9a8",  // sage green blouse
    pantsColor: "#374151",  // charcoal
    skinTone: "#c6956e",
    hairColor: "#3d2b1f",
    shoeColor: "#3d2b1f",
    hasTie: false,
    tieColor: "",
    female: true,
    eyeColor: "#2d1a0e",
    lipColor: "#c4605a",
    deskCenter: [-8, 0, 8], // Projects room
  },
  {
    name: "Chella",
    shirtColor: "#f5f5f5",  // white blouse
    pantsColor: "#292524",  // dark brown
    skinTone: "#e8c4a0",
    hairColor: "#8b6a4f",
    shoeColor: "#2a2a2a",
    hasTie: false,
    tieColor: "",
    female: true,
    eyeColor: "#4a3728",
    lipColor: "#d4757a",
    deskCenter: [8, 0, 8],  // Experience room
  },
  {
    name: "Natalie",
    shirtColor: "#d4a0a0",  // blush pink blouse
    pantsColor: "#1e3a5f",  // navy
    skinTone: "#f5d0b0",
    hairColor: "#c9b99a",   // blonde
    shoeColor: "#1a1a1a",
    hasTie: false,
    tieColor: "",
    female: true,
    eyeColor: "#4682b4",   // blue eyes
    lipColor: "#cc6666",
    deskCenter: [-8, 0, -8], // Skills room
  },
  {
    name: "Keith",
    shirtColor: "#6366f1",  // indigo shirt
    pantsColor: "#3f3f46",  // dark grey
    skinTone: "#8d5e3c",
    hairColor: "#1a1a1a",
    shoeColor: "#1a1a1a",
    hasTie: true,
    tieColor: "#1e40af",    // blue tie
    female: false,
    eyeColor: "#2c1a0e",
    lipColor: "#9e6b60",
    deskCenter: [8, 0, -8], // Education room
  },
];

/* ── Key locations ── */
const KITCHEN_CENTER = new THREE.Vector3(13, 0, 0);
const RESTROOM_CENTER = new THREE.Vector3(-13, 0, 0);
// Stand-around spots in the kitchen / restroom
const KITCHEN_SPOT = new THREE.Vector3(13, 0, 0.5);
const RESTROOM_SPOT = new THREE.Vector3(-13, 0, 0.5);
// Hallway lounge spots
const HALLWAY_SPOTS = [
  new THREE.Vector3(0, 0, 5),
  new THREE.Vector3(3, 0, 4),
  new THREE.Vector3(-3, 0, 4),
  new THREE.Vector3(0, 0, -4),
];
const CHAIR_OFFSET = new THREE.Vector3(0, 0, 0.7);

/* ── Activity types ── */
type Activity =
  | "working"        // sitting at desk
  | "standing_up"    // transition
  | "go_kitchen"     // walking to kitchen
  | "in_kitchen"     // standing in kitchen (getting coffee / eating)
  | "go_restroom"    // walking to restroom
  | "in_restroom"    // standing in restroom
  | "go_hallway"     // walking to hallway spot
  | "in_hallway"     // standing in hallway (chatting / stretching)
  | "returning"      // walking back to desk
  | "sitting_down";  // transition

interface WorkerRuntime {
  char: CharacterDef;
  seatPos: THREE.Vector3;
  roomCenter: THREE.Vector3;
}

function OfficeWorker({
  runtime,
  talkingTo,
  charPosRef,
  npcPositionsRef,
}: {
  runtime: WorkerRuntime;
  talkingTo: string | null;
  charPosRef: MutableRefObject<THREE.Vector3>;
  npcPositionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
}) {
  const { char, seatPos } = runtime;

  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const nameRef = useRef<THREE.Group>(null);

  const activityRef = useRef<Activity>("working");
  const timerRef = useRef(Math.random() * 6); // desync start
  const posRef = useRef(seatPos.clone());
  const targetRef = useRef(new THREE.Vector3());
  const facingRef = useRef(Math.PI);
  const transitionT = useRef(0);
  const idleDuration = useRef(0); // how long to idle at destination

  function pickNextActivity(): Activity {
    const roll = Math.random();
    if (roll < 0.35) return "go_kitchen";
    if (roll < 0.6) return "go_restroom";
    return "go_hallway";
  }

  function setDestination(activity: Activity) {
    if (activity === "go_kitchen") {
      targetRef.current.copy(KITCHEN_SPOT);
      targetRef.current.x += (Math.random() - 0.5) * 1.5;
      targetRef.current.z += (Math.random() - 0.5) * 1;
    } else if (activity === "go_restroom") {
      targetRef.current.copy(RESTROOM_SPOT);
      targetRef.current.x += (Math.random() - 0.5) * 1.5;
      targetRef.current.z += (Math.random() - 0.5) * 1;
    } else if (activity === "go_hallway") {
      const spot = HALLWAY_SPOTS[Math.floor(Math.random() * HALLWAY_SPOTS.length)];
      targetRef.current.copy(spot);
      targetRef.current.x += (Math.random() - 0.5) * 2;
      targetRef.current.z += (Math.random() - 0.5) * 1;
    }
  }

  const walkSpeed = 1.8 + Math.random() * 0.5;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Publish position for proximity detection (include seated Y offset)
    const publishPos = posRef.current.clone();
    const isSeatedState = activityRef.current === "working" || activityRef.current === "sitting_down";
    publishPos.y = isSeatedState ? -0.42 : 0;
    npcPositionsRef.current.set(char.name, publishPos);

    // If this NPC is being talked to, freeze state machine and face player
    if (talkingTo === char.name) {
      const dx = charPosRef.current.x - posRef.current.x;
      const dz = charPosRef.current.z - posRef.current.z;
      const targetFacing = Math.atan2(dx, dz);
      facingRef.current = THREE.MathUtils.lerp(facingRef.current, targetFacing, 0.1);

      groupRef.current.position.copy(posRef.current);
      groupRef.current.position.y = activityRef.current === "working" ? -0.42 : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, facingRef.current, 0.08,
      );
      if (nameRef.current) {
        nameRef.current.rotation.y = -groupRef.current.rotation.y;
      }
      return;
    }

    timerRef.current += delta;
    const activity = activityRef.current;

    /* ── state machine ── */
    if (activity === "working") {
      if (timerRef.current > 6 + Math.random() * 10) {
        activityRef.current = "standing_up";
        timerRef.current = 0;
        transitionT.current = 0;
      }
    } else if (activity === "standing_up") {
      transitionT.current = Math.min(transitionT.current + delta / 0.5, 1);
      if (transitionT.current >= 1) {
        const next = pickNextActivity();
        activityRef.current = next;
        setDestination(next);
        timerRef.current = 0;
        idleDuration.current = 3 + Math.random() * 6;
      }
    } else if (activity === "go_kitchen" || activity === "go_restroom" || activity === "go_hallway") {
      const arrived = walkToward(targetRef.current, walkSpeed, delta);
      if (arrived) {
        if (activity === "go_kitchen") activityRef.current = "in_kitchen";
        else if (activity === "go_restroom") activityRef.current = "in_restroom";
        else activityRef.current = "in_hallway";
        timerRef.current = 0;
      }
    } else if (activity === "in_kitchen" || activity === "in_restroom" || activity === "in_hallway") {
      // Idle at location
      if (timerRef.current > idleDuration.current) {
        activityRef.current = "returning";
        targetRef.current.copy(seatPos);
        timerRef.current = 0;
      }
    } else if (activity === "returning") {
      const arrived = walkToward(seatPos, walkSpeed, delta);
      if (arrived) {
        posRef.current.copy(seatPos);
        facingRef.current = Math.PI;
        activityRef.current = "sitting_down";
        timerRef.current = 0;
        transitionT.current = 0;
      }
    } else if (activity === "sitting_down") {
      transitionT.current = Math.min(transitionT.current + delta / 0.4, 1);
      if (transitionT.current >= 1) {
        activityRef.current = "working";
        timerRef.current = 0;
      }
    }

    /* ── pose ── */
    const isSeated = activity === "working";
    const isWalking = activity === "go_kitchen" || activity === "go_restroom" || activity === "go_hallway" || activity === "returning";
    const isStandingIdle = activity === "in_kitchen" || activity === "in_restroom" || activity === "in_hallway";

    let standFactor: number;
    if (isSeated) standFactor = 0;
    else if (activity === "standing_up") standFactor = transitionT.current;
    else if (activity === "sitting_down") standFactor = 1 - transitionT.current;
    else standFactor = 1;

    const seatDropY = (1 - standFactor) * -0.42;
    const worldPos = posRef.current.clone();
    worldPos.y = seatDropY;

    groupRef.current.position.copy(worldPos);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, facingRef.current, 0.08,
    );

    // Name tag always faces camera-ish (billboard by counter-rotating)
    if (nameRef.current) {
      nameRef.current.rotation.y = -groupRef.current.rotation.y;
    }

    /* ── limbs ── */
    const legBend = (1 - standFactor) * -Math.PI / 2;

    if (isWalking) {
      const cycle = Date.now() * 0.006 + char.name.charCodeAt(0);
      const swing = Math.sin(cycle) * 0.4;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.6;
    } else if (isStandingIdle) {
      // Subtle idle sway
      const sway = Math.sin(Date.now() * 0.002 + char.name.charCodeAt(0)) * 0.05;
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, sway, 0.05);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -sway, 0.05);
    } else {
      // Seated / transitioning
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, legBend, 0.12);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, legBend, 0.12);
      const armAngle = (1 - standFactor) * -0.5;
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, armAngle, 0.1);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, armAngle, 0.1);
    }
  });

  function walkToward(target: THREE.Vector3, speed: number, delta: number): boolean {
    const dir = new THREE.Vector3().subVectors(target, posRef.current);
    const dist = dir.length();
    if (dist < 0.3) return true;
    dir.normalize().multiplyScalar(speed * delta);
    posRef.current.add(dir);
    facingRef.current = Math.atan2(dir.x, dir.z);
    return false;
  }

  return (
    <group ref={groupRef} position={seatPos.toArray()}>
      {/* Floating name tag */}
      <group ref={nameRef} position={[0, 2.05, 0]}>
        <Text fontSize={0.14} color="#374151" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#ffffff">
          {char.name}
        </Text>
      </group>

      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color={char.skinTone} roughness={0.8} />
      </mesh>

      {/* ── Face ── */}
      {/* Left eye white */}
      <mesh position={[-0.065, 1.68, 0.155]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Left eye iris */}
      <mesh position={[-0.065, 1.68, 0.185]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={char.eyeColor} roughness={0.4} />
      </mesh>
      {/* Left eye pupil */}
      <mesh position={[-0.065, 1.68, 0.195]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
      </mesh>
      {/* Right eye white */}
      <mesh position={[0.065, 1.68, 0.155]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Right eye iris */}
      <mesh position={[0.065, 1.68, 0.185]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={char.eyeColor} roughness={0.4} />
      </mesh>
      {/* Right eye pupil */}
      <mesh position={[0.065, 1.68, 0.195]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 1.63, 0.17]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={char.skinTone} roughness={0.8} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 1.585, 0.16]}>
        <boxGeometry args={[0.06, 0.015, 0.02]} />
        <meshStandardMaterial color={char.lipColor} roughness={0.6} />
      </mesh>
      {/* Eyebrows */}
      <mesh position={[-0.065, 1.72, 0.16]}>
        <boxGeometry args={[0.05, 0.012, 0.015]} />
        <meshStandardMaterial color={char.hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.065, 1.72, 0.16]}>
        <boxGeometry args={[0.05, 0.012, 0.015]} />
        <meshStandardMaterial color={char.hairColor} roughness={0.9} />
      </mesh>

      {/* Hair — male: short cap, female: longer with side volume */}
      {char.female ? (
        <>
          {/* Top hair */}
          <mesh position={[0, 1.78, -0.02]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color={char.hairColor} roughness={0.9} />
          </mesh>
          {/* Hair sides — left */}
          <mesh position={[-0.15, 1.55, -0.04]}>
            <capsuleGeometry args={[0.06, 0.25, 6, 8]} />
            <meshStandardMaterial color={char.hairColor} roughness={0.9} />
          </mesh>
          {/* Hair sides — right */}
          <mesh position={[0.15, 1.55, -0.04]}>
            <capsuleGeometry args={[0.06, 0.25, 6, 8]} />
            <meshStandardMaterial color={char.hairColor} roughness={0.9} />
          </mesh>
          {/* Hair back */}
          <mesh position={[0, 1.5, -0.1]}>
            <capsuleGeometry args={[0.1, 0.3, 6, 8]} />
            <meshStandardMaterial color={char.hairColor} roughness={0.9} />
          </mesh>
        </>
      ) : (
        /* Male short hair cap */
        <mesh position={[0, 1.78, -0.04]}>
          <sphereGeometry args={[0.19, 10, 8]} />
          <meshStandardMaterial color={char.hairColor} roughness={0.9} />
        </mesh>
      )}

      {/* Torso — female: narrower shoulders, tapered waist */}
      {char.female ? (
        <>
          {/* Upper torso (shoulders) */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[0.34, 0.22, 0.2]} />
            <meshStandardMaterial color={char.shirtColor} roughness={0.7} />
          </mesh>
          {/* Lower torso (waist — narrower) */}
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.28, 0.22, 0.18]} />
            <meshStandardMaterial color={char.shirtColor} roughness={0.7} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.38, 0.5, 0.22]} />
          <meshStandardMaterial color={char.shirtColor} roughness={0.7} />
        </mesh>
      )}

      {/* Collar */}
      <mesh position={[0, 1.44, 0.08]}>
        <boxGeometry args={[0.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      {/* Tie (males only) */}
      {char.hasTie && (
        <mesh position={[0, 1.18, 0.12]}>
          <boxGeometry args={[0.06, 0.35, 0.02]} />
          <meshStandardMaterial color={char.tieColor} roughness={0.5} />
        </mesh>
      )}

      {/* Left arm */}
      <group ref={leftArmRef} position={[char.female ? -0.22 : -0.25, 1.35, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[char.female ? 0.045 : 0.055, 0.28, 6, 8]} />
          <meshStandardMaterial color={char.shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[char.female ? 0.04 : 0.05, 8, 6]} />
          <meshStandardMaterial color={char.skinTone} roughness={0.8} />
        </mesh>
      </group>
      {/* Right arm */}
      <group ref={rightArmRef} position={[char.female ? 0.22 : 0.25, 1.35, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[char.female ? 0.045 : 0.055, 0.28, 6, 8]} />
          <meshStandardMaterial color={char.shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[char.female ? 0.04 : 0.05, 8, 6]} />
          <meshStandardMaterial color={char.skinTone} roughness={0.8} />
        </mesh>
      </group>

      {/* Belt / waist */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[char.female ? 0.3 : 0.36, 0.08, char.female ? 0.18 : 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      {/* Hips — females get a skirt, males keep pants */}
      {char.female && (
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 0.28, 8]} />
          <meshStandardMaterial color={char.pantsColor} roughness={0.7} />
        </mesh>
      )}

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.1, 0.88, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[char.female ? 0.055 : 0.065, 0.35, 6, 8]} />
          <meshStandardMaterial color={char.pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[char.female ? 0.08 : 0.1, 0.06, char.female ? 0.15 : 0.18]} />
          <meshStandardMaterial color={char.shoeColor} roughness={0.5} />
        </mesh>
      </group>
      {/* Right leg */}
      <group ref={rightLegRef} position={[0.1, 0.88, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[char.female ? 0.055 : 0.065, 0.35, 6, 8]} />
          <meshStandardMaterial color={char.pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[char.female ? 0.08 : 0.1, 0.06, char.female ? 0.15 : 0.18]} />
          <meshStandardMaterial color={char.shoeColor} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

interface OfficePeopleProps {
  npcPositionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
  talkingTo: string | null;
  charPosRef: MutableRefObject<THREE.Vector3>;
  onNearbyNPCChange: (name: string | null) => void;
}

export function OfficePeople({ npcPositionsRef, talkingTo, charPosRef, onNearbyNPCChange }: OfficePeopleProps) {
  const workers = useMemo<WorkerRuntime[]>(() => {
    return CHARACTERS.map((char) => {
      const roomCenter = new THREE.Vector3(...char.deskCenter);
      const seatPos = roomCenter.clone().add(CHAIR_OFFSET);
      return { char, seatPos, roomCenter };
    });
  }, []);

  const lastNearbyRef = useRef<string | null>(null);

  useFrame(() => {
    if (talkingTo) return; // Don't update nearby while in conversation

    let closestName: string | null = null;
    let closestDist = 2.5;

    npcPositionsRef.current.forEach((pos, name) => {
      const dx = charPosRef.current.x - pos.x;
      const dz = charPosRef.current.z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closestName = name;
      }
    });

    if (closestName !== lastNearbyRef.current) {
      lastNearbyRef.current = closestName;
      onNearbyNPCChange(closestName);
    }
  });

  return (
    <>
      {workers.map((w) => (
        <OfficeWorker
          key={w.char.name}
          runtime={w}
          talkingTo={talkingTo}
          charPosRef={charPosRef}
          npcPositionsRef={npcPositionsRef}
        />
      ))}
    </>
  );
}
