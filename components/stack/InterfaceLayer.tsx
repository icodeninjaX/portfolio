"use client";

import { RoundedBox, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, layerActivity } from "./activity";
import { LAYER_Y, PANEL_RING, PROJECT_COUNT, PROJECT_STAGE_OFFSET, panelAngleDeg } from "./stages";
import { stackScroll } from "./scrollStore";

export type PanelProject = { slug: string; images: string[] };

const PANEL_W = 3.7;
const PANEL_ASPECT = 1.95;
const PANEL_H = PANEL_W / PANEL_ASPECT;
const HOLD_SECONDS = 3.2;

const vertex = /* glsl */ `
  varying vec2 vUv;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform float uAspectA;
  uniform float uAspectB;
  uniform float uMix;
  uniform float uActive;
  uniform float uTime;
  uniform vec3 uAmber;
  varying vec2 vUv;
  #include <fog_pars_fragment>

  vec2 cover(vec2 uv, float texAspect) {
    float plane = ${PANEL_ASPECT.toFixed(3)};
    vec2 s = texAspect > plane ? vec2(plane / texAspect, 1.0) : vec2(1.0, texAspect / plane);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec3 a = texture2D(uA, cover(vUv, uAspectA)).rgb;
    vec3 b = texture2D(uB, cover(vUv, uAspectB)).rgb;
    // Wipe transition instead of a plain dissolve — reads like a screen refresh.
    float edge = uMix * 1.2 - 0.1;
    float w = 1.0 - smoothstep(edge - 0.08, edge, vUv.x + (vUv.y - 0.5) * 0.15);
    vec3 col = mix(b, a, w);
    float seam = (1.0 - smoothstep(0.0, 0.02, abs(vUv.x + (vUv.y - 0.5) * 0.15 - edge))) * step(0.01, uMix) * step(uMix, 0.99);

    float grey = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(grey) * vec3(1.0, 0.92, 0.82) * 0.45, col, uActive);
    float scan = 0.96 + 0.04 * sin(vUv.y * 900.0 + uTime * 4.0);
    vec2 v = vUv - 0.5;
    float vig = 1.0 - dot(v, v) * 0.9;
    col *= scan * vig * (0.35 + uActive * 0.75);
    col += uAmber * seam * 2.0;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

type PanelProps = {
  index: number;
  textures: THREE.Texture[];
};

function aspectOf(t: THREE.Texture) {
  const img = t.image as { width?: number; height?: number } | undefined;
  return img?.width && img?.height ? img.width / img.height : PANEL_ASPECT;
}

function Panel({ index, textures }: PanelProps) {
  const group = useRef<THREE.Group>(null);
  const bar = useRef<THREE.Mesh>(null);
  const state = useRef({ cur: 0, mix: 1, timer: 0, active: 0 });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        fog: true,
        uniforms: {
          ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
          uA: { value: textures[0] },
          uB: { value: textures[0] },
          uAspectA: { value: aspectOf(textures[0]) },
          uAspectB: { value: aspectOf(textures[0]) },
          uMix: { value: 1 },
          uActive: { value: 0 },
          uTime: { value: 0 },
          uAmber: { value: new THREE.Color(AMBER) },
        },
      }),
    [textures],
  );

  const angle = (panelAngleDeg(index) * Math.PI) / 180;
  const base = useMemo(
    () => new THREE.Vector3(Math.sin(angle) * PANEL_RING.radius, PANEL_RING.y, Math.cos(angle) * PANEL_RING.radius),
    [angle],
  );

  useFrame((frame, delta) => {
    const s = state.current;
    const own = 1 - Math.min(1, Math.abs(stackScroll.stage - (PROJECT_STAGE_OFFSET + index + 0.5)) / 0.9);
    // On the wide "every layer" shot all screens light up together.
    const focus = Math.max(own, stackScroll.stage > PROJECT_STAGE_OFFSET + PROJECT_COUNT ? layerActivity("interface") : 0);
    s.active = THREE.MathUtils.damp(s.active, focus, 4, delta);
    const u = material.uniforms;
    u.uActive.value = s.active;
    u.uTime.value = frame.clock.elapsedTime;

    if (textures.length > 1 && s.active > 0.6 && !stackScroll.reducedMotion) {
      s.timer += delta;
      if (s.timer > HOLD_SECONDS) {
        s.timer = 0;
        const next = (s.cur + 1) % textures.length;
        u.uB.value = textures[s.cur];
        u.uAspectB.value = aspectOf(textures[s.cur]);
        u.uA.value = textures[next];
        u.uAspectA.value = aspectOf(textures[next]);
        s.cur = next;
        s.mix = 0;
      }
    }
    s.mix = Math.min(1, s.mix + delta / 0.9);
    u.uMix.value = s.mix;

    if (group.current) {
      const t = frame.clock.elapsedTime;
      group.current.position.set(base.x, base.y + Math.sin(t * 0.8 + index) * 0.06 + s.active * 0.15, base.z);
    }
    if (bar.current) bar.current.scale.x = 0.001 + s.active;
  });

  return (
    <group ref={group} rotation={[0, angle, 0]}>
      <RoundedBox args={[PANEL_W + 0.14, PANEL_H + 0.14, 0.08]} radius={0.04} smoothness={3} position={[0, 0, -0.045]}>
        <meshStandardMaterial color="#0f0e0d" metalness={0.9} roughness={0.3} />
      </RoundedBox>
      <mesh material={material}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
      </mesh>
      <mesh ref={bar} position={[0, -PANEL_H / 2 - 0.16, 0]}>
        <planeGeometry args={[PANEL_W, 0.018]} />
        <meshBasicMaterial color={new THREE.Color(AMBER).multiplyScalar(2.5)} toneMapped={false} />
      </mesh>
      {/* mast down to the platform */}
      <mesh position={[0, -(PANEL_RING.y - LAYER_Y.interface) / 2 - PANEL_H / 4, -0.06]}>
        <boxGeometry args={[0.03, PANEL_RING.y - LAYER_Y.interface - PANEL_H / 2, 0.03]} />
        <meshStandardMaterial color="#2a2622" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function InterfaceLayer({ projects }: { projects: PanelProject[] }) {
  const flat = useMemo(() => projects.flatMap((p) => p.images), [projects]);
  const loaded = useTexture(flat);
  const grouped = useMemo(() => {
    const list = Array.isArray(loaded) ? loaded : [loaded];
    list.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
    const starts = projects.map((_, i) => projects.slice(0, i).reduce((n, p) => n + p.images.length, 0));
    return projects.map((p, i) => list.slice(starts[i], starts[i] + p.images.length));
  }, [loaded, projects]);

  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ring.current && !stackScroll.reducedMotion) ring.current.rotation.z += delta * 0.05;
  });

  const y = LAYER_Y.interface;
  return (
    <group>
      {/* circular deck */}
      <mesh position={[0, y, 0]}>
        <cylinderGeometry args={[7.4, 7.4, 0.1, 96, 1]} />
        <meshStandardMaterial color="#0d0c0b" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh ref={ring} position={[0, y + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.18, 7.22, 128, 1, 0, Math.PI * 1.7]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0, y + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.215, 96]} />
        <meshBasicMaterial color="#d9cbb8" transparent opacity={0.25} />
      </mesh>
      {grouped.map((tex, i) => (tex.length ? <Panel key={projects[i].slug} index={i} textures={tex} /> : null))}
    </group>
  );
}
