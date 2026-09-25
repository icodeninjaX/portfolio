"use client";

import { RoundedBox, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, layerActivity, PLATE_SIZE } from "./activity";
import { Plate } from "./Plate";
import { LAYER_Y } from "./stages";

const vertex = /* glsl */ `
  #include <fog_pars_vertex>
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

// The generated PCB scan doubles as a mask: gold copper is warm (r >> b),
// silkscreen is neutral grey, solder mask is near-black. Signals only travel
// where there's copper.
const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uActive;
  uniform vec3 uAmber;
  varying vec2 vUv;
  #include <fog_pars_fragment>

  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  void main() {
    vec3 tex = texture2D(uMap, vUv).rgb;
    float copper = smoothstep(0.08, 0.28, tex.r - tex.b);
    vec2 c = vUv - 0.5;
    float d = length(c);

    // Rings of charge radiating out of the central die.
    float wave = fract(d * 2.2 - uTime * 0.22);
    float ring = smoothstep(0.0, 0.04, wave) * (1.0 - smoothstep(0.04, 0.22, wave));
    // Sparse packets racing along individual traces.
    vec2 cell = floor(vUv * 48.0);
    float lane = hash(cell);
    float packet = step(0.985, fract(lane * 13.0 + uTime * (0.2 + lane * 0.5)));

    float energy = copper * (0.12 + (ring * 1.8 + packet * 2.5) * (0.35 + uActive));
    vec3 base = tex * (0.32 + 0.25 * uActive);
    vec3 col = base + uAmber * energy;
    // Fade the board into the slab near the edges.
    float edge = smoothstep(0.5, 0.44, max(abs(c.x), abs(c.y)));
    gl_FragColor = vec4(col * edge, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export function SiliconLayer() {
  const map = useTexture("/stack/pcb.webp");
  const dieRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeRef = useRef<THREE.LineBasicMaterial>(null);
  const activity = useRef(0);

  const material = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      fog: true,
      uniforms: {
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
        uMap: { value: map },
        uTime: { value: 0 },
        uActive: { value: 0 },
        uAmber: { value: new THREE.Color(AMBER).multiplyScalar(1.6) },
      },
    });
  }, [map]);

  useFrame((state, delta) => {
    activity.current = THREE.MathUtils.damp(activity.current, layerActivity("silicon"), 3, delta);
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    material.uniforms.uActive.value = activity.current;
    if (dieRef.current) dieRef.current.emissiveIntensity = 0.6 + activity.current * 2.2 + Math.sin(t * 2.4) * 0.25;
    if (edgeRef.current) edgeRef.current.opacity = 0.18 + activity.current * 0.6;
  });

  const y = LAYER_Y.silicon;
  return (
    <group>
      <Plate y={y} edgeRef={edgeRef} />
      <mesh position={[0, y + 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
        <planeGeometry args={[PLATE_SIZE - 0.1, PLATE_SIZE - 0.1]} />
      </mesh>
      {/* the processor everything grows out of */}
      <group position={[0, y + 0.25, 0]}>
        <RoundedBox args={[1.5, 0.26, 1.5]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color="#141210" metalness={0.9} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0.132, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.72, 0.72]} />
          <meshStandardMaterial ref={dieRef} color="#1a1410" emissive={AMBER} emissiveIntensity={1} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
