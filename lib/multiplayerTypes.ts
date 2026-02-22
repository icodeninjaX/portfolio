import type { WeaponType } from "@/components/creative/FPSHands";

export interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  weapon: WeaponType;
  attacking: boolean;
  timestamp: number;
}

export interface RemotePlayer {
  id: string;
  name: string;
  prevState: PlayerState | null;
  currentState: PlayerState;
  receivedAt: number;
  prevReceivedAt: number;
}

export interface ShotEvent {
  id: string;
  shotId: number;
  startPos: [number, number, number];
  direction: [number, number, number];
}

export interface HitEvent {
  attackerId: string;
  targetId: string;
  weapon: WeaponType;
}

// Messages from client to server
export type ClientMessage =
  | { type: "state"; data: PlayerState }
  | { type: "shot"; data: ShotEvent }
  | { type: "hit"; data: HitEvent };

// Messages from server to client
export type ServerMessage =
  | { type: "init"; id: string; players: PlayerState[] }
  | { type: "joined"; player: PlayerState }
  | { type: "state"; data: PlayerState }
  | { type: "left"; id: string }
  | { type: "shot"; data: ShotEvent }
  | { type: "hit"; data: HitEvent };
