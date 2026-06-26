"use client";

import { useEffect, useRef } from "react";
import type { Effects } from "@/lib/profile/schema";

type TrailPoint = { x: number; y: number; age: number };

export default function CursorEffect({ effects }: { effects: Effects }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !effects.cursor.enabled) return;
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
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const sm = smoothRef.current;
      sm.x += (mx - sm.x) * effects.cursor.followLag;
      sm.y += (my - sm.y) * effects.cursor.followLag;

      trailRef.current.push({ x: sm.x, y: sm.y, age: 0 });
      trailRef.current = trailRef.current.filter((p) => {
        p.age += effects.cursor.fade;
        return p.age < 1;
      });

      const color = effects.cursor.color;
      const size = effects.cursor.size;

      if (effects.cursor.type === "trail") {
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
      } else if (effects.cursor.type === "dots") {
        for (const p of trailRef.current) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 1 - p.age;
          ctx.fill();
        }
      } else if (effects.cursor.type === "sparkles") {
        for (const p of trailRef.current) {
          const sparkleSize = size * (1 - p.age);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.age * Math.PI);
          ctx.globalAlpha = (1 - p.age) * 0.9;
          ctx.fillStyle = color;
          drawStar(ctx, 0, 0, 4, sparkleSize, sparkleSize * 0.4);
          ctx.fill();
          ctx.restore();
        }
      } else if (effects.cursor.type === "rings") {
        for (let i = 0; i < trailRef.current.length; i += 4) {
          const p = trailRef.current[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * (1 + p.age * 4), 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.globalAlpha = (1 - p.age) * 0.6;
          ctx.lineWidth = 1.5;
          ctx.stroke();
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
  }, [effects.cursor]);

  if (!effects.cursor.enabled || effects.cursor.type === "none") return null;

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
        zIndex: 50,
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
