"use client";

import { useState, useEffect, useRef } from "react";
import { findActiveLine, type LyricLine } from "./lrc-parser";

export function useLyricsSync(
  lyrics: LyricLine[],
  audioRef: React.RefObject<HTMLAudioElement | null>
): { activeIndex: number } {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (lyrics.length === 0) return;
    let lastIndex = -1;

    function tick() {
      const audio = audioRef.current;
      if (audio) {
        const idx = findActiveLine(lyrics, audio.currentTime);
        if (idx !== lastIndex) {
          lastIndex = idx;
          setActiveIndex(idx);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lyrics, audioRef]);

  return { activeIndex };
}