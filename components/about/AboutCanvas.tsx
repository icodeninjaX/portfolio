"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { CameraRig } from "@/components/stack/CameraRig";
import { stackScroll } from "@/components/stack/scrollStore";
import { Dust } from "@/components/stack/Spine";
import { Beam, Gyroscope, Moons } from "./Gyroscope";
import { PolarGrid } from "./PolarGrid";
import { ABOUT_KEYS } from "./stages";

const BG = "#0a0908";

export default function AboutCanvas() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0 }}
      dpr={[1, mobile ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 34, near: 0.05, far: 120, position: [0, 1, 10] }}
      aria-hidden
    >
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={[BG, 0.034]} />

      <ambientLight intensity={0.12} />
      <directionalLight position={[6, 14, 8]} intensity={1} color="#ffd9b0" />
      <directionalLight position={[-10, 4, -6]} intensity={0.45} color="#7f9bb8" />
      {/* the core lights the rings from inside */}
      <pointLight position={[0, 0, 0]} intensity={9} distance={9} decay={1.6} color="#ff8a3d" />

      {/* Local lightformers only: no HDRI fetched from a CDN. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffd2a6" position={[0, 10, 6]} scale={[14, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#9fb4cc" position={[-8, 4, -4]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={2.4} color="#ff8a3d" position={[0, 0, 0]} scale={1.2} />
      </Environment>

      <CameraRig keys={ABOUT_KEYS} />

      <Gyroscope />
      <Moons />
      <Beam />
      <PolarGrid />
      {/* kept clear of the close-up camera paths so no mote sits on the lens */}
      <Dust count={mobile ? 400 : 800} radius={[5.2, 18]} height={[-5, 17]} />

      <EffectComposer multisampling={mobile ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.72} />
        <ToneMapping mode={ToneMappingMode.AGX} />
        <Vignette offset={0.25} darkness={0.75} />
        <Noise opacity={stackScroll.reducedMotion ? 0 : 0.035} premultiply />
      </EffectComposer>
    </Canvas>
  );
}
