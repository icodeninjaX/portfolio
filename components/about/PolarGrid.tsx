"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, sceneTime } from "@/components/stack/activity";
import { alignment } from "./activity";

const vertex = /* glsl */ `
  varying vec2 vXZ;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vXZ = world.xz;
    vec4 mvPosition = viewMatrix * world;
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// An instrument's dial laid under the gyroscope: range rings, bearing spokes
// and a sweep that only really wakes up once everything has aligned.
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uAlign;
  uniform vec3 uAmber;
  uniform float uDensity;
  varying vec2 vXZ;
  varying float vDepth;

  float line(float v, float width) {
    // Guard the derivative so a flat spot can't divide 0 by 0 (NaN).
    float d = abs(fract(v - 0.5) - 0.5) / max(fwidth(v), 1e-5);
    return 1.0 - min(d / width, 1.0);
  }

  void main() {
    float r = length(vXZ);
    // atan(0, 0) is undefined; nudge off the exact centre.
    float a = atan(vXZ.y, vXZ.x + 1e-6) / 6.2831853 + 0.5;
    float rings = line(r, 1.0) * 0.55 + line(r * 4.0, 0.8) * 0.12;
    float spokes = line(a * 24.0, 1.0) * smoothstep(1.0, 3.0, r) * 0.35;
    // Radar sweep: a soft leading line with a short afterglow, no hard seam.
    float s = fract(a - uTime * 0.05);
    float sweep = (smoothstep(0.985, 0.999, s) * (1.0 - smoothstep(0.999, 1.0, s)) + exp(-(1.0 - s) * 60.0) * 0.4)
      * smoothstep(0.5, 2.0, r);
    float wave = smoothstep(0.1, 0.0, abs(fract(r * 0.12 - uTime * 0.15) - 0.5) - 0.44);
    float fade = exp(-r * 0.13) * smoothstep(0.4, 1.2, r);
    float glow = (rings + spokes) * (0.08 + uAlign * 0.32) + sweep * (0.1 + uAlign * 0.3) + wave * uAlign * 0.12;
    // Additive, so fog has to fade the light out rather than mix in fog colour.
    float fog = exp(-uDensity * uDensity * vDepth * vDepth);
    gl_FragColor = vec4(uAmber * glow * fade * fog, 1.0);
  }
`;

export function PolarGrid({ y = -4.2 }: { y?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uDensity: { value: 0.034 },
          uAlign: { value: 0 },
          uAmber: { value: new THREE.Color(AMBER).multiplyScalar(0.9) },
        },
      }),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const u = (mesh.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = sceneTime(state.clock.elapsedTime);
    u.uAlign.value = alignment();
  });

  return (
    <mesh ref={mesh} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
      <planeGeometry args={[70, 70]} />
    </mesh>
  );
}
