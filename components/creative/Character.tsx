"use client";

import { useState, useRef, useEffect, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Car } from "./Car";
import { HumanoidFigure, type HumanoidMotionState } from "./HumanoidFigure";
import { playHorn, playJump, playLand, playBoost, playSlide, playTeleport } from "@/lib/officeAudio";
import { damping } from "@/lib/humanoidMotion";

export interface MovementState {
  speed: number;
  isSprinting: boolean;
  isCrouching: boolean;
  isSliding: boolean;
  isAirborne: boolean;
  speedRatio: number;
  eyeHeight: number;
  inVehicle?: boolean;
}

export interface VirtualControls {
  forward: number; // -1 (back) to 1 (forward)
  strafe: number;  // -1 (left) to 1 (right)
  sprint?: boolean;
  jump?: boolean;
  crouch?: boolean;
}

interface CharacterProps {
  startPosition: [number, number, number];
  positionRef: MutableRefObject<THREE.Vector3>;
  onThrow: () => void;
  yawRef: MutableRefObject<number>;
  movementDisabled?: boolean;
  movementStateRef?: MutableRefObject<MovementState>;
  virtualControls?: VirtualControls;
  teleportPos?: THREE.Vector3 | null;
  onClearTeleport?: () => void;
}

const GROUND_Y = 0.3;
const GRAVITY = -22;
const JUMP_VELOCITY = 7.0;

const SPEEDS = {
  walk: 5.2,
  sprint: 9.5,
  crouch: 2.8,
  slide: 11.2,
};

const EYE_HEIGHTS = {
  stand: 1.75,
  crouch: 1.15,
  slide: 0.92,
  vehicle: 1.5,
};

export const STATION_COORDS: Record<string, [number, number, number]> = {
  summary: [0, GROUND_Y, 0],
  projects: [-8, GROUND_Y, 8],
  experience: [8, GROUND_Y, 8],
  skills: [-8, GROUND_Y, -8],
  education: [8, GROUND_Y, -8],
  kitchen: [-10, GROUND_Y, -12],
  parking: [0, GROUND_Y, 20],
};

export function Character({
  startPosition,
  positionRef,
  onThrow,
  yawRef,
  movementDisabled,
  movementStateRef,
  virtualControls,
  teleportPos,
  onClearTeleport,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const onFootRef = useRef<THREE.Group>(null);

  // Vehicle mode vs on-foot mode (GTA style)
  const [inVehicle, setInVehicle] = useState(false);
  const inVehicleRef = useRef(false);

  // Input keys
  const keys = useRef(new Set<string>());

  // Movement physics state
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const verticalVelocity = useRef(0);
  const isAirborne = useRef(false);
  const isCrouching = useRef(false);
  const isSprinting = useRef(false);
  const isSliding = useRef(false);
  const slideTimer = useRef(0);
  const steerAngle = useRef(0);
  const hornTrigger = useRef(0);
  const humanoidMotionRef = useRef<HumanoidMotionState>({
    speed: 0,
    isGrounded: true,
    verticalVelocity: 0,
    isJumping: false,
    isRunning: false,
    pose: "default",
  });

  // Throw cycle
  const timerRef = useRef(0);
  const threw = useRef(false);

  // Keyboard listeners
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (movementDisabled) return;
      const k = e.key.toLowerCase();

      // Navigation keys
      if (["w", "a", "s", "d"].includes(k)) keys.current.add(k);
      if (e.key === "ArrowUp") keys.current.add("w");
      if (e.key === "ArrowDown") keys.current.add("s");
      if (e.key === "ArrowLeft") keys.current.add("a");
      if (e.key === "ArrowRight") keys.current.add("d");

      // Sprint
      if (e.key === "Shift") {
        keys.current.add("shift");
        if (!isAirborne.current && !isCrouching.current) {
          playBoost();
        }
      }

      // Crouch / Slide
      if (k === "c" || e.key === "Control") {
        keys.current.add("crouch");
        const currentHorizSpeed = Math.sqrt(
          velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z
        );
        if (currentHorizSpeed > 6.0 && !isAirborne.current) {
          isSliding.current = true;
          slideTimer.current = 0.8;
          playSlide();
        }
      }

      // Jump
      if (e.code === "Space") {
        if (!isAirborne.current) {
          isAirborne.current = true;
          verticalVelocity.current = JUMP_VELOCITY;
          playJump();
        }
      }

      // F: Toggle Vehicle / On-Foot (GTA style)
      if (k === "f") {
        inVehicleRef.current = !inVehicleRef.current;
        setInVehicle(inVehicleRef.current);
        playTeleport();
      }

      // Horn
      if (k === "h") {
        hornTrigger.current = Date.now();
        playHorn();
      }

      // Hotkey Station Fast Travel (keys 4-0)
      const stationMap: Record<string, string> = {
        "4": "summary",
        "5": "projects",
        "6": "experience",
        "7": "skills",
        "8": "education",
        "9": "kitchen",
        "0": "parking",
      };
      if (stationMap[e.key]) {
        const dest = STATION_COORDS[stationMap[e.key]];
        if (dest) {
          positionRef.current.set(dest[0], dest[1], dest[2]);
          velocity.current.set(0, 0, 0);
          playTeleport();
        }
      }
    };

    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.delete(k);
      if (e.key === "ArrowUp") keys.current.delete("w");
      if (e.key === "ArrowDown") keys.current.delete("s");
      if (e.key === "ArrowLeft") keys.current.delete("a");
      if (e.key === "ArrowRight") keys.current.delete("d");
      if (e.key === "Shift") keys.current.delete("shift");
      if (k === "c" || e.key === "Control") keys.current.delete("crouch");
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [movementDisabled, positionRef]);

  // Teleport prop handler
  useEffect(() => {
    if (teleportPos) {
      positionRef.current.copy(teleportPos);
      velocity.current.set(0, 0, 0);
      playTeleport();
      onClearTeleport?.();
    }
  }, [teleportPos, positionRef, onClearTeleport]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // --- 1. Gather movement inputs ---
    let inputX = 0;
    let inputZ = 0;
    let reqSprint = false;
    let reqCrouch = false;
    let reqJump = false;

    if (!movementDisabled) {
      if (keys.current.has("w")) inputZ += 1;
      if (keys.current.has("s")) inputZ -= 1;
      if (keys.current.has("a")) inputX -= 1;
      if (keys.current.has("d")) inputX += 1;
      if (keys.current.has("shift")) reqSprint = true;
      if (keys.current.has("crouch")) reqCrouch = true;

      // Virtual controls overlay (touch / mouse)
      if (virtualControls) {
        inputZ += virtualControls.forward;
        inputX += virtualControls.strafe;
        if (virtualControls.sprint) reqSprint = true;
        if (virtualControls.crouch) reqCrouch = true;
        if (virtualControls.jump && !isAirborne.current) reqJump = true;
      }
    }

    inputX = THREE.MathUtils.clamp(inputX, -1, 1);
    inputZ = THREE.MathUtils.clamp(inputZ, -1, 1);

    if (reqJump && !isAirborne.current) {
      isAirborne.current = true;
      verticalVelocity.current = JUMP_VELOCITY;
      playJump();
    }

    if (isSliding.current) {
      slideTimer.current -= delta;
      if (slideTimer.current <= 0 || !reqCrouch) {
        isSliding.current = false;
      }
    }

    isSprinting.current = reqSprint && (inputX !== 0 || inputZ !== 0) && !reqCrouch;
    isCrouching.current = reqCrouch && !isSliding.current;

    // --- 2. Determine target speed & acceleration ---
    let targetSpeed = SPEEDS.walk;
    if (isSliding.current) {
      targetSpeed = SPEEDS.slide;
    } else if (isSprinting.current) {
      targetSpeed = SPEEDS.sprint;
    } else if (isCrouching.current) {
      targetSpeed = SPEEDS.crouch;
    }

    const yaw = yawRef.current;
    const forwardX = -Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const rightDirX = Math.cos(yaw);
    const rightDirZ = -Math.sin(yaw);

    const targetSteerAngle = inputX * 0.45;
    steerAngle.current = THREE.MathUtils.lerp(steerAngle.current, targetSteerAngle, 0.2);

    let targetDirX = 0;
    let targetDirZ = 0;
    const inputMagnitude = Math.sqrt(inputX * inputX + inputZ * inputZ);

    if (inputMagnitude > 0.05) {
      const normInputX = inputX / inputMagnitude;
      const normInputZ = inputZ / inputMagnitude;
      targetDirX = (forwardX * normInputZ + rightDirX * normInputX) * targetSpeed;
      targetDirZ = (forwardZ * normInputZ + rightDirZ * normInputX) * targetSpeed;
    }

    const accelRate = isSliding.current ? 4.0 : isAirborne.current ? 8.0 : 16.0;
    const dragRate = isSliding.current ? 2.5 : isAirborne.current ? 3.0 : 18.0;

    const rate = inputMagnitude > 0.05 ? accelRate : dragRate;
    velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetDirX, rate * delta);
    velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetDirZ, rate * delta);

    // --- 3. Vertical jump & gravity physics ---
    if (isAirborne.current) {
      verticalVelocity.current += GRAVITY * delta;
      positionRef.current.y += verticalVelocity.current * delta;

      if (positionRef.current.y <= GROUND_Y) {
        positionRef.current.y = GROUND_Y;
        verticalVelocity.current = 0;
        isAirborne.current = false;
        playLand();
      }
    } else {
      positionRef.current.y = GROUND_Y;
    }

    // --- 4. Update horizontal position with collision boundaries ---
    const nextX = positionRef.current.x + velocity.current.x * delta;
    const nextZ = positionRef.current.z + velocity.current.z * delta;

    let resolvedX = nextX;
    let resolvedZ = nextZ;

    const isAtFrontWall = (positionRef.current.z <= 14.5 && nextZ > 14.5) || (positionRef.current.z >= 15.0 && nextZ < 15.0);
    const isThroughDoor = Math.abs(nextX) <= 2.2;

    if (isAtFrontWall && !isThroughDoor) {
      if (positionRef.current.z <= 14.5) {
        resolvedZ = Math.min(nextZ, 14.5);
      } else {
        resolvedZ = Math.max(nextZ, 15.0);
      }
    }

    resolvedX = THREE.MathUtils.clamp(resolvedX, -13.5, 13.5);
    resolvedZ = THREE.MathUtils.clamp(resolvedZ, -13.5, 28.5);

    const movedX = resolvedX - positionRef.current.x;
    const movedZ = resolvedZ - positionRef.current.z;
    const actualSpeed = Math.hypot(movedX, movedZ) / Math.max(delta, 0.0001);
    positionRef.current.x = resolvedX;
    positionRef.current.z = resolvedZ;

    groupRef.current.position.x = positionRef.current.x;
    groupRef.current.position.z = positionRef.current.z;

    if (inVehicleRef.current && !isAirborne.current) {
      const currentSpeed = Math.sqrt(
        velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z
      );
      const bobFreq = isSprinting.current ? 0.015 : 0.008;
      const bobAmp = currentSpeed > 0.5 ? 0.04 : 0.015;
      groupRef.current.position.y = positionRef.current.y + Math.sin(Date.now() * bobFreq) * bobAmp;
    } else {
      groupRef.current.position.y = positionRef.current.y;
    }

    groupRef.current.rotation.y = yawRef.current;
    if (onFootRef.current && actualSpeed > 0.08) {
      const target = Math.atan2(movedX, movedZ) - yawRef.current;
      const difference = Math.atan2(Math.sin(target - onFootRef.current.rotation.y), Math.cos(target - onFootRef.current.rotation.y));
      onFootRef.current.rotation.y += difference * damping(14, delta);
    }

    // --- 5. Periodic throw cycle ---
    timerRef.current += delta;
    if (timerRef.current > 4.0) {
      if (!threw.current) {
        onThrow();
        threw.current = true;
      }
      if (timerRef.current > 4.5) {
        timerRef.current = 0;
        threw.current = false;
      }
    }

    // --- 6. Sync state to movementStateRef ---
    const currentSpeed = Math.sqrt(
      velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z
    );
    humanoidMotionRef.current.speed = actualSpeed;
    humanoidMotionRef.current.isGrounded = !isAirborne.current;
    humanoidMotionRef.current.verticalVelocity = verticalVelocity.current;
    humanoidMotionRef.current.isJumping = isAirborne.current;
    humanoidMotionRef.current.isRunning = isSprinting.current;
    humanoidMotionRef.current.steerAngle = steerAngle.current;
    humanoidMotionRef.current.pose = inVehicleRef.current
      ? "driver"
      : isSliding.current
      ? "sliding"
      : isCrouching.current
      ? "crouching"
      : "default";

    if (movementStateRef) {
      const speedRatio = THREE.MathUtils.clamp(currentSpeed / SPEEDS.sprint, 0, 1);
      const targetEyeHeight = inVehicleRef.current
        ? isSliding.current
          ? 1.05
          : isCrouching.current
          ? 1.25
          : EYE_HEIGHTS.vehicle
        : isSliding.current
        ? EYE_HEIGHTS.slide
        : isCrouching.current
        ? EYE_HEIGHTS.crouch
        : EYE_HEIGHTS.stand;

      movementStateRef.current.speed = currentSpeed;
      movementStateRef.current.isSprinting = isSprinting.current;
      movementStateRef.current.isCrouching = isCrouching.current;
      movementStateRef.current.isSliding = isSliding.current;
      movementStateRef.current.isAirborne = isAirborne.current;
      movementStateRef.current.speedRatio = speedRatio;
      movementStateRef.current.inVehicle = inVehicleRef.current;
      movementStateRef.current.eyeHeight = THREE.MathUtils.lerp(
        movementStateRef.current.eyeHeight,
        targetEyeHeight,
        12.0 * delta
      );
    }
  }, -1);

  const currentSpeed = Math.sqrt(
    velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z
  );

  return (
    <group ref={groupRef} position={startPosition}>
      {inVehicle ? (
        <>
          {/* ===== CYBERPUNK CAR (Vehicle Mode) ===== */}
          <Car
            isMoving={currentSpeed > 0.2}
            isSprinting={isSprinting.current}
            isCrouching={isCrouching.current}
            isSliding={isSliding.current}
            isAirborne={isAirborne.current}
            steerAngle={steerAngle.current}
            hornTrigger={hornTrigger.current}
            speedRatio={currentSpeed / SPEEDS.sprint}
          />

          {/* ===== REALISTIC HUMANOID DRIVER (seated in car) ===== */}
          <group position={[0, -0.42, 0.05]} rotation={[0, Math.PI, 0]}>
            <HumanoidFigure
              config={{
                name: "Driver",
                female: false,
                skinTone: "#d4a57b",
                eyeColor: "#1e3a5f",
                lipColor: "#b5746a",
                hairColor: "#1c1917",
                shirtColor: "#1e293b",
                pantsColor: "#0f172a",
                shoeColor: "#0a0a0a",
                hasTie: true,
                tieColor: "#00d9ff",
                hasWatch: true,
              }}
               isDriver
               motionStateRef={humanoidMotionRef}
            />
          </group>
        </>
      ) : (
        /* ===== REALISTIC HUMANOID CHARACTER (On-Foot Mode, GTA Style) ===== */
        <group ref={onFootRef} position={[0, -0.3, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidFigure
            config={{
              name: "Keith",
              female: false,
              skinTone: "#8d5e3c",
              hairColor: "#111827",
              shirtColor: "#6366f1",
              pantsColor: "#3f3f46",
              shoeColor: "#09090b",
              hasTie: true,
              tieColor: "#2563eb",
              hasWatch: true,
            }}
             motionStateRef={humanoidMotionRef}
          />
        </group>
      )}
    </group>
  );
}
