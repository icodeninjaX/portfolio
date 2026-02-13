"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function PostEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}
