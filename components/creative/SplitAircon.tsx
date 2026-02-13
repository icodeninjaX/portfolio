"use client";

const AC_COLOR = "#f5f5f5";
const VENT_COLOR = "#e0e0e0";

interface AirconUnitProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

function AirconUnit({ position, rotation = [0, 0, 0] }: AirconUnitProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[1.2, 0.3, 0.22]} />
        <meshStandardMaterial color={AC_COLOR} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top edge trim */}
      <mesh position={[0, 0.155, 0]}>
        <boxGeometry args={[1.22, 0.01, 0.24]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Bottom vent flap (angled open) */}
      <mesh position={[0, -0.16, 0.06]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.1, 0.04, 0.15]} />
        <meshStandardMaterial color={AC_COLOR} roughness={0.4} />
      </mesh>

      {/* Vent slats */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x) => (
        <mesh key={x} position={[x, -0.1, 0.12]}>
          <boxGeometry args={[0.12, 0.08, 0.005]} />
          <meshStandardMaterial color={VENT_COLOR} roughness={0.5} />
        </mesh>
      ))}

      {/* Status LED */}
      <mesh position={[0.5, 0.1, 0.115]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color="#00ff66"
          emissive="#00ff66"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Brand label area */}
      <mesh position={[-0.35, 0.08, 0.115]}>
        <boxGeometry args={[0.2, 0.04, 0.005]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* Mount one AC unit on the back wall of each room, near ceiling of partition */
const ROOMS: {
  position: [number, number, number];
  rotation: [number, number, number];
}[] = [
  // Summary room [0,0,0] — back wall at z=-2
  { position: [0, 2.6, -1.9], rotation: [0, 0, 0] },
  // Projects room [-8,0,8] — back wall at z=6
  { position: [-8, 2.6, 6.1], rotation: [0, 0, 0] },
  // Experience room [8,0,8] — back wall at z=6
  { position: [8, 2.6, 6.1], rotation: [0, 0, 0] },
  // Skills room [-8,0,-8] — back wall at z=-10
  { position: [-8, 2.6, -9.9], rotation: [0, 0, 0] },
  // Education room [8,0,-8] — back wall at z=-10
  { position: [8, 2.6, -9.9], rotation: [0, 0, 0] },
];

export function SplitAircon() {
  return (
    <group>
      {ROOMS.map((room, i) => (
        <AirconUnit key={i} position={room.position} rotation={room.rotation} />
      ))}
    </group>
  );
}
