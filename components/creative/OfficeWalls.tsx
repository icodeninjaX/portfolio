"use client";

const WALL_HEIGHT = 5;
const WALL_COLOR = "#f0ece4";
const BASEBOARD_COLOR = "#d4cfc6";
const WINDOW_FRAME = "#8c8478";

function WindowPane({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Glass */}
      <mesh>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial
          color="#a8d8ea"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Frame */}
      {/* Top */}
      <mesh position={[0, 1.3, 0.01]}>
        <boxGeometry args={[3.7, 0.12, 0.06]} />
        <meshStandardMaterial color={WINDOW_FRAME} roughness={0.6} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -1.3, 0.01]}>
        <boxGeometry args={[3.7, 0.12, 0.06]} />
        <meshStandardMaterial color={WINDOW_FRAME} roughness={0.6} />
      </mesh>
      {/* Left */}
      <mesh position={[-1.8, 0, 0.01]}>
        <boxGeometry args={[0.12, 2.7, 0.06]} />
        <meshStandardMaterial color={WINDOW_FRAME} roughness={0.6} />
      </mesh>
      {/* Right */}
      <mesh position={[1.8, 0, 0.01]}>
        <boxGeometry args={[0.12, 2.7, 0.06]} />
        <meshStandardMaterial color={WINDOW_FRAME} roughness={0.6} />
      </mesh>
      {/* Center vertical divider */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.08, 2.6, 0.06]} />
        <meshStandardMaterial color={WINDOW_FRAME} roughness={0.6} />
      </mesh>
    </group>
  );
}

function SolidWall({
  position,
  rotation,
  width,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, WALL_HEIGHT / 2, 0]}>
        <boxGeometry args={[width, WALL_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} />
      </mesh>
      {/* Baseboard trim */}
      <mesh position={[0, 0.1, 0.11]}>
        <boxGeometry args={[width, 0.2, 0.04]} />
        <meshStandardMaterial color={BASEBOARD_COLOR} roughness={0.7} />
      </mesh>
    </group>
  );
}

function WallWithWindows({
  position,
  rotation,
  width,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main wall */}
      <mesh position={[0, WALL_HEIGHT / 2, 0]}>
        <boxGeometry args={[width, WALL_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} />
      </mesh>
      {/* Baseboard trim */}
      <mesh position={[0, 0.1, 0.11]}>
        <boxGeometry args={[width, 0.2, 0.04]} />
        <meshStandardMaterial color={BASEBOARD_COLOR} roughness={0.7} />
      </mesh>
      {/* Windows (cut into wall visually by placing them flush on the inside face) */}
      <WindowPane position={[-7, 2.8, 0.12]} />
      <WindowPane position={[0, 2.8, 0.12]} />
      <WindowPane position={[7, 2.8, 0.12]} />
    </group>
  );
}

function FrontWallWithDoor({
  position,
  rotation,
  width,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
}) {
  const doorWidth = 5;
  const sideWidth = (width - doorWidth) / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Left wall section */}
      <group position={[-(doorWidth / 2 + sideWidth / 2), 0, 0]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]}>
          <boxGeometry args={[sideWidth, WALL_HEIGHT, 0.2]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} />
        </mesh>
        <mesh position={[0, 0.1, 0.11]}>
          <boxGeometry args={[sideWidth, 0.2, 0.04]} />
          <meshStandardMaterial color={BASEBOARD_COLOR} roughness={0.7} />
        </mesh>
      </group>
      {/* Right wall section */}
      <group position={[(doorWidth / 2 + sideWidth / 2), 0, 0]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]}>
          <boxGeometry args={[sideWidth, WALL_HEIGHT, 0.2]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} />
        </mesh>
        <mesh position={[0, 0.1, 0.11]}>
          <boxGeometry args={[sideWidth, 0.2, 0.04]} />
          <meshStandardMaterial color={BASEBOARD_COLOR} roughness={0.7} />
        </mesh>
      </group>
      {/* Door header */}
      <mesh position={[0, WALL_HEIGHT - 0.25, 0]}>
        <boxGeometry args={[doorWidth + 0.4, 0.5, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}

export function OfficeWalls() {
  return (
    <>
      {/* Back wall (z = -15) — with windows to see outside */}
      <WallWithWindows position={[0, 0, -15]} rotation={[0, 0, 0]} width={30} />
      {/* Front wall (z = +15) — door entrance */}
      <FrontWallWithDoor position={[0, 0, 15]} rotation={[0, Math.PI, 0]} width={30} />
      {/* Left wall (x = -15) — with windows */}
      <WallWithWindows position={[-15, 0, 0]} rotation={[0, Math.PI / 2, 0]} width={30} />
      {/* Right wall (x = +15) — solid */}
      <SolidWall position={[15, 0, 0]} rotation={[0, -Math.PI / 2, 0]} width={30} />
    </>
  );
}
