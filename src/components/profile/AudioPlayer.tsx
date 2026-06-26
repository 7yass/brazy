"use client";

import { useEffect, useRef, useState } from "react";
import type { Audio } from "@/lib/profile/schema";

export default function AudioPlayer({ audio }: { audio: Audio }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!audio.enabled || !audio.src) return;
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
  }, [audio]);

  useEffect(() => {
    if (!audio.enabled || !audio.src) return;
    if (audio.autoplay) {
      const el = audioRef.current;
      if (el) {
        el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }
  }, [audio.enabled, audio.src, audio.autoplay]);

  if (!audio.enabled || !audio.src) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    el.currentTime = pct * el.duration;
  };

  return (
    <>
      <audio ref={audioRef} src={audio.src} preload="metadata" />
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
        {show && audio.showVisualizer && (
          <Visualizer audioRef={audioRef} playing={playing} />
        )}
        <div
          onClick={() => setShow((s) => !s)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "rgba(15, 15, 25, 0.7)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            color: "#f8fafc",
            fontSize: 13,
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            cursor: "pointer",
            userSelect: "none",
            maxWidth: 260,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: 16,
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 600 }}>
              {audio.title || "track"}
            </span>
            {audio.artist && (
              <span style={{ fontSize: 11, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {audio.artist}
              </span>
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                seek(e);
              }}
              style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 999, cursor: "pointer" }}
            >
              <div style={{ height: "100%", width: `${progress}%`, background: "#22d3ee", borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, opacity: 0.5 }}>
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Visualizer({
  audioRef,
  playing,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playing: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bars = 24;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const h = playing ? Math.random() * canvas.height * 0.8 + 4 : 4;
        ctx.fillStyle = `hsla(${190 + i * 4}, 90%, 65%, 0.8)`;
        ctx.fillRect(i * w + 1, canvas.height - h, w - 2, h);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={48}
      style={{
        background: "rgba(15,15,25,0.6)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}
