"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense } from "react";
import { CameraRig } from "./CameraRig";
import { DataLayer } from "./DataLayer";
import { InterfaceLayer, type PanelProject } from "./InterfaceLayer";
import { NetworkLayer } from "./NetworkLayer";
import { SiliconLayer } from "./SiliconLayer";
import { Crown, Dust, Spine } from "./Spine";
import { stackScroll } from "./scrollStore";

const BG = "#0a0908";

export default function StackCanvas({ projects }: { projects: PanelProject[] }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0 }}
      dpr={[1, mobile ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 34, near: 0.1, far: 120, position: [8, 3, 8] }}
      aria-hidden
    >
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={[BG, 0.028]} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[6, 20, 8]} intensity={1.1} color="#ffd9b0" />
      <directionalLight position={[-10, 6, -6]} intensity={0.5} color="#7f9bb8" />

      {/* Local lightformers only: no HDRI fetched from a CDN. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffd2a6" position={[0, 10, 6]} scale={[14, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#9fb4cc" position={[-8, 4, -4]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ff8a3d" position={[6, 2, -6]} scale={3} />
      </Environment>

      <CameraRig />

      <Suspense fallback={null}>
        <SiliconLayer />
        <InterfaceLayer projects={projects} />
      </Suspense>
      <NetworkLayer />
      <DataLayer />
      <Spine />
      <Crown />
      <Dust count={mobile ? 450 : 900} />

      <EffectComposer multisampling={mobile ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.7} />
        <ToneMapping mode={ToneMappingMode.AGX} />
        <Vignette offset={0.25} darkness={0.75} />
        <Noise opacity={stackScroll.reducedMotion ? 0 : 0.035} premultiply />
      </EffectComposer>
    </Canvas>
  );
}
