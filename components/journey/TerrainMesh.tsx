"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, sceneTime } from "@/components/stack/activity";
import { travelled } from "./activity";
import { heightAt, ROUTE } from "./terrain";

const vertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// A relief map cut from dark stone: laser-etched contour lines every half
// metre, heavier index contours every 2.5 m, and a survey lamp that follows
// the traveller up the road and wakes the lines around it.
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uDensity;
  uniform vec3 uAmber;
  uniform vec3 uBg;
  uniform vec3 uLamp;
  uniform float uSweep;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vDepth;

  float line(float v, float width) {
    float d = abs(fract(v - 0.5) - 0.5) / max(fwidth(v), 1e-5);
    return 1.0 - min(d / width, 1.0);
  }

  void main() {
    vec3 n = normalize(vNormalW);
    // Warm key from above-right, cool fill from behind: same rig as the other pages.
    float key = max(dot(n, normalize(vec3(0.5, 0.8, 0.35))), 0.0);
    float fill = max(dot(n, normalize(vec3(-0.6, 0.3, -0.5))), 0.0);
    float slope = 1.0 - n.y;
    vec3 stone = vec3(0.011, 0.0095, 0.008);
    vec3 col = stone * (0.3 + key * 1.2) + vec3(0.004, 0.006, 0.009) * fill + vec3(0.006, 0.004, 0.003) * slope;

    float h = vWorld.y;
    float minor = line(h * 2.0, 0.9);
    float major = line(h * 0.4, 1.1);
    float r = length(vWorld.xz);

    float lampD = distance(vWorld, uLamp);
    float lamp = exp(-lampD * lampD * 0.012);
    // A slow scan ring expanding from the lamp, like a surveyor's ping.
    float ring = smoothstep(0.9, 0.0, abs(lampD - fract(uTime * 0.12) * 22.0)) * (1.0 - fract(uTime * 0.12));
    // A radial sweep across the whole map on the overview shot.
    float sweep = uSweep * smoothstep(0.9, 0.0, abs(r - fract(uTime * 0.07) * 48.0));

    float glow = minor * (0.05 + lamp * 0.45) + major * (0.16 + lamp * 0.9) + ring * (minor + major) * 0.35
      + sweep * (minor * 0.3 + major * 0.6);
    col += uAmber * glow;

    float fog = exp(-uDensity * uDensity * vDepth * vDepth);
    gl_FragColor = vec4(mix(uBg, col, fog), 1.0);
  }
`;

const SIZE = 170;

export function Terrain({ segments = 320, sweep }: { segments?: number; sweep: () => number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(SIZE, SIZE, segments, segments);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const half = SIZE / 2;
    for (let i = 0; i < pos.count; i++) {
      // Pull the grid in toward the peak: fine facets on the summit the
      // camera gets close to, coarse ones on the far plains.
      const gx = pos.getX(i);
      const gz = pos.getZ(i);
      const r = Math.hypot(gx, gz);
      const k = r > 0 ? Math.pow(r / half, 0.5) : 1;
      const x = gx * k;
      const z = gz * k;
      pos.setX(i, x);
      pos.setZ(i, z);
      // Cut a shallow bench under the road so the ribbon never sinks into rock.
      pos.setY(i, heightAt(x, z) - 0.04);
    }
    g.computeVertexNormals();
    return g;
  }, [segments]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uDensity: { value: 0.022 },
          uAmber: { value: new THREE.Color(AMBER).multiplyScalar(0.85) },
          uBg: { value: new THREE.Color("#0a0908") },
          uLamp: { value: new THREE.Vector3() },
          uSweep: { value: 0 },
        },
      }),
    [],
  );

  const lamp = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    if (!mesh.current) return;
    const u = (mesh.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = sceneTime(state.clock.elapsedTime);
    ROUTE.getPointAt(THREE.MathUtils.clamp(travelled(), 0, 1), lamp.current);
    (u.uLamp.value as THREE.Vector3).lerp(lamp.current, 1 - Math.exp(-delta * 4));
    u.uSweep.value = THREE.MathUtils.damp(u.uSweep.value, sweep(), 3, delta);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} />;
}
