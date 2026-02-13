"use client";

export function OfficeFloor() {
  return (
    <>
      {/* Interior wood floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#c4a882" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Exterior ground / grass extending beyond the office */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.9} metalness={0} />
      </mesh>
    </>
  );
}
