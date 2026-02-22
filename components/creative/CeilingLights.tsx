"use client";

const LIGHT_POSITIONS: [number, number, number][] = [
  [-4, 4.95, -6],
  [-4, 4.95, 0],
  [-4, 4.95, 6],
  [4, 4.95, -6],
  [4, 4.95, 0],
  [4, 4.95, 6],
];

function Fixture({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Housing */}
      <mesh>
        <boxGeometry args={[1.6, 0.08, 0.4]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Tube 1 */}
      <mesh position={[0, -0.06, -0.08]}>
        <boxGeometry args={[1.4, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#fff8f0"
          emissive="#fff8f0"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* Tube 2 */}
      <mesh position={[0, -0.06, 0.08]}>
        <boxGeometry args={[1.4, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#fff8f0"
          emissive="#fff8f0"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* Actual point light casting downward */}
      <pointLight
        position={[0, -0.15, 0]}
        intensity={0.6}
        color="#fff5e6"
        distance={8}
        decay={2}
      />
    </group>
  );
}

export function CeilingLights() {
  return (
    <group>
      {LIGHT_POSITIONS.map((pos, i) => (
        <Fixture key={i} position={pos} />
      ))}
    </group>
  );
}
