"use client";

import { type MutableRefObject, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { HumanoidAnimator, type HumanoidMotionState, type HumanoidPose } from "@/lib/humanoidMotion";

export type { HumanoidMotionState } from "@/lib/humanoidMotion";

export interface HumanoidConfig {
  name: string;
  female: boolean;
  skinTone?: string;
  eyeColor?: string;
  lipColor?: string;
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  shoeColor?: string;
  hasTie?: boolean;
  tieColor?: string;
  hasWatch?: boolean;
  hasLanyard?: boolean;
  modelUrl?: string;
}


export interface HumanoidFigureProps {
  config: HumanoidConfig;
  isSeated?: boolean;
  isWalking?: boolean;
  isRunning?: boolean;
  isCrouching?: boolean;
  isSliding?: boolean;
  isCrawling?: boolean;
  isDancing?: boolean;
  isSinging?: boolean;
  isJumping?: boolean;
  isFlinching?: boolean;
  isDriver?: boolean;
  steerAngle?: number;
  lookAtTarget?: THREE.Vector3 | null;
  lookAtTargetRef?: MutableRefObject<THREE.Vector3>;
  walkSpeed?: number;
  motionStateRef?: MutableRefObject<HumanoidMotionState>;
}

const DEFAULT_MODELS: Record<string, string> = {
  Keith: "/models/male_avatar.glb", Carl: "/models/male_avatar.glb",
  Charo: "/models/Aurora.glb", Chella: "/models/Celeste.glb",
  Natalie: "/models/Lyra.glb", Driver: "/models/male_avatar.glb",
};

export function HumanoidFigure(props: HumanoidFigureProps) {
  const { config, motionStateRef, lookAtTargetRef } = props;
  const modelPath = config.modelUrl || DEFAULT_MODELS[config.name] ||
    (config.female ? "/models/Aurora.glb" : "/models/male_avatar.glb");
  const { scene } = useGLTF(modelPath);
  const rig = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return { scene: clone, animator: new HumanoidAnimator(clone) };
  }, [scene]);

  useFrame((_, delta) => {
    // Legacy props remain supported. Live callers never read movement refs during render.
    const pose: HumanoidPose = props.isDriver ? "driver" : props.isSeated ? "seated"
      : props.isCrawling ? "crawling" : props.isSliding ? "sliding"
      : props.isCrouching ? "crouching" : props.isFlinching ? "flinching"
      : props.isDancing ? "dancing" : props.isSinging ? "singing" : "default";
    const motion = motionStateRef?.current ?? {
      speed: (props.isRunning ? 3.5 : props.isWalking ? 1.9 : 0) * (props.walkSpeed ?? 1),
      isGrounded: !props.isJumping,
      verticalVelocity: 0,
      isJumping: !!props.isJumping,
      isRunning: !!props.isRunning,
      pose,
      steerAngle: props.steerAngle,
    };
    rig.animator.update({
      ...motion,
      lookAtTarget: lookAtTargetRef?.current ?? props.lookAtTarget ?? motion.lookAtTarget,
    }, delta);
  });
  return <primitive object={rig.scene} />;
}

useGLTF.preload("/models/male_avatar.glb");
useGLTF.preload("/models/Aurora.glb");
useGLTF.preload("/models/Celeste.glb");
useGLTF.preload("/models/Lyra.glb");
