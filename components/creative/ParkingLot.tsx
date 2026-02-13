"use client";

import { Car } from "./Car";

const PARKED_CARS = [
  { x: -4, z: 0, rotY: Math.PI / 2 + 0.05 },
  { x: 0, z: 0, rotY: Math.PI / 2 - 0.03 },
  { x: 4, z: 0, rotY: Math.PI / 2 + 0.08 },
];

export function ParkingLot() {
  return (
    <group position={[0, -0.04, 25]}>
      {/* Asphalt surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>

      {/* Parking line stripes */}
      {[-6, -2, 2, 6].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, 0]}>
          <planeGeometry args={[0.1, 4]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
        </mesh>
      ))}

      {/* Front edge stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -2]}>
        <planeGeometry args={[14, 0.1]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
      </mesh>
      {/* Back edge stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2]}>
        <planeGeometry args={[14, 0.1]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
      </mesh>

      {/* Parked cars */}
      {PARKED_CARS.map(({ x, z, rotY }, i) => (
        <group key={i} position={[x, 0.3, z]} rotation={[0, rotY, 0]}>
          <Car isMoving={false} />
        </group>
      ))}
    </group>
  );
}
