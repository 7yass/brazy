"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Mini animated preview of each effect ─────────────────────────────────────
function EffectPreview({ effect, accent }: { effect: string; accent: string }) {
  const [tick, setTick] = useState(0);
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(true);
  const label = "brazy";

  // re-trigger loop animations
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3500);
    return () => clearInterval(t);
  }, []);

  // typewriter in preview
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

  // cursor blink
  useEffect(() => {
    if (effect !== "typewriter") return;
    const t = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(t);
  }, [effect]);

  const base: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#fafafa",
    userSelect: "none",
    display: "inline-block",
  };

  if (effect === "none") return <span style={{ ...base, color: "rgba(255,255,255,0.4)" }}>none</span>;

  if (effect === "glow") return (
    <>
      <style>{`@keyframes pg_${effect} { 0%,100%{text-shadow:0 0 8px ${accent}66,0 0 24px ${accent}33} 50%{text-shadow:0 0 18px ${accent}99,0 0 44px ${accent}55} }`}</style>
      <span style={{ ...base, animation: `pg_${effect} 2s ease-in-out infinite` }}>{label}</span>
    </>
  );

  if (effect === "rainbow") return (
    <>
      <style>{`@keyframes pg_rb{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <span style={{
        ...base,
        background: "linear-gradient(90deg,#ff0080,#ff8c00,#ffe000,#40ff00,#00c0ff,#8000ff,#ff0080)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "pg_rb 2s linear infinite",
      }}>{label}</span>
    </>
  );

  if (effect === "glitch") return (
    <>
      <style>{`
        @keyframes pg_gt { 0%,90%,100%{clip-path:inset(0 0 100% 0);transform:translateX(0)} 92%{clip-path:inset(0 0 60% 0);transform:translateX(-3px);color:#ff0044} 94%{clip-path:inset(30% 0 40% 0);transform:translateX(3px);color:#00ffff} 96%{clip-path:inset(60% 0 20% 0);transform:translateX(-2px)} }
        @keyframes pg_gb { 0%,90%,100%{clip-path:inset(100% 0 0 0);transform:translateX(0)} 92%{clip-path:inset(60% 0 0 0);transform:translateX(3px);color:#00ffff} 94%{clip-path:inset(40% 0 30% 0);transform:translateX(-3px);color:#ff0044} 96%{clip-path:inset(20% 0 60% 0);transform:translateX(2px)} }
      `}</style>
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={base}>{label}</span>
        <span style={{ ...base, position: "absolute", top: 0, left: 0, animation: "pg_gt 3s infinite" }}>{label}</span>
        <span style={{ ...base, position: "absolute", top: 0, left: 0, animation: "pg_gb 3s infinite .05s" }}>{label}</span>
      </div>
    </>
  );

  if (effect === "typewriter") return (
    <span style={base}>
      {typed}
      <span style={{ opacity: cursor ? 1 : 0, color: accent, fontWeight: 300 }}>|</span>
    </span>
  );

  if (effect === "neon") return (
    <>
      <style>{`@keyframes pg_neon{0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 4px #fff,0 0 11px #fff,0 0 19px #fff,0 0 40px ${accent},0 0 80px ${accent}}20%,24%,55%{text-shadow:none}}`}</style>
      <span style={{ ...base, color: "#fff", animation: "pg_neon 5s infinite alternate" }}>{label}</span>
    </>
  );

  if (effect === "shake") return (
    <>
      <style>{`@keyframes pg_shk{0%,100%{transform:translateX(0)} 20%{transform:translateX(-3px) rotate(-1deg)} 40%{transform:translateX(3px) rotate(1deg)} 60%{transform:translateX(-2px)} 80%{transform:translateX(2px)}}`}</style>
      <span style={{ ...base, display: "inline-block", animation: "pg_shk 0.5s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "gradient") return (
    <>
      <style>{`@keyframes pg_grad{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <span style={{
        ...base,
        background: `linear-gradient(90deg,${accent},#ec4899,${accent})`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "pg_grad 2.5s linear infinite",
      }}>{label}</span>
    </>
  );

  if (effect === "bounce") return (
    <>
      <style>{`@keyframes pg_bnc{0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)}}`}</style>
      <span style={{ ...base, display: "inline-block", animation: "pg_bnc 0.8s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "pulse") return (
    <>
      <style>{`@keyframes pg_pls{0%,100%{opacity:1} 50%{opacity:0.3}}`}</style>
      <span style={{ ...base, animation: "pg_pls 1.5s ease-in-out infinite" }}>{label}</span>
    </>
  );

  if (effect === "wave") return (
    <>
      <style>{`@keyframes pg_wv0{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} @keyframes pg_wv1{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} @keyframes pg_wv2{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} @keyframes pg_wv3{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} @keyframes pg_wv4{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      <span style={base}>
        {label.split("").map((ch, i) => (
          <span key={i} style={{ display: "inline-block", animation: `pg_wv${i % 5} 1s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{ch}</span>
        ))}
      </span>
    </>
  );

  return <span style={base}>{label}</span>;
}

// ─── Effect definitions ────────────────────────────────────────────────────────
const EFFECTS = [
  { value: "none",       label: "None",       free: true },
  { value: "typewriter", label: "Typewriter",  free: true },
  { value: "rainbow",    label: "Rainbow",     free: true },
  { value: "glitch",     label: "Glitch",      free: true },
  { value: "glow",       label: "Glow",        free: true },
  { value: "neon",       label: "Neon",        free: true },
  { value: "shake",      label: "Shake",       free: true },
  { value: "gradient",   label: "Gradient",    free: true },
  { value: "bounce",     label: "Bounce",      free: true },
  { value: "pulse",      label: "Pulse",       free: true },
  { value: "wave",       label: "Wave",        free: true },
];

// ─── Live name preview ─────────────────────────────────────────────────────────
function LivePreview({ effect, name, accent }: { effect: string; name: string; accent: string }) {
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (effect !== "typewriter") { setTyped(name); return; }
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      setTyped(name.slice(0, i + 1));
      i++;
      if (i >= name.length) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, [name, effect]);

  useEffect(() => {
    if (effect !== "typewriter") return;
    const t = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(t);
  }, [effect]);

  const base: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#fafafa",
    display: "inline-block",
  };

  if (effect === "glow") return (
    <>
      <style>{`@keyframes lp_glow{0%,100%{text-shadow:0 0 12px ${accent}77,0 0 32px ${accent}33}50%{text-shadow:0 0 24px ${accent}aa,0 0 60px ${accent}55}}`}</style>
      <span style={{ ...base, animation: "lp_glow 2.5s ease-in-out infinite" }}>{name}</span>
    </>
  );
  if (effect === "rainbow") return (
    <>
      <style>{`@keyframes lp_rb{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <span style={{ ...base, background: "linear-gradient(90deg,#ff0080,#ff8c00,#ffe000,#40ff00,#00c0ff,#8000ff,#ff0080)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "lp_rb 2s linear infinite" }}>{name}</span>
    </>
  );
  if (effect === "glitch") return (
    <>
      <style>{`@keyframes lp_gt{0%,90%,100%{clip-path:inset(0 0 100% 0);transform:translateX(0)}92%{clip-path:inset(0 0 60% 0);transform:translateX(-4px);color:#ff0044}94%{clip-path:inset(30% 0 40% 0);transform:translateX(4px);color:#00ffff}96%{clip-path:inset(60% 0 20% 0);transform:translateX(-2px)}} @keyframes lp_gb{0%,90%,100%{clip-path:inset(100% 0 0 0);transform:translateX(0)}92%{clip-path:inset(60% 0 0 0);transform:translateX(4px);color:#00ffff}94%{clip-path:inset(40% 0 30% 0);transform:translateX(-4px);color:#ff0044}96%{clip-path:inset(20% 0 60% 0);transform:translateX(2px)}}`}</style>
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={base}>{name}</span>
        <span style={{ ...base, position: "absolute", top: 0, left: 0, animation: "lp_gt 3s infinite" }}>{name}</span>
        <span style={{ ...base, position: "absolute", top: 0, left: 0, animation: "lp_gb 3s infinite .05s" }}>{name}</span>
      </div>
    </>
  );
  if (effect === "typewriter") return <span style={base}>{typed}<span style={{ opacity: cursor ? 1 : 0, color: accent, fontWeight: 300, marginLeft: 1 }}>|</span></span>;
  if (effect === "neon") return (
    <>
      <style>{`@keyframes lp_neon{0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 4px #fff,0 0 11px #fff,0 0 19px #fff,0 0 40px ${accent},0 0 80px ${accent}}20%,24%,55%{text-shadow:none}}`}</style>
      <span style={{ ...base, color: "#fff", animation: "lp_neon 5s infinite alternate" }}>{name}</span>
    </>
  );
  if (effect === "shake") return (
    <>
      <style>{`@keyframes lp_shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px) rotate(-1deg)}40%{transform:translateX(3px) rotate(1deg)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}`}</style>
      <span style={{ ...base, display: "inline-block", animation: "lp_shk 0.6s ease-in-out infinite" }}>{name}</span>
    </>
  );
  if (effect === "gradient") return (
    <>
      <style>{`@keyframes lp_grad{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <span style={{ ...base, background: `linear-gradient(90deg,${accent},#ec4899,${accent})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "lp_grad 2.5s linear infinite" }}>{name}</span>
    </>
  );
  if (effect === "bounce") return (
    <>
      <style>{`@keyframes lp_bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>
      <span style={{ ...base, display: "inline-block", animation: "lp_bnc 0.8s ease-in-out infinite" }}>{name}</span>
    </>
  );
  if (effect === "pulse") return (
    <>
      <style>{`@keyframes lp_pls{0%,100%{opacity:1}50%{opacity:0.25}}`}</style>
      <span style={{ ...base, animation: "lp_pls 1.5s ease-in-out infinite" }}>{name}</span>
    </>
  );
  if (effect === "wave") return (
    <span style={base}>
      {name.split("").map((ch, i) => (
        <span key={i} style={{ display: "inline-block", animation: `lp_wv 1s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{ch}</span>
      ))}
      <style>{`@keyframes lp_wv{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>
    </span>
  );
  return <span style={base}>{name}</span>;
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
export default function UsernameEffectsModal({
  open,
  current,
  username,
  accent,
  onSelect,
  onClose,
}: {
  open: boolean;
  current: string;
  username: string;
  accent: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(current);

  // sync if parent changes
  useEffect(() => { if (open) setSelected(current); }, [open, current]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="ue-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Panel */}
          <motion.div
            key="ue-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#0e0c17",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fafafa" }}>Username Effects</span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4, display: "flex", borderRadius: 8, transition: "color .15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fafafa")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)")}>
                <X size={18} />
              </button>
            </div>

            {/* Grid of effects */}
            <div style={{ padding: "16px 16px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {EFFECTS.map((eff) => {
                const isActive = selected === eff.value;
                return (
                  <motion.button
                    key={eff.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected(eff.value)}
                    style={{
                      position: "relative",
                      height: 90,
                      borderRadius: 14,
                      border: isActive ? `1.5px solid ${accent}` : "1.5px solid rgba(255,255,255,0.07)",
                      background: isActive ? `${accent}14` : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "10px 8px",
                      transition: "border-color .2s, background .2s",
                      overflow: "hidden",
                    }}
                  >
                    {/* glow ring when active */}
                    {isActive && (
                      <div style={{ position: "absolute", inset: 0, borderRadius: 13, boxShadow: `0 0 16px ${accent}33`, pointerEvents: "none" }} />
                    )}
                    {/* mini animated preview */}
                    <div style={{ pointerEvents: "none" }}>
                      <EffectPreview effect={eff.value} accent={accent} />
                    </div>
                    {/* label */}
                    <span style={{ fontSize: 11, color: isActive ? "#fafafa" : "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.02em" }}>{eff.label}</span>
                    {/* free badge */}
                    {eff.free && (
                      <span style={{ position: "absolute", top: 6, right: 6, fontSize: 9, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", borderRadius: 6, padding: "1px 5px", fontWeight: 600, letterSpacing: "0.03em" }}>FREE</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Live preview strip */}
            <div style={{ margin: "18px 16px 0", padding: "16px 20px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 64 }}>
              <LivePreview effect={selected} name={username || "brazy"} accent={accent} />
            </div>

            {/* Footer buttons */}
            <div style={{ display: "flex", gap: 10, padding: "16px" }}>
              <button
                onClick={onClose}
                style={{ flex: 1, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)")}
              >
                Cancel
              </button>
              <button
                onClick={() => { onSelect(selected); onClose(); }}
                style={{ flex: 1, height: 42, borderRadius: 12, background: accent, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity .15s", boxShadow: `0 4px 20px ${accent}55` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
