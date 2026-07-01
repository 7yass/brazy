"use client";

import { useMemo } from "react";
import { useLyricsSync } from "@/lib/audio/lyrics-sync";
import type { LyricLine } from "@/lib/audio/lrc-parser";

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
  primaryColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  borderRadius?: number;
}

const LINE_HEIGHT = 34;
const VISIBLE_LINES = 7;
const CONTAINER_HEIGHT = LINE_HEIGHT * VISIBLE_LINES;

function getOpacity(distance: number): number {
  if (distance === 0) return 1;
  if (distance === 1) return 0.45;
  if (distance === 2) return 0.18;
  return 0.07;
}

function getScale(distance: number): number {
  if (distance === 0) return 1;
  if (distance === 1) return 0.97;
  return 0.94;
}

export default function LyricsDisplay({
  lyrics,
  audioRef,
  primaryColor = "#ffffff",
  textColor = "#ffffff",
  mutedTextColor = "#666666",
  borderRadius = 16,
}: LyricsDisplayProps) {
  const { activeIndex } = useLyricsSync(lyrics, audioRef);

  const translateY = useMemo(() => {
    return -activeIndex * LINE_HEIGHT + CONTAINER_HEIGHT / 2 - LINE_HEIGHT / 2;
  }, [activeIndex]);

  if (lyrics.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
        height: CONTAINER_HEIGHT,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      >
        {lyrics.map((line, i) => {
          const distance = Math.abs(i - activeIndex);
          const isActive = i === activeIndex;
          return (
            <div
              key={`${line.time}-${i}`}
              style={{
                height: LINE_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 24px",
                opacity: getOpacity(distance),
                transform: `scale(${getScale(distance)})`,
                transition: "opacity 0.3s ease, transform 0.3s ease",
                fontSize: isActive ? "13px" : "12px",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? textColor : mutedTextColor,
                letterSpacing: isActive ? "-0.01em" : "0",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {line.text || "\u266A"}
            </div>
          );
        })}
      </div>
    </div>
  );
}