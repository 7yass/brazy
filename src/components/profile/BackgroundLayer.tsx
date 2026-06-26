"use client";

import { useEffect, useRef } from "react";
import type { Background } from "@/lib/profile/schema";
import CanvasBackground from "./CanvasBackground";

export default function BackgroundLayer({ background }: { background: Background }) {
  if (background.type === "particles" || background.type === "matrix" || background.type === "starfield" || background.type === "rain" || background.type === "snow" || background.type === "bubbles") {
    return <CanvasBackground background={background} />;
  }

  if (background.type === "aurora") {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: "-20%",
          zIndex: 0,
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
          zIndex: 0,
          pointerEvents: "none",
          background: `linear-gradient(135deg, ${background.color1}, ${background.color2}, ${background.color3})`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 12s ease infinite",
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
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${background.color1}22 1px, transparent 1px), linear-gradient(90deg, ${background.color1}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    );
  }

  if (background.type === "image") {
    return (
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
        }}
      />
    );
  }

  if (background.type === "video") {
    return (
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source src={background.videoUrl} />
      </video>
    );
  }

  if (background.type === "color") {
    return (
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
    );
  }

  return null;
}
