"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { stackScroll } from "@/components/stack/scrollStore";
import { Dust } from "@/components/stack/Spine";
import { ledgerFocus } from "./activity";
import { JourneyRig } from "./JourneyRig";
import { Route } from "./Route";
import { Terrain } from "./Terrain";
import { SummitBeam, Waypoints } from "./Waypoints";

const BG = "#0a0908";

export default function JourneyCanvas() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0 }}
      dpr={[1, mobile ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 34, near: 0.05, far: 160, position: [0, 20, 40] }}
      aria-hidden
    >
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={[BG, 0.022]} />

      <ambientLight intensity={0.12} />
      <directionalLight position={[8, 16, 6]} intensity={1} color="#ffd9b0" />
      <directionalLight position={[-10, 5, -8]} intensity={0.45} color="#7f9bb8" />

      {/* Local lightformers only: no HDRI fetched from a CDN. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffd2a6" position={[0, 10, 6]} scale={[14, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#9fb4cc" position={[-8, 4, -4]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#ff8a3d" position={[0, -2, 0]} scale={4} />
      </Environment>

      <JourneyRig />

      <Terrain segments={mobile ? 200 : 320} sweep={ledgerFocus} />
      <Route segments={mobile ? 900 : 1400} />
      <Waypoints />
      <SummitBeam />
      <Dust count={mobile ? 500 : 1000} radius={[4, 42]} height={[1, 22]} />

      <EffectComposer multisampling={mobile ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.72} />
        <ToneMapping mode={ToneMappingMode.AGX} />
        <Vignette offset={0.25} darkness={0.75} />
        <Noise opacity={stackScroll.reducedMotion ? 0 : 0.035} premultiply />
      </EffectComposer>
    </Canvas>
  );
}
