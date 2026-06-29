"use client";

import { useEffect, useRef } from "react";
import type { Effects } from "@/lib/profile/schema";

type Burst = {
  x: number;
  y: number;
  particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[];
};

export default function ClickEffect({ effects }: { effects: Effects }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const burstsRef = useRef<Burst[]>([]);

  useEffect(() => {
    if (!effects.click.enabled) return;

    const spawn = (x: number, y: number) => {
      const count = effects.click.count;
      const particles = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 2 + Math.random() * 4;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 3 + Math.random() * 4,
        };
      });
      burstsRef.current.push({ x, y, particles });
    };

    const onClick = (e: MouseEvent) => {
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [effects.click.enabled, effects.click.count]);

  useEffect(() => {
    if (!effects.click.enabled) return;
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const tick = () => {
      const bursts = burstsRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i];
        let alive = false;
        for (const p of burst.particles) {
          if (p.life <= 0) continue;
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.life -= 0.02;
          const el = document.createElement("div");
          el.style.cssText = `position:fixed;left:${p.x}px;top:${p.y}px;pointer-events:none;z-index:60;`;
          if (effects.click.type === "hearts") {
            el.innerHTML = `<span style="font-size:${p.size * 3}px;opacity:${Math.max(0, p.life)}">❤️</span>`;
          } else if (effects.click.type === "emojis") {
            el.innerHTML = `<span style="font-size:${p.size * 3}px;opacity:${Math.max(0, p.life)}">${effects.click.emoji}</span>`;
          } else if (effects.click.type === "confetti") {
            el.innerHTML = `<div style="width:${p.size}px;height:${p.size * 1.6}px;background:${effects.click.color};opacity:${Math.max(0, p.life)};transform:rotate(${p.x * 10}deg)"></div>`;
          } else if (effects.click.type === "ripple") {
            el.innerHTML = `<div style="position:fixed;left:${burst.x - 20}px;top:${burst.y - 20}px;width:40px;height:40px;border:2px solid ${effects.click.color};border-radius:50%;opacity:${Math.max(0, p.life)};transform:scale(${(1 - p.life) * 4})"></div>`;
          } else {
            el.innerHTML = `<div style="width:${p.size}px;height:${p.size}px;background:${effects.click.color};border-radius:50%;opacity:${Math.max(0, p.life)}"></div>`;
          }
          container.appendChild(el);
          requestAnimationFrame(() => el.remove());
        }
        if (!alive) bursts.splice(i, 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [effects.click.enabled, effects.click.type, effects.click.color, effects.click.emoji]);

  if (!effects.click.enabled || effects.click.type === "none") return null;
  return <div ref={containerRef} aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60 }} />;
}
