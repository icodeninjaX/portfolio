"use client";

import { useState, useRef, useEffect, ReactNode, MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MovementState } from "./Character";

interface SceneProps {
  children: ReactNode;
  charPosRef: MutableRefObject<THREE.Vector3>;
  yawRef: MutableRefObject<number>;
  pitchRef: MutableRefObject<number>;
  handOffsetRef: MutableRefObject<{ x: number; y: number }>;
  talkingTo: string | null;
  talkingToPosition: THREE.Vector3 | null;
  movementStateRef?: MutableRefObject<MovementState>;
  cameraMode?: "fps" | "tps";
  onCameraModeChange?: (mode: "fps" | "tps") => void;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function Scene({
  children,
  charPosRef,
  yawRef,
  pitchRef,
  handOffsetRef,
  talkingTo,
  talkingToPosition,
  movementStateRef,
  cameraMode,
  onCameraModeChange,
}: SceneProps) {
  const { gl } = useThree();
  const [internalCameraMode, setInternalCameraMode] = useState<"fps" | "tps">("fps");
  const activeCameraMode = cameraMode ?? internalCameraMode;

  const transitionRef = useRef(0); // 0 = FPS/TPS, 1 = conversation
  const fpsCamQuat = useRef(new THREE.Quaternion());

  // Camera head-bob and roll
  const headBobTimer = useRef(0);
  const rollRef = useRef(0);

  // Cached conversation camera target — computed once when conversation starts
  const convTargetPos = useRef(new THREE.Vector3());
  const convTargetQuat = useRef(new THREE.Quaternion());
  const prevTalkingTo = useRef<string | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      yawRef.current -= e.movementX * 0.002;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - e.movementY * 0.002,
        -Math.PI * (80 / 180),
        Math.PI * (80 / 180)
      );
      // Update hand offset
      handOffsetRef.current.x = THREE.MathUtils.clamp(
        handOffsetRef.current.x + e.movementX * 0.001,
        -1,
        1
      );
      handOffsetRef.current.y = THREE.MathUtils.clamp(
        handOffsetRef.current.y + e.movementY * 0.001,
        -1,
        1
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "v") {
        const nextMode = activeCameraMode === "fps" ? "tps" : "fps";
        if (onCameraModeChange) {
          onCameraModeChange(nextMode);
        } else {
          setInternalCameraMode(nextMode);
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gl.domElement, yawRef, pitchRef, handOffsetRef, activeCameraMode, onCameraModeChange]);

  useFrame(({ camera }, delta) => {
    // Decay hand offset
    handOffsetRef.current.x *= 0.95;
    handOffsetRef.current.y *= 0.95;

    // Movement state values
    const moveState = movementStateRef?.current;
    const speed = moveState?.speed ?? 0;
    const isSprinting = moveState?.isSprinting ?? false;
    const isSliding = moveState?.isSliding ?? false;
    const isAirborne = moveState?.isAirborne ?? false;
    const eyeHeight = moveState?.eyeHeight ?? 2.2;

    // Head bob calculation
    const bobRate = isSprinting ? 14 : speed > 0.5 ? 9 : 2.5;
    headBobTimer.current += delta * bobRate;

    let bobY = 0;
    let bobX = 0;
    if (!isAirborne && !talkingTo) {
      const ampY = isSprinting ? 0.055 : isSliding ? 0.02 : speed > 0.5 ? 0.035 : 0.008;
      const ampX = isSprinting ? 0.03 : isSliding ? 0.015 : speed > 0.5 ? 0.018 : 0.004;
      bobY = Math.sin(headBobTimer.current) * ampY;
      bobX = Math.cos(headBobTimer.current * 0.5) * ampX;
    }

    // Camera banking / roll on strafe
    const targetRoll = -handOffsetRef.current.x * 0.08;
    rollRef.current = THREE.MathUtils.lerp(rollRef.current, targetRoll, 8.0 * delta);

    // Dynamic FOV expansion when sprinting or sliding
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isSliding ? 57 : isSprinting ? 55 : 50;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 5.0 * delta);
      camera.updateProjectionMatrix();
    }

    // Compute conversation camera target ONCE when conversation starts
    if (talkingTo && !prevTalkingTo.current && talkingToPosition) {
      const npcPos = talkingToPosition;
      // Eye height: npcPos.y includes seated offset (-0.42) or 0 for standing
      const convEyeHeight = npcPos.y + 1.65;

      const dir = new THREE.Vector3(
        charPosRef.current.x - npcPos.x,
        0,
        charPosRef.current.z - npcPos.z
      );

      // If player is extremely close, fall back to a direction from yaw
      if (dir.length() < 0.1) {
        dir.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
      }
      dir.normalize();

      convTargetPos.current.set(
        npcPos.x + dir.x * 1.2,
        convEyeHeight,
        npcPos.z + dir.z * 1.2
      );

      const lookTarget = new THREE.Vector3(npcPos.x, convEyeHeight, npcPos.z);
      const tempCam = new THREE.PerspectiveCamera();
      tempCam.position.copy(convTargetPos.current);
      tempCam.lookAt(lookTarget);
      convTargetQuat.current.copy(tempCam.quaternion);
    }
    prevTalkingTo.current = talkingTo;

    // Transition progress
    const targetTransition = talkingTo ? 1 : 0;
    const transitionSpeed = talkingTo ? 2.0 : 3.0; // ~0.5s in, ~0.33s out
    const step = transitionSpeed * delta;
    if (transitionRef.current < targetTransition) {
      transitionRef.current = Math.min(transitionRef.current + step, targetTransition);
    } else if (transitionRef.current > targetTransition) {
      transitionRef.current = Math.max(transitionRef.current - step, targetTransition);
    }
    const t = smoothstep(transitionRef.current);

    // FPS camera position & rotation with head bob and roll
    const yaw = yawRef.current;
    const rightDirX = Math.cos(yaw);
    const rightDirZ = -Math.sin(yaw);

    const fpsPos = new THREE.Vector3(
      charPosRef.current.x + rightDirX * bobX,
      charPosRef.current.y + eyeHeight + bobY,
      charPosRef.current.z + rightDirZ * bobX
    );
    const fpsEuler = new THREE.Euler(pitchRef.current, yawRef.current, rollRef.current, "YXZ");
    fpsCamQuat.current.setFromEuler(fpsEuler);

    // TPS (Third-Person GTA camera)
    const isVehicle = moveState?.inVehicle ?? false;
    const isCrouching = moveState?.isCrouching ?? false;
    const isSlidingMove = moveState?.isSliding ?? false;

    const camDist = isVehicle ? 4.2 : isSlidingMove ? 3.4 : isSprinting ? 3.2 : 2.8;
    const camHeight = isVehicle ? 2.0 : isCrouching ? 1.3 : 1.75;

    const tpsPos = new THREE.Vector3(
      charPosRef.current.x + Math.sin(yaw) * camDist + rightDirX * bobX,
      charPosRef.current.y + camHeight + Math.sin(-pitchRef.current) * camDist * 0.75 + bobY,
      charPosRef.current.z + Math.cos(yaw) * camDist + rightDirZ * bobX
    );

    const lookTarget = new THREE.Vector3(
      charPosRef.current.x,
      charPosRef.current.y + (isVehicle ? 1.1 : isCrouching ? 0.9 : 1.35),
      charPosRef.current.z
    );

    const tempCamMat = new THREE.Matrix4();
    tempCamMat.lookAt(tpsPos, lookTarget, new THREE.Vector3(0, 1, 0));
    const tpsCamQuat = new THREE.Quaternion().setFromRotationMatrix(tempCamMat);

    const activePos = activeCameraMode === "tps" ? tpsPos : fpsPos;
    const activeQuat = activeCameraMode === "tps" ? tpsCamQuat : fpsCamQuat.current;

    if (t > 0.999) {
      // Fully in conversation — lock to target
      camera.position.copy(convTargetPos.current);
      camera.quaternion.copy(convTargetQuat.current);
    } else if (t < 0.001) {
      // Normal gameplay mode (smooth camera tracking)
      if (activeCameraMode === "tps") {
        camera.position.lerp(activePos, 14.0 * delta);
        camera.quaternion.slerp(activeQuat, 14.0 * delta);
      } else {
        camera.position.copy(fpsPos);
        camera.quaternion.copy(fpsCamQuat.current);
      }
    } else {
      // Lerp between gameplay camera and cached conversation target
      camera.position.lerpVectors(activePos, convTargetPos.current, t);
      camera.quaternion.slerpQuaternions(activeQuat, convTargetQuat.current, t);
    }
  });

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.5} color="#fff8f0" />

      {/* Sunlight from above-left (through windows) */}
      <directionalLight
        position={[-10, 12, -5]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
      />

      {/* Secondary fill light from right */}
      <directionalLight
        position={[8, 8, 4]}
        intensity={0.4}
        color="#e8f0ff"
      />

      {/* Overhead office light */}
      <pointLight position={[0, 4.5, 0]} intensity={0.8} color="#ffffff" distance={20} />

      {/* Sky hemisphere light */}
      <hemisphereLight
        color="#87ceeb"
        groundColor="#4a7c3f"
        intensity={0.3}
      />

      {children}
    </>
  );
}
