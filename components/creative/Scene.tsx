"use client";

import { useRef, useEffect, ReactNode, MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SceneProps {
  children: ReactNode;
  charPosRef: MutableRefObject<THREE.Vector3>;
  yawRef: MutableRefObject<number>;
  pitchRef: MutableRefObject<number>;
  handOffsetRef: MutableRefObject<{ x: number; y: number }>;
  talkingTo: string | null;
  talkingToPosition: THREE.Vector3 | null;
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
}: SceneProps) {
  const { gl } = useThree();
  const transitionRef = useRef(0); // 0 = FPS, 1 = conversation
  const fpsCamQuat = useRef(new THREE.Quaternion());

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
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [gl.domElement, yawRef, pitchRef, handOffsetRef]);

  useFrame(({ camera }, delta) => {
    // Decay hand offset
    handOffsetRef.current.x *= 0.95;
    handOffsetRef.current.y *= 0.95;

    // Compute conversation camera target ONCE when conversation starts
    if (talkingTo && !prevTalkingTo.current && talkingToPosition) {
      const npcPos = talkingToPosition;
      // Eye height: npcPos.y includes seated offset (-0.42) or 0 for standing
      const eyeHeight = npcPos.y + 1.65;

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
        eyeHeight,
        npcPos.z + dir.z * 1.2
      );

      const lookTarget = new THREE.Vector3(npcPos.x, eyeHeight, npcPos.z);
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

    // FPS camera
    const fpsPos = new THREE.Vector3(
      charPosRef.current.x,
      charPosRef.current.y + 2.2,
      charPosRef.current.z
    );
    const fpsEuler = new THREE.Euler(pitchRef.current, yawRef.current, 0, "YXZ");
    fpsCamQuat.current.setFromEuler(fpsEuler);

    if (t > 0.999) {
      // Fully in conversation — lock to target
      camera.position.copy(convTargetPos.current);
      camera.quaternion.copy(convTargetQuat.current);
    } else if (t < 0.001) {
      // Pure FPS mode
      camera.position.copy(fpsPos);
      camera.quaternion.copy(fpsCamQuat.current);
    } else {
      // Lerp between FPS and cached conversation target
      camera.position.lerpVectors(fpsPos, convTargetPos.current, t);
      camera.quaternion.slerpQuaternions(fpsCamQuat.current, convTargetQuat.current, t);
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
