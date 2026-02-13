"use client";

const XMETA_ORANGE = "#FF6B00";

// Accent strips along the tops of the 5 room partition walls
// Rooms are at: [0,0,0], [-8,0,8], [8,0,8], [-8,0,-8], [8,0,-8]
// Each room is 5 wide × 4 deep with 3-unit-high partitions

const ROOMS: [number, number, number][] = [
  [0, 0, 0],
  [-8, 0, 8],
  [8, 0, 8],
  [-8, 0, -8],
  [8, 0, -8],
];

const ROOM_W = 5;
const ROOM_D = 4;
const STRIP_Y = 3.02; // Just above the 3-unit partition walls
const STRIP_THICKNESS = 0.04;
const STRIP_HEIGHT = 0.06;

function RoomAccentStrips({ roomPos }: { roomPos: [number, number, number] }) {
  const [rx, , rz] = roomPos;
  const halfW = ROOM_W / 2;
  const halfD = ROOM_D / 2;

  return (
    <group>
      {/* Back wall top strip */}
      <mesh position={[rx, STRIP_Y, rz - halfD]}>
        <boxGeometry args={[ROOM_W + 0.1, STRIP_HEIGHT, STRIP_THICKNESS]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Left wall top strip */}
      <mesh position={[rx - halfW, STRIP_Y, rz]}>
        <boxGeometry args={[STRIP_THICKNESS, STRIP_HEIGHT, ROOM_D + 0.1]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Right wall top strip */}
      <mesh position={[rx + halfW, STRIP_Y, rz]}>
        <boxGeometry args={[STRIP_THICKNESS, STRIP_HEIGHT, ROOM_D + 0.1]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function XMetaAccents() {
  return (
    <group>
      {ROOMS.map((pos, i) => (
        <RoomAccentStrips key={i} roomPos={pos} />
      ))}

      {/* Outer wall baseboard accent strips (interior side) */}
      {/* Back wall */}
      <mesh position={[0, 0.22, -14.82]}>
        <boxGeometry args={[29.6, 0.04, 0.02]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Front wall — left section */}
      <mesh position={[-8.75, 0.22, 14.82]}>
        <boxGeometry args={[12.1, 0.04, 0.02]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Front wall — right section */}
      <mesh position={[8.75, 0.22, 14.82]}>
        <boxGeometry args={[12.1, 0.04, 0.02]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Left wall */}
      <mesh position={[-14.82, 0.22, 0]}>
        <boxGeometry args={[0.02, 0.04, 29.6]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Right wall */}
      <mesh position={[14.82, 0.22, 0]}>
        <boxGeometry args={[0.02, 0.04, 29.6]} />
        <meshStandardMaterial
          color={XMETA_ORANGE}
          emissive={XMETA_ORANGE}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}
