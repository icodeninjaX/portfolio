"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, layerActivity, sceneTime } from "./activity";
import { Plate } from "./Plate";
import { LAYER_Y } from "./stages";

const GRID = 16;
const PITCH = 0.38;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uActive;
  varying float vTop;
  varying float vHeight;
  varying float vScan;
  varying vec3 vNormal2;
  #include <fog_pars_vertex>

  float wave(vec2 p, float t) {
    return sin(p.x * 1.3 + t * 0.9) * 0.5 + sin(p.y * 1.7 - t * 0.7) * 0.35 + sin((p.x + p.y) * 0.8 + t * 1.3) * 0.25;
  }

  void main() {
    vec3 origin = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float n = wave(origin.xz, uTime) * 0.5 + 0.5;
    float h = 0.06 + pow(n, 2.6) * (0.4 + uActive * 1.1);

    // A query sweeping row by row across the table.
    float row = floor(mod(uTime * 2.5, ${GRID}.0));
    float myRow = floor((origin.z / ${PITCH} + ${GRID / 2}.0));
    vScan = 1.0 - smoothstep(0.0, 2.5, abs(myRow - row));
    h += vScan * 0.35 * uActive;

    vec3 p = position;
    p.y = (p.y + 0.5) * h;
    vTop = p.y / h;
    vHeight = h;
    vNormal2 = normal;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uAmber;
  uniform float uActive;
  varying float vTop;
  varying float vHeight;
  varying float vScan;
  varying vec3 vNormal2;
  #include <fog_pars_fragment>

  void main() {
    float light = 0.35 + 0.65 * max(dot(vNormal2, normalize(vec3(0.4, 1.0, 0.3))), 0.0);
    vec3 col = vec3(0.055, 0.05, 0.047) * light;
    float cap = step(0.98, vTop);
    float rim = smoothstep(0.7, 1.0, vTop) * 0.12;
    float hot = smoothstep(0.55, 1.4, vHeight);
    col += uAmber * (cap * (0.08 + hot * 1.1 + vScan * 1.3) + rim * hot) * (0.25 + uActive * 0.9);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export function DataLayer() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const edgeRef = useRef<THREE.LineBasicMaterial>(null);
  const activity = useRef(0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        fog: true,
        uniforms: {
          ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
          uTime: { value: 0 },
          uActive: { value: 0 },
          uAmber: { value: new THREE.Color(AMBER).multiplyScalar(1.8) },
        },
      }),
    [],
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    let i = 0;
    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        dummy.position.set((x - GRID / 2 + 0.5) * PITCH, 0, (z - GRID / 2 + 0.5) * PITCH);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    activity.current = THREE.MathUtils.damp(activity.current, layerActivity("data"), 3, delta);
    material.uniforms.uTime.value = sceneTime(state.clock.elapsedTime);
    material.uniforms.uActive.value = activity.current;
    if (edgeRef.current) edgeRef.current.opacity = 0.18 + activity.current * 0.6;
  });

  const y = LAYER_Y.data;
  return (
    <group>
      <Plate y={y} edgeRef={edgeRef} />
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, GRID * GRID]}
        position={[0, y + 0.08, 0]}
        material={material}
        frustumCulled={false}
      >
        <boxGeometry args={[0.26, 1, 0.26]} />
      </instancedMesh>
    </group>
  );
}
