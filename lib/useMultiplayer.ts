"use client";

import { useEffect, useRef, useState, useCallback, MutableRefObject } from "react";
import PartySocket from "partysocket";
import * as THREE from "three";
import type { WeaponType } from "@/components/creative/FPSHands";
import type {
  PlayerState,
  RemotePlayer,
  ShotEvent,
  HitEvent,
  ServerMessage,
} from "./multiplayerTypes";

const SEND_RATE = 50; // 20Hz = 50ms

interface UseMultiplayerOptions {
  charPosRef: MutableRefObject<THREE.Vector3>;
  yawRef: MutableRefObject<number>;
  weaponRef: MutableRefObject<WeaponType>;
  attackingRef: MutableRefObject<boolean>;
  playerName: string;
}

interface RemoteShotVisual {
  id: number;
  startPos: [number, number, number];
  direction: [number, number, number];
}

export function useMultiplayer({
  charPosRef,
  yawRef,
  weaponRef,
  attackingRef,
  playerName,
}: UseMultiplayerOptions) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const [remoteShots, setRemoteShots] = useState<RemoteShotVisual[]>([]);
  const [remoteHits, setRemoteHits] = useState<Set<string>>(new Set());

  const remotePlayersRef = useRef<Map<string, RemotePlayer>>(new Map());
  const socketRef = useRef<PartySocket | null>(null);
  const playerIdRef = useRef<string | null>(null);

  useEffect(() => {
    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST;
    if (!host) return;

    const socket = new PartySocket({
      host,
      room: "office",
    });
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnected(true);
    });

    socket.addEventListener("close", () => {
      setConnected(false);
    });

    socket.addEventListener("message", (evt) => {
      const msg: ServerMessage = JSON.parse(evt.data);

      if (msg.type === "init") {
        playerIdRef.current = msg.id;
        setPlayerId(msg.id);
        // Add existing players
        for (const p of msg.players) {
          remotePlayersRef.current.set(p.id, {
            id: p.id,
            name: p.name,
            prevState: null,
            currentState: p,
            receivedAt: performance.now(),
            prevReceivedAt: performance.now() - SEND_RATE,
          });
        }
        setPlayerCount(msg.players.length + 1);
      } else if (msg.type === "joined") {
        remotePlayersRef.current.set(msg.player.id, {
          id: msg.player.id,
          name: msg.player.name,
          prevState: null,
          currentState: msg.player,
          receivedAt: performance.now(),
          prevReceivedAt: performance.now() - SEND_RATE,
        });
        setPlayerCount(remotePlayersRef.current.size + 1);
      } else if (msg.type === "state") {
        const existing = remotePlayersRef.current.get(msg.data.id);
        if (existing) {
          existing.prevState = existing.currentState;
          existing.prevReceivedAt = existing.receivedAt;
          existing.currentState = msg.data;
          existing.receivedAt = performance.now();
          existing.name = msg.data.name;
        } else {
          remotePlayersRef.current.set(msg.data.id, {
            id: msg.data.id,
            name: msg.data.name,
            prevState: null,
            currentState: msg.data,
            receivedAt: performance.now(),
            prevReceivedAt: performance.now() - SEND_RATE,
          });
          setPlayerCount(remotePlayersRef.current.size + 1);
        }
      } else if (msg.type === "left") {
        remotePlayersRef.current.delete(msg.id);
        setPlayerCount(remotePlayersRef.current.size + 1);
      } else if (msg.type === "shot") {
        const shotData = msg.data as ShotEvent;
        setRemoteShots((prev) => [
          ...prev,
          {
            id: shotData.shotId,
            startPos: shotData.startPos,
            direction: shotData.direction,
          },
        ]);
      } else if (msg.type === "hit") {
        const hitData = msg.data as HitEvent;
        // If we are the target, show hit reaction
        if (hitData.targetId === playerIdRef.current) {
          // Could add screen flash / shake here
        }
        // Show hit reaction on remote player
        setRemoteHits((prev) => {
          const next = new Set(prev);
          next.add(hitData.targetId);
          return next;
        });
        setTimeout(() => {
          setRemoteHits((prev) => {
            const next = new Set(prev);
            next.delete(hitData.targetId);
            return next;
          });
        }, 800);
      }
    });

    // Send state at 20Hz
    const interval = setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN || !playerIdRef.current) return;
      const state: PlayerState = {
        id: playerIdRef.current,
        name: playerName,
        x: charPosRef.current.x,
        y: charPosRef.current.y,
        z: charPosRef.current.z,
        yaw: yawRef.current,
        weapon: weaponRef.current,
        attacking: attackingRef.current,
        timestamp: Date.now(),
      };
      socket.send(JSON.stringify({ type: "state", data: state }));
    }, SEND_RATE);

    return () => {
      clearInterval(interval);
      socket.close();
      socketRef.current = null;
      remotePlayersRef.current.clear();
    };
  }, [charPosRef, yawRef, weaponRef, attackingRef, playerName]);

  const sendShot = useCallback(
    (startPos: [number, number, number], direction: [number, number, number]) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
      const shotEvent: ShotEvent = {
        id: playerIdRef.current || "",
        shotId: Date.now() + Math.random(),
        startPos,
        direction,
      };
      socketRef.current.send(JSON.stringify({ type: "shot", data: shotEvent }));
    },
    []
  );

  const sendHit = useCallback((targetId: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    const hitEvent: HitEvent = {
      attackerId: playerIdRef.current || "",
      targetId,
      weapon: weaponRef.current,
    };
    socketRef.current.send(JSON.stringify({ type: "hit", data: hitEvent }));
  }, [weaponRef]);

  const removeRemoteShot = useCallback((shotId: number) => {
    setRemoteShots((prev) => prev.filter((s) => s.id !== shotId));
  }, []);

  return {
    playerId,
    connected,
    playerCount,
    remotePlayersRef,
    sendShot,
    sendHit,
    remoteShots,
    remoteHits,
    removeRemoteShot,
  };
}
