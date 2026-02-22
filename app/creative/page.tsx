"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "@/components/creative/Scene";
import { OfficeFloor } from "@/components/creative/OfficeFloor";
import { OfficeWalls } from "@/components/creative/OfficeWalls";
import { OfficeAmbience } from "@/components/creative/OfficeAmbience";
import { OutdoorTrees } from "@/components/creative/OutdoorTrees";
import { SectionStations, STATIONS } from "@/components/creative/SectionStations";
import { PostEffects } from "@/components/creative/PostEffects";
import { OfficeHUD } from "@/components/creative/OfficeHUD";
import { Character } from "@/components/creative/Character";
import { ThrownBall } from "@/components/creative/ThrownBall";
import { OfficePeople } from "@/components/creative/OfficePeople";
import { OfficeKitchen } from "@/components/creative/OfficeKitchen";
import { OfficeRestroom } from "@/components/creative/OfficeRestroom";
import { WallArt } from "@/components/creative/WallArt";
import { Whiteboard } from "@/components/creative/Whiteboard";
import { WaterCooler } from "@/components/creative/WaterCooler";
import { PrinterCopier } from "@/components/creative/PrinterCopier";
import { RubberDuck } from "@/components/creative/RubberDuck";
import { ParkingLot } from "@/components/creative/ParkingLot";
import { CeilingLights } from "@/components/creative/CeilingLights";
import { LeftWallGallery } from "@/components/creative/LeftWallGallery";
import { SkyClouds } from "@/components/creative/SkyClouds";
import { XMetaSign } from "@/components/creative/XMetaSign";
import { ProductShowcase } from "@/components/creative/ProductShowcase";
import { XMetaBanner } from "@/components/creative/XMetaBanner";
import { CompanyValues } from "@/components/creative/CompanyValues";
import { XMetaAccents } from "@/components/creative/XMetaAccents";
import { OfficeSofa } from "@/components/creative/OfficeSofa";
import { OfficeCeiling } from "@/components/creative/OfficeCeiling";
import { SplitAircon } from "@/components/creative/SplitAircon";
import { RoomLabels } from "@/components/creative/RoomLabels";
import { OfficeDoors } from "@/components/creative/OfficeDoors";
import { FPSHands, WeaponType } from "@/components/creative/FPSHands";
import { WaterProjectile } from "@/components/creative/WaterProjectile";
import { ConversationOverlay } from "@/components/creative/ConversationOverlay";
import { RemotePlayers } from "@/components/creative/RemotePlayers";
import { NPC_DIALOGUES } from "@/lib/npcDialogue";
import { useMultiplayer } from "@/lib/useMultiplayer";

interface Ball {
  id: number;
  targetKey: string;
  startPos: [number, number, number];
  targetPos: [number, number, number];
  createdAt: number;
  color: string;
}

interface WaterShot {
  id: number;
  startPos: [number, number, number];
  direction: [number, number, number];
}

const CHAR_START: [number, number, number] = [0, 0.3, 12];
const BALL_COLORS = ["#2563eb", "#d946ef", "#16a34a", "#ea580c", "#7c3aed"];

export default function CreativePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [wobblingStations, setWobblingStations] = useState<Set<string>>(new Set());
  const [pointerLocked, setPointerLocked] = useState(false);

  // Conversation state
  const [talkingTo, setTalkingTo] = useState<string | null>(null);
  const [nearbyNPC, setNearbyNPC] = useState<string | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [talkingToPosition, setTalkingToPosition] = useState<THREE.Vector3 | null>(null);

  // Weapon state
  const [weapon, setWeapon] = useState<WeaponType>("fists");
  const [attacking, setAttacking] = useState(false);
  const [waterShots, setWaterShots] = useState<WaterShot[]>([]);
  const [hitNPCs, setHitNPCs] = useState<Set<string>>(new Set());
  const weaponRef = useRef<WeaponType>("fists");

  const charPosRef = useRef(new THREE.Vector3(...CHAR_START));
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const handOffsetRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const npcPositionsRef = useRef(new Map<string, THREE.Vector3>());
  const talkingToRef = useRef<string | null>(null);
  const nearbyNPCRef = useRef<string | null>(null);
  const attackingRef = useRef(false);
  const remotePlayerPositionsRef = useRef(new Map<string, THREE.Vector3>());

  // Keep refs in sync for use in key handlers
  talkingToRef.current = talkingTo;
  nearbyNPCRef.current = nearbyNPC;
  weaponRef.current = weapon;
  attackingRef.current = attacking;

  // Auto-generated player name
  const [playerName] = useState(() => {
    const adjectives = ["Swift", "Bold", "Calm", "Keen", "Wild", "Cool", "Brave", "Sharp"];
    const nouns = ["Fox", "Wolf", "Hawk", "Bear", "Lynx", "Owl", "Deer", "Crow"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
  });

  // Multiplayer
  const {
    connected,
    playerCount,
    remotePlayersRef,
    sendShot,
    sendHit,
    remoteShots,
    remoteHits,
    removeRemoteShot,
  } = useMultiplayer({
    charPosRef,
    yawRef,
    weaponRef,
    attackingRef,
    playerName,
  });

  useEffect(() => {
    const onChange = () => {
      setPointerLocked(document.pointerLockElement != null);
    };
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  // Weapon switching (1/2/3 keys + scroll wheel)
  useEffect(() => {
    const WEAPONS: WeaponType[] = ["fists", "knife", "watergun"];

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") setWeapon("fists");
      else if (e.key === "2") setWeapon("knife");
      else if (e.key === "3") setWeapon("watergun");
    };

    const onWheel = (e: WheelEvent) => {
      if (!document.pointerLockElement) return;
      e.preventDefault();
      setWeapon((prev) => {
        const idx = WEAPONS.indexOf(prev);
        const next = e.deltaY > 0
          ? (idx + 1) % WEAPONS.length
          : (idx - 1 + WEAPONS.length) % WEAPONS.length;
        return WEAPONS[next];
      });
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Attack on left click (while pointer locked)
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !document.pointerLockElement || talkingToRef.current) return;

      setAttacking(true);
      setTimeout(() => setAttacking(false), 330);

      // Melee hit detection (fists / knife)
      if (weaponRef.current === "fists" || weaponRef.current === "knife") {
        const range = weaponRef.current === "knife" ? 3.0 : 2.0;
        const yaw = yawRef.current;
        const fwdX = -Math.sin(yaw);
        const fwdZ = -Math.cos(yaw);
        npcPositionsRef.current.forEach((npcPos, name) => {
          const dx = npcPos.x - charPosRef.current.x;
          const dz = npcPos.z - charPosRef.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist > range) return;
          const dot = (dx * fwdX + dz * fwdZ) / (dist || 1);
          if (dot > 0.3) {
            triggerNPCHit(name);
          }
        });
        // Melee hit detection against remote players
        remotePlayerPositionsRef.current.forEach((playerPos, id) => {
          const dx = playerPos.x - charPosRef.current.x;
          const dz = playerPos.z - charPosRef.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist > range) return;
          const dot = (dx * fwdX + dz * fwdZ) / (dist || 1);
          if (dot > 0.3) {
            sendHit(id);
          }
        });
      }

      // Spawn water projectile when using water gun
      if (weaponRef.current === "watergun") {
        const yaw = yawRef.current;
        const pitch = pitchRef.current;
        const dir: [number, number, number] = [
          -Math.sin(yaw) * Math.cos(pitch),
          Math.sin(pitch),
          -Math.cos(yaw) * Math.cos(pitch),
        ];
        const start: [number, number, number] = [
          charPosRef.current.x + dir[0] * 0.5,
          charPosRef.current.y + 2.2 + dir[1] * 0.5,
          charPosRef.current.z + dir[2] * 0.5,
        ];
        setWaterShots((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), startPos: start, direction: dir },
        ]);
        sendShot(start, dir);
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, []);

  const handleWaterShotDone = useCallback((id: number) => {
    setWaterShots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleHitPlayer = useCallback((id: string) => {
    sendHit(id);
  }, [sendHit]);

  const triggerNPCHit = useCallback((name: string) => {
    setHitNPCs((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
    setTimeout(() => {
      setHitNPCs((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }, 800);
  }, []);

  // E key and ESC key handlers for conversation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e") {
        if (talkingToRef.current) {
          // Already in conversation — advance or exit
          const dialogue = NPC_DIALOGUES[talkingToRef.current];
          if (!dialogue) return;
          setDialogueIndex((prev) => {
            if (prev >= dialogue.lines.length - 1) {
              // Last line — exit conversation
              exitConversation();
              return 0;
            }
            return prev + 1;
          });
        } else if (nearbyNPCRef.current && document.pointerLockElement) {
          // Start conversation
          const npcName = nearbyNPCRef.current;
          const npcPos = npcPositionsRef.current.get(npcName);
          if (npcPos) {
            document.exitPointerLock();
            setTalkingTo(npcName);
            setDialogueIndex(0);
            setTalkingToPosition(npcPos.clone());
          }
        }
      }

      if (e.key === "Escape" && talkingToRef.current) {
        e.preventDefault();
        exitConversation();
      }
    };

    function exitConversation() {
      setTalkingTo(null);
      setDialogueIndex(0);
      setTalkingToPosition(null);
      // Re-request pointer lock after a short delay to avoid browser blocking
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.requestPointerLock();
        }
      }, 100);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (!pointerLocked && !talkingTo && canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  }, [pointerLocked, talkingTo]);

  const handleThrow = useCallback(() => {
    const station = STATIONS[Math.floor(Math.random() * STATIONS.length)];
    const [sx, , sz] = station.position;
    const targetPos: [number, number, number] = [sx, 1.5, sz];
    const id = Date.now() + Math.random();

    const origin: [number, number, number] = [
      charPosRef.current.x,
      charPosRef.current.y + 1.5,
      charPosRef.current.z,
    ];

    setBalls((prev) => [
      ...prev,
      {
        id,
        targetKey: station.key,
        startPos: origin,
        targetPos,
        createdAt: performance.now() / 1000,
        color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
      },
    ]);
  }, []);

  const handleBallHit = useCallback((stationKey: string) => {
    setWobblingStations((prev) => {
      const next = new Set(prev);
      next.add(stationKey);
      return next;
    });
    setTimeout(() => {
      setWobblingStations((prev) => {
        const next = new Set(prev);
        next.delete(stationKey);
        return next;
      });
    }, 800);
  }, []);

  const handleBallDone = useCallback((ballId: number) => {
    setBalls((prev) => prev.filter((b) => b.id !== ballId));
  }, []);

  const handleProximityChange = useCallback((sectionKey: string | null) => {
    setActiveSection(sectionKey);
  }, []);

  const handleNearbyNPCChange = useCallback((name: string | null) => {
    setNearbyNPC(name);
  }, []);

  // Current dialogue info
  const currentDialogue = talkingTo ? NPC_DIALOGUES[talkingTo] : null;
  const currentLine = currentDialogue ? currentDialogue.lines[dialogueIndex] : null;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#87ceeb", position: "relative" }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 12, 22], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#87ceeb" }}
        onClick={handleCanvasClick}
      >
        <Suspense fallback={null}>
          <Scene
            charPosRef={charPosRef}
            yawRef={yawRef}
            pitchRef={pitchRef}
            handOffsetRef={handOffsetRef}
            talkingTo={talkingTo}
            talkingToPosition={talkingToPosition}
          >
            <OfficeFloor />
            <OfficeWalls />
            <OfficeAmbience />
            <OutdoorTrees />
            <SectionStations
              charPosRef={charPosRef}
              onProximityChange={handleProximityChange}
              wobblingStations={wobblingStations}
            />
            <OfficeKitchen />
            <OfficeRestroom />
            <WallArt />
            <Whiteboard />
            <WaterCooler />
            <PrinterCopier />
            <RubberDuck />
            <ParkingLot />
            <CeilingLights />
            <LeftWallGallery />
            <SkyClouds />
            <XMetaSign />
            <ProductShowcase />
            <XMetaBanner />
            <CompanyValues />
            <XMetaAccents />
            <OfficeSofa />
            <OfficeCeiling />
            <SplitAircon />
            <RoomLabels />
            <OfficeDoors />
            <OfficePeople
              npcPositionsRef={npcPositionsRef}
              talkingTo={talkingTo}
              charPosRef={charPosRef}
              onNearbyNPCChange={handleNearbyNPCChange}
              hitNPCs={hitNPCs}
            />
            <RemotePlayers
              remotePlayersRef={remotePlayersRef}
              remoteHits={remoteHits}
              remotePlayerPositionsRef={remotePlayerPositionsRef}
            />
            <Character
              startPosition={CHAR_START}
              positionRef={charPosRef}
              onThrow={handleThrow}
              yawRef={yawRef}
              movementDisabled={!!talkingTo}
            />
            {balls.map((ball) => (
              <ThrownBall
                key={ball.id}
                startPos={ball.startPos}
                targetPos={ball.targetPos}
                createdAt={ball.createdAt}
                color={ball.color}
                onHit={() => handleBallHit(ball.targetKey)}
                onDone={() => handleBallDone(ball.id)}
              />
            ))}
          </Scene>
          <FPSHands handOffsetRef={handOffsetRef} visible={!talkingTo} weapon={weapon} attacking={attacking} />
          {waterShots.map((shot) => (
            <WaterProjectile
              key={shot.id}
              startPos={shot.startPos}
              direction={shot.direction}
              onDone={() => handleWaterShotDone(shot.id)}
              npcPositionsRef={npcPositionsRef}
              onHitNPC={triggerNPCHit}
              remotePlayerPositionsRef={remotePlayerPositionsRef}
              onHitPlayer={handleHitPlayer}
            />
          ))}
          {/* Remote water projectiles (visual only, no hit detection on receiver) */}
          {remoteShots.map((shot) => (
            <WaterProjectile
              key={shot.id}
              startPos={shot.startPos}
              direction={shot.direction}
              onDone={() => removeRemoteShot(shot.id)}
            />
          ))}
          <PostEffects />
        </Suspense>
      </Canvas>
      <OfficeHUD
        activeSection={activeSection}
        pointerLocked={pointerLocked}
        nearbyNPC={nearbyNPC}
        talkingTo={talkingTo}
        weapon={weapon}
        onWeaponChange={setWeapon}
        connected={connected}
        playerCount={playerCount}
        playerName={playerName}
      />

      {/* Conversation overlay */}
      <ConversationOverlay
        npcName={currentDialogue?.name ?? null}
        line={currentLine}
        lineIndex={dialogueIndex}
        totalLines={currentDialogue?.lines.length ?? 0}
      />

      {/* Click to Play overlay */}
      {!pointerLocked && !talkingTo && (
        <div
          onClick={handleCanvasClick}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 600,
              textAlign: "center",
              padding: "32px 48px",
              borderRadius: 16,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            Click to Play
            <div style={{ fontSize: 14, fontWeight: 400, marginTop: 8, color: "#9ca3af" }}>
              WASD to move &bull; Mouse to look &bull; Click to attack &bull; 1/2/3 switch weapons
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
