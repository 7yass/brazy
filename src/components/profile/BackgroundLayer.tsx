"use client";

import { useState, useEffect } from "react";
import type { Background } from "@/lib/profile/schema";
import CanvasBackground from "./CanvasBackground";

/* ── helpers ─────────────────────────────────────────────────── */

const CANVAS_TYPES = new Set(["particles", "matrix", "starfield", "rain", "snow", "bubbles"]);
const NO_OVERLAY_TYPES = new Set(["none", "color", "image", "video"]);

/* ── Base layer (zIndex 0) ───────────────────────────────────── */

function BaseLayer({ background }: { background: Background }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (background.imageUrl) {
      setImageLoaded(false);
      const img = new Image();
      img.src = background.imageUrl;
      img.onload = () => setImageLoaded(true);
    }
  }, [background.imageUrl]);

  useEffect(() => {
    setVideoLoaded(false);
  }, [background.videoUrl]);

  return (
    <>
      {/* Fallback solid color (visible under everything) */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: background.color1,
        }}
      />

      {/* Image Layer */}
      {background.imageUrl && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `url(${background.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: background.blur ? `blur(${background.blur}px)` : "none",
            transform: background.blur ? "scale(1.05)" : "none",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
          }}
        />
      )}

      {/* Video Layer */}
      {background.videoUrl && (
        <>
          <video
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            onPlay={() => setVideoLoaded(true)}
            onLoadedData={() => setVideoLoaded(true)}
            style={{
              position: "fixed",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
              pointerEvents: "none",
              filter: background.blur ? `blur(${background.blur}px)` : "none",
              transform: background.blur ? "scale(1.05)" : "none",
              opacity: videoLoaded ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
            }}
          >
            <source src={background.videoUrl} />
          </video>

          {/* Loading Indicator */}
          {!videoLoaded && (
            <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/[0.06] px-3 py-1.5 rounded-full font-sans select-none">
              <div className="w-2 h-2 rounded-full bg-red-650 animate-pulse" />
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-400">Loading backdrop...</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ── Effect overlay (zIndex 1) ───────────────────────────────── */

function EffectOverlay({ background }: { background: Background }) {
  // No overlay for these types
  if (NO_OVERLAY_TYPES.has(background.type)) return null;

  // Canvas-based effects
  if (CANVAS_TYPES.has(background.type)) {
    return <CanvasBackground background={background} />;
  }

  if (background.type === "aurora") {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: "-20%",
          zIndex: 1,
          pointerEvents: "none",
          filter: "blur(60px)",
          opacity: 0.7,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(40% 50% at 20% 50%, ${background.color1} 0%, transparent 60%), radial-gradient(40% 50% at 80% 50%, ${background.color2} 0%, transparent 60%), radial-gradient(40% 50% at 50% 80%, ${background.color3} 0%, transparent 60%)`,
            animation: "aurora 14s ease-in-out infinite alternate",
          }}
        />
      </div>
    );
  }

  if (background.type === "gradient") {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `linear-gradient(135deg, ${background.color1}, ${background.color2}, ${background.color3})`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 12s ease infinite",
          opacity: (background.imageUrl || background.videoUrl) ? 0.45 : 1,
        }}
      />
    );
  }

  if (background.type === "grid") {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${background.color1}22 1px, transparent 1px), linear-gradient(90deg, ${background.color1}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    );
  }

  return null;
}

/* ── Composed component ──────────────────────────────────────── */

export default function BackgroundLayer({ background }: { background: Background }) {
  return (
    <>
      <BaseLayer background={background} />
      <EffectOverlay background={background} />
    </>
  );
}
