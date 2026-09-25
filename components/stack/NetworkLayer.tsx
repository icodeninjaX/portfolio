"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AMBER, layerActivity, mulberry32, PLATE_SIZE } from "./activity";
import { Plate } from "./Plate";
import { LAYER_Y } from "./stages";
import { stackScroll } from "./scrollStore";

type Graph = {
  nodes: THREE.Vector3[];
  edges: [number, number][];
  adjacency: number[][];
  hubs: number[];
};

function buildGraph(): Graph {
  const rand = mulberry32(2016);
  const nodes: THREE.Vector3[] = [];
  const grid = 7;
  const span = PLATE_SIZE - 1.2;
  for (let gx = 0; gx < grid; gx++) {
    for (let gz = 0; gz < grid; gz++) {
      if (rand() < 0.18) continue;
      const x = (gx / (grid - 1) - 0.5) * span + (rand() - 0.5) * 0.55;
      const z = (gz / (grid - 1) - 0.5) * span + (rand() - 0.5) * 0.55;
      nodes.push(new THREE.Vector3(x, 0, z));
    }
  }
  const adjacency: number[][] = nodes.map(() => []);
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  nodes.forEach((n, i) => {
    const nearest = nodes
      .map((m, j) => ({ j, d: n.distanceToSquared(m) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      adjacency[i].push(j);
      adjacency[j].push(i);
    }
  });
  // A handful of "branches" — the destinations orders get routed to.
  const hubs = [3, 11, 19, 27, 33].filter((h) => h < nodes.length);
  return { nodes, edges, adjacency, hubs };
}

const PACKETS = 70;

export function NetworkLayer() {
  const graph = useMemo(() => buildGraph(), []);
  const nodeMesh = useRef<THREE.InstancedMesh>(null);
  const packetMesh = useRef<THREE.InstancedMesh>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const edgeRef = useRef<THREE.LineBasicMaterial>(null);
  const hubRings = useRef<THREE.Group>(null);
  const activity = useRef(0);

  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    graph.edges.forEach(([a, b]) => pts.push(graph.nodes[a], graph.nodes[b]));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [graph]);

  const packets = useMemo(() => {
    const rand = mulberry32(62997);
    return Array.from({ length: PACKETS }, () => {
      const from = Math.floor(rand() * graph.nodes.length);
      const nbrs = graph.adjacency[from];
      return { from, to: nbrs[Math.floor(rand() * nbrs.length)] ?? from, t: rand(), speed: 0.5 + rand() * 0.9, rand };
    });
  }, [graph]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    activity.current = THREE.MathUtils.damp(activity.current, layerActivity("network"), 3, delta);
    const act = activity.current;
    const t = state.clock.elapsedTime;
    const dt = stackScroll.reducedMotion ? 0 : Math.min(delta, 0.05);

    if (lineMat.current) lineMat.current.opacity = 0.12 + act * 0.35;
    if (edgeRef.current) edgeRef.current.opacity = 0.18 + act * 0.6;

    if (nodeMesh.current && !nodeMesh.current.userData.ready) {
      graph.nodes.forEach((n, i) => {
        const hub = graph.hubs.includes(i);
        dummy.position.set(n.x, 0.1, n.z);
        dummy.scale.setScalar(hub ? 1.7 : 1);
        dummy.updateMatrix();
        nodeMesh.current!.setMatrixAt(i, dummy.matrix);
      });
      nodeMesh.current.instanceMatrix.needsUpdate = true;
      nodeMesh.current.userData.ready = true;
    }

    const pm = packetMesh.current;
    if (pm) {
      const speedBoost = 0.4 + act * 1.2;
      packets.forEach((p, i) => {
        p.t += dt * p.speed * speedBoost;
        if (p.t >= 1) {
          // Random walk: keep hopping from the node we just reached.
          p.t -= 1;
          const nbrs = graph.adjacency[p.to];
          const next = nbrs[Math.floor(p.rand() * nbrs.length)];
          p.from = p.to;
          p.to = next === undefined ? p.from : next;
        }
        const a = graph.nodes[p.from];
        const b = graph.nodes[p.to];
        dummy.position.lerpVectors(a, b, p.t);
        dummy.position.y = 0.16 + Math.sin(p.t * Math.PI) * 0.12;
        dummy.scale.setScalar(0.7 + act * 0.4);
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      });
      pm.instanceMatrix.needsUpdate = true;
    }

    if (hubRings.current) {
      hubRings.current.children.forEach((ring, i) => {
        const phase = (t * 0.6 + i * 0.37) % 1;
        ring.scale.setScalar(0.3 + phase * 1.6);
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - phase) * (0.2 + act * 0.7);
      });
    }
  });

  const y = LAYER_Y.network;
  return (
    <group>
      <Plate y={y} color="#0c0c0c" thickness={0.12} edgeRef={edgeRef} />
      <group position={[0, y + 0.06, 0]}>
        <lineSegments geometry={lineGeo} position={[0, 0.1, 0]}>
          <lineBasicMaterial ref={lineMat} color="#c9b8a4" transparent opacity={0.2} />
        </lineSegments>
        <instancedMesh ref={nodeMesh} args={[undefined, undefined, graph.nodes.length]}>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
          <meshStandardMaterial color="#d8cfc4" metalness={0.6} roughness={0.3} emissive="#6b3a18" emissiveIntensity={0.4} />
        </instancedMesh>
        <instancedMesh ref={packetMesh} args={[undefined, undefined, PACKETS]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshBasicMaterial color={new THREE.Color(AMBER).multiplyScalar(1.8)} toneMapped={false} />
        </instancedMesh>
        <group ref={hubRings}>
          {graph.hubs.map((h) => (
            <mesh key={h} position={[graph.nodes[h].x, 0.12, graph.nodes[h].z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.28, 0.31, 48]} />
              <meshBasicMaterial color={AMBER} transparent opacity={0.5} toneMapped={false} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
