"use client";

import { useMemo } from "react";

const TILE_SIZE = 1.5;
const GROUT_WIDTH = 0.04;
const FLOOR_EXTENT = 15; // -15 to +15
const TILE_STEP = TILE_SIZE + GROUT_WIDTH;

const TILE_VARIANTS = [
  { color: "#e8e0d4", roughness: 0.45, metalness: 0.05 },
  { color: "#e2dace", roughness: 0.55, metalness: 0.03 },
  { color: "#ded5c8", roughness: 0.40, metalness: 0.06 },
  { color: "#e5ddd2", roughness: 0.50, metalness: 0.04 },
  { color: "#dfd7cb", roughness: 0.48, metalness: 0.05 },
  { color: "#e6ded3", roughness: 0.42, metalness: 0.04 },
];

export function OfficeFloor() {
  const tiles = useMemo(() => {
    const result: { x: number; z: number; color: string; roughness: number; metalness: number }[] = [];
    let idx = 0;
    for (let x = -FLOOR_EXTENT + TILE_SIZE / 2; x < FLOOR_EXTENT; x += TILE_STEP) {
      for (let z = -FLOOR_EXTENT + TILE_SIZE / 2; z < FLOOR_EXTENT; z += TILE_STEP) {
        const variant = TILE_VARIANTS[idx % TILE_VARIANTS.length];
        result.push({
          x,
          z,
          color: variant.color,
          roughness: variant.roughness,
          metalness: variant.metalness,
        });
        idx++;
      }
    }
    return result;
  }, []);

  return (
    <>
      {/* Grout base layer (dark lines visible between tiles) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#b0a898" roughness={0.95} />
      </mesh>

      {/* Individual tiles */}
      {tiles.map((tile, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[tile.x, -0.01, tile.z]}
          receiveShadow
        >
          <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
          <meshStandardMaterial
            color={tile.color}
            roughness={tile.roughness}
            metalness={tile.metalness}
          />
        </mesh>
      ))}

      {/* Exterior ground / grass extending beyond the office */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.9} metalness={0} />
      </mesh>
    </>
  );
}
