"use client";

export function PrinterCopier() {
  return (
    <group position={[-12, 0, -12]}>
      {/* Paper tray base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.0, 0.3, 0.7]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.6} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.1, 0.5, 0.75]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Scanner lid (slightly tilted open) */}
      <mesh position={[0, 0.84, -0.05]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.75]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0.35, 0.72, 0.38]}>
        <boxGeometry args={[0.3, 0.12, 0.02]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      {/* Cyan neon display */}
      <mesh position={[0.35, 0.72, 0.395]}>
        <planeGeometry args={[0.22, 0.06]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Output tray (front) */}
      <mesh position={[0, 0.35, 0.45]}>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Green status LED */}
      <mesh position={[-0.4, 0.75, 0.385]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Paper sheets sticking out (output tray) */}
      <mesh position={[0, 0.37, 0.5]}>
        <boxGeometry args={[0.5, 0.01, 0.15]} />
        <meshStandardMaterial color="#fafafa" roughness={0.8} />
      </mesh>
    </group>
  );
}
