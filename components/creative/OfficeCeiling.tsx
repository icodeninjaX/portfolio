"use client";

const CEILING_COLOR = "#e8e4dc";

export function OfficeCeiling() {
  return (
    <group>
      {/* Main ceiling slab */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} side={2} />
      </mesh>

      {/* Ceiling tile grid lines — running along X */}
      {[-12, -8, -4, 0, 4, 8, 12].map((z) => (
        <mesh key={`x${z}`} position={[0, 4.99, z]}>
          <boxGeometry args={[30, 0.005, 0.03]} />
          <meshStandardMaterial color="#d4cfc6" roughness={0.8} />
        </mesh>
      ))}

      {/* Ceiling tile grid lines — running along Z */}
      {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
        <mesh key={`z${x}`} position={[x, 4.99, 0]}>
          <boxGeometry args={[0.03, 0.005, 30]} />
          <meshStandardMaterial color="#d4cfc6" roughness={0.8} />
        </mesh>
      ))}

      {/* Perimeter crown molding */}
      {/* Front (z=15) */}
      <mesh position={[0, 4.92, 14.9]}>
        <boxGeometry args={[30, 0.16, 0.1]} />
        <meshStandardMaterial color="#d4cfc6" roughness={0.7} />
      </mesh>
      {/* Back (z=-15) */}
      <mesh position={[0, 4.92, -14.9]}>
        <boxGeometry args={[30, 0.16, 0.1]} />
        <meshStandardMaterial color="#d4cfc6" roughness={0.7} />
      </mesh>
      {/* Left (x=-15) */}
      <mesh position={[-14.9, 4.92, 0]}>
        <boxGeometry args={[0.1, 0.16, 30]} />
        <meshStandardMaterial color="#d4cfc6" roughness={0.7} />
      </mesh>
      {/* Right (x=+15) */}
      <mesh position={[14.9, 4.92, 0]}>
        <boxGeometry args={[0.1, 0.16, 30]} />
        <meshStandardMaterial color="#d4cfc6" roughness={0.7} />
      </mesh>
    </group>
  );
}
