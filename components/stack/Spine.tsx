"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, layerActivity, mulberry32, PLATE_SIZE } from "./activity";
import { LAYER_Y } from "./stages";
import { stackScroll } from "./scrollStore";

// One signal, born in the silicon, climbing every layer to the top.
const busVertex = /* glsl */ `
  varying float vY;
  void main() {
    vY = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const busFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uBase;
  uniform vec3 uColor;
  varying float vY;
  void main() {
    float p = fract(vY * uDensity - uTime * uSpeed);
    float pulse = pow(smoothstep(0.75, 1.0, p), 3.0);
    float a = uBase + pulse;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export function busMaterial(speed: number, density: number, base: number, intensity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: busVertex,
    fragmentShader: busFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uDensity: { value: density },
      uBase: { value: base },
      uColor: { value: new THREE.Color(AMBER).multiplyScalar(intensity) },
    },
  });
}

export function Spine() {
  const core = useMemo(() => busMaterial(0.35, 3, 0.12, 3), []);
  const rails = useMemo(() => busMaterial(0.22, 5, 0.04, 1.6), []);
  const height = LAYER_Y.crown - 0.2;
  const railH = LAYER_Y.interface;
  const c = PLATE_SIZE / 2 - 0.22;

  useFrame((state) => {
    const t = stackScroll.reducedMotion ? 0 : state.clock.elapsedTime;
    core.uniforms.uTime.value = t;
    rails.uniforms.uTime.value = t;
  });

  return (
    <group>
      <mesh position={[0, height / 2 + 0.3, 0]} material={core}>
        <cylinderGeometry args={[0.018, 0.018, height, 8, 1, true]} />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * c, railH / 2, sz * c]} material={rails}>
            <cylinderGeometry args={[0.012, 0.012, railH, 6, 1, true]} />
          </mesh>
        )),
      )}
    </group>
  );
}

export function Crown() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const activity = useRef(0);

  useFrame((state, delta) => {
    activity.current = THREE.MathUtils.damp(activity.current, layerActivity("crown"), 2.5, delta);
    const t = stackScroll.reducedMotion ? 0 : state.clock.elapsedTime;
    if (outer.current) outer.current.rotation.set(Math.PI / 2 + Math.sin(t * 0.3) * 0.08, 0, t * 0.12);
    if (inner.current) inner.current.rotation.set(Math.PI / 2 + Math.cos(t * 0.4) * 0.12, t * 0.1, -t * 0.2);
    if (core.current) core.current.color.set(AMBER).multiplyScalar(1.5 + activity.current * 3 + Math.sin(t * 2) * 0.4);
  });

  const y = LAYER_Y.crown;
  return (
    <group position={[0, y, 0]}>
      <mesh ref={outer}>
        <torusGeometry args={[3.2, 0.018, 12, 200]} />
        <meshBasicMaterial color={new THREE.Color(AMBER).multiplyScalar(2)} toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[2.1, 0.012, 12, 160]} />
        <meshBasicMaterial color="#e9dccb" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial ref={core} color={AMBER} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Dust({
  count = 900,
  radius = [2, 18],
  height = [-3, 31],
}: {
  count?: number;
  radius?: [number, number];
  height?: [number, number];
}) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const rand = mulberry32(1997);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius[0] + rand() * (radius[1] - radius[0]);
      const a = rand() * Math.PI * 2;
      arr[i * 3] = Math.sin(a) * r;
      arr[i * 3 + 1] = height[0] + rand() * (height[1] - height[0]);
      arr[i * 3 + 2] = Math.cos(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, radius[0], radius[1], height[0], height[1]]);

  useFrame((_, delta) => {
    if (points.current && !stackScroll.reducedMotion) points.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.035} color="#e8c9a4" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}
