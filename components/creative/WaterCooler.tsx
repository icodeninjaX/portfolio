"use client";

export function WaterCooler() {
  return (
    <group position={[10.5, 0, 0.7]}>
      {/* White body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.5, 1.1, 0.45]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>

      {/* Blue water bottle on top */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 12]} />
        <meshStandardMaterial
          color="#1e40af"
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Bottle cap */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 12]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Red tap */}
      <mesh position={[-0.1, 0.85, 0.24]}>
        <boxGeometry args={[0.06, 0.08, 0.04]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>
      {/* Blue tap */}
      <mesh position={[0.1, 0.85, 0.24]}>
        <boxGeometry args={[0.06, 0.08, 0.04]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.5} />
      </mesh>

      {/* Drip tray */}
      <mesh position={[0, 0.65, 0.24]}>
        <boxGeometry args={[0.3, 0.02, 0.08]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Green neon status LED */}
      <mesh position={[0.18, 1.0, 0.24]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Base/feet */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.52, 0.04, 0.47]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}
