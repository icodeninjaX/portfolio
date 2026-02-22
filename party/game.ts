import type * as Party from "partykit/server";

interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  weapon: string;
  attacking: boolean;
  timestamp: number;
}

export default class GameServer implements Party.Server {
  players: Map<string, PlayerState> = new Map();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    const playerState: PlayerState = {
      id: conn.id,
      name: `Player ${conn.id.slice(0, 4)}`,
      x: 0,
      y: 0.3,
      z: 12,
      yaw: 0,
      weapon: "fists",
      attacking: false,
      timestamp: Date.now(),
    };
    this.players.set(conn.id, playerState);

    // Send init to the new player with all existing players
    const initMsg = JSON.stringify({
      type: "init",
      id: conn.id,
      players: Array.from(this.players.values()).filter((p) => p.id !== conn.id),
    });
    conn.send(initMsg);

    // Broadcast "joined" to all other players
    const joinedMsg = JSON.stringify({ type: "joined", player: playerState });
    this.room.broadcast(joinedMsg, [conn.id]);
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const msg = JSON.parse(message);

      if (msg.type === "state") {
        // Update stored state
        const state = msg.data as PlayerState;
        state.id = sender.id; // Enforce sender ID
        this.players.set(sender.id, state);
        // Broadcast to all others
        this.room.broadcast(JSON.stringify({ type: "state", data: state }), [sender.id]);
      } else if (msg.type === "shot") {
        // Broadcast shot to all (including sender for consistency, but sender can ignore own)
        const data = { ...msg.data, id: sender.id };
        this.room.broadcast(JSON.stringify({ type: "shot", data }), [sender.id]);
      } else if (msg.type === "hit") {
        // Broadcast hit to all
        const data = { ...msg.data, attackerId: sender.id };
        this.room.broadcast(JSON.stringify({ type: "hit", data }));
      }
    } catch {
      // Ignore malformed messages
    }
  }

  onClose(conn: Party.Connection) {
    this.players.delete(conn.id);
    this.room.broadcast(JSON.stringify({ type: "left", id: conn.id }));
  }
}

GameServer satisfies Party.Worker;
