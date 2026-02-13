"use client";

import { Text } from "@react-three/drei";

interface DeskLabelProps {
  text: string;
  color: string;
  position: [number, number, number];
}

export function DeskLabel({ text, color, position }: DeskLabelProps) {
  return (
    <group position={position}>
      {/* Nameplate base */}
      <mesh>
        <boxGeometry args={[1.4, 0.3, 0.15]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Label text */}
      <Text
        position={[0, 0, 0.09]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {text}
      </Text>
    </group>
  );
}
