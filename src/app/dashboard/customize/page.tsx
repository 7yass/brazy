"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, type ProfileConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { saveProfileAction } from "./actions";

// ─── helpers ──────────────────────────────────────────────────────────────────
const F = "Satoshi, sans-serif";
const hex = (v: string) => (v.startsWith("#") ? v : `#${v}`);
const bare = (v: string) => v.replace(/^#/, "");

// ─── tiny toast ───────────────────────────────────────────────────────────────
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      backgroundColor: ok ? "#1a3a1a" : "#3a1a1a",
      border: `1.5px solid ${ok ? "#3a8a3a" : "#8a3a3a"}`,
      color: ok ? "#7ec87e" : "#e07070",
      borderRadius: 14, padding: "11px 22px", fontFamily: F, fontSize: 14,
      fontWeight: 500, zIndex: 9999, pointerEvents: "none",
      boxShadow: "0 8px 32px #0008",
    }}>
      {msg}
    </div>
  );
}

// ─── section wrapper ──────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#fafafa", fontFamily: F, marginBottom: 14 }}>
        {label}
      </span>
      <div style={{ backgroundColor: "#111", borderRadius: 18, padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {children}
      </div>
    </div>
  );
}

// ─── cell (label + control) ───────────────────────────────────────────────────
function Cell({ label, children, tip }: { label: string; children: React.ReactNode; tip?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#c8c8c8", fontFamily: F }}>{label}</span>
        {tip && <span title="Advanced feature" style={{ fontSize: 11, color: "#9849ac", fontFamily: F, fontWeight: 600 }}>✦ Advanced</span>}
      </div>
      {children}
    </div>
  );
}

// ─── toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: "relative", width: 44, height: 24, borderRadius: 999, backgroundColor: checked ? "#9849ac" : "#2a2a2a", border: `2px solid ${checked ? "#9849ac" : "#333"}`, display: "block", transition: ".25s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, left: checked ? 20 : 2, width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fafafa", transition: ".25s", display: "block" }} />
      </span>
    </label>
  );
}

// ─── color input ──────────────────────────────────────────────────────────────
function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [text, setText] = useState(bare(value));
  useEffect(() => setText(bare(value)), [value]);
  const commit = (v: string) => { const clean = bare(v); setText(clean); if (/^[0-9a-fA-F]{6}$/.test(clean)) onChange(hex(clean)); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <span style={{ fontSize: 12, color: "#888", fontFamily: F }}>{label}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: "#1a1a1a", border: "2px solid #232323", borderRadius: 12, padding: "7px 10px" }}>
        <label style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, display: "block", backgroundColor: hex(value), border: "1.5px solid #333" }} />
          <input type="color" value={hex(value)} onChange={e => onChange(e.target.value)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        </label>
        <input type="text" value={text} maxLength={7} onChange={e => commit(e.target.value.replace("#", ""))}
          placeholder="ffffff" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontFamily: F, fontSize: 13, fontWeight: 500 }} />
      </div>
    </div>
  );
}

// ─── select dropdown ──────────────────────────────────────────────────────────
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const cur = options.find(o => o.value === value);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 12, backgroundColor: "#171717", border: "2px solid #232323", color: "#e0e0e0", fontFamily: F, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
        <span>{cur?.label ?? value}</span>
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 15, height: 15, color: "#888" }}>
          <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, backgroundColor: "#171717", border: "2px solid #232323", borderRadius: 12, listStyle: "none", margin: 0, padding: "4px 0", zIndex: 50, maxHeight: 260, overflowY: "auto" }}>
          {options.map(o => (
            <li key={o.value} onClick={() => { onChange(o.value); setOpen(false); }} style={{ padding: "9px 12px", cursor: "pointer", fontSize: 14, fontFamily: F, color: o.value === value ? "#d283eb" : "#e0e0e0", backgroundColor: o.value === value ? "#9849ac22" : "transparent", transition: ".15s" }}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── slider ───────────────────────────────────────────────────────────────────
function Slider({ value, onChange, min, max, step = 1, unit = "" }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#666", fontFamily: F }}>{min}{unit}</span>
        <span style={{ fontSize: 12, color: "#aaa", fontFamily: F, fontWeight: 600 }}>{value}{unit}</span>
        <span style={{ fontSize: 11, color: "#666", fontFamily: F }}>{max}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, backgroundColor: "#2a2a2a" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, backgroundColor: "#9849ac", borderRadius: 3, transition: ".1s" }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }}
        />
      </div>
    </div>
  );
}

// ─── glow btn ─────────────────────────────────────────────────────────────────
function GlowBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 12, backgroundColor: active ? "#1a2e1a" : "#181818", border: `2px solid ${active ? "#2d5e2d" : "#222"}`, color: active ? "#7ec87e" : "#c8c8c8", fontFamily: F, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: ".2s" }}>
      ✦ {label}
    </button>
  );
}

// ─── upload box ───────────────────────────────────────────────────────────────
function UploadBox({
  label, type, accept, currentUrl, onUploaded, onOpenAudio,
}: {
  label: string; type: string; accept: string; currentUrl?: string;
  onUploaded: (url: string) => void; onOpenAudio?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentUrl ?? "");
  useEffect(() => setPreview(currentUrl ?? ""), [currentUrl]);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) { setPreview(json.url); onUploaded(json.url); }
    } finally { setLoading(false); }
  };

  const handleClick = () => {
    if (type === "audio" && onOpenAudio) { onOpenAudio(); return; }
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) upload(f);
  };

  const isVideo = preview && (preview.endsWith(".mp4") || preview.endsWith(".webm") || preview.includes("/backgrounds/"));
  const isAudio = type === "audio";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#aaa", fontFamily: F }}>{label}</span>
      <div
        onClick={handleClick}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          backgroundColor: "#141414", border: "2px dashed #222", borderRadius: 14,
          cursor: "pointer", transition: ".2s", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
          padding: preview && !isAudio ? 0 : "28px 12px",
          minHeight: 120, overflow: "hidden", position: "relative",
        }}
      >
        {loading && (
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
            <span style={{ color: "#9849ac", fontFamily: F, fontSize: 13 }}>Uploading…</span>
          </div>
        )}
        {preview && !isAudio ? (
          isVideo ? (
            <video src={preview} muted loop autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 120 }} />
          ) : (
            <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 120 }} />
          )
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isAudio ? <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></> : <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15l-5-5L5 21" /></>}
            </svg>
            <span style={{ fontSize: 12, color: "#555", fontFamily: F, textAlign: "center" }}>
              {isAudio ? "Click to open audio manager" : "Click or drag to upload"}
            </span>
          </>
        )}
      </div>
      {preview && (
        <button onClick={e => { e.stopPropagation(); setPreview(""); onUploaded(""); }}
          style={{ background: "none", border: "none", color: "#e07070", fontSize: 12, fontFamily: F, cursor: "pointer", textAlign: "left", padding: 0 }}>
          ✕ Remove
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
}

// ─── audio manager modal ──────────────────────────────────────────────────────
type AudioTrack = { id: string; title: string; artist: string; thumb: string; preview: string; duration: number };

function AudioManager({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (t: AudioTrack) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/audio/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      setResults(json.results ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(q), 400);
    return () => clearTimeout(t);
  }, [q, search]);

  const playPreview = (url: string) => {
    if (preview === url) { audioRef.current?.pause(); setPreview(null); return; }
    setPreview(url);
    if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#000b", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ backgroundColor: "#111", borderRadius: 20, padding: 24, width: "min(560px, 95vw)", maxHeight: "80vh", display: "flex", flexDirection: "column", gap: 16 }} onClick={e => e.stopPropagation()}>
        <audio ref={audioRef} onEnded={() => setPreview(null)} style={{ display: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#fafafa", fontFamily: F }}>🎵 Audio Manager</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <input
          type="text" value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search songs, artists…"
          style={{ padding: "10px 14px", borderRadius: 12, backgroundColor: "#1a1a1a", border: "2px solid #232323", color: "#e0e0e0", fontFamily: F, fontSize: 14, outline: "none" }}
        />
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {loading && <span style={{ color: "#888", fontFamily: F, fontSize: 13, textAlign: "center", paddingTop: 20 }}>Searching…</span>}
          {!loading && results.length === 0 && q.trim() && <span style={{ color: "#555", fontFamily: F, fontSize: 13, textAlign: "center", paddingTop: 20 }}>No results found</span>}
          {!loading && !q.trim() && <span style={{ color: "#555", fontFamily: F, fontSize: 13, textAlign: "center", paddingTop: 20 }}>Type a song or artist name to search</span>}
          {results.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, backgroundColor: "#181818", border: "1.5px solid #222", cursor: "pointer" }}>
              <img src={t.thumb} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#e0e0e0", fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#888", fontFamily: F }}>{t.artist} · {Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, "0")}</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {t.preview && (
                  <button onClick={() => playPreview(t.preview)}
                    style={{ padding: "6px 10px", borderRadius: 8, backgroundColor: preview === t.preview ? "#9849ac" : "#222", border: "none", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                    {preview === t.preview ? "⏸" : "▶"}
                  </button>
                )}
                <button onClick={() => { onSelect(t); onClose(); }}
                  style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "#9849ac", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}>
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── toggle cell ──────────────────────────────────────────────────────────────
function ToggleCell({ label, tip, checked, onChange }: { label: string; tip?: boolean; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#c8c8c8", fontFamily: F }}>{label}</span>
        {tip && <span style={{ fontSize: 11, color: "#9849ac", fontFamily: F, fontWeight: 600 }}>✦</span>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── location input ───────────────────────────────────────────────────────────
function LocationInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#1a1a1a", border: "2px solid #1f1f1f", borderRadius: 12, padding: "9px 12px" }}>
      <span style={{ color: "#777", fontSize: 16 }}>📍</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="My Location"
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontFamily: F, fontSize: 14 }} />
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function CustomizePage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioMeta, setAudioMeta] = useState<{ audio_track_id?: string; audio_source?: string; audio_title?: string; audio_artist?: string; audio_thumb?: string }>({});

  // ── load config from Supabase on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      if (!supabase) { setCfg(normalizeConfig({})); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCfg(normalizeConfig({})); return; }
      const { data } = await supabase
        .from("profiles")
        .select("config, audio_track_id, audio_source, audio_title, audio_artist, audio_thumb")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setCfg(normalizeConfig(data.config));
        setAudioMeta({
          audio_track_id: data.audio_track_id ?? undefined,
          audio_source: data.audio_source ?? undefined,
          audio_title: data.audio_title ?? undefined,
          audio_artist: data.audio_artist ?? undefined,
          audio_thumb: data.audio_thumb ?? undefined,
        });
      } else {
        setCfg(normalizeConfig(brazyProfile));
      }
    })();
  }, []);

  const set = useCallback(<K extends keyof ProfileConfig>(section: K, patch: Partial<ProfileConfig[K]>) => {
    setCfg(prev => prev ? { ...prev, [section]: { ...(prev[section] as object), ...patch } } : prev);
  }, []);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  };

  const save = async () => {
    if (!cfg) return;
    setSaving(true);
    try {
      const result = await saveProfileAction(cfg, audioMeta);
      if (result.error) showToast(`❌ ${result.error}`, false);
      else showToast("✅ Changes saved!", true);
    } catch (e) {
      showToast(`❌ ${String(e)}`, false);
    } finally {
      setSaving(false);
    }
  };

  if (!cfg) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
      <span style={{ color: "#555", fontFamily: F }}>Loading your profile…</span>
    </div>
  );

  const { identity, theme, background, effects, splash, audio } = cfg;

  const bgOptions = [
    { value: "none",      label: "None" },
    { value: "color",     label: "Solid Color" },
    { value: "gradient",  label: "Gradient" },
    { value: "image",     label: "Image" },
    { value: "video",     label: "Video" },
    { value: "particles", label: "Particles" },
    { value: "matrix",    label: "Matrix" },
    { value: "starfield", label: "Starfield" },
    { value: "aurora",    label: "Aurora" },
    { value: "rain",      label: "Rain" },
    { value: "snow",      label: "Snow" },
    { value: "bubbles",   label: "Bubbles" },
    { value: "grid",      label: "Grid" },
  ];

  const usernameEffectOptions = [
    { value: "none",       label: "None" },
    { value: "glow",       label: "Glow" },
    { value: "glitch",     label: "Glitch" },
    { value: "typewriter", label: "Typewriter" },
    { value: "rainbow",    label: "Rainbow" },
  ];

  const cursorOptions = [
    { value: "none",     label: "None" },
    { value: "trail",    label: "Trail" },
    { value: "sparkles", label: "Sparkles" },
    { value: "dots",     label: "Dots" },
    { value: "rings",    label: "Rings" },
  ];

  const clickOptions = [
    { value: "none",     label: "None" },
    { value: "burst",    label: "Burst" },
    { value: "ripple",   label: "Ripple" },
    { value: "hearts",   label: "Hearts" },
    { value: "confetti", label: "Confetti" },
    { value: "emojis",   label: "Emojis" },
  ];

  const cardStyleOpts = [
    { value: "glass",   label: "Glass" },
    { value: "solid",   label: "Solid" },
    { value: "outline", label: "Outline" },
    { value: "neon",    label: "Neon" },
    { value: "minimal", label: "Minimal" },
  ];

  const fontOpts = [
    { value: "geist",   label: "Geist" },
    { value: "inter",   label: "Inter" },
    { value: "poppins", label: "Poppins" },
    { value: "mono",    label: "Monospace" },
    { value: "serif",   label: "Serif" },
    { value: "comic",   label: "Comic" },
  ];

  const splashTypeOpts = [
    { value: "blur",     label: "Blur" },
    { value: "black",    label: "Black" },
    { value: "image",    label: "Image" },
    { value: "glitch",   label: "Glitch" },
    { value: "gradient", label: "Gradient" },
  ];

  const audioStyleOpts = [
    { value: "pill",    label: "Pill" },
    { value: "minimal", label: "Minimal" },
    { value: "full",    label: "Full" },
  ];

  return (
    <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 28, fontFamily: F, paddingBottom: 100 }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      <AudioManager
        open={audioOpen}
        onClose={() => setAudioOpen(false)}
        onSelect={t => {
          setAudioMeta({ audio_track_id: t.id, audio_source: t.preview, audio_title: t.title, audio_artist: t.artist, audio_thumb: t.thumb });
          set("audio", { enabled: true, src: t.preview, title: t.title, artist: t.artist });
        }}
      />

      {/* ── ASSETS UPLOADER ── */}
      <Section label="Assets Uploader">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          <UploadBox label="Background" type="background" accept="image/*,video/mp4,video/webm"
            currentUrl={background.imageUrl || background.videoUrl}
            onUploaded={url => {
              const isVid = url.match(/\.(mp4|webm)/);
              set("background", isVid ? { type: "video", videoUrl: url } : { type: "image", imageUrl: url });
            }}
          />
          <UploadBox label="Audio" type="audio" accept="audio/*"
            currentUrl={audioMeta.audio_source}
            onUploaded={url => {
              setAudioMeta(prev => ({ ...prev, audio_source: url }));
              set("audio", { enabled: true, src: url });
            }}
            onOpenAudio={() => setAudioOpen(true)}
          />
          <UploadBox label="Profile Avatar" type="avatar" accept="image/*"
            currentUrl={identity.avatarUrl}
            onUploaded={url => set("identity", { avatarUrl: url })}
          />
          <UploadBox label="Custom Cursor" type="cursor" accept="image/*,.cur"
            currentUrl={effects.cursor.enabled && effects.cursor.type !== "none" ? undefined : undefined}
            onUploaded={url => {
              // store as custom cursor color ref for now
              set("effects", { cursor: { ...effects.cursor, enabled: true, type: "trail", color: url } });
            }}
          />
        </div>
      </Section>

      {/* ── GENERAL CUSTOMIZATION ── */}
      <Section label="General Customization">
        {/* row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.2fr 1.2fr", gap: 20 }}>
          <Cell label="Description">
            <textarea value={identity.bio} onChange={e => set("identity", { bio: e.target.value })}
              rows={3} placeholder="Write something about yourself…"
              style={{ width: "100%", backgroundColor: "#161616", border: "2px solid #1e1e1e", borderRadius: 12, padding: "10px 12px", color: "#e0e0e0", fontFamily: F, fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
          </Cell>
          <Cell label="Background Effect">
            <Select value={background.type} onChange={v => set("background", { type: v as ProfileConfig["background"]["type"] })} options={bgOptions} />
          </Cell>
          <Cell label="Profile Opacity">
            <Slider value={Math.round(theme.cardOpacity * 100)} onChange={v => set("theme", { cardOpacity: v / 100 })} min={0} max={100} unit="%" />
          </Cell>
          <Cell label="Profile Blur">
            <Slider value={theme.cardBlur} onChange={v => set("theme", { cardBlur: v })} min={0} max={60} unit="px" />
          </Cell>
        </div>
        {/* row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.2fr 1.2fr", gap: 20 }}>
          <Cell label="Username Effect">
            <Select value={effects.typewriterTitle ? "typewriter" : "none"}
              onChange={v => set("effects", { typewriterTitle: v === "typewriter", textGlow: v === "glow", glowPulse: v === "glow" })}
              options={usernameEffectOptions}
            />
          </Cell>
          <Cell label="Cursor Effect">
            <Select value={effects.cursor.type} onChange={v => set("effects", { cursor: { ...effects.cursor, type: v as typeof effects.cursor.type, enabled: v !== "none" } })} options={cursorOptions} />
          </Cell>
          <Cell label="Location">
            <LocationInput value={identity.location} onChange={v => set("identity", { location: v })} />
          </Cell>
          <Cell label="Glow Settings">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <GlowBtn label="Username" active={effects.textGlow} onClick={() => set("effects", { textGlow: !effects.textGlow })} />
                <GlowBtn label="Socials" active={effects.glowPulse} onClick={() => set("effects", { glowPulse: !effects.glowPulse })} />
              </div>
              <GlowBtn label="Badges" active={cfg.badges.enabled} onClick={() => setCfg(p => p ? { ...p, badges: { ...p.badges, enabled: !p.badges.enabled } } : p)} />
            </div>
          </Cell>
        </div>
      </Section>

      {/* ── COLOR CUSTOMIZATION ── */}
      <Section label="Color Customization">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, alignItems: "start" }}>
          <Cell label="Accent Color"><ColorInput value={theme.accentColor} onChange={v => set("theme", { accentColor: v })} /></Cell>
          <Cell label="Text Color"><ColorInput value={theme.textColor} onChange={v => set("theme", { textColor: v })} /></Cell>
          <div />
          <button
            onClick={() => set("theme", { cardStyle: theme.cardStyle === "glass" ? "solid" : "glass" })}
            style={{ alignSelf: "end", padding: "11px 16px", borderRadius: 12, backgroundColor: theme.cardStyle !== "glass" ? "#1a2e1a" : "#181818", border: `2px solid ${theme.cardStyle !== "glass" ? "#2d5e2d" : "#222"}`, color: theme.cardStyle !== "glass" ? "#aaccaa" : "#c8c8c8", fontFamily: F, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: ".2s" }}>
            {theme.cardStyle !== "glass" ? "✓ Profile Gradient Disabled" : "Disable Profile Gradient"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, alignItems: "start" }}>
          <Cell label="Background Color"><ColorInput value={theme.backgroundColor} onChange={v => set("theme", { backgroundColor: v })} /></Cell>
          <Cell label="Icon Color"><ColorInput value={theme.accentColor} onChange={v => set("theme", { accentColor: v })} /></Cell>
          <div />
          <Cell label="Primary Color"><ColorInput value={theme.primaryColor} onChange={v => set("theme", { primaryColor: v })} /></Cell>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, alignItems: "start" }}>
          <Cell label="Background Effect Color"><ColorInput value={background.color1} onChange={v => set("background", { color1: v })} /></Cell>
          <div /><div />
          <Cell label="Secondary Color"><ColorInput value={theme.secondaryColor} onChange={v => set("theme", { secondaryColor: v })} /></Cell>
        </div>
      </Section>

      {/* ── OTHER CUSTOMIZATION ── */}
      <Section label="Other Customization">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <ToggleCell label="Monochrome Icons" checked={!theme.glow} onChange={v => set("theme", { glow: !v })} />
          <ToggleCell label="Animated Title" checked={effects.typewriterTitle} onChange={v => set("effects", { typewriterTitle: v })} />
          <ToggleCell label="Swap Box Colors" checked={theme.cardStyle === "neon"} onChange={v => set("theme", { cardStyle: v ? "neon" : "glass" })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <ToggleCell label="Volume Control" checked={audio.enabled} onChange={v => set("audio", { enabled: v })} />
          <ToggleCell label="Discord Avatar" checked={identity.verified} onChange={v => set("identity", { verified: v })} />
          <ToggleCell label="Avatar Decoration" checked={effects.tilt3d} onChange={v => set("effects", { tilt3d: v })} />
        </div>
      </Section>

      {/* ── ADVANCED (formerly Premium) ── */}
      <Section label="✦ Advanced — All Unlocked">
        {/* Theme */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Card Style" tip><Select value={theme.cardStyle} onChange={v => set("theme", { cardStyle: v as typeof theme.cardStyle })} options={cardStyleOpts} /></Cell>
          <Cell label="Font Family" tip><Select value={theme.fontFamily} onChange={v => set("theme", { fontFamily: v as typeof theme.fontFamily })} options={fontOpts} /></Cell>
          <Cell label="Border Radius" tip><Slider value={theme.borderRadius} onChange={v => set("theme", { borderRadius: v })} min={0} max={48} unit="px" /></Cell>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Card Opacity" tip><Slider value={Math.round(theme.cardOpacity * 100)} onChange={v => set("theme", { cardOpacity: v / 100 })} min={0} max={100} unit="%" /></Cell>
          <Cell label="Card Blur" tip><Slider value={theme.cardBlur} onChange={v => set("theme", { cardBlur: v })} min={0} max={60} unit="px" /></Cell>
          <Cell label="Glow Intensity" tip><Slider value={theme.glowIntensity} onChange={v => set("theme", { glowIntensity: v })} min={0} max={100} unit="%" /></Cell>
        </div>
        {/* Background effect params */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="BG Speed" tip><Slider value={background.speed} onChange={v => set("background", { speed: v })} min={0} max={5} step={0.1} /></Cell>
          <Cell label="BG Density" tip><Slider value={background.density} onChange={v => set("background", { density: v })} min={0} max={5} step={0.1} /></Cell>
          <Cell label="BG Particle Size" tip><Slider value={background.size} onChange={v => set("background", { size: v })} min={1} max={12} /></Cell>
        </div>
        {/* Effects */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Click Effect" tip><Select value={effects.click.type} onChange={v => set("effects", { click: { ...effects.click, type: v as typeof effects.click.type, enabled: v !== "none" } })} options={clickOptions} /></Cell>
          <Cell label="Click Count" tip><Slider value={effects.click.count} onChange={v => set("effects", { click: { ...effects.click, count: v } })} min={2} max={40} /></Cell>
          <Cell label="3D Tilt" tip>
            <div style={{ paddingTop: 6 }}><Toggle checked={effects.tilt3d} onChange={v => set("effects", { tilt3d: v })} /></div>
          </Cell>
        </div>
        {/* Splash/enter gate */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Entry Gate" tip>
            <div style={{ paddingTop: 6 }}><Toggle checked={splash.enabled} onChange={v => set("splash", { enabled: v })} /></div>
          </Cell>
          <Cell label="Gate Style" tip><Select value={splash.type} onChange={v => set("splash", { type: v as typeof splash.type })} options={splashTypeOpts} /></Cell>
          <Cell label="Gate Text" tip>
            <input type="text" value={splash.text} onChange={e => set("splash", { text: e.target.value })}
              placeholder="brazy" style={{ width: "100%", backgroundColor: "#1a1a1a", border: "2px solid #232323", borderRadius: 12, padding: "9px 12px", color: "#e0e0e0", fontFamily: F, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </Cell>
        </div>
        {/* Audio */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Audio Player Style" tip><Select value={audio.style} onChange={v => set("audio", { style: v as typeof audio.style })} options={audioStyleOpts} /></Cell>
          <Cell label="Autoplay" tip>
            <div style={{ paddingTop: 6 }}><Toggle checked={audio.autoplay} onChange={v => set("audio", { autoplay: v })} /></div>
          </Cell>
          <Cell label="Show Visualizer" tip>
            <div style={{ paddingTop: 6 }}><Toggle checked={audio.showVisualizer} onChange={v => set("audio", { showVisualizer: v })} /></div>
          </Cell>
        </div>
        {/* Audio volume */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Audio Volume" tip><Slider value={Math.round(audio.volume * 100)} onChange={v => set("audio", { volume: v / 100 })} min={0} max={100} unit="%" /></Cell>
          <Cell label="Cursor Size" tip><Slider value={effects.cursor.size} onChange={v => set("effects", { cursor: { ...effects.cursor, size: v } })} min={2} max={24} unit="px" /></Cell>
          <Cell label="Cursor Color" tip><ColorInput value={effects.cursor.color} onChange={v => set("effects", { cursor: { ...effects.cursor, color: v } })} /></Cell>
        </div>
        {/* Click effect color + emoji */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="Click Effect Color" tip><ColorInput value={effects.click.color} onChange={v => set("effects", { click: { ...effects.click, color: v } })} /></Cell>
          <Cell label="Click Emoji" tip>
            <input type="text" value={effects.click.emoji} onChange={e => set("effects", { click: { ...effects.click, emoji: e.target.value } })}
              maxLength={2} placeholder="✨"
              style={{ width: 60, backgroundColor: "#1a1a1a", border: "2px solid #232323", borderRadius: 12, padding: "9px 12px", color: "#e0e0e0", fontFamily: F, fontSize: 20, outline: "none", textAlign: "center" }} />
          </Cell>
          <Cell label="BG Overlay Color" tip><ColorInput value={theme.backgroundOverlayColor} onChange={v => set("theme", { backgroundOverlayColor: v })} /></Cell>
        </div>
        {/* BG overlay opacity + max width + content align */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          <Cell label="BG Overlay Opacity" tip><Slider value={Math.round(theme.backgroundOverlayOpacity * 100)} onChange={v => set("theme", { backgroundOverlayOpacity: v / 100 })} min={0} max={100} unit="%" /></Cell>
          <Cell label="Profile Width" tip><Slider value={theme.maxWidth} onChange={v => set("theme", { maxWidth: v })} min={280} max={900} unit="px" /></Cell>
          <Cell label="Content Align" tip>
            <div style={{ display: "flex", gap: 8 }}>
              {(["center", "left"] as const).map(a => (
                <button key={a} onClick={() => set("theme", { contentAlign: a })}
                  style={{ flex: 1, padding: "9px", borderRadius: 12, backgroundColor: theme.contentAlign === a ? "#9849ac" : "#181818", border: `2px solid ${theme.contentAlign === a ? "#9849ac" : "#222"}`, color: "#fff", fontFamily: F, fontSize: 13, cursor: "pointer", fontWeight: 500, textTransform: "capitalize" }}>
                  {a}
                </button>
              ))}
            </div>
          </Cell>
        </div>
        {/* SEO */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
          <Cell label="SEO Title" tip>
            <input type="text" value={cfg.seo.title} onChange={e => setCfg(p => p ? { ...p, seo: { ...p.seo, title: e.target.value } } : p)}
              placeholder="My Profile — brazy" style={{ width: "100%", backgroundColor: "#1a1a1a", border: "2px solid #232323", borderRadius: 12, padding: "9px 12px", color: "#e0e0e0", fontFamily: F, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </Cell>
          <Cell label="SEO Description" tip>
            <input type="text" value={cfg.seo.description} onChange={e => setCfg(p => p ? { ...p, seo: { ...p.seo, description: e.target.value } } : p)}
              placeholder="A short description for search engines" style={{ width: "100%", backgroundColor: "#1a1a1a", border: "2px solid #232323", borderRadius: 12, padding: "9px 12px", color: "#e0e0e0", fontFamily: F, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </Cell>
        </div>
      </Section>

      {/* ── STICKY SAVE BAR ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "14px 28px", backgroundColor: "#0d0d0dcc", backdropFilter: "blur(12px)", borderTop: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, zIndex: 100 }}>
        <span style={{ fontSize: 13, color: "#666", fontFamily: F }}>All changes are saved per-click</span>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: "11px 28px", borderRadius: 14, background: saving ? "#555" : "linear-gradient(135deg, #9849ac, #6a2f8a)", border: "none", color: "#fff", fontFamily: F, fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", transition: ".2s", boxShadow: saving ? "none" : "0 4px 24px #9849ac55" }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
