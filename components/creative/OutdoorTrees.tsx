"use client";

import { useMemo } from "react";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  trunkColor?: string;
  leafColor?: string;
}

function Tree({ position, scale = 1, trunkColor = "#5c3a1e", leafColor = "#2d6b30" }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      {/* Foliage layers — stacked cones */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 2.2, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[1.1, 1.8, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 5.3, 0]}>
        <coneGeometry args={[0.7, 1.4, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
    </group>
  );
}

function RoundTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 2.4, 8]} />
        <meshStandardMaterial color="#6b4226" roughness={0.9} />
      </mesh>
      {/* Round foliage */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.8, 12, 10]} />
        <meshStandardMaterial color="#3a8c3f" roughness={0.75} />
      </mesh>
      <mesh position={[0.6, 3.0, 0.5]}>
        <sphereGeometry args={[1.2, 10, 8]} />
        <meshStandardMaterial color="#2f7a32" roughness={0.75} />
      </mesh>
      <mesh position={[-0.5, 3.2, -0.4]}>
        <sphereGeometry args={[1.0, 10, 8]} />
        <meshStandardMaterial color="#358538" roughness={0.75} />
      </mesh>
    </group>
  );
}

export function OutdoorTrees() {
  const trees = useMemo(() => {
    const items: { type: "pine" | "round"; pos: [number, number, number]; scale: number }[] = [];

    // Trees around the perimeter of the office (outside +-15 walls)
    // Behind (z < -16)
    for (let i = 0; i < 10; i++) {
      items.push({
        type: i % 2 === 0 ? "pine" : "round",
        pos: [-25 + i * 5 + (Math.random() - 0.5) * 2, 0, -20 - Math.random() * 8],
        scale: 0.8 + Math.random() * 0.6,
      });
    }
    // In front (z > 16)
    for (let i = 0; i < 10; i++) {
      items.push({
        type: i % 3 === 0 ? "round" : "pine",
        pos: [-25 + i * 5 + (Math.random() - 0.5) * 2, 0, 20 + Math.random() * 8],
        scale: 0.8 + Math.random() * 0.6,
      });
    }
    // Left side (x < -16)
    for (let i = 0; i < 8; i++) {
      items.push({
        type: i % 2 === 0 ? "pine" : "round",
        pos: [-20 - Math.random() * 8, 0, -18 + i * 5 + (Math.random() - 0.5) * 2],
        scale: 0.8 + Math.random() * 0.6,
      });
    }
    // Right side (x > 16)
    for (let i = 0; i < 8; i++) {
      items.push({
        type: i % 3 === 0 ? "round" : "pine",
        pos: [20 + Math.random() * 8, 0, -18 + i * 5 + (Math.random() - 0.5) * 2],
        scale: 0.8 + Math.random() * 0.6,
      });
    }
    return items;
  }, []);

  return (
    <>
      {trees.map((t, i) =>
        t.type === "pine" ? (
          <Tree key={i} position={t.pos} scale={t.scale} />
        ) : (
          <RoundTree key={i} position={t.pos} scale={t.scale} />
        )
      )}
    </>
  );
}
