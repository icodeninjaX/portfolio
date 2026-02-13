"use client";

import { useEffect, useRef, useState } from "react";

interface ConversationOverlayProps {
  npcName: string | null;
  line: string | null;
  lineIndex: number;
  totalLines: number;
}

export function ConversationOverlay({ npcName, line, lineIndex, totalLines }: ConversationOverlayProps) {
  const [displayedLine, setDisplayedLine] = useState(line);
  const [fadeKey, setFadeKey] = useState(0);
  const prevLineRef = useRef(line);

  useEffect(() => {
    if (line !== prevLineRef.current) {
      prevLineRef.current = line;
      setDisplayedLine(line);
      setFadeKey((k) => k + 1);
    }
  }, [line]);

  if (!npcName || !displayedLine) return null;

  const isLastLine = lineIndex >= totalLines - 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 32,
      }}
    >
      {/* NPC Name - top */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 20,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 700,
          letterSpacing: 1,
          padding: "10px 28px",
          borderRadius: 12,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {npcName}
      </div>

      {/* Chat bubble + prompt - bottom */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, maxWidth: 560, width: "100%" }}>
        {/* Chat bubble */}
        <div
          key={fadeKey}
          style={{
            color: "#f3f4f6",
            fontSize: 16,
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.6,
            padding: "20px 28px",
            borderRadius: 16,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            width: "100%",
            textAlign: "center",
            animation: "conversationFadeIn 0.3s ease-out",
          }}
        >
          {displayedLine}
        </div>

        {/* Prompt */}
        <div
          style={{
            color: "#9ca3af",
            fontSize: 12,
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "6px 16px",
            borderRadius: 6,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          {isLastLine ? "Press E to finish" : "Press E to continue"} &bull; ESC to exit
        </div>
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes conversationFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
