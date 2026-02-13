"use client";

const DOOR_COLOR = "#5c4033";
const FRAME_COLOR = "#3e2723";
const GLASS_COLOR = "#c8dce8";
const HANDLE_COLOR = "#b0b0b0";

/* ── Single room door (1.8 wide × 2.4 tall) ── */
function RoomDoor({
  hingePos,
  hingeRotation,
  swingAngle,
  accentColor,
}: {
  hingePos: [number, number, number];
  hingeRotation: number;
  swingAngle: number;
  accentColor: string;
}) {
  const doorW = 1.7;
  const doorH = 2.35;

  return (
    <group position={hingePos} rotation={[0, hingeRotation, 0]}>
      {/* Hinge pivot — door swings from this edge */}
      <group rotation={[0, swingAngle, 0]}>
        {/* Door panel */}
        <mesh position={[doorW / 2, doorH / 2, 0]}>
          <boxGeometry args={[doorW, doorH, 0.06]} />
          <meshStandardMaterial color={DOOR_COLOR} roughness={0.75} />
        </mesh>

        {/* Frosted glass window */}
        <mesh position={[doorW / 2, 1.7, 0.032]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshStandardMaterial
            color={GLASS_COLOR}
            transparent
            opacity={0.45}
            roughness={0.15}
            metalness={0.05}
          />
        </mesh>
        {/* Glass frame */}
        {/* Top */}
        <mesh position={[doorW / 2, 1.96, 0.033]}>
          <boxGeometry args={[0.76, 0.03, 0.01]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
        </mesh>
        {/* Bottom */}
        <mesh position={[doorW / 2, 1.44, 0.033]}>
          <boxGeometry args={[0.76, 0.03, 0.01]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
        </mesh>
        {/* Left */}
        <mesh position={[doorW / 2 - 0.365, 1.7, 0.033]}>
          <boxGeometry args={[0.03, 0.52, 0.01]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
        </mesh>
        {/* Right */}
        <mesh position={[doorW / 2 + 0.365, 1.7, 0.033]}>
          <boxGeometry args={[0.03, 0.52, 0.01]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
        </mesh>

        {/* Lower panel inset */}
        <mesh position={[doorW / 2, 0.55, 0.035]}>
          <boxGeometry args={[1.2, 0.8, 0.01]} />
          <meshStandardMaterial color="#4a3428" roughness={0.8} />
        </mesh>

        {/* Door handle (lever style) — front */}
        <group position={[doorW - 0.2, 1.1, 0.05]}>
          {/* Escutcheon plate */}
          <mesh>
            <boxGeometry args={[0.06, 0.14, 0.015]} />
            <meshStandardMaterial color={HANDLE_COLOR} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Lever */}
          <mesh position={[0, 0, 0.04]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.12, 0.025, 0.025]} />
            <meshStandardMaterial color={HANDLE_COLOR} roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
        {/* Door handle — back */}
        <group position={[doorW - 0.2, 1.1, -0.05]}>
          <mesh>
            <boxGeometry args={[0.06, 0.14, 0.015]} />
            <meshStandardMaterial color={HANDLE_COLOR} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[0.12, 0.025, 0.025]} />
            <meshStandardMaterial color={HANDLE_COLOR} roughness={0.3} metalness={0.7} />
          </mesh>
        </group>

        {/* Colored accent strip along top edge */}
        <mesh position={[doorW / 2, doorH - 0.02, 0.035]}>
          <boxGeometry args={[doorW - 0.1, 0.04, 0.005]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Door frame — hinge side */}
      <mesh position={[-0.03, doorH / 2, 0]}>
        <boxGeometry args={[0.05, doorH + 0.1, 0.12]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.7} />
      </mesh>
      {/* Door frame — latch side */}
      <mesh position={[doorW + 0.03, doorH / 2, 0]}>
        <boxGeometry args={[0.05, doorH + 0.1, 0.12]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.7} />
      </mesh>
      {/* Door frame — top */}
      <mesh position={[doorW / 2, doorH + 0.03, 0]}>
        <boxGeometry args={[doorW + 0.12, 0.06, 0.12]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ── Glass entrance door panel (for double doors) ── */
function EntranceDoorPanel({ width, height }: { width: number; height: number }) {
  return (
    <group>
      {/* Aluminum frame */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Large glass panel */}
      <mesh position={[width / 2, height / 2 + 0.2, 0.032]}>
        <planeGeometry args={[width - 0.2, height - 0.6]} />
        <meshStandardMaterial
          color="#a8d8ea"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Horizontal push bar */}
      <group position={[width / 2, 1.1, 0.06]}>
        <mesh>
          <boxGeometry args={[width * 0.7, 0.06, 0.04]} />
          <meshStandardMaterial color={HANDLE_COLOR} roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Bar mounts */}
        {[-width * 0.3, width * 0.3].map((x) => (
          <mesh key={x} position={[x, 0, -0.03]}>
            <boxGeometry args={[0.06, 0.06, 0.04]} />
            <meshStandardMaterial color={HANDLE_COLOR} roughness={0.25} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Pull handle on back side */}
      <group position={[width / 2, 1.1, -0.06]}>
        <mesh>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color={HANDLE_COLOR} roughness={0.25} metalness={0.7} />
        </mesh>
      </group>

      {/* Bottom kick plate */}
      <mesh position={[width / 2, 0.15, 0.032]}>
        <boxGeometry args={[width - 0.1, 0.3, 0.005]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Room door configs ── */
/*
 * Each room's doorway faces outward (+z from the room's front wall).
 * Hinge on the left edge of the opening (when looking at the door from outside).
 * Doors swing inward into the room (negative swing angle).
 *
 * Room centers & front wall z:
 *   Summary  [0,0,0]    → front at z=+2
 *   Projects [-8,0,8]   → front at z=+10
 *   Experience [8,0,8]  → front at z=+10
 *   Skills   [-8,0,-8]  → front at z=-6
 *   Education [8,0,-8]  → front at z=-6
 */
const ROOM_DOORS: {
  hingePos: [number, number, number];
  hingeRotation: number;
  swingAngle: number;
  accentColor: string;
}[] = [
  // Summary — hinge at left of opening (x = 0 - 0.9), door on interior side
  {
    hingePos: [-0.9, 0, 1.95],
    hingeRotation: Math.PI,
    swingAngle: -1.8,
    accentColor: "#2563eb",
  },
  // Projects
  {
    hingePos: [-8.9, 0, 9.95],
    hingeRotation: Math.PI,
    swingAngle: -1.8,
    accentColor: "#d946ef",
  },
  // Experience
  {
    hingePos: [7.1, 0, 9.95],
    hingeRotation: Math.PI,
    swingAngle: -1.8,
    accentColor: "#16a34a",
  },
  // Skills
  {
    hingePos: [-8.9, 0, -6.05],
    hingeRotation: Math.PI,
    swingAngle: -1.8,
    accentColor: "#ea580c",
  },
  // Education
  {
    hingePos: [7.1, 0, -6.05],
    hingeRotation: Math.PI,
    swingAngle: -1.8,
    accentColor: "#7c3aed",
  },
];

export function OfficeDoors() {
  const entranceDoorW = 2.4;
  const entranceDoorH = 4.4;

  return (
    <group>
      {/* ── Main entrance double doors ── */}
      {/* Left door — hinge at x=-2.5, swings inward */}
      <group position={[-2.45, 0, 14.9]} rotation={[0, Math.PI, 0]}>
        <group rotation={[0, 1.6, 0]}>
          <EntranceDoorPanel width={entranceDoorW} height={entranceDoorH} />
        </group>
      </group>

      {/* Right door — hinge at x=+2.5, swings inward */}
      <group position={[2.45, 0, 14.9]} rotation={[0, Math.PI, 0]}>
        <group rotation={[0, -1.6, 0]}>
          <EntranceDoorPanel width={entranceDoorW} height={entranceDoorH} />
        </group>
      </group>

      {/* Entrance door frame — left pillar */}
      <mesh position={[-2.55, entranceDoorH / 2, 14.9]}>
        <boxGeometry args={[0.1, entranceDoorH + 0.1, 0.14]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[2.55, entranceDoorH / 2, 14.9]}>
        <boxGeometry args={[0.1, entranceDoorH + 0.1, 0.14]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Top frame */}
      <mesh position={[0, entranceDoorH + 0.05, 14.9]}>
        <boxGeometry args={[5.2, 0.1, 0.14]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* ── Room doors ── */}
      {ROOM_DOORS.map((cfg, i) => (
        <RoomDoor key={i} {...cfg} />
      ))}
    </group>
  );
}
