"use client";

import { Text } from "@react-three/drei";

const XMETA_ORANGE = "#FF6B00";

const POWERBANKS = [
  { label: "X-10K", width: 0.55, height: 0.25, depth: 0.12, color: "#1a1a1a", x: -1.2 },
  { label: "X-20K Pro", width: 0.7, height: 0.3, depth: 0.14, color: "#2a2a2a", x: 0 },
  { label: "X-5K Mini", width: 0.4, height: 0.2, depth: 0.1, color: "#1a1a1a", x: 1.2 },
];

function Powerbank({
  position,
  width,
  height,
  depth,
  color,
  label,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  label: string;
}) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Orange accent strip on top */}
      <mesh position={[0, height + 0.005, 0]}>
        <boxGeometry args={[width * 0.6, 0.01, depth * 0.3]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* USB-C port indicator */}
      <mesh position={[width / 2 + 0.001, height / 2, 0]}>
        <boxGeometry args={[0.01, 0.04, 0.06]} />
        <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* LED indicator dots */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[-width * 0.25 + i * (width * 0.17), height + 0.006, depth * 0.2]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial
            color={i < 3 ? "#00ff88" : "#333333"}
            emissive={i < 3 ? "#00ff88" : "#000000"}
            emissiveIntensity={i < 3 ? 1.2 : 0}
          />
        </mesh>
      ))}
      {/* Label */}
      <Text
        position={[0, height / 2, depth / 2 + 0.01]}
        fontSize={0.06}
        color={XMETA_ORANGE}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {label}
      </Text>
    </group>
  );
}

export function ProductShowcase() {
  return (
    <group position={[8.5, 2.2, 14.75]} rotation={[0, Math.PI, 0]}>
      {/* Shelf bracket — back plate */}
      <mesh position={[0, -0.15, -0.06]}>
        <boxGeometry args={[3.4, 0.6, 0.04]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Shelf surface */}
      <mesh position={[0, -0.02, 0.12]}>
        <boxGeometry args={[3.4, 0.04, 0.35]} />
        <meshStandardMaterial color="#3e3e3e" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Orange shelf edge strip */}
      <mesh position={[0, -0.04, 0.29]}>
        <boxGeometry args={[3.4, 0.02, 0.01]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* L-bracket supports */}
      {[-1.4, 1.4].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.2, -0.03]}>
            <boxGeometry args={[0.06, 0.4, 0.04]} />
            <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[x, -0.39, 0.12]}>
            <boxGeometry args={[0.06, 0.04, 0.3]} />
            <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Powerbank models */}
      {POWERBANKS.map((pb) => (
        <Powerbank
          key={pb.label}
          position={[pb.x, 0, 0.12]}
          width={pb.width}
          height={pb.height}
          depth={pb.depth}
          color={pb.color}
          label={pb.label}
        />
      ))}

      {/* "Product Line" header */}
      <Text
        position={[0, 0.22, 0.01]}
        fontSize={0.1}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Product Line
      </Text>
    </group>
  );
}
