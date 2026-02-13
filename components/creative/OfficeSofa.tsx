"use client";

import { Text, Billboard } from "@react-three/drei";

const SOFA_COLOR = "#3b3b3b";
const CUSHION_COLOR = "#4a4a4a";
const PILLOW_COLOR = "#FF6B00"; // X-Meta orange accent pillows

/* ── Simple seated person (decorative, no animation) ── */
interface SeatedPersonProps {
  position: [number, number, number];
  rotationY: number;
  name: string;
  shirtColor: string;
  pantsColor: string;
  skinTone: string;
  hairColor: string;
  female: boolean;
  eyeColor: string;
  lipColor: string;
}

function SeatedPerson({
  position,
  rotationY,
  name,
  shirtColor,
  pantsColor,
  skinTone,
  hairColor,
  female,
  eyeColor,
  lipColor,
}: SeatedPersonProps) {
  const nameTagWidth = name.length * 0.085 + 0.16;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Name tag */}
      <Billboard>
        <group position={[0, 2.12, 0]}>
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[nameTagWidth, 0.24]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.88} />
          </mesh>
          <mesh position={[0, -0.13, -0.004]}>
            <planeGeometry args={[nameTagWidth, 0.03]} />
            <meshBasicMaterial color={shirtColor} />
          </mesh>
          <Text
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#000000"
          >
            {name}
          </Text>
        </group>
      </Billboard>

      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color={skinTone} roughness={0.8} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.065, 1.68, 0.155]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[-0.065, 1.68, 0.185]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={eyeColor} roughness={0.4} />
      </mesh>
      <mesh position={[-0.065, 1.68, 0.195]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
      </mesh>
      <mesh position={[0.065, 1.68, 0.155]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0.065, 1.68, 0.185]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={eyeColor} roughness={0.4} />
      </mesh>
      <mesh position={[0.065, 1.68, 0.195]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.63, 0.17]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={skinTone} roughness={0.8} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 1.585, 0.16]}>
        <boxGeometry args={[0.06, 0.015, 0.02]} />
        <meshStandardMaterial color={lipColor} roughness={0.6} />
      </mesh>
      {/* Eyebrows */}
      <mesh position={[-0.065, 1.72, 0.16]}>
        <boxGeometry args={[0.05, 0.012, 0.015]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.065, 1.72, 0.16]}>
        <boxGeometry args={[0.05, 0.012, 0.015]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Hair */}
      {female ? (
        <>
          <mesh position={[0, 1.78, -0.02]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          <mesh position={[-0.15, 1.55, -0.04]}>
            <capsuleGeometry args={[0.06, 0.25, 6, 8]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          <mesh position={[0.15, 1.55, -0.04]}>
            <capsuleGeometry args={[0.06, 0.25, 6, 8]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.5, -0.1]}>
            <capsuleGeometry args={[0.1, 0.3, 6, 8]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 1.78, -0.04]}>
          <sphereGeometry args={[0.19, 10, 8]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
      )}

      {/* Torso */}
      {female ? (
        <>
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[0.34, 0.22, 0.2]} />
            <meshStandardMaterial color={shirtColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.28, 0.22, 0.18]} />
            <meshStandardMaterial color={shirtColor} roughness={0.7} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.38, 0.5, 0.22]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
      )}

      {/* Collar */}
      <mesh position={[0, 1.44, 0.08]}>
        <boxGeometry args={[0.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[female ? 0.3 : 0.36, 0.08, female ? 0.18 : 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      {/* Arms — resting on lap (angled down and forward) */}
      <group position={[female ? -0.22 : -0.25, 1.35, 0]} rotation={[-0.5, 0, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[female ? 0.045 : 0.055, 0.28, 6, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[female ? 0.04 : 0.05, 8, 6]} />
          <meshStandardMaterial color={skinTone} roughness={0.8} />
        </mesh>
      </group>
      <group position={[female ? 0.22 : 0.25, 1.35, 0]} rotation={[-0.5, 0, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[female ? 0.045 : 0.055, 0.28, 6, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[female ? 0.04 : 0.05, 8, 6]} />
          <meshStandardMaterial color={skinTone} roughness={0.8} />
        </mesh>
      </group>

      {/* Legs — bent at 90 degrees (seated) */}
      <group position={[-0.1, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[female ? 0.055 : 0.065, 0.35, 6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[female ? 0.08 : 0.1, 0.06, female ? 0.15 : 0.18]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.1, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[female ? 0.055 : 0.065, 0.35, 6, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[female ? 0.08 : 0.1, 0.06, female ? 0.15 : 0.18]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Sofa furniture ── */
function Sofa() {
  return (
    <group>
      {/* Base/seat */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.8, 0.3, 0.9]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.85} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.7, -0.38]}>
        <boxGeometry args={[2.8, 0.55, 0.2]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.85} />
      </mesh>

      {/* Seat cushions (3) */}
      {[-0.85, 0, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.47, 0.02]}>
          <boxGeometry args={[0.82, 0.08, 0.78]} />
          <meshStandardMaterial color={CUSHION_COLOR} roughness={0.9} />
        </mesh>
      ))}

      {/* Back cushions (3) */}
      {[-0.85, 0, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.72, -0.24]}>
          <boxGeometry args={[0.8, 0.38, 0.12]} />
          <meshStandardMaterial color={CUSHION_COLOR} roughness={0.9} />
        </mesh>
      ))}

      {/* Left armrest */}
      <mesh position={[-1.45, 0.5, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.9]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.85} />
      </mesh>

      {/* Right armrest */}
      <mesh position={[1.45, 0.5, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.9]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.85} />
      </mesh>

      {/* Legs (4) */}
      {[
        [-1.2, 0.06, 0.3],
        [-1.2, 0.06, -0.3],
        [1.2, 0.06, 0.3],
        [1.2, 0.06, -0.3],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* Orange accent pillows */}
      <mesh position={[-1.05, 0.62, 0.05]} rotation={[0.15, 0.2, 0.1]}>
        <boxGeometry args={[0.3, 0.3, 0.08]} />
        <meshStandardMaterial color={PILLOW_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[1.05, 0.62, 0.08]} rotation={[-0.1, -0.15, -0.08]}>
        <boxGeometry args={[0.3, 0.3, 0.08]} />
        <meshStandardMaterial color={PILLOW_COLOR} roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ── Coffee table ── */
function CoffeeTable() {
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[
        [-0.5, 0.19, 0.22],
        [-0.5, 0.19, -0.22],
        [0.5, 0.19, 0.22],
        [0.5, 0.19, -0.22],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 8]} />
          <meshStandardMaterial color="#3e2723" roughness={0.6} />
        </mesh>
      ))}
      {/* Coffee mug */}
      <mesh position={[-0.25, 0.47, 0.05]}>
        <cylinderGeometry args={[0.04, 0.035, 0.1, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Mug handle */}
      <mesh position={[-0.29, 0.47, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.008, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Magazine/tablet */}
      <mesh position={[0.2, 0.44, -0.05]} rotation={[-Math.PI / 2, 0, 0.15]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

export function OfficeSofa() {
  return (
    <group position={[5, 0, 4]} rotation={[0, -Math.PI / 4, 0]}>
      <Sofa />

      {/* Coffee table in front */}
      <group position={[0, 0, 1.2]}>
        <CoffeeTable />
      </group>

      {/* Person 1 — left side of sofa */}
      <SeatedPerson
        position={[-0.7, -0.08, 0.02]}
        rotationY={0}
        name="Marcus"
        shirtColor="#e07b39"
        pantsColor="#2d3748"
        skinTone="#c68642"
        hairColor="#1a1a1a"
        female={false}
        eyeColor="#3b2f1a"
        lipColor="#9e6b60"
      />

      {/* Person 2 — right side of sofa */}
      <SeatedPerson
        position={[0.7, -0.08, 0.02]}
        rotationY={0}
        name="Sofia"
        shirtColor="#7c3aed"
        pantsColor="#1e293b"
        skinTone="#e8c4a0"
        hairColor="#5c3317"
        female={true}
        eyeColor="#4a6741"
        lipColor="#cc6666"
      />
    </group>
  );
}
