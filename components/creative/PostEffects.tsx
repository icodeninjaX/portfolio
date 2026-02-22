"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  ChromaticAberration,
  N8AO,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Vector2 } from "three";

const chromaticOffset = /* @__PURE__ */ new Vector2(0.0005, 0.0005);

export function PostEffects() {
  return (
    <>
      <N8AO
        halfRes
        aoRadius={2.0}
        distanceFalloff={1.0}
        intensity={1.5}
        quality="low"
        aoSamples={6}
        denoiseSamples={4}
        denoiseRadius={12}
        color="#1a1a2e"
        depthAwareUpsampling
      />

      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.55}
          blendFunction={BlendFunction.NORMAL}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation
          modulationOffset={0.4}
        />
      </EffectComposer>
    </>
  );
}
