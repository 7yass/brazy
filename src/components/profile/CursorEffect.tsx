"use client";

import { useEffect, useRef, useState } from "react";
import type { Effects } from "@/lib/profile/schema";

type TrailPoint = { x: number; y: number; age: number; rot?: number; vx?: number; vy?: number };

export default function CursorEffect({ effects }: { effects: Effects }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const prevMouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const animRef = useRef<number>(0);

  // Emoji cursor overlay position
  const [emojiPos, setEmojiPos] = useState({ x: -999, y: -999 });

  const type = effects.cursor.type;
  const isEmojiType = type === "cat" || type === "bubble" || type === "snowflake";

  // Following dot / ghost cursor DOM-based state
  const dotRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const isDomType = type === "dot" || type === "ghost";

  useEffect(() => {
    if (!effects.cursor.enabled || type === "none") return;

    // ── Emoji types ──────────────────────────────────────────────
    if (isEmojiType) {
      const onMove = (e: MouseEvent) => setEmojiPos({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }

    // ── DOM-based: Following Dot & Ghost Cursor ──────────────────
    if (isDomType) {
      let raf: number;
      const pos = { x: -999, y: -999 };
      const smoothPos = { x: -999, y: -999 };

      const onMove = (e: MouseEvent) => {
        pos.x = e.clientX;
        pos.y = e.clientY;
      };
      window.addEventListener("mousemove", onMove);

      const tick = () => {
        const lag = type === "ghost" ? 0.08 : 0.25;
        smoothPos.x += (pos.x - smoothPos.x) * lag;
        smoothPos.y += (pos.y - smoothPos.y) * lag;

        if (type === "dot" && dotRef.current) {
          dotRef.current.style.transform = `translate(${smoothPos.x}px, ${smoothPos.y}px)`;
        }
        if (type === "ghost" && ghostRef.current) {
          ghostRef.current.style.transform = `translate(${smoothPos.x}px, ${smoothPos.y}px)`;
        }
        raf = requestAnimationFrame(tick);
      };
      tick();

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
      };
    }

    // ── Canvas-based effects ──────────────────────────────────────
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // For particles: spawn on move
      if (type === "particles") {
        for (let i = 0; i < 3; i++) {
          trailRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            age: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 2 + 0.5),
            rot: Math.random() * Math.PI * 2,
          });
        }
      }

      // For shooting star: spawn a streak on move
      if (type === "shooting") {
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > 3) {
          trailRef.current.push({
            x: e.clientX,
            y: e.clientY,
            age: 0,
            rot: Math.atan2(dy, dx),
            vx: dx,
            vy: dy,
          });
        }
      }
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const sm = smoothRef.current;

      const lag = effects.cursor.followLag ?? 0.18;
      sm.x += (mx - sm.x) * lag;
      sm.y += (my - sm.y) * lag;

      // Trail-based types push every frame
      if (type !== "particles" && type !== "shooting") {
        trailRef.current.push({ x: sm.x, y: sm.y, age: 0, rot: Math.random() * Math.PI * 2 });
      }

      trailRef.current = trailRef.current.filter((p) => {
        p.age += effects.cursor.fade ?? 0.12;
        return p.age < 1;
      });

      const color = effects.cursor.color;
      const size = effects.cursor.size ?? 6;

      if (type === "trail") {
        for (let i = 1; i < trailRef.current.length; i++) {
          const p = trailRef.current[i];
          const prev = trailRef.current[i - 1];
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 1 - p.age;
          ctx.lineWidth = size;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      } else if (type === "dots") {
        for (const p of trailRef.current) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 1 - p.age;
          ctx.fill();
        }
      } else if (type === "sparkles") {
        for (const p of trailRef.current) {
          const sparkleSize = size * (1 - p.age);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot ?? 0) + p.age * Math.PI);
          ctx.globalAlpha = (1 - p.age) * 0.9;
          ctx.fillStyle = color;
          drawStar(ctx, 0, 0, 4, sparkleSize, sparkleSize * 0.4);
          ctx.fill();
          ctx.restore();
        }
      } else if (type === "rings") {
        for (let i = 0; i < trailRef.current.length; i += 4) {
          const p = trailRef.current[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * (1 + p.age * 4), 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.globalAlpha = (1 - p.age) * 0.6;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } else if (type === "glow") {
        const gradient = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, size * 8);
        gradient.addColorStop(0, color + "66");
        gradient.addColorStop(1, color + "00");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, size * 8, 0, Math.PI * 2);
        ctx.fill();

      // ── NEW: Particles ─────────────────────────────────────────
      } else if (type === "particles") {
        for (const p of trailRef.current) {
          p.x += p.vx ?? 0;
          p.y += p.vy ?? 0;
          (p as any).vy = ((p.vy ?? 0)) + 0.05; // gravity
          const s = size * (1 - p.age) * 0.8;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot ?? 0);
          ctx.globalAlpha = (1 - p.age) * 0.85;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

      // ── NEW: Shooting Star ─────────────────────────────────────
      } else if (type === "shooting") {
        for (const p of trailRef.current) {
          const len = Math.sqrt((p.vx ?? 0) ** 2 + (p.vy ?? 0) ** 2) * (1 - p.age) * 0.6;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot ?? 0);
          const grad = ctx.createLinearGradient(-len, 0, size, 0);
          grad.addColorStop(0, color + "00");
          grad.addColorStop(1, color);
          ctx.globalAlpha = (1 - p.age) * 0.9;
          ctx.strokeStyle = grad;
          ctx.lineWidth = size * 0.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-len, 0);
          ctx.lineTo(size, 0);
          ctx.stroke();
          // star at tip
          ctx.fillStyle = color;
          ctx.globalAlpha = (1 - p.age);
          ctx.beginPath();
          ctx.arc(size, 0, size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [type, isEmojiType, isDomType, effects.cursor.enabled, effects.cursor.color, effects.cursor.size, effects.cursor.fade, effects.cursor.followLag, effects.cursor.url]);

  if (!effects.cursor.enabled || type === "none") return null;

  const emojiMap = { cat: "🐱", bubble: "🫧", snowflake: "❄️" };

  if (isEmojiType) {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: emojiPos.x,
          top: emojiPos.y,
          transform: "translate(-50%, -50%)",
          fontSize: 22,
          pointerEvents: "none",
          zIndex: 9999,
          userSelect: "none",
          transition: "left 0.04s linear, top 0.04s linear",
          filter: type === "bubble" ? `drop-shadow(0 0 6px ${effects.cursor.color})` : "none",
        }}
      >
        {emojiMap[type as keyof typeof emojiMap]}
      </div>
    );
  }

  // ── Following Dot ──────────────────────────────────────────────
  if (type === "dot") {
    return (
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: (effects.cursor.size ?? 6) * 2,
          height: (effects.cursor.size ?? 6) * 2,
          borderRadius: "50%",
          background: effects.cursor.color,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-999px, -999px)",
          marginLeft: -(effects.cursor.size ?? 6),
          marginTop: -(effects.cursor.size ?? 6),
          boxShadow: `0 0 ${(effects.cursor.size ?? 6) * 2}px ${effects.cursor.color}`,
          willChange: "transform",
        }}
      />
    );
  }

  // ── Ghost Cursor ───────────────────────────────────────────────
  if (type === "ghost") {
    return (
      <div
        ref={ghostRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: (effects.cursor.size ?? 6) * 4,
          height: (effects.cursor.size ?? 6) * 4,
          borderRadius: "50%",
          border: `2px solid ${effects.cursor.color}`,
          background: effects.cursor.color + "18",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-999px, -999px)",
          marginLeft: -(effects.cursor.size ?? 6) * 2,
          marginTop: -(effects.cursor.size ?? 6) * 2,
          backdropFilter: "blur(1px)",
          willChange: "transform",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outer: number, inner: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.lineTo(cx, cy - outer);
  ctx.closePath();
}
