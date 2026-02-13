"use client";

import { Text } from "@react-three/drei";

const XMETA_ORANGE = "#FF6B00";

const VALUES = [
  { title: "Innovation", desc: "Pushing boundaries\nin portable energy", x: 5 },
  { title: "Quality", desc: "Built to last,\ntested to endure", x: 9 },
  { title: "Sustainability", desc: "Eco-friendly\npower solutions", x: 13 },
];

export function CompanyValues() {
  return (
    <group position={[0, 2.5, -14.85]}>
      {VALUES.map(({ title, desc, x }) => (
        <group key={title} position={[x, 0, 0]}>
          {/* Dark plaque background */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[1.8, 1.2, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>

          {/* Orange top accent bar */}
          <mesh position={[0, 0.55, -0.005]}>
            <boxGeometry args={[1.6, 0.06, 0.01]} />
            <meshStandardMaterial
              color={XMETA_ORANGE}
              emissive={XMETA_ORANGE}
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>

          {/* Title */}
          <Text
            position={[0, 0.25, 0.01]}
            fontSize={0.14}
            color={XMETA_ORANGE}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {title}
          </Text>

          {/* Description */}
          <Text
            position={[0, -0.12, 0.01]}
            fontSize={0.09}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
          >
            {desc}
          </Text>
        </group>
      ))}
    </group>
  );
}
