"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { stackScroll } from "@/components/stack/scrollStore";
import { keyTravel, segment } from "./activity";
import type { JourneyKey } from "./stages";
import { heightAt, outwardAt, ROUTE, tangentAt } from "./terrain";

const UP = new THREE.Vector3(0, 1, 0);
const p = new THREE.Vector3();
const tan = new THREE.Vector3();
const out = new THREE.Vector3();
const offset = new THREE.Vector3();

type Pose = { pos: THREE.Vector3; target: THREE.Vector3 };

/**
 * Where a key puts the camera when the traveller is at road position `u`.
 * Route shots ride along with the traveller, so moving between two of them
 * follows the road around the mountain instead of cutting through it.
 */
function poseOf(k: JourneyKey, u: number, into: Pose) {
  if (k.kind === "free") {
    into.pos.set(...k.pos);
    into.target.set(...k.target);
    return into;
  }
  ROUTE.getPointAt(THREE.MathUtils.clamp(u, 0, 1), p);
  tangentAt(u, tan);
  outwardAt(p, out);
  into.pos
    .copy(p)
    .addScaledVector(tan, -k.back)
    .addScaledVector(out, k.side)
    .addScaledVector(UP, k.lift);
  into.target.copy(p).addScaledVector(UP, k.look).addScaledVector(tan, 0.6);
  return into;
}

const A: Pose = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
const B: Pose = { pos: new THREE.Vector3(), target: new THREE.Vector3() };

/** Scroll-driven camera for the Journey page. Same feel as the shared CameraRig. */
export function JourneyRig() {
  const pos = useRef(new THREE.Vector3(0, 20, 40));
  const target = useRef(new THREE.Vector3());
  const shift = useRef(0);
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const first = useRef(true);

  useFrame((state, delta) => {
    const { camera, size } = state;
    const { a, b, f } = segment();
    const ua = keyTravel(a);
    const u = ua + (keyTravel(b) - ua) * f;
    poseOf(a, u, A);
    poseOf(b, u, B);
    const mobile = stackScroll.isMobile;

    const dp = desiredPos.current.lerpVectors(A.pos, B.pos, f);
    desiredTarget.current.lerpVectors(A.target, B.target, f);
    // Swooping into or out of a wide shot arcs up and over the terrain.
    if (a.kind === "free" || b.kind === "free") dp.y += Math.sin(Math.PI * f) * 4;

    // Pointer parallax: swing a little around the subject.
    const px = stackScroll.reducedMotion ? 0 : stackScroll.pointer.x;
    const py = stackScroll.reducedMotion ? 0 : stackScroll.pointer.y;
    offset.subVectors(dp, desiredTarget.current);
    // Phones are narrow: pull back so the subject still fits above the copy.
    if (mobile) offset.multiplyScalar(1.3);
    offset.applyAxisAngle(UP, px * 0.045);
    dp.copy(desiredTarget.current).add(offset);
    dp.y += py * 0.3;
    // Never inside a hillside.
    dp.y = Math.max(dp.y, heightAt(dp.x, dp.z) + 0.7);

    const damp = first.current || stackScroll.reducedMotion ? 1 : 1 - Math.exp(-delta * 3.2);
    first.current = false;
    pos.current.lerp(dp, damp);
    target.current.lerp(desiredTarget.current, damp);
    const k = a.shift + (b.shift - a.shift) * f;
    shift.current += ((mobile ? 0 : k) - shift.current) * damp;

    camera.position.copy(pos.current);
    if (!stackScroll.reducedMotion) {
      const t = state.clock.elapsedTime;
      camera.position.y += Math.sin(t * 0.6) * 0.04;
      camera.position.x += Math.cos(t * 0.45) * 0.03;
    }
    camera.lookAt(target.current);

    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width;
    const h = size.height;
    cam.setViewOffset(w, h, -shift.current * w * 0.5, mobile ? h * 0.2 : 0, w, h);
    cam.updateProjectionMatrix();
  });

  return null;
}
