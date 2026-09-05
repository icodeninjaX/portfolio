"use client";

import { useRef, useMemo, useState, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { HumanoidFigure, HumanoidConfig, type HumanoidMotionState } from "./HumanoidFigure";
import { damping, sampleOfficeJump } from "@/lib/humanoidMotion";

/* ── Named characters with fixed appearances ── */
export interface CharacterDef extends HumanoidConfig {
  deskCenter: [number, number, number]; // their assigned office room center
}

export const CHARACTERS: CharacterDef[] = [
  {
    name: "Carl",
    shirtColor: "#2563eb",  // sharp blue dress shirt
    pantsColor: "#1e293b",  // navy slacks
    skinTone: "#d4a57b",
    hairColor: "#1a1a1a",
    shoeColor: "#111827",
    hasTie: true,
    tieColor: "#dc2626",   // classic red tie
    female: false,
    eyeColor: "#3b2f1a",
    lipColor: "#b5746a",
    hasWatch: true,
    deskCenter: [0, 0, 0],  // Summary room
  },
  {
    name: "Charo",
    shirtColor: "#86efac",  // sage pastel blouse
    pantsColor: "#334155",  // charcoal pencil skirt
    skinTone: "#c6956e",
    hairColor: "#3d2b1f",
    shoeColor: "#1e293b",
    hasTie: false,
    female: true,
    eyeColor: "#2d1a0e",
    lipColor: "#f43f5e",
    deskCenter: [-8, 0, 8], // Projects room
  },
  {
    name: "Chella",
    shirtColor: "#f8fafc",  // crisp white silk blouse
    pantsColor: "#292524",  // dark tailored trousers
    skinTone: "#e8c4a0",
    hairColor: "#8b6a4f",
    shoeColor: "#1c1917",
    hasTie: false,
    female: true,
    eyeColor: "#4a3728",
    lipColor: "#e11d48",
    deskCenter: [8, 0, 8],  // Experience room
  },
  {
    name: "Natalie",
    shirtColor: "#fda4af",  // blush pink designer blouse
    pantsColor: "#1e3a5f",  // deep navy skirt
    skinTone: "#f5d0b0",
    hairColor: "#d4b886",   // golden blonde layered waves
    shoeColor: "#0f172a",
    hasTie: false,
    female: true,
    eyeColor: "#0284c7",   // vibrant blue eyes
    lipColor: "#f43f5e",
    deskCenter: [-8, 0, -8], // Skills room
  },
  {
    name: "Keith",
    shirtColor: "#6366f1",  // signature indigo dress shirt
    pantsColor: "#3f3f46",  // dark slate trousers
    skinTone: "#8d5e3c",
    hairColor: "#111827",
    shoeColor: "#09090b",
    hasTie: true,
    tieColor: "#2563eb",    // royal blue tie
    female: false,
    eyeColor: "#2c1a0e",
    lipColor: "#9e6b60",
    hasWatch: true,
    deskCenter: [8, 0, -8], // Education room
  },
];

/* ── Ambient chatter lines (short, about Keith) ── */
const CHATTER_LINES: Record<string, string[]> = {
  Carl: [
    "Keith's code is so clean...",
    "Did you see his latest project?",
    "He's been coding since morning!",
    "I should ask Keith for a review.",
    "Such an impressive resume!",
  ],
  Charo: [
    "Keith's UI design is top tier!",
    "He shipped that feature so fast.",
    "Always learning new things...",
    "Working with Keith is great!",
    "Have you checked his projects yet?",
  ],
  Chella: [
    "Keith's background is amazing!",
    "He handled that production bug like a pro.",
    "Smart and humble, rare combo!",
    "I love his creative portfolio.",
    "He really knows his stack!",
  ],
  Natalie: [
    "Keith solves problems so smoothly.",
    "His tech skills are off the charts!",
    "Great team player, honestly.",
    "Check out the skills section!",
    "He always stays up to date.",
  ],
  Keith: [
    "Welcome to my portfolio!",
    "Feel free to explore around!",
    "Check out my stations for details.",
    "Built this with Next.js & Three.js!",
    "Press E anytime to chat with me!",
  ],
};

/* ── Common destinations ── */
const KITCHEN_SPOT = new THREE.Vector3(-10, 0, -12);
const RESTROOM_SPOT = new THREE.Vector3(11, 0, -12);
const HALLWAY_SPOTS = [
  new THREE.Vector3(0, 0, 4),
  new THREE.Vector3(0, 0, -4),
  new THREE.Vector3(-4, 0, 0),
  new THREE.Vector3(4, 0, 0),
];

type Activity =
  | "working"
  | "standing_up"
  | "go_kitchen"
  | "in_kitchen"
  | "go_restroom"
  | "in_restroom"
  | "go_hallway"
  | "in_hallway"
  | "crouching"
  | "dancing"
  | "singing"
  | "jumping"
  | "returning"
  | "sitting_down";

type MoveStyle = "walk" | "crawl" | "run";

const HIT_REACTIONS = [
  "Ouch!",
  "Hey!",
  "What the-?!",
  "Watch it!",
  "Not cool!",
  "Why me?!",
  "Excuse you!",
];

interface WorkerRuntime {
  char: CharacterDef;
  seatPos: THREE.Vector3;
  roomCenter: THREE.Vector3;
}

const CHAIR_OFFSET = new THREE.Vector3(0, 0, 1.4);

function lerpAngle(from: number, to: number, step: number): number {
  let diff = (to - from) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return from + diff * step;
}

function OfficeWorker({
  runtime,
  talkingTo,
  charPosRef,
  npcPositionsRef,
  hitNPCs,
}: {
  runtime: WorkerRuntime;
  talkingTo: string | null;
  charPosRef: MutableRefObject<THREE.Vector3>;
  npcPositionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
  hitNPCs: Set<string>;
}) {
  const { char, seatPos } = runtime;
  const groupRef = useRef<THREE.Group>(null);
  const note1Ref = useRef<THREE.Group>(null);
  const note2Ref = useRef<THREE.Group>(null);
  const note3Ref = useRef<THREE.Group>(null);

  const activityRef = useRef<Activity>("working");
  const timerRef = useRef((char.name.charCodeAt(0) % 5) * 1.2); // desync start
  const posRef = useRef(seatPos.clone());
  const targetRef = useRef(new THREE.Vector3());
  const facingRef = useRef(Math.PI);
  const transitionT = useRef(0);
  const idleDuration = useRef(4); // how long to idle at destination
  const moveStyleRef = useRef<MoveStyle>("walk");
  const movementSpeedRef = useRef(0);
  const jumpElapsedRef = useRef(0);
  const humanoidMotionRef = useRef<HumanoidMotionState>({
    speed: 0,
    isGrounded: true,
    verticalVelocity: 0,
    isJumping: false,
    isRunning: false,
    pose: "seated",
  });

  // Hit reaction
  const flinchTimeRef = useRef(1);
  const wasHit = useRef(false);
  const [hitReaction, setHitReaction] = useState<string | null>(null);

  // Chatter
  const chatterTimerRef = useRef(3 + (char.name.charCodeAt(0) % 4) * 2);
  const chatterPhaseRef = useRef<"waiting" | "showing">("waiting");
  const chatterIndexRef = useRef(0);
  const [chatterLine, setChatterLine] = useState<string | null>(null);
  const nameTagWidth = char.name.length * 0.085 + 0.16;

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

  function walkToward(target: THREE.Vector3, speed: number, delta: number): boolean {
    const dir = new THREE.Vector3().subVectors(target, posRef.current);
    const dist = dir.length();
    if (dist < 0.3) return true;
    const distanceTravelled = Math.min(speed * delta, dist);
    dir.normalize().multiplyScalar(distanceTravelled);
    posRef.current.add(dir);
    movementSpeedRef.current = distanceTravelled / Math.max(delta, 0.0001);
    facingRef.current = Math.atan2(dir.x, dir.z);
    return false;
  }

  const walkSpeed = 1.9;

  const updateHumanoidMotion = (activity: Activity, jumpProgress?: number) => {
    const walking = activity === "go_kitchen" || activity === "go_restroom" || activity === "go_hallway" || activity === "returning";
    const crawling = walking && moveStyleRef.current === "crawl";
    const running = walking && moveStyleRef.current === "run";
    const motion = humanoidMotionRef.current;
    motion.speed = movementSpeedRef.current;
    motion.isRunning = running;
    motion.isJumping = activity === "jumping";
    motion.jumpProgress = jumpProgress;
    motion.verticalVelocity = 0;
    motion.isGrounded = true;
    if (activity === "jumping" && jumpProgress !== undefined) {
      const jump = sampleOfficeJump(jumpElapsedRef.current);
      motion.isGrounded = jump.isGrounded;
      motion.verticalVelocity = jump.verticalVelocity;
    }
    motion.seatWeight = activity === "working" ? 1
      : activity === "standing_up" ? 1 - transitionT.current
      : activity === "sitting_down" ? transitionT.current : 0;
    motion.pose = flinchTimeRef.current < 1 ? "flinching"
      : activity === "working" ? "seated"
      : crawling ? "crawling"
      : activity === "crouching" ? "crouching"
      : activity === "dancing" ? "dancing"
      : activity === "singing" ? "singing"
      : "default";
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    movementSpeedRef.current = 0;

    // Publish position for proximity detection (include seated Y offset)
    const publishPos = posRef.current.clone();
    const isSeatedState = activityRef.current === "working" || activityRef.current === "sitting_down";
    publishPos.y = isSeatedState ? -0.42 : 0;
    npcPositionsRef.current.set(char.name, publishPos);

    // Hit reaction detection
    const isHit = hitNPCs.has(char.name);
    if (isHit && !wasHit.current) {
      flinchTimeRef.current = 0;
      wasHit.current = true;
      setHitReaction(HIT_REACTIONS[Math.floor(Math.random() * HIT_REACTIONS.length)]);
    }
    if (!isHit && wasHit.current) {
      wasHit.current = false;
    }
    if (flinchTimeRef.current < 1) {
      flinchTimeRef.current += delta * 2; // ~0.5s flinch
    } else if (hitReaction) {
      setHitReaction(null);
    }

    // If this NPC is being talked to, freeze state machine and face player
    if (talkingTo === char.name) {
      const dx = charPosRef.current.x - posRef.current.x;
      const dz = charPosRef.current.z - posRef.current.z;
      const targetFacing = Math.atan2(dx, dz);
      facingRef.current = lerpAngle(facingRef.current, targetFacing, damping(9, delta));

      groupRef.current.position.copy(posRef.current);
      groupRef.current.position.y = activityRef.current === "working" ? -0.42 : 0;
      groupRef.current.rotation.y = facingRef.current;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
      updateHumanoidMotion(activityRef.current === "working" ? "working" : "in_hallway");
      jumpElapsedRef.current = 0;
      if (chatterPhaseRef.current === "showing") {
        setChatterLine(null);
        chatterPhaseRef.current = "waiting";
        chatterTimerRef.current = 4 + Math.random() * 6;
      }
      return;
    }

    timerRef.current += delta;
    const activity = activityRef.current;

    /* ── state machine ── */
    if (activity === "working") {
      if (timerRef.current > 7 + (char.name.charCodeAt(0) % 6) * 2) {
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
        const styleRoll = Math.random();
        moveStyleRef.current = styleRoll < 0.12 ? "crawl" : styleRoll < 0.3 ? "run" : "walk";
      }
    } else if (activity === "go_kitchen" || activity === "go_restroom" || activity === "go_hallway") {
      const speed = moveStyleRef.current === "run" ? walkSpeed * 1.8
        : moveStyleRef.current === "crawl" ? walkSpeed * 0.45
        : walkSpeed;
      const arrived = walkToward(targetRef.current, speed, delta);
      if (arrived) {
        const actionRoll = Math.random();
        if (actionRoll < 0.12) activityRef.current = "dancing";
        else if (actionRoll < 0.22) activityRef.current = "singing";
        else if (actionRoll < 0.32) activityRef.current = "jumping";
        else if (actionRoll < 0.44) activityRef.current = "crouching";
        else if (activity === "go_kitchen") activityRef.current = "in_kitchen";
        else if (activity === "go_restroom") activityRef.current = "in_restroom";
        else activityRef.current = "in_hallway";
        timerRef.current = 0;
      }
    } else if (activity === "in_kitchen" || activity === "in_restroom" || activity === "in_hallway"
      || activity === "crouching" || activity === "dancing" || activity === "singing" || activity === "jumping") {
      if (timerRef.current > idleDuration.current &&
        (activity !== "jumping" || sampleOfficeJump(jumpElapsedRef.current).progress >= 0.94)) {
        activityRef.current = "returning";
        targetRef.current.copy(seatPos);
        timerRef.current = 0;
        moveStyleRef.current = "walk";
      }
    } else if (activity === "returning") {
      const speed = moveStyleRef.current === "run" ? walkSpeed * 1.8
        : moveStyleRef.current === "crawl" ? walkSpeed * 0.45
        : walkSpeed;
      const arrived = walkToward(seatPos, speed, delta);
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
    const currentActivity = activityRef.current;
    const isSeated = currentActivity === "working";

    let standFactor: number;
    if (isSeated) standFactor = 0;
    else if (currentActivity === "standing_up") standFactor = transitionT.current;
    else if (currentActivity === "sitting_down") standFactor = 1 - transitionT.current;
    else standFactor = 1;

    const seatDropY = (1 - standFactor) * -0.42;
    const worldPos = posRef.current.clone();
    worldPos.y = seatDropY;

    groupRef.current.position.copy(worldPos);

    // The rig owns body lean and joint compression; the parent owns travel.
    groupRef.current.rotation.x = 0;

    // Dance body bob
    let jumpProgress: number | undefined;
    if (currentActivity === "jumping") {
      jumpElapsedRef.current += delta;
      const jump = sampleOfficeJump(jumpElapsedRef.current);
      jumpProgress = jump.progress;
      groupRef.current.position.y += jump.height;
    } else {
      jumpElapsedRef.current = 0;
    }

    if (currentActivity === "dancing") {
      const beat = Date.now() * 0.008 + char.name.charCodeAt(0);
      groupRef.current.position.y += Math.abs(Math.sin(beat)) * 0.12;
      groupRef.current.rotation.z = Math.sin(beat * 0.5) * 0.06;
    } else if (currentActivity === "singing") {
      const sw = Date.now() * 0.003 + char.name.charCodeAt(0);
      groupRef.current.rotation.z = Math.sin(sw) * 0.04;
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
    }

    groupRef.current.rotation.y = lerpAngle(
      groupRef.current.rotation.y, facingRef.current, damping(10, delta),
    );

    // Flinch
    if (flinchTimeRef.current < 1) {
      const flinch = Math.sin(flinchTimeRef.current * Math.PI);
      groupRef.current.position.y += flinch * 0.08;
      groupRef.current.rotation.x = flinch * 0.06;
    }

    updateHumanoidMotion(currentActivity, jumpProgress);

    /* ── musical notes (singing) ── */
    const isSinging = activity === "singing";
    const nt = Date.now() * 0.002 + char.name.charCodeAt(0);
    if (note1Ref.current) {
      note1Ref.current.visible = isSinging;
      if (isSinging) {
        note1Ref.current.position.x = 0.3 + Math.sin(nt * 1.3) * 0.08;
        note1Ref.current.position.y = 2.3 + Math.sin(nt * 1.8) * 0.12;
      }
    }
    if (note2Ref.current) {
      note2Ref.current.visible = isSinging;
      if (isSinging) {
        note2Ref.current.position.x = -0.25 + Math.sin(nt * 1.1 + 2) * 0.06;
        note2Ref.current.position.y = 2.5 + Math.sin(nt * 1.5 + 1) * 0.1;
      }
    }
    if (note3Ref.current) {
      note3Ref.current.visible = isSinging;
      if (isSinging) {
        note3Ref.current.position.x = 0.15 + Math.sin(nt * 0.9 + 4) * 0.07;
        note3Ref.current.position.y = 2.7 + Math.sin(nt * 1.2 + 3) * 0.1;
      }
    }

    /* ── chatter timer ── */
    chatterTimerRef.current -= delta;
    if (chatterTimerRef.current <= 0) {
      if (chatterPhaseRef.current === "waiting") {
        const lines = CHATTER_LINES[char.name];
        if (lines && lines.length > 0) {
          chatterIndexRef.current = (chatterIndexRef.current + 1) % lines.length;
          setChatterLine(lines[chatterIndexRef.current]);
          chatterPhaseRef.current = "showing";
          chatterTimerRef.current = 3 + Math.random() * 2;
        }
      } else {
        setChatterLine(null);
        chatterPhaseRef.current = "waiting";
        chatterTimerRef.current = 5 + Math.random() * 8;
      }
    }
  }, -1);


  return (
    <group ref={groupRef} position={seatPos.toArray()}>
      {/* Floating name tag + chatter (auto-faces camera) */}
      <Billboard>
        {/* Name tag */}
        <group position={[0, 2.12, 0]}>
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[nameTagWidth, 0.24]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.88} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.13, -0.004]}>
            <planeGeometry args={[nameTagWidth, 0.03]} />
            <meshBasicMaterial color={char.shirtColor} side={THREE.DoubleSide} />
          </mesh>
          <Text fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#000000">
            {char.name}
          </Text>
        </group>

        {/* Hit reaction bubble */}
        {hitReaction && (
          <group position={[0, 2.52, 0]}>
            <mesh position={[0, 0, -0.005]}>
              <planeGeometry args={[1.0, 0.28]} />
              <meshBasicMaterial color="#ff4444" transparent opacity={0.92} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.17, -0.004]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.05, 0.08, 3]} />
              <meshBasicMaterial color="#ff4444" transparent opacity={0.92} side={THREE.DoubleSide} />
            </mesh>
            <Text fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
              {hitReaction}
            </Text>
          </group>
        )}

        {/* Speech bubble */}
        {chatterLine && !hitReaction && talkingTo !== char.name && (
          <group position={[0, 2.52, 0]}>
            <mesh position={[0, 0, -0.005]}>
              <planeGeometry args={[1.4, 0.22]} />
              <meshBasicMaterial color="#f8fafc" transparent opacity={0.92} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.14, -0.004]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.05, 0.08, 3]} />
              <meshBasicMaterial color="#f8fafc" transparent opacity={0.92} side={THREE.DoubleSide} />
            </mesh>
            <Text fontSize={0.08} color="#334155" anchorX="center" anchorY="middle" maxWidth={1.2}>
              {chatterLine}
            </Text>
          </group>
        )}

        {/* Musical notes */}
        <group ref={note1Ref} visible={false} position={[0.3, 2.3, 0]}>
          <Text fontSize={0.18} color="#ec4899" anchorX="center" anchorY="middle">{"♪"}</Text>
        </group>
        <group ref={note2Ref} visible={false} position={[-0.25, 2.5, 0]}>
          <Text fontSize={0.14} color="#8b5cf6" anchorX="center" anchorY="middle">{"♫"}</Text>
        </group>
        <group ref={note3Ref} visible={false} position={[0.15, 2.7, 0]}>
          <Text fontSize={0.12} color="#f59e0b" anchorX="center" anchorY="middle">{"♪"}</Text>
        </group>
      </Billboard>

      {/* ===== REALISTIC HUMANOID MODEL ===== */}
      <HumanoidFigure
        config={char}
        lookAtTargetRef={charPosRef}
        motionStateRef={humanoidMotionRef}
      />
    </group>
  );
}

interface OfficePeopleProps {
  npcPositionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
  talkingTo: string | null;
  charPosRef: MutableRefObject<THREE.Vector3>;
  onNearbyNPCChange: (name: string | null) => void;
  hitNPCs?: Set<string>;
}

export function OfficePeople({ npcPositionsRef, talkingTo, charPosRef, onNearbyNPCChange, hitNPCs }: OfficePeopleProps) {
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
          hitNPCs={hitNPCs ?? new Set()}
        />
      ))}
    </>
  );
}
