"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CAMERA_KEYS, type CameraKey } from "./stages";
import { stackScroll } from "./scrollStore";

const DEG = Math.PI / 180;

// Hold still while the reader is mid-section, travel between sections.
function dwell(f: number) {
  const t = THREE.MathUtils.clamp((f - 0.18) / 0.64, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function sample(stage: number) {
  const t = Math.max(0, stage - 0.5);
  const i = Math.min(Math.floor(t), CAMERA_KEYS.length - 1);
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[Math.min(i + 1, CAMERA_KEYS.length - 1)];
  const f = dwell(t - i);
  const mix = (k: keyof Omit<CameraKey, "layer" | "label">) => a[k] + (b[k] - a[k]) * f;
  return {
    r: mix("r"),
    a: mix("a"),
    y: mix("y"),
    tr: mix("tr"),
    ta: mix("ta"),
    ty: mix("ty"),
    shift: mix("shift"),
  };
}

export function CameraRig() {
  const { camera, size } = useThree();
  const pos = useRef(new THREE.Vector3(8, 2, 8));
  const target = useRef(new THREE.Vector3());
  const shift = useRef(0);
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const first = useRef(true);

  useFrame((state, delta) => {
    const k = sample(stackScroll.stage);
    const mobile = stackScroll.isMobile;
    // Narrow screens need more distance for close-ups; the wide shot already fits.
    const r = k.r * (mobile ? 1 + 0.3 * THREE.MathUtils.clamp((30 - k.r) / 15, 0, 1) : 1);
    const px = stackScroll.reducedMotion ? 0 : stackScroll.pointer.x;
    const py = stackScroll.reducedMotion ? 0 : stackScroll.pointer.y;
    const angle = (k.a + px * 2.5) * DEG;

    desiredPos.current.set(Math.sin(angle) * r, k.y + py * 0.35 + (mobile ? 1 : 0), Math.cos(angle) * r);
    desiredTarget.current.set(Math.sin(k.ta * DEG) * k.tr, k.ty, Math.cos(k.ta * DEG) * k.tr);

    // Critically damped follow; frame-rate independent.
    const damp = first.current || stackScroll.reducedMotion ? 1 : 1 - Math.exp(-delta * 3.2);
    first.current = false;
    pos.current.lerp(desiredPos.current, damp);
    target.current.lerp(desiredTarget.current, damp);
    shift.current += ((mobile ? 0 : k.shift) - shift.current) * damp;

    camera.position.copy(pos.current);
    // Subtle handheld breathing keeps static frames alive.
    if (!stackScroll.reducedMotion) {
      const t = state.clock.elapsedTime;
      camera.position.y += Math.sin(t * 0.6) * 0.04;
      camera.position.x += Math.cos(t * 0.45) * 0.03;
    }
    camera.lookAt(target.current);

    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width;
    const h = size.height;
    // Phones: copy docks to the bottom, so lift the scene into the top half.
    cam.setViewOffset(w, h, -shift.current * w * 0.5, mobile ? h * 0.2 : 0, w, h);
    cam.updateProjectionMatrix();
  });

  return null;
}
