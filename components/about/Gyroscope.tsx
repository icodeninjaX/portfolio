"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, sceneTime } from "@/components/stack/activity";
import { stackScroll } from "@/components/stack/scrollStore";
import { busMaterial } from "@/components/stack/Spine";
import { alignment, chapterProgress, focus, launch } from "./activity";
import { useEngraving } from "./engraving";
import { JOURNEY_COUNT, RINGS, type RingSpec } from "./stages";

const DIM = new THREE.Color("#5a5047");
const HOT = new THREE.Color(AMBER).multiplyScalar(3.2);

/** Bright in the closing top-down shot, where the whole gyroscope is on show. */
function ringActivity(spec: RingSpec) {
  return Math.max(focus(spec.stage), focus("core") * 0.75, focus("trajectory") * 0.45);
}

function Bearing({ axis, from, to }: { axis: "x" | "z"; from: number; to: number }) {
  const len = to - from;
  const mid = from + len / 2;
  const rot: [number, number, number] = axis === "x" ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0];
  return (
    <>
      {[-1, 1].map((side) => {
        const pos: [number, number, number] = axis === "x" ? [side * mid, 0, 0] : [0, 0, side * mid];
        const cap: [number, number, number] = axis === "x" ? [side * to, 0, 0] : [0, 0, side * to];
        return (
          <group key={side}>
            <mesh position={pos} rotation={rot}>
              <cylinderGeometry args={[0.022, 0.022, len, 12]} />
              <meshStandardMaterial color="#4a433b" metalness={1} roughness={0.25} />
            </mesh>
            <mesh position={cap} rotation={rot}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 20]} />
              <meshStandardMaterial color="#2a2622" metalness={1} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function JourneyBeads({ radius }: { radius: number }) {
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const lit = useRef<number[]>(Array.from({ length: JOURNEY_COUNT }, () => 0));
  const span = (Math.PI * 2 * (JOURNEY_COUNT - 1)) / JOURNEY_COUNT;

  useFrame((_, delta) => {
    // Beads light one by one as the reader moves through the Orbit chapter.
    const p = chapterProgress("orbit") * JOURNEY_COUNT * 1.05;
    const boost = Math.max(focus("core"), focus("trajectory"));
    mats.current.forEach((m, i) => {
      if (!m) return;
      const target = Math.max(p > i + 0.15 ? 1 : 0, boost);
      lit.current[i] = THREE.MathUtils.damp(lit.current[i], target, 6, delta);
      m.color.copy(DIM).lerp(HOT, lit.current[i]);
    });
  });

  return (
    <>
      {Array.from({ length: JOURNEY_COUNT }, (_, i) => {
        const a = (i / Math.max(1, JOURNEY_COUNT - 1)) * span;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0, 0, radius + 0.035]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshBasicMaterial
                ref={(m) => {
                  if (m) mats.current[i] = m;
                }}
                color={DIM}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function Ring({ spec, index, parentRadius, children }: {
  spec: RingSpec;
  index: number;
  parentRadius?: number;
  children?: React.ReactNode;
}) {
  const pivot = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const face = useRef<THREE.MeshStandardMaterial>(null);
  const rim = useRef<THREE.MeshBasicMaterial>(null);
  const activity = useRef(0);
  const texture = useEngraving(spec.engraving, spec.radius, spec.band);
  const { radius, band } = spec;

  useFrame((state, delta) => {
    activity.current = THREE.MathUtils.damp(activity.current, ringActivity(spec), 3, delta);
    const t = sceneTime(state.clock.elapsedTime);
    const chaos = 1 - alignment();
    const a = activity.current;
    if (pivot.current) {
      const tumble = spec.tilt + Math.sin(t * 0.21 + index * 1.7) * spec.wobble;
      pivot.current.rotation[spec.axis] = chaos * tumble;
    }
    if (spinner.current) {
      // Scroll winds the rings too, so every flick of the wheel turns the gyroscope.
      const dir = Math.sign(spec.spin);
      spinner.current.rotation.y = t * spec.spin + dir * stackScroll.stage * 0.55;
    }
    if (face.current) face.current.emissiveIntensity = 0.1 + a * 1.1;
    if (rim.current) rim.current.opacity = 0.12 + a * 0.88;
  });

  return (
    <group ref={pivot}>
      {parentRadius && <Bearing axis={spec.axis} from={radius + 0.02} to={parentRadius - 0.02} />}
      <group ref={spinner}>
        {/* keyed so the material compiles with its maps once the engraving is drawn */}
        <mesh key={texture ? "engraved" : "blank"}>
          <cylinderGeometry args={[radius, radius, band, 256, 1, true]} />
          <meshStandardMaterial
            ref={face}
            color={texture ? "#ffffff" : "#15120f"}
            map={texture}
            emissiveMap={texture}
            emissive={AMBER}
            emissiveIntensity={0.12}
            metalness={0.75}
            roughness={0.34}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[radius - 0.012, radius - 0.012, band, 192, 1, true]} />
          <meshStandardMaterial color="#0f0e0d" metalness={0.9} roughness={0.3} side={THREE.BackSide} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0, (s * band) / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius - 0.006, 0.011, 8, 256]} />
            <meshStandardMaterial color="#6b6056" metalness={1} roughness={0.2} />
          </mesh>
        ))}
        <mesh position={[0, band / 2 + 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.004, 0.004, 6, 256]} />
          <meshBasicMaterial ref={rim} color={HOT} transparent opacity={0.2} toneMapped={false} />
        </mesh>
        {spec.stage === "orbit" && <JourneyBeads radius={radius} />}
      </group>
      {children}
    </group>
  );
}

const coreVertex = /* glsl */ `
  varying vec3 vNormal2;
  varying vec3 vPos;
  varying vec3 vView;
  void main() {
    vNormal2 = normalize(normalMatrix * normal);
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// Molten surface: layered value noise drifting over the sphere, hotter at the rim.
const coreFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;
  uniform vec3 uAmber;
  varying vec3 vNormal2;
  varying vec3 vPos;
  varying vec3 vView;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(17.1, 113.7, 71.3))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec3(1.7, -0.4, 0.9);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = vPos * 5.0;
    // Slow convection cells with bright filaments running between them.
    float n = fbm(p + vec3(0.0, uTime * 0.22, uTime * 0.1));
    float cells = fbm(p * 1.6 - vec3(uTime * 0.16, 0.0, uTime * 0.08));
    float veins = 1.0 - smoothstep(0.0, 0.06, abs(cells - 0.5));
    float facing = max(dot(vNormal2, vView), 0.0);
    float fres = pow(1.0 - facing, 2.5);
    // Values stay near 1 on purpose: AgX pushes anything hotter toward white.
    // Dark crust, hot cracks: the cracks bloom, the crust keeps the colour rich.
    vec3 crust = vec3(0.16, 0.012, 0.0);
    vec3 molten = vec3(0.7, 0.1, 0.0);
    vec3 col = mix(crust, molten, smoothstep(0.35, 0.8, n));
    col += vec3(1.0, 0.42, 0.04) * veins * (1.1 + n * 1.4);
    // Limb glow like a photosphere seen through haze.
    col += vec3(1.0, 0.3, 0.0) * fres * 1.3;
    gl_FragColor = vec4(col * uHeat, 1.0);
  }
`;

function haloTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,170,90,0.9)");
  g.addColorStop(0.25, "rgba(255,122,26,0.35)");
  g.addColorStop(0.6, "rgba(255,90,10,0.06)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function heat() {
  return 1 + focus("drive") * 0.25 + focus("core") * 0.3 + launch() * 0.15;
}

/** Uniforms of a mesh's ShaderMaterial, reached through its ref. */
function uniformsOf(mesh: THREE.Mesh | null) {
  return mesh ? (mesh.material as THREE.ShaderMaterial).uniforms : null;
}

export function Core() {
  const sphere = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const level = useRef(1);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uHeat: { value: 1 },
          uAmber: { value: new THREE.Color(AMBER) },
        },
      }),
    [],
  );
  const haloMap = useMemo(() => haloTexture(), []);

  useFrame((state, delta) => {
    const t = sceneTime(state.clock.elapsedTime);
    level.current = THREE.MathUtils.damp(level.current, heat(), 3, delta);
    const breathe = 1 + Math.sin(t * 1.6) * 0.06;
    const u = uniformsOf(sphere.current);
    if (u) {
      u.uTime.value = t;
      u.uHeat.value = level.current * breathe;
    }
    if (halo.current) {
      // Shrinks as the camera closes in so it never floods the frame.
      const near = THREE.MathUtils.clamp((state.camera.position.length() - 2) / 8, 0.35, 1);
      const s = (2 + level.current * 0.6 + Math.sin(t * 1.6) * 0.08) * near;
      halo.current.scale.set(s, s, 1);
      (halo.current.material as THREE.SpriteMaterial).opacity = (0.3 + level.current * 0.15) * near;
    }
  });

  return (
    <group>
      <mesh ref={sphere} material={material}>
        <sphereGeometry args={[0.42, 96, 96]} />
      </mesh>
      <sprite ref={halo}>
        <spriteMaterial map={haloMap} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </group>
  );
}

/** Shockwaves off the core: each one is a feature shipping. */
export function Pulses() {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Mesh[]>([]);
  const COUNT = 3;

  useFrame((state) => {
    if (!group.current) return;
    group.current.quaternion.copy(state.camera.quaternion);
    const t = sceneTime(state.clock.elapsedTime);
    const drive = Math.max(focus("drive"), focus("core") * 0.5);
    rings.current.forEach((m, i) => {
      if (!m) return;
      const f = stackScroll.reducedMotion ? 0.35 + i * 0.2 : (t * 0.32 + i / COUNT) % 1;
      const s = 0.6 + f * 5.2;
      m.scale.set(s, s, s);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - f) * (1 - f) * (0.03 + drive * 0.75);
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) rings.current[i] = m;
          }}
        >
          <ringGeometry args={[0.985, 1, 160]} />
          <meshBasicMaterial
            color={HOT}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const MOON_ORBIT = 5.6;

/** Off-hours: the things that orbit the work. */
export function Moons() {
  const orbit = useRef<THREE.Group>(null);
  const edges = useRef<THREE.LineBasicMaterial[]>([]);
  const trail = useRef<THREE.LineBasicMaterial>(null);
  const moons = useRef<THREE.Group[]>([]);
  const activity = useRef(0);

  const shapes = useMemo(
    () => [
      new THREE.IcosahedronGeometry(0.22, 0),
      new THREE.OctahedronGeometry(0.22, 0),
      new THREE.DodecahedronGeometry(0.2, 0),
      new THREE.TorusKnotGeometry(0.12, 0.04, 64, 8),
    ],
    [],
  );
  const lines = useMemo(() => shapes.map((g) => new THREE.EdgesGeometry(g, 20)), [shapes]);
  const path = useMemo(() => {
    const pts = Array.from({ length: 257 }, (_, i) => {
      const a = (i / 256) * Math.PI * 2;
      return new THREE.Vector3(Math.sin(a) * MOON_ORBIT, 0, Math.cos(a) * MOON_ORBIT);
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state, delta) => {
    activity.current = THREE.MathUtils.damp(activity.current, Math.max(focus("offhours"), focus("core") * 0.5), 3, delta);
    const a = activity.current;
    const t = sceneTime(state.clock.elapsedTime);
    if (orbit.current) orbit.current.rotation.y = t * 0.08 + stackScroll.stage * 0.35;
    moons.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.set(t * 0.4 + i, t * 0.55 + i * 2, 0);
      m.scale.setScalar(0.6 + a * 0.6);
    });
    edges.current.forEach((m) => {
      if (m) m.opacity = 0.06 + a * 0.94;
    });
    if (trail.current) trail.current.opacity = 0.05 + a * 0.2;
  });

  return (
    <group rotation={[0.32, 0, -0.12]}>
      <lineLoop geometry={path}>
        <lineBasicMaterial ref={trail} color={AMBER} transparent opacity={0.08} toneMapped={false} />
      </lineLoop>
      <group ref={orbit}>
        {shapes.map((g, i) => {
          const ang = (i / shapes.length) * Math.PI * 2;
          return (
            <group
              key={i}
              position={[Math.sin(ang) * MOON_ORBIT, 0, Math.cos(ang) * MOON_ORBIT]}
              ref={(m) => {
                if (m) moons.current[i] = m;
              }}
            >
              <mesh geometry={g}>
                <meshStandardMaterial color="#141210" metalness={0.9} roughness={0.3} />
              </mesh>
              <lineSegments geometry={lines[i]}>
                <lineBasicMaterial
                  ref={(m) => {
                    if (m) edges.current[i] = m;
                  }}
                  color={HOT}
                  transparent
                  opacity={0.3}
                  toneMapped={false}
                />
              </lineSegments>
            </group>
          );
        })}
      </group>
    </group>
  );
}

const BEAM_HEIGHT = 18;

/** Trajectory: once the rings align, the signal fires up toward the stack. */
export function Beam() {
  const group = useRef<THREE.Group>(null);
  const beams = useRef<THREE.Mesh[]>([]);
  const core = useMemo(() => busMaterial(0.5, 4, 0.14, 3.2), []);
  const glow = useMemo(() => busMaterial(0.5, 4, 0.03, 0.45), []);

  useFrame((state) => {
    const t = sceneTime(state.clock.elapsedTime);
    beams.current.forEach((m) => {
      const u = uniformsOf(m);
      if (u) u.uTime.value = t;
    });
    const l = launch();
    if (group.current) {
      group.current.scale.y = Math.max(0.0001, l);
      group.current.visible = l > 0.001;
    }
  });

  return (
    <group ref={group} position={[0, 0.45, 0]}>
      {[
        { material: core, radius: 0.018, segments: 8 },
        { material: glow, radius: 0.04, segments: 12 },
      ].map((b, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) beams.current[i] = m;
          }}
          position={[0, BEAM_HEIGHT / 2, 0]}
          material={b.material}
        >
          <cylinderGeometry args={[b.radius, b.radius, BEAM_HEIGHT, b.segments, 1, true]} />
        </mesh>
      ))}
    </group>
  );
}

export function Gyroscope() {
  const root = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!root.current) return;
    // The whole instrument leans toward the pointer while it's still loose.
    const give = stackScroll.reducedMotion ? 0 : 1 - alignment() * 0.8;
    const k = 1 - Math.exp(-delta * 2);
    root.current.rotation.x += (-stackScroll.pointer.y * 0.12 * give - root.current.rotation.x) * k;
    root.current.rotation.z += (-stackScroll.pointer.x * 0.1 * give - root.current.rotation.z) * k;
  });

  // Nest outer → inner so each gimbal carries the ones inside it.
  const nested = RINGS.reduceRight<React.ReactNode>(
    (inner, spec, i) => (
      <Ring key={spec.stage} spec={spec} index={i} parentRadius={RINGS[i - 1]?.radius}>
        {inner}
      </Ring>
    ),
    null,
  );

  return (
    <group ref={root}>
      {nested}
      <Core />
      <Pulses />
    </group>
  );
}
