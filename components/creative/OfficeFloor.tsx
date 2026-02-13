"use client";

import { useMemo } from "react";

const TILE_SIZE = 1.5;
const GROUT_WIDTH = 0.04;
const FLOOR_EXTENT = 15; // -15 to +15
const TILE_STEP = TILE_SIZE + GROUT_WIDTH;

const TILE_COLORS = ["#e8e0d4", "#e2dace", "#ded5c8", "#e5ddd2"];

export function OfficeFloor() {
  const tiles = useMemo(() => {
    const result: { x: number; z: number; color: string }[] = [];
    let idx = 0;
    for (let x = -FLOOR_EXTENT + TILE_SIZE / 2; x < FLOOR_EXTENT; x += TILE_STEP) {
      for (let z = -FLOOR_EXTENT + TILE_SIZE / 2; z < FLOOR_EXTENT; z += TILE_STEP) {
        result.push({
          x,
          z,
          color: TILE_COLORS[idx % TILE_COLORS.length],
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
            roughness={0.6}
            metalness={0.05}
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
