"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, sceneTime } from "@/components/stack/activity";
import { travelled } from "./activity";
import { ROUTE } from "./terrain";

const vertex = /* glsl */ `
  varying float vU;
  varying float vDepth;
  void main() {
    vU = uv.x;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Behind the traveller the road burns, with signal pulses climbing it;
// ahead it is only surveyed: a faint dashed line waiting to be walked.
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  uniform float uLength;
  uniform float uDensity;
  uniform float uHot;
  uniform float uCold;
  uniform vec3 uColor;
  varying float vU;
  varying float vDepth;
  void main() {
    float m = vU * uLength;
    float walked = 1.0 - smoothstep(uTravel - 0.002, uTravel + 0.002, vU);
    float pulse = pow(smoothstep(0.8, 1.0, fract(m * 0.08 - uTime * 0.55)), 3.0);
    float hot = (0.55 + pulse * 1.6) * walked;
    float dash = step(0.5, fract(m * 1.6)) * (1.0 - walked);
    // The head of the trail flares where the traveller stands.
    float head = exp(-pow((vU - uTravel) * uLength * 0.9, 2.0)) * 2.4;
    float a = (hot + head) * uHot + dash * uCold;
    float fog = exp(-uDensity * uDensity * vDepth * vDepth);
    gl_FragColor = vec4(uColor * a * fog, 1.0);
  }
`;

function routeMaterial(hot: number, cold: number) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uLength: { value: ROUTE.getLength() },
      uDensity: { value: 0.022 },
      uHot: { value: hot },
      uCold: { value: cold },
      uColor: { value: new THREE.Color(AMBER) },
    },
  });
}

export function Route({ segments = 1400 }: { segments?: number }) {
  const core = useMemo(() => routeMaterial(2.6, 0.45), []);
  const halo = useMemo(() => routeMaterial(0.2, 0), []);
  const tubes = useMemo(
    () => [new THREE.TubeGeometry(ROUTE, segments, 0.028, 6), new THREE.TubeGeometry(ROUTE, segments, 0.065, 8)],
    [segments],
  );
  const travel = useRef(0);
  const meshes = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    const t = sceneTime(state.clock.elapsedTime);
    // Eased so the burn front glides rather than snapping to scroll.
    travel.current = THREE.MathUtils.damp(travel.current, travelled(), 4, delta);
    for (const m of meshes.current) {
      const u = (m.material as THREE.ShaderMaterial).uniforms;
      u.uTime.value = t;
      u.uTravel.value = travel.current;
    }
  });

  return (
    <group>
      {[core, halo].map((material, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) meshes.current[i] = m;
          }}
          geometry={tubes[i]}
          material={material}
        />
      ))}
    </group>
  );
}
