"use client";

import { MutableRefObject, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RemotePlayer } from "@/lib/multiplayerTypes";
import { RemotePlayerMesh } from "./RemotePlayer";

interface RemotePlayersProps {
  remotePlayersRef: MutableRefObject<Map<string, RemotePlayer>>;
  remoteHits: Set<string>;
  remotePlayerPositionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
}

export function RemotePlayers({ remotePlayersRef, remoteHits, remotePlayerPositionsRef }: RemotePlayersProps) {
  const [playerIds, setPlayerIds] = useState<string[]>([]);

  // Poll for player list changes at 10Hz
  useEffect(() => {
    const interval = setInterval(() => {
      const ids = Array.from(remotePlayersRef.current.keys()).sort();
      setPlayerIds((prev) => {
        if (prev.length !== ids.length || prev.some((id, i) => id !== ids[i])) {
          return ids;
        }
        return prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [remotePlayersRef]);

  // Clean up position entries for players that left
  useFrame(() => {
    const activeIds = remotePlayersRef.current;
    remotePlayerPositionsRef.current.forEach((_, id) => {
      if (!activeIds.has(id)) {
        remotePlayerPositionsRef.current.delete(id);
      }
    });
  });

  return (
    <>
      {playerIds.map((id) => {
        const player = remotePlayersRef.current.get(id);
        if (!player) return null;
        return (
          <RemotePlayerMesh
            key={id}
            player={player}
            isHit={remoteHits.has(id)}
            remotePlayerPositionsRef={remotePlayerPositionsRef}
          />
        );
      })}
    </>
  );
}
