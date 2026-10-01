"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { AMBER, PLATE_SIZE } from "./activity";

type PlateProps = {
  y: number;
  size?: number;
  thickness?: number;
  color?: string;
  edgeRef?: React.Ref<THREE.LineBasicMaterial>;
};

/** A machined slab with a hairline glowing edge — the base of every layer. */
export function Plate({ y, size = PLATE_SIZE, thickness = 0.16, color = "#0e0d0c", edgeRef }: PlateProps) {
  const edges = useMemo(() => {
    const h = size / 2 + 0.002;
    const pts = [
      [-h, h], [h, h], [h, h], [h, -h], [h, -h], [-h, -h], [-h, -h], [-h, h],
    ].map(([x, z]) => new THREE.Vector3(x, thickness / 2 + 0.002, z));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [size, thickness]);

  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[size, thickness, size]} radius={0.05} smoothness={3}>
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.38} />
      </RoundedBox>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edgeRef} color={AMBER} transparent opacity={0.25} toneMapped={false} />
      </lineSegments>
      {/* corner bolts */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (size / 2 - 0.22), thickness / 2 + 0.01, sz * (size / 2 - 0.22)]}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
            <meshStandardMaterial color="#3a3530" metalness={1} roughness={0.25} />
          </mesh>
        )),
      )}
    </group>
  );
}
