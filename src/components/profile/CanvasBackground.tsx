"use client";

import { useEffect, useRef } from "react";
import type { Background } from "@/lib/profile/schema";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

const COLORS: Record<string, string[]> = {
  particles: ["#8b5cf6", "#22d3ee", "#ec4899", "#fbbf24"],
  starfield: ["#ffffff", "#cbd5e1", "#94a3b8"],
  rain: ["#60a5fa", "#3b82f6", "#93c5fd"],
  snow: ["#ffffff", "#e2e8f0", "#f1f5f9"],
  bubbles: ["#22d3ee", "#06b6d4", "#67e8f9"],
  aurora: ["#8b5cf6", "#22d3ee", "#ec4899", "#10b981"],
};

export default function CanvasBackground({ background }: { background: Background }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const palette = COLORS[background.type] || COLORS.particles;
    const count = Math.floor(60 * background.density);

    const makeParticle = (): Particle => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const color = palette[Math.floor(Math.random() * palette.length)];
      switch (background.type) {
        case "starfield":
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0,
            vy: 0.2 + Math.random() * 0.8,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random(),
            color,
          };
        case "rain":
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0,
            vy: 4 + Math.random() * 6,
            size: Math.random() * 1.5 + 0.5,
            alpha: 0.3 + Math.random() * 0.5,
            color,
          };
        case "snow":
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.5 + Math.random() * 1.5,
            size: Math.random() * 3 + 1,
            alpha: 0.4 + Math.random() * 0.6,
            color,
          };
        case "bubbles":
          return {
            x: Math.random() * w,
            y: h + Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(0.5 + Math.random() * 1.5),
            size: Math.random() * 6 + 2,
            alpha: 0.2 + Math.random() * 0.4,
            color,
          };
        default:
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * background.size + 1,
            alpha: 0.3 + Math.random() * 0.7,
            color,
          };
      }
    };

    particlesRef.current = Array.from({ length: count }, makeParticle);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const draw = () => {
      const width = w();
      const height = h();

      if (background.type === "matrix") {
        ctx.fillStyle = "rgba(8, 7, 13, 0.1)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#22c55e";
        ctx.font = "14px monospace";
        const cols = Math.floor(width / 16);
        for (let i = 0; i < cols; i++) {
          const char = String.fromCharCode(0x30a0 + Math.random() * 96);
          const y = ((Date.now() / 8 + i * 37) % (height + 200)) - 100;
          ctx.fillText(char, i * 16, y);
        }
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const parts = particlesRef.current;

      if (background.type === "particles") {
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          p.x += p.vx * background.speed;
          p.y += p.vy * background.speed;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.vx -= dx * 0.0005;
            p.vy -= dy * 0.0005;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          for (let j = i + 1; j < parts.length; j++) {
            const p2 = parts[j];
            const d = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (d < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - d / 100) * 0.3;
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      } else {
        for (const p of parts) {
          p.x += p.vx * background.speed;
          p.y += p.vy * background.speed;
          if (background.type === "bubbles") {
            if (p.y < -20) {
              p.y = height + 20;
              p.x = Math.random() * width;
            }
          } else {
            if (p.y > height + 10) {
              p.y = -10;
              p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
          }

          ctx.beginPath();
          if (background.type === "rain") {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.size * 8);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.lineWidth = p.size;
            ctx.stroke();
          } else {
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [background]);

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
        zIndex: 0,
      }}
    />
  );
}
