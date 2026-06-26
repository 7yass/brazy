"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (id: string, opts: Record<string, unknown>) => YTPlayer;
      PlayerState: { PLAYING: number; [key: string]: number };
      ready?: boolean;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

export default function AudioPlayer({
  audioTrackId,
  audioTitle,
  audioArtist,
  audioThumb,
}: {
  audioTrackId?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioThumb?: string;
}) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioTrackId) return;

    const initPlayer = () => {
      playerRef.current = new window.YT!.Player("yt-player", {
        videoId: audioTrackId,
        playerVars: { autoplay: 1, enablejsapi: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === window.YT?.PlayerState.PLAYING);
          },
        },
      });
    };

    if (window.YT) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [audioTrackId]);

  if (!audioTrackId) return null;

  return (
    <>
      <div
        id="yt-player"
        style={{ width: 0, height: 0, position: "absolute", pointerEvents: "none", opacity: 0, overflow: "hidden" }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 80,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 10,
          background: "#121212",
          border: "1px solid #1b1b1b",
          borderRadius: 14,
          maxWidth: 300,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        }}
      >
        {audioThumb && (
          <img
            src={audioThumb}
            alt=""
            style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fafafa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {audioTitle || "track"}
          </p>
          {audioArtist && (
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#a5a4a4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {audioArtist}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            const p = playerRef.current;
            if (!p) return;
            if (playing) { p.pauseVideo(); setPlaying(false); }
            else { p.playVideo(); setPlaying(true); }
          }}
          style={{
            background: "none",
            border: "none",
            color: "#fafafa",
            cursor: "pointer",
            fontSize: 18,
            padding: "4px 8px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
    </>
  );
}
