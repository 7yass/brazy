"use client";

import { useEffect, useRef } from "react";
import type { Background } from "@/lib/profile/schema";

export default function CanvasBackground({ background }: { background: Background }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // Aurora and grid are pure CSS — no canvas needed
  if (background.type === "aurora") {
    return <AuroraBackground background={background} />;
  }
  if (background.type === "grid") {
    return <GridBackground background={background} />;
  }

  // Canvas-based effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    cancelAnimationFrame(animRef.current);

    // User palette from config
    const palette = [background.color1 || "#7c3aed", background.color2 || "#22d3ee", background.color3 || "#ec4899"];
    const speed = background.speed ?? 1;
    const density = background.density ?? 1;
    const size = background.size ?? 3;

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = () => palette[Math.floor(Math.random() * palette.length)];

    // ── PARTICLES ──────────────────────────────────────────────────────────────
    if (background.type === "particles") {
      const count = Math.floor(55 * density);
      type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string };
      const pts: P[] = Array.from({ length: count }, () => ({
        x: rand(0, w()), y: rand(0, h()),
        vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
        r: rand(1.5, size + 1), a: rand(0.3, 0.85), color: pick(),
      }));

      const draw = () => {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          // mouse repel
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) { p.vx -= dx * 0.0006; p.vy -= dy * 0.0006; }
          // clamp velocity
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > 1.5) { p.vx *= 1.5 / spd; p.vy *= 1.5 / spd; }
          p.x += p.vx * speed; p.y += p.vy * speed;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          // dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.a;
          ctx.fill();
          // lines between close particles
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 90) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - d / 90) * 0.25;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── STARFIELD ──────────────────────────────────────────────────────────────
    else if (background.type === "starfield") {
      const count = Math.floor(120 * density);
      type S = { x: number; y: number; vy: number; r: number; a: number; twinkle: number };
      const stars: S[] = Array.from({ length: count }, () => ({
        x: rand(0, w()), y: rand(0, h()),
        vy: rand(0.08, 0.35) * speed,
        r: rand(0.4, 1.8),
        a: rand(0.4, 1),
        twinkle: rand(0, Math.PI * 2),
      }));

      const draw = () => {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);
        const t = Date.now() * 0.001;
        for (const s of stars) {
          s.y += s.vy;
          s.twinkle += 0.02;
          if (s.y > H + 2) { s.y = -2; s.x = rand(0, W); }
          const alpha = s.a * (0.6 + 0.4 * Math.sin(s.twinkle + t));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── RAIN ───────────────────────────────────────────────────────────────────
    else if (background.type === "rain") {
      const count = Math.floor(80 * density);
      const color = background.color1 || "#60a5fa";
      type R = { x: number; y: number; vy: number; len: number; a: number };
      const drops: R[] = Array.from({ length: count }, () => ({
        x: rand(0, w()), y: rand(-200, h()),
        vy: rand(6, 14) * speed,
        len: rand(10, 24),
        a: rand(0.15, 0.45),
      }));

      const draw = () => {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);
        ctx.lineWidth = 1;
        for (const d of drops) {
          d.y += d.vy;
          if (d.y > H + 30) { d.y = rand(-100, 0); d.x = rand(0, W); }
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.vy * 0.15, d.y + d.len);
          ctx.strokeStyle = color;
          ctx.globalAlpha = d.a;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── MATRIX ─────────────────────────────────────────────────────────────────
    else if (background.type === "matrix") {
      const fontSize = 13;
      const cols = Math.floor(w() / fontSize);
      const drops: number[] = Array.from({ length: cols }, () => Math.random() * -50);
      const color = background.color1 || "#22c55e";

      const draw = () => {
        const W = w(), H = h();
        // fade trail
        ctx.fillStyle = "rgba(8,7,13,0.12)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
          // head character brighter
          const isHead = drops[i] > 0 && drops[i] < H / fontSize;
          ctx.fillStyle = isHead ? "#ffffff" : color;
          ctx.globalAlpha = isHead ? 0.9 : rand(0.3, 0.7);
          const char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          drops[i] += speed * 0.8;
          if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── SNOW ───────────────────────────────────────────────────────────────────
    else if (background.type === "snow") {
      const count = Math.floor(70 * density);
      type Fl = { x: number; y: number; vx: number; vy: number; r: number; a: number; wobble: number };
      const flakes: Fl[] = Array.from({ length: count }, () => ({
        x: rand(0, w()), y: rand(-50, h()),
        vx: rand(-0.3, 0.3), vy: rand(0.4, 1.4) * speed,
        r: rand(1.5, 4.5), a: rand(0.4, 0.9),
        wobble: rand(0, Math.PI * 2),
      }));

      const draw = () => {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);
        for (const f of flakes) {
          f.wobble += 0.015;
          f.x += f.vx + Math.sin(f.wobble) * 0.3;
          f.y += f.vy;
          if (f.y > H + 10) { f.y = -10; f.x = rand(0, W); }
          if (f.x < -10) f.x = W + 10;
          if (f.x > W + 10) f.x = -10;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = f.a;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── BUBBLES ────────────────────────────────────────────────────────────────
    else if (background.type === "bubbles") {
      const count = Math.floor(30 * density);
      type B = { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string };
      const bubbles: B[] = Array.from({ length: count }, () => ({
        x: rand(0, w()), y: rand(0, h()),
        vx: rand(-0.2, 0.2), vy: rand(-0.6, -0.2) * speed,
        r: rand(4, 18), a: rand(0.08, 0.22), color: pick(),
      }));

      const draw = () => {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);
        for (const b of bubbles) {
          b.x += b.vx; b.y += b.vy;
          if (b.y < -b.r * 2) { b.y = H + b.r; b.x = rand(0, W); }
          if (b.x < -b.r) b.x = W + b.r;
          if (b.x > W + b.r) b.x = -b.r;
          // circle stroke
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = b.color;
          ctx.globalAlpha = b.a * 2;
          ctx.lineWidth = 1;
          ctx.stroke();
          // inner fill
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = b.a;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [background]);

  if (background.type === "aurora" || background.type === "grid") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

// ── Aurora — pure CSS, no canvas ──────────────────────────────────────────────

function AuroraBackground({ background }: { background: Background }) {
  const c1 = background.color1 || "#7c3aed";
  const c2 = background.color2 || "#22d3ee";
  const c3 = background.color3 || "#ec4899";
  const spd = background.speed ?? 1;
  const dur1 = Math.max(1, 8 / spd);
  const dur2 = Math.max(1, 11 / spd);
  const dur3 = Math.max(1, 14 / spd);

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes aurora1 {
          0%   { transform: translate(-10%, 10%) scale(1.1) rotate(0deg); }
          33%  { transform: translate(5%, -8%) scale(1.25) rotate(8deg); }
          66%  { transform: translate(-5%, 12%) scale(1.05) rotate(-6deg); }
          100% { transform: translate(-10%, 10%) scale(1.1) rotate(0deg); }
        }
        @keyframes aurora2 {
          0%   { transform: translate(10%, -10%) scale(1.15) rotate(0deg); }
          33%  { transform: translate(-8%, 5%) scale(1.3) rotate(-10deg); }
          66%  { transform: translate(12%, -5%) scale(1.1) rotate(7deg); }
          100% { transform: translate(10%, -10%) scale(1.15) rotate(0deg); }
        }
        @keyframes aurora3 {
          0%   { transform: translate(0%, 0%) scale(1.2) rotate(0deg); }
          50%  { transform: translate(-12%, 8%) scale(1.35) rotate(12deg); }
          100% { transform: translate(0%, 0%) scale(1.2) rotate(0deg); }
        }
      `}</style>
      {/* Blob 1 */}
      <div style={{
        position: "absolute", width: "70vw", height: "70vw",
        top: "-20vw", left: "-15vw",
        background: `radial-gradient(ellipse at center, ${c1}55 0%, ${c1}00 70%)`,
        filter: "blur(60px)",
        animation: `aurora1 ${dur1}s ease-in-out infinite`,
        willChange: "transform",
      }} />
      {/* Blob 2 */}
      <div style={{
        position: "absolute", width: "65vw", height: "65vw",
        top: "10vw", right: "-20vw",
        background: `radial-gradient(ellipse at center, ${c2}44 0%, ${c2}00 70%)`,
        filter: "blur(70px)",
        animation: `aurora2 ${dur2}s ease-in-out infinite`,
        willChange: "transform",
      }} />
      {/* Blob 3 */}
      <div style={{
        position: "absolute", width: "55vw", height: "55vw",
        bottom: "-15vw", left: "20vw",
        background: `radial-gradient(ellipse at center, ${c3}44 0%, ${c3}00 70%)`,
        filter: "blur(80px)",
        animation: `aurora3 ${dur3}s ease-in-out infinite`,
        willChange: "transform",
      }} />
    </div>
  );
}

// ── Grid — pure CSS ────────────────────────────────────────────────────────────

function GridBackground({ background }: { background: Background }) {
  const color = background.color1 || "#7c3aed";
  const spd = background.speed ?? 1;
  const dur = Math.max(0.5, 4 / spd);

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
      `}</style>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${color}18 1px, transparent 1px), linear-gradient(90deg, ${color}18 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        animation: `gridScroll ${dur}s linear infinite`,
      }} />
      {/* subtle center glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${color}12 0%, transparent 70%)`,
      }} />
    </div>
  );
}
