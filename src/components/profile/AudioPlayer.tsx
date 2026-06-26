"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Audio } from "@/lib/profile/schema";

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
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface AudioPlayerProps {
  audio: Audio;
  audioTrackId?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioThumb?: string;
}

export default function AudioPlayer({ audio, audioTrackId, audioTitle, audioArtist, audioThumb }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const apiReadyRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [show, setShow] = useState(false);

  const hasYoutube = Boolean(audioTrackId);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggle = useCallback(() => {
    if (hasYoutube && playerRef.current) {
      const state = playerRef.current.getPlayerState();
      if (state === window.YT?.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
        setPlaying(false);
      } else {
        playerRef.current.playVideo();
        setPlaying(true);
      }
    } else if (audioRef.current) {
      const el = audioRef.current;
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        el.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
  }, [hasYoutube, playing]);

  useEffect(() => {
    if (!hasYoutube) return;

    let pollInterval: ReturnType<typeof setInterval>;

    const initPlayer = () => {
      if (!window.YT?.ready) return;
      apiReadyRef.current = true;
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: audioTrackId,
        playerVars: {
          autoplay: audio.autoplay ? 1 : 0,
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === window.YT?.PlayerState.PLAYING);
          },
          onReady: () => {
            if (audio.autoplay) setPlaying(true);
          },
        },
      });

      pollInterval = setInterval(() => {
        try {
          const p = playerRef.current;
          if (!p) return;
          const state = p.getPlayerState();
          if (state === window.YT?.PlayerState.PLAYING) {
            const elapsed = p.getCurrentTime();
            const dur = p.getDuration();
            setCurrentTime(formatTime(elapsed));
            setDuration(formatTime(dur));
            setProgress(dur ? (elapsed / dur) * 100 : 0);
          }
        } catch {}
      }, 500);
    };

    if (window.YT?.ready) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        if (window.YT) window.YT.ready = true;
        initPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      clearInterval(pollInterval);
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [audioTrackId, hasYoutube, audio.autoplay]);

  useEffect(() => {
    if (hasYoutube || !audio.enabled || !audio.src) return;
    const el = audioRef.current;
    if (!el) return;
    el.volume = audio.volume;
    el.loop = audio.loop;
    const onLoaded = () => setDuration(formatTime(el.duration));
    const onTime = () => {
      setCurrentTime(formatTime(el.currentTime));
      setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
    };
    const onEnded = () => setPlaying(false);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [audio, hasYoutube]);

  if (!audioTrackId && (!audio.enabled || !audio.src)) return null;

  const showPlayer = show || hasYoutube;

  return (
    <>
      {hasYoutube && (
        <div
          id="yt-player"
          style={{
            width: 0,
            height: 0,
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            overflow: "hidden",
          }}
        />
      )}
      {!hasYoutube && <audio ref={audioRef} src={audio.src} preload="metadata" />}

      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        {showPlayer && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              background: "rgba(15, 15, 25, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              color: "#f8fafc",
              fontSize: 13,
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              maxWidth: 300,
            }}
          >
            {audioThumb && (
              <img
                src={audioThumb}
                alt=""
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); toggle(); }}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: 16,
                padding: 0,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 600 }}>
                {audioTitle || audio.title || "track"}
              </span>
              {audioArtist && (
                <span style={{ fontSize: 11, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {audioArtist}
                </span>
              )}
              {!hasYoutube && show && (
                <>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 999, cursor: "pointer" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: "#22d3ee", borderRadius: 999 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, opacity: 0.5 }}>
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
