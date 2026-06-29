"use client";

import { useState, useEffect } from "react";
import type { ProfileConfig, Theme, Effects, Background, Identity, Audio } from "@/lib/profile/schema";
import { Toggle, SelectInput, Slider } from "./controls";

// ── Inline animated preview (same logic as UsernameEffectsModal) ──────────────
function EffectPreview({ effect, accent }: { effect: string; accent: string }) {
  const [tick, setTick] = useState(0);
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(true);
  const label = "brazy";

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (effect !== "typewriter") return;
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      setTyped(label.slice(0, i + 1));
      i++;
      if (i >= label.length) clearInterval(t);
    }, 90);
    return () => clearInterval(t);
  }, [effect, tick]);

  useEffect(() => {
    if (effect !== "typewriter") return;
    const t = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(t);
  }, [effect]);

  const base: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#fafafa",
    userSelect: "none",
    display: "inline-block",
  };

  if (effect === "none") return <span style={{ ...base, color: "rgba(255,255,255,0.3)" }}>none</span>;

  if (effect === "glow") return (
    <>
      <style>{`@keyframes gc_glow{0%,100%{text-shadow:0 0 6px ${accent}66,0 0 18px ${accent}33}50%{text-shadow:0 0 14px ${accent}99,0 0 36px ${accent}55}}`}</style>
      <span style={{ ...base, animation: "gc_glow 2s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "rainbow") return (
    <>
      <style>{`@keyframes gc_rb{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <span style={{ ...base, background: "linear-gradient(90deg,#ff0080,#ff8c00,#ffe000,#40ff00,#00c0ff,#8000ff,#ff0080)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "gc_rb 2s linear infinite" }}>{label}</span>
    </>
  );

  if (effect === "glitch") return (
    <>
      <style>{`@keyframes gc_gt{0%,90%,100%{clip-path:inset(0 0 100% 0);transform:translateX(0)}92%{clip-path:inset(0 0 60% 0);transform:translateX(-2px);color:#ff0044}94%{clip-path:inset(30% 0 40% 0);transform:translateX(2px);color:#00ffff}96%{clip-path:inset(60% 0 20% 0);transform:translateX(-1px)}} @keyframes gc_gb{0%,90%,100%{clip-path:inset(100% 0 0 0);transform:translateX(0)}92%{clip-path:inset(60% 0 0 0);transform:translateX(2px);color:#00ffff}94%{clip-path:inset(40% 0 30% 0);transform:translateX(-2px);color:#ff0044}96%{clip-path:inset(20% 0 60% 0);transform:translateX(1px)}}`}</style>
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={base}>{label}</span>
        <span style={{ ...base, position: "absolute", top: 0, left: 0, animation: "gc_gt 3s infinite" }}>{label}</span>
        <span style={{ ...base, position: "absolute", top: 0, left: 0, animation: "gc_gb 3s infinite .05s" }}>{label}</span>
      </div>
    </>
  );

  if (effect === "typewriter") return (
    <span style={base}>{typed}<span style={{ opacity: cursor ? 1 : 0, color: accent, fontWeight: 300 }}>|</span></span>
  );

  if (effect === "neon") return (
    <>
      <style>{`@keyframes gc_neon{0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 4px #fff,0 0 11px #fff,0 0 19px #fff,0 0 40px ${accent},0 0 80px ${accent}}20%,24%,55%{text-shadow:none}}`}</style>
      <span style={{ ...base, color: "#fff", animation: "gc_neon 5s infinite alternate" }}>{label}</span>
    </>
  );

  if (effect === "shake") return (
    <>
      <style>{`@keyframes gc_shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-2px) rotate(-1deg)}40%{transform:translateX(2px) rotate(1deg)}60%{transform:translateX(-1px)}80%{transform:translateX(1px)}}`}</style>
      <span style={{ ...base, display: "inline-block", animation: "gc_shk 0.5s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "gradient") return (
    <>
      <style>{`@keyframes gc_grad{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <span style={{ ...base, background: `linear-gradient(90deg,${accent},#ec4899,${accent})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "gc_grad 2.5s linear infinite" }}>{label}</span>
    </>
  );

  if (effect === "bounce") return (
    <>
      <style>{`@keyframes gc_bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
      <span style={{ ...base, display: "inline-block", animation: "gc_bnc 0.8s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "pulse") return (
    <>
      <style>{`@keyframes gc_pls{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <span style={{ ...base, animation: "gc_pls 1.5s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "wave") return (
    <span style={base}>
      {label.split("").map((ch, i) => (
        <span key={i} style={{ display: "inline-block", animation: `gc_wv 1s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{ch}</span>
      ))}
      <style>{`@keyframes gc_wv{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </span>
  );

  return <span style={base}>{label}</span>;
}

const EFFECTS = [
  { value: "none",       label: "None" },
  { value: "glow",       label: "Glow" },
  { value: "glitch",     label: "Glitch" },
  { value: "typewriter", label: "Typewriter" },
  { value: "rainbow",    label: "Rainbow" },
  { value: "neon",       label: "Neon" },
  { value: "shake",      label: "Shake" },
  { value: "gradient",   label: "Gradient" },
  { value: "bounce",     label: "Bounce" },
  { value: "pulse",      label: "Pulse" },
  { value: "wave",       label: "Wave" },
];

export function GeneralCustomization({
  identity,
  theme,
  background,
  effects,
  audio,
  onUpdate,
}: {
  identity: Partial<Identity>;
  theme: Partial<Theme>;
  background: Partial<Background>;
  effects: Partial<Effects>;
  audio: Partial<Audio>;
  onUpdate: (section: keyof ProfileConfig, key: string, value: unknown) => void;
}) {
  const bgEffectValue = background.type ?? "none";
  const currentEffect = (effects as Record<string, unknown>).usernameEffect as string ?? "none";
  const accent = (theme.primaryColor as string) || "#7c3aed";

  const bgEffectOptions = [
    { value: "none", label: "None" },
    { value: "color", label: "Color" },
    { value: "gradient", label: "Gradient" },
    { value: "particles", label: "Particles" },
    { value: "matrix", label: "Matrix" },
    { value: "starfield", label: "Starfield" },
    { value: "aurora", label: "Aurora" },
    { value: "rain", label: "Rain" },
    { value: "snow", label: "Snow" },
    { value: "bubbles", label: "Bubbles" },
    { value: "grid", label: "Grid" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Bio */}
      <Row label="Description">
        <textarea
          value={identity.bio ?? ""}
          onChange={(e) => onUpdate("identity", "bio", e.target.value)}
          placeholder="Bio"
          rows={3}
          style={{
            background: "#121212",
            border: "2px solid #1b1b1b",
            borderRadius: 14,
            padding: 14,
            color: "#f1f1f1",
            fontSize: 15,
            fontWeight: 500,
            resize: "none",
            width: "100%",
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#333"; }}
          onBlur={(e) => { e.target.style.borderColor = "#1b1b1b"; }}
        />
      </Row>

      {/* Background Effects */}
      <Row label="Background Effects">
        <div style={{ width: 140 }}>
          <SelectInput
            value={bgEffectValue}
            onChange={(v) => onUpdate("background", "type", v)}
            options={bgEffectOptions}
          />
        </div>
      </Row>

      {/* Username Effects — inline card grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 15, color: "#a5a4a4", fontWeight: 450 }}>Username Effects</span>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}>
          {EFFECTS.map((eff) => {
            const isActive = currentEffect === eff.value;
            return (
              <button
                key={eff.value}
                onClick={() => {
                  onUpdate("effects", "usernameEffect", eff.value);
                  onUpdate("effects", "typewriterTitle", eff.value === "typewriter");
                  onUpdate("effects", "textGlow", eff.value === "glow" || eff.value === "neon" || eff.value === "rainbow");
                  onUpdate("effects", "glowPulse", eff.value === "glow" || eff.value === "rainbow");
                }}
                style={{
                  position: "relative",
                  height: 72,
                  borderRadius: 12,
                  border: isActive ? `1.5px solid ${accent}` : "1.5px solid rgba(255,255,255,0.07)",
                  background: isActive ? `${accent}18` : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 4px",
                  transition: "border-color .18s, background .18s",
                  overflow: "hidden",
                  boxShadow: isActive ? `0 0 14px ${accent}28` : "none",
                }}
              >
                <div style={{ pointerEvents: "none" }}>
                  <EffectPreview effect={eff.value} accent={accent} />
                </div>
                <span style={{
                  fontSize: 10,
                  color: isActive ? "#fafafa" : "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}>
                  {eff.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Opacity */}
      <Row label="Profile Opacity">
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 220 }}>
          <Slider
            value={theme.cardOpacity ?? 0.55}
            onChange={(v) => onUpdate("theme", "cardOpacity", v)}
            min={0} max={1} step={0.05}
          />
          <span style={{ fontSize: 12, color: "#797979", minWidth: 32, textAlign: "right", flexShrink: 0 }}>
            {Math.round((theme.cardOpacity ?? 0.55) * 100)}%
          </span>
        </div>
      </Row>

      {/* Profile Blur */}
      <Row label="Profile Blur">
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 220 }}>
          <Slider
            value={theme.cardBlur ?? 20}
            onChange={(v) => onUpdate("theme", "cardBlur", v)}
            min={0} max={60} step={1}
          />
          <span style={{ fontSize: 12, color: "#797979", minWidth: 32, textAlign: "right", flexShrink: 0 }}>
            {theme.cardBlur ?? 20}px
          </span>
        </div>
      </Row>

      {/* Location */}
      <Row label="Location">
        <input
          value={identity.location ?? ""}
          onChange={(e) => onUpdate("identity", "location", e.target.value)}
          placeholder="Location"
          style={{
            background: "#121212",
            border: "2px solid #1b1b1b",
            borderRadius: 14,
            padding: "8px 14px",
            color: "#f1f1f1",
            fontSize: 15,
            fontWeight: 500,
            width: "100%",
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#333"; }}
          onBlur={(e) => { e.target.style.borderColor = "#1b1b1b"; }}
        />
      </Row>

      {/* Glow */}
      <Row label="Glow Settings">
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 280 }}>
          <Toggle value={theme.glow ?? false} onChange={(v) => onUpdate("theme", "glow", v)} label="" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <Slider
              value={theme.glowIntensity ?? 60}
              onChange={(v) => onUpdate("theme", "glowIntensity", v)}
              min={0} max={100} step={5}
            />
            <span style={{ fontSize: 12, color: "#797979", minWidth: 32, textAlign: "right", flexShrink: 0 }}>
              {theme.glowIntensity ?? 60}%
            </span>
          </div>
        </div>
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 36 }}>
      <span style={{ fontSize: 15, color: "#a5a4a4", fontWeight: 450, flexShrink: 0, minWidth: 120 }}>{label}</span>
      <div style={{ display: "flex", justifyContent: "flex-end", flex: 1, maxWidth: 300 }}>{children}</div>
    </div>
  );
}
