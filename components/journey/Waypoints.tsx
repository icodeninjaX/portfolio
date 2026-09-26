"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, sceneTime } from "@/components/stack/activity";
import { stackScroll } from "@/components/stack/scrollStore";
import { busMaterial } from "@/components/stack/Spine";
import { ledgerFocus, summitFocus, travelled, waypointFocus } from "./activity";
import { usePlaque } from "./plaque";
import { summitStop, WAYPOINT_U, WAYPOINTS } from "./stages";
import { elevation, outwardAt, ROUTE, SUMMIT } from "./terrain";

const DIM = new THREE.Color("#4a4038");
const HOT = new THREE.Color(AMBER).multiplyScalar(3.2);
const SLAB: [number, number, number] = [0.34, 1.7, 0.09];
const SHAFT = 7;

/** Bright on the overview shots, where the whole route is on show. */
function overview() {
  return Math.max(ledgerFocus(), summitFocus()) * 0.6;
}

function Monolith({ index }: { index: number }) {
  const u = WAYPOINT_U[index];
  const { base, facing } = useMemo(() => {
    const p = ROUTE.getPointAt(u);
    const out = outwardAt(p);
    // Planted just off the road on the downhill side, facing out to the camera.
    const base = p.clone().addScaledVector(out, 0.32);
    base.y -= 0.06;
    // The summit has its own composed shot; turn the last plaque to meet it.
    if (index === WAYPOINTS.length - 1) {
      const [cx, , cz] = summitStop.pos;
      return { base, facing: Math.atan2(cx - base.x, cz - base.z) };
    }
    return { base, facing: Math.atan2(out.x, out.z) };
  }, [u, index]);
  const texture = usePlaque({
    index: String(index + 1).padStart(2, "0"),
    year: WAYPOINTS[index].year,
    elevation: elevation(u),
  });

  const face = useRef<THREE.MeshStandardMaterial>(null);
  const beacon = useRef<THREE.MeshBasicMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const shaft = useRef<THREE.Mesh>(null);
  const shaftMat = useMemo(() => busMaterial(0.45, 3, 0.08, 1), []);
  const lit = useRef(0);
  const act = useRef(0);

  useFrame((state, delta) => {
    const t = sceneTime(state.clock.elapsedTime);
    // Lights once the trail reaches it and stays lit behind you.
    lit.current = THREE.MathUtils.damp(lit.current, travelled() >= u - 0.004 ? 1 : 0, 5, delta);
    act.current = THREE.MathUtils.damp(act.current, Math.max(waypointFocus(index), overview()), 3, delta);
    const l = lit.current;
    const a = act.current;
    if (face.current) face.current.emissiveIntensity = 0.04 + l * 0.14 + a * 0.4;
    if (beacon.current) {
      const blink = stackScroll.reducedMotion ? 1 : 0.8 + Math.sin(t * 2.2 + index) * 0.2;
      beacon.current.color.copy(DIM).lerp(HOT, l * blink);
    }
    if (ring.current) {
      const f = stackScroll.reducedMotion ? 0.4 : (t * 0.45 + index * 0.13) % 1;
      const s = 0.3 + f * 1.6;
      ring.current.scale.set(s, s, s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - f) * (1 - f) * a * 0.9;
    }
    if (shaft.current) {
      shaft.current.visible = a > 0.01;
      const su = (shaft.current.material as THREE.ShaderMaterial).uniforms;
      su.uTime.value = t;
      (su.uColor.value as THREE.Color).set(AMBER).multiplyScalar(a * 1.4);
    }
  });

  return (
    <group position={base} rotation={[0, facing, 0]}>
      <mesh position={[0, SLAB[1] / 2, 0]}>
        <boxGeometry args={SLAB} />
        <meshStandardMaterial color="#1a1714" metalness={0.9} roughness={0.35} />
      </mesh>
      {/* keyed so the material recompiles with its maps once the plaque is drawn */}
      <mesh key={texture ? "engraved" : "blank"} position={[0, SLAB[1] / 2, SLAB[2] / 2 + 0.001]}>
        <planeGeometry args={[SLAB[0] * 0.92, SLAB[1] * 0.96]} />
        <meshStandardMaterial
          ref={face}
          color={texture ? "#ffffff" : "#15120f"}
          map={texture}
          emissiveMap={texture}
          emissive={AMBER}
          emissiveIntensity={0.12}
          metalness={0.7}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0, SLAB[1] + 0.07, 0]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshBasicMaterial ref={beacon} color={DIM} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.96, 1, 96]} />
        <meshBasicMaterial
          color={HOT}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={shaft} position={[0, SLAB[1] + 0.1 + SHAFT / 2, 0]} material={shaftMat} visible={false}>
        <cylinderGeometry args={[0.012, 0.012, SHAFT, 6, 1, true]} />
      </mesh>
    </group>
  );
}

export function Waypoints() {
  return (
    <>
      {WAYPOINTS.map((_, i) => (
        <Monolith key={i} index={i} />
      ))}
    </>
  );
}

const BEAM = 26;

/** The summit fires a signal straight up once the whole route is walked: the road keeps going. */
export function SummitBeam() {
  const group = useRef<THREE.Group>(null);
  const core = useMemo(() => busMaterial(0.5, 5, 0.16, 3.2), []);
  const glow = useMemo(() => busMaterial(0.5, 5, 0.03, 0.5), []);
  const level = useRef(0);
  const beams = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    const t = sceneTime(state.clock.elapsedTime);
    beams.current.forEach((m) => {
      (m.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    });
    level.current = THREE.MathUtils.damp(level.current, Math.max(ledgerFocus() * 0.8, summitFocus()), 2.5, delta);
    if (group.current) {
      group.current.scale.y = Math.max(0.0001, level.current);
      group.current.visible = level.current > 0.002;
    }
  });

  return (
    <group ref={group} position={[SUMMIT.x, SUMMIT.y + 1.9, SUMMIT.z]}>
      {[
        { material: core, radius: 0.02, segments: 8 },
        { material: glow, radius: 0.06, segments: 12 },
      ].map((b, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) beams.current[i] = m;
          }}
          position={[0, BEAM / 2, 0]}
          material={b.material}
        >
          <cylinderGeometry args={[b.radius, b.radius, BEAM, b.segments, 1, true]} />
        </mesh>
      ))}
    </group>
  );
}
