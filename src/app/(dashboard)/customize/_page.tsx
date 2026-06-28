"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Image as ImageIcon, Palette, Type, MousePointer2, Sparkles,
  Music, Link2, Layout, Globe, Code, ChevronDown, ChevronRight,
  Check, Save, RotateCcw, Zap, Eye, EyeOff, Laptop, Smartphone,
} from "lucide-react";

import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import ProfileRenderer from "@/components/profile/ProfileRenderer";

// ─── Shared primitives ─────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon, label, children, defaultOpen = false,
}: {
  icon: React.ElementType; label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden transition duration-150">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-transparent border-none cursor-pointer text-left focus:outline-none select-none group"
      >
        <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center shrink-0 transition duration-150 group-hover:scale-105">
          <Icon className="w-4 h-4 text-red-500" />
        </div>
        <span className="text-xs font-bold text-neutral-300 group-hover:text-white transition-colors flex-1">{label}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          : <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-3 border-t border-neutral-900/60 flex flex-col gap-4.5 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1 font-sans">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-neutral-300">{label}</span>
        {hint && <span className="text-[10px] text-neutral-500 mt-0.5 max-w-sm leading-normal">{hint}</span>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ColorPill({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 w-fit hover:border-neutral-700 transition duration-150">
      <label className="cursor-pointer relative">
        <div className="w-5 h-5 rounded-md border border-white/10 shrink-0" style={{ backgroundColor: value }} />
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="opacity-0 absolute inset-0 cursor-pointer w-full h-full" />
      </label>
      <span className="text-[11px] font-mono text-neutral-400 font-semibold">{value.toUpperCase()}</span>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${value ? "bg-red-600" : "bg-neutral-800"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function SliderRow({ value, onChange, min, max, step = 1, format }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : String(value);
  return (
    <div className="flex items-center gap-4 w-60 font-sans">
      <div className="relative flex-1 h-5 flex items-center">
        <div className="absolute left-0 right-0 h-1 rounded-full bg-neutral-850">
          <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-5 opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-md pointer-events-none transition-all duration-75"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <span className="text-[10px] font-mono text-neutral-500 font-semibold min-w-[32px] text-right">{display}</span>
    </div>
  );
}

function Chips<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 border cursor-pointer ${
            value === o.value
              ? "bg-red-600/10 border-red-600/40 text-red-500"
              : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-neutral-250 hover:bg-neutral-900/60"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function InputText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 w-56 transition"
    />
  );
}

// Re-added helper textarea component
function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 w-full transition resize-none leading-relaxed"
    />
  );
}

function TileGrid<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; emoji?: string }[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 w-full font-sans">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border bg-neutral-950 transition duration-150 cursor-pointer group text-center ${
            value === o.value
              ? "border-red-600/30 bg-red-600/5"
              : "border-neutral-900 hover:border-red-600/30 hover:bg-neutral-900/30"
          }`}
        >
          {o.emoji && <span className="text-base mb-1.5 transition-transform duration-200 group-hover:scale-110">{o.emoji}</span>}
          <span className={`text-[10px] font-bold tracking-tight truncate w-full ${value === o.value ? "text-red-500" : "text-neutral-400 group-hover:text-white"}`}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-neutral-900/80 my-2" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizePage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const cfgRef = useRef<ProfileConfig | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { userId: uid, config: loaded } = await clientGetProfile();
        setUserId(uid);
        setCfg(loaded);
        cfgRef.current = loaded;
      } catch (err) {
        console.error("Load customize error:", err);
        setCfg(normalizeConfig({}));
      }
    })();
  }, []);

  const doSave = useCallback(async (config: ProfileConfig) => {
    if (!userId || savingRef.current) return;
    savingRef.current = true;
    setSaveStatus("saving");
    try {
      await clientSaveProfile(config);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Save customize error:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally { savingRef.current = false; }
  }, [userId]);

  const scheduleSave = useCallback((next: ProfileConfig) => {
    cfgRef.current = next;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(() => { debounceRef.current = null; doSave(next); }, 800);
  }, [doSave]);

  const set = useCallback(<S extends keyof ProfileConfig, K extends keyof ProfileConfig[S]>(
    section: S, key: K, val: ProfileConfig[S][K]
  ) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = { ...prev, [section]: { ...(prev[section] as Record<string, unknown>), [key]: val } } as ProfileConfig;
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const setCursor = useCallback(<K extends keyof ProfileConfig["effects"]["cursor"]>(key: K, val: ProfileConfig["effects"]["cursor"][K]) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = { ...prev, effects: { ...prev.effects, cursor: { ...prev.effects.cursor, [key]: val } } };
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const setClick = useCallback(<K extends keyof ProfileConfig["effects"]["click"]>(key: K, val: ProfileConfig["effects"]["click"][K]) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = { ...prev, effects: { ...prev.effects, click: { ...prev.effects.click, [key]: val } } };
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  if (!cfg) {
    return (
      <div className="flex items-center justify-center h-80 font-sans">
        <div className="flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-semibold text-neutral-500">Loading your profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 select-none font-sans">
      
      <style>{`
        .preview-wrapper [style*="position: fixed"],
        .preview-wrapper [style*="position:fixed"] {
          position: absolute !important;
        }
        .preview-wrapper [style*="min-height: 100vh"],
        .preview-wrapper [style*="min-height:100vh"] {
          min-height: 100% !important;
        }
        .preview-wrapper {
          transform: translate3d(0, 0, 0);
          perspective: 1000px;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-red-500" /> Customize Profile
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Design every visual component of your custom page card with real-time previews.</p>
        </div>
        {saveStatus !== "idle" && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-355 ${
            saveStatus === "saved" ? "bg-green-500/10 border-green-500/30 text-green-400" :
            saveStatus === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
            "bg-neutral-900/50 border-neutral-800 text-neutral-400 animate-pulse"
          }`}>
            {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
            {saveStatus === "saving" ? "Saving updates..." : saveStatus === "saved" ? "Saved!" : "Connection error"}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

        {/* Left Column - Form controls */}
        <div className="w-full lg:w-[45%] xl:w-[42%] shrink-0 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)] pr-2 scrollbar-none pb-8">
          
          {/* ─── Identity ─────────────────────────────────────────────── */}
          <SectionCard icon={Type} label="Identity" defaultOpen={true}>
            <Row label="Display name">
              <InputText value={cfg.identity.displayName} onChange={v => set("identity", "displayName", v)} placeholder="Your name" />
            </Row>
            <Row label="Bio" hint="Supports markdown if enabled below">
              <TextArea value={cfg.identity.bio} onChange={v => set("identity", "bio", v)} placeholder="Tell the world about yourself…" rows={3} />
            </Row>
            <Row label="Markdown bio" hint="Bold, italic, links in bio">
              <Toggle value={cfg.identity.bioMarkdown} onChange={v => set("identity", "bioMarkdown", v)} />
            </Row>
            <Row label="Tagline">
              <InputText value={cfg.identity.tagline} onChange={v => set("identity", "tagline", v)} placeholder="founder · designer" />
            </Row>
            <Row label="Pronouns">
              <InputText value={cfg.identity.pronouns} onChange={v => set("identity", "pronouns", v)} placeholder="they/them" />
            </Row>
            <Row label="Location">
              <InputText value={cfg.identity.location} onChange={v => set("identity", "location", v)} placeholder="earth" />
            </Row>
          </SectionCard>

          {/* ─── Background ──────────────────────────────────────────────────── */}
          <SectionCard icon={ImageIcon} label="Background">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Type</span>
              <TileGrid
                value={cfg.background.type}
                onChange={v => set("background", "type", v)}
                options={[
                  { value: "none", label: "None", emoji: "✕" },
                  { value: "color", label: "Color", emoji: "🎨" },
                  { value: "gradient", label: "Gradient", emoji: "🌈" },
                  { value: "particles", label: "Particles", emoji: "✨" },
                  { value: "matrix", label: "Matrix", emoji: "🖥️" },
                  { value: "starfield", label: "Stars", emoji: "⭐" },
                  { value: "aurora", label: "Aurora", emoji: "🌌" },
                  { value: "rain", label: "Rain", emoji: "🌧️" },
                  { value: "snow", label: "Snow", emoji: "❄️" },
                  { value: "bubbles", label: "Bubbles", emoji: "🫧" },
                  { value: "grid", label: "Grid", emoji: "▦" },
                  { value: "image", label: "Image", emoji: "🖼️" },
                  { value: "video", label: "Video", emoji: "🎬" },
                ]}
              />
            </div>
            <Row label="Primary color">
              <ColorPill value={cfg.background.color1} onChange={v => set("background", "color1", v)} />
            </Row>
            {cfg.background.type !== "none" && cfg.background.type !== "color" && (
              <>
                <Row label="Secondary color">
                  <ColorPill value={cfg.background.color2} onChange={v => set("background", "color2", v)} />
                </Row>
                <Row label="Accent color">
                  <ColorPill value={cfg.background.color3} onChange={v => set("background", "color3", v)} />
                </Row>
              </>
            )}
            {(cfg.background.type === "particles" || cfg.background.type === "matrix" || cfg.background.type === "starfield" || cfg.background.type === "rain" || cfg.background.type === "snow" || cfg.background.type === "bubbles") && (
              <>
                <Divider />
                <Row label="Speed">
                  <SliderRow value={cfg.background.speed} onChange={v => set("background", "speed", v)} min={0} max={5} step={0.1} format={v => `${v.toFixed(1)}×`} />
                </Row>
                <Row label="Density">
                  <SliderRow value={cfg.background.density} onChange={v => set("background", "density", v)} min={0} max={5} step={0.1} format={v => `${v.toFixed(1)}×`} />
                </Row>
                <Row label="Size">
                  <SliderRow value={cfg.background.size} onChange={v => set("background", "size", v)} min={1} max={12} step={0.5} format={v => `${v}px`} />
                </Row>
                <Row label="Particle glow">
                  <Toggle value={cfg.background.glow} onChange={v => set("background", "glow", v)} />
                </Row>
              </>
            )}
            {(cfg.background.type === "image" || cfg.background.type === "video") && (
              <>
                <Divider />
                <Row label={cfg.background.type === "image" ? "Image URL" : "Video URL"}>
                  <InputText
                    value={cfg.background.type === "image" ? cfg.background.imageUrl : cfg.background.videoUrl}
                    onChange={v => set("background", cfg.background.type === "image" ? "imageUrl" : "videoUrl", v)}
                    placeholder={cfg.background.type === "image" ? "https://..." : "https://..."}
                  />
                </Row>
              </>
            )}
          </SectionCard>

          {/* ─── Theme & Colors ─────────────────────────────────────────────── */}
          <SectionCard icon={Palette} label="Theme & Colors">
            <Row label="Primary color">
              <ColorPill value={cfg.theme.primaryColor} onChange={v => set("theme", "primaryColor", v)} />
            </Row>
            <Row label="Secondary color">
              <ColorPill value={cfg.theme.secondaryColor} onChange={v => set("theme", "secondaryColor", v)} />
            </Row>
            <Row label="Accent color">
              <ColorPill value={cfg.theme.accentColor} onChange={v => set("theme", "accentColor", v)} />
            </Row>
            <Row label="Text color">
              <ColorPill value={cfg.theme.textColor} onChange={v => set("theme", "textColor", v)} />
            </Row>
            <Row label="Muted text">
              <ColorPill value={cfg.theme.mutedTextColor} onChange={v => set("theme", "mutedTextColor", v)} />
            </Row>
            <Row label="Background color">
              <ColorPill value={cfg.theme.backgroundColor} onChange={v => set("theme", "backgroundColor", v)} />
            </Row>
            <Divider />
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Card style</span>
              <Chips
                value={cfg.theme.cardStyle}
                onChange={v => set("theme", "cardStyle", v)}
                options={[
                  { value: "glass", label: "Glass" },
                  { value: "solid", label: "Solid" },
                  { value: "outline", label: "Outline" },
                  { value: "neon", label: "Neon" },
                  { value: "minimal", label: "Minimal" },
                ]}
              />
            </div>
            <Row label="Card opacity">
              <SliderRow value={cfg.theme.cardOpacity} onChange={v => set("theme", "cardOpacity", v)} min={0} max={1} step={0.01} format={v => `${Math.round(v * 100)}%`} />
            </Row>
            <Row label="Card blur">
              <SliderRow value={cfg.theme.cardBlur} onChange={v => set("theme", "cardBlur", v)} min={0} max={60} step={1} format={v => `${v}px`} />
            </Row>
            <Row label="Border radius">
              <SliderRow value={cfg.theme.borderRadius} onChange={v => set("theme", "borderRadius", v)} min={0} max={48} step={1} format={v => `${v}px`} />
            </Row>
            <Row label="Border width">
              <SliderRow value={cfg.theme.borderWidth} onChange={v => set("theme", "borderWidth", v)} min={0} max={8} step={0.5} format={v => `${v}px`} />
            </Row>
            <Row label="Animated border" hint="Rainbow rotating gradient border">
              <Toggle value={cfg.theme.animatedBorder} onChange={v => set("theme", "animatedBorder", v)} />
            </Row>
            <Divider />
            <Row label="Glow">
              <Toggle value={cfg.theme.glow} onChange={v => set("theme", "glow", v)} />
            </Row>
            {cfg.theme.glow && (
              <Row label="Glow intensity">
                <SliderRow value={cfg.theme.glowIntensity} onChange={v => set("theme", "glowIntensity", v)} min={0} max={100} step={5} format={v => `${v}%`} />
              </Row>
            )}
            <Divider />
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Font family</span>
              <TileGrid
                value={cfg.theme.fontFamily}
                onChange={v => set("theme", "fontFamily", v)}
                options={[
                  { value: "geist", label: "Geist", emoji: "Gg" },
                  { value: "inter", label: "Inter", emoji: "Ii" },
                  { value: "poppins", label: "Poppins", emoji: "Pp" },
                  { value: "mono", label: "Mono", emoji: "</>" },
                  { value: "serif", label: "Serif", emoji: "𝕊𝕤" },
                ]}
              />
            </div>
            <Divider />
            <div className="mb-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Profile size</span>
              <Chips
                value={cfg.theme.profileSize}
                onChange={v => set("theme", "profileSize", v)}
                options={[
                  { value: "default", label: "Default" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ]}
              />
            </div>
          </SectionCard>

          {/* ─── Effects ─────────────────────────────────────────────────────── */}
          <SectionCard icon={Sparkles} label="Effects">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Username effect</span>
              <TileGrid
                value={cfg.effects.usernameEffect}
                onChange={v => set("effects", "usernameEffect", v)}
                options={[
                  { value: "none", label: "None", emoji: "—" },
                  { value: "glow", label: "Glow", emoji: "💡" },
                  { value: "glitch", label: "Glitch", emoji: "📺" },
                  { value: "typewriter", label: "Type", emoji: "⌨️" },
                  { value: "rainbow", label: "Rainbow", emoji: "🌈" },
                  { value: "neon", label: "Neon", emoji: "🔮" },
                  { value: "shake", label: "Shake", emoji: "📳" },
                ]}
              />
            </div>
            <Divider />
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Cursor effect</span>
              <TileGrid
                value={cfg.effects.cursor.type}
                onChange={v => setCursor("type", v)}
                options={[
                  { value: "none", label: "None", emoji: "✕" },
                  { value: "trail", label: "Trail", emoji: "〰️" },
                  { value: "sparkles", label: "Sparkles", emoji: "✨" },
                  { value: "dots", label: "Dots", emoji: "⚬" },
                  { value: "rings", label: "Rings", emoji: "◎" },
                  { value: "cat", label: "Cat", emoji: "🐱" },
                  { value: "bubble", label: "Bubble", emoji: "🫧" },
                  { value: "snowflake", label: "Snow", emoji: "❄️" },
                ]}
              />
            </div>
            {cfg.effects.cursor.type !== "none" && (
              <>
                <Row label="Cursor color">
                  <ColorPill value={cfg.effects.cursor.color} onChange={v => setCursor("color", v)} />
                </Row>
                <Row label="Cursor size">
                  <SliderRow value={cfg.effects.cursor.size} onChange={v => setCursor("size", v)} min={2} max={24} step={1} format={v => `${v}px`} />
                </Row>
              </>
            )}
            <Divider />
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Click effect</span>
              <TileGrid
                value={cfg.effects.click.type}
                onChange={v => setClick("type", v)}
                options={[
                  { value: "none", label: "None", emoji: "✕" },
                  { value: "burst", label: "Burst", emoji: "💥" },
                  { value: "ripple", label: "Ripple", emoji: "💧" },
                  { value: "hearts", label: "Hearts", emoji: "❤️" },
                  { value: "confetti", label: "Confetti", emoji: "🎊" },
                  { value: "emojis", label: "Emojis", emoji: "😄" },
                ]}
              />
            </div>
            {cfg.effects.click.type === "emojis" && (
              <Row label="Emoji">
                <InputText value={cfg.effects.click.emoji} onChange={v => setClick("emoji", v)} placeholder="✨" />
              </Row>
            )}
            {cfg.effects.click.type !== "none" && (
              <>
                <Row label="Click color">
                  <ColorPill value={cfg.effects.click.color} onChange={v => setClick("color", v)} />
                </Row>
                <Row label="Particle count">
                  <SliderRow value={cfg.effects.click.count} onChange={v => setClick("count", v)} min={2} max={40} step={1} />
                </Row>
              </>
            )}
            <Divider />
            <Row label="3D tilt" hint="Card tilts on mouse hover">
              <Toggle value={cfg.effects.tilt3d} onChange={v => set("effects", "tilt3d", v)} />
            </Row>
            {cfg.effects.tilt3d && (
              <Row label="Tilt intensity">
                <SliderRow value={cfg.effects.tiltIntensity} onChange={v => set("effects", "tiltIntensity", v)} min={1} max={30} step={1} format={v => `${v}°`} />
              </Row>
            )}
            <Row label="Glow pulse">
              <Toggle value={cfg.effects.glowPulse} onChange={v => set("effects", "glowPulse", v)} />
            </Row>
            <Row label="Text glow">
              <Toggle value={cfg.effects.textGlow} onChange={v => set("effects", "textGlow", v)} />
            </Row>
          </SectionCard>

          {/* ─── Splash / Enter Screen ──────────────────────────────────────── */}
          <SectionCard icon={Eye} label="Enter Screen">
            <Row label="Enable enter screen">
              <Toggle value={cfg.splash.enabled} onChange={v => set("splash", "enabled", v)} />
            </Row>
            {cfg.splash.enabled && (
              <>
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Type</span>
                  <Chips
                    value={cfg.splash.type}
                    onChange={v => set("splash", "type", v)}
                    options={[
                      { value: "blur", label: "Blur" },
                      { value: "black", label: "Black" },
                      { value: "glitch", label: "Glitch" },
                      { value: "gradient", label: "Gradient" },
                      { value: "image", label: "Image" },
                    ]}
                  />
                </div>
                <Row label="Title text">
                  <InputText value={cfg.splash.text} onChange={v => set("splash", "text", v)} placeholder="brazy" />
                </Row>
                <Row label="Subtext">
                  <InputText value={cfg.splash.subtext} onChange={v => set("splash", "subtext", v)} placeholder="click to enter" />
                </Row>
                <Row label="Enter button text">
                  <InputText value={cfg.splash.cta} onChange={v => set("splash", "cta", v)} placeholder="enter" />
                </Row>
                <Row label="Enter sound URL" hint="Plays when visitor clicks enter">
                  <InputText value={cfg.splash.enterSoundUrl} onChange={v => set("splash", "enterSoundUrl", v)} placeholder="https://..." />
                </Row>
                {cfg.splash.type === "blur" && (
                  <Row label="Blur amount">
                    <SliderRow value={cfg.splash.blurAmount} onChange={v => set("splash", "blurAmount", v)} min={0} max={40} step={1} format={v => `${v}px`} />
                  </Row>
                )}
                {cfg.splash.type === "image" && (
                  <Row label="Background image URL">
                    <InputText value={cfg.splash.imageUrl} onChange={v => set("splash", "imageUrl", v)} placeholder="https://..." />
                  </Row>
                )}
                <Divider />
                <Row label="BG color">
                  <ColorPill value={cfg.splash.bgColor} onChange={v => set("splash", "bgColor", v)} />
                </Row>
                <Row label="Text color">
                  <ColorPill value={cfg.splash.textColor} onChange={v => set("splash", "textColor", v)} />
                </Row>
                <Row label="Accent color">
                  <ColorPill value={cfg.splash.accentColor} onChange={v => set("splash", "accentColor", v)} />
                </Row>
              </>
            )}
          </SectionCard>

          {/* ─── Audio ──────────────────────────────────────────────────────── */}
          <SectionCard icon={Music} label="Audio">
            <Row label="Enable audio player">
              <Toggle value={cfg.audio.enabled} onChange={v => set("audio", "enabled", v)} />
            </Row>
            {cfg.audio.enabled && (
              <>
                <Row label="Audio URL (mp3 / wav)">
                  <InputText value={cfg.audio.src} onChange={v => set("audio", "src", v)} placeholder="https://..." />
                </Row>
                <Row label="Track title">
                  <InputText value={cfg.audio.title} onChange={v => set("audio", "title", v)} placeholder="Track name" />
                </Row>
                <Row label="Artist">
                  <InputText value={cfg.audio.artist} onChange={v => set("audio", "artist", v)} placeholder="Artist name" />
                </Row>
                <Divider />
                <Row label="Volume">
                  <SliderRow value={cfg.audio.volume} onChange={v => set("audio", "volume", v)} min={0} max={1} step={0.01} format={v => `${Math.round(v * 100)}%`} />
                </Row>
                <Row label="Autoplay">
                  <Toggle value={cfg.audio.autoplay} onChange={v => set("audio", "autoplay", v)} />
                </Row>
                <Row label="Loop">
                  <Toggle value={cfg.audio.loop} onChange={v => set("audio", "loop", v)} />
                </Row>
                <Row label="Visualizer bars">
                  <Toggle value={cfg.audio.showVisualizer} onChange={v => set("audio", "showVisualizer", v)} />
                </Row>
                <Divider />
                <div className="mb-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Player style</span>
                  <Chips
                    value={cfg.audio.style}
                    onChange={v => set("audio", "style", v)}
                    options={[
                      { value: "pill", label: "Pill" },
                      { value: "minimal", label: "Minimal" },
                      { value: "full", label: "Full" },
                    ]}
                  />
                </div>
              </>
            )}
          </SectionCard>

          {/* ─── Layout ──────────────────────────────────────────────────────── */}
          <SectionCard icon={Layout} label="Layout">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2.5">Content alignment</span>
              <Chips
                value={cfg.theme.contentAlign}
                onChange={v => set("theme", "contentAlign", v)}
                options={[
                  { value: "center", label: "Center" },
                  { value: "left", label: "Left" },
                ]}
              />
            </div>
            <Row label="Max width">
              <SliderRow value={cfg.theme.maxWidth} onChange={v => set("theme", "maxWidth", v)} min={280} max={900} step={10} format={v => `${v}px`} />
            </Row>
            <Divider />
            <Row label="Animated browser title" hint="Scrolling text in browser tab">
              <Toggle value={cfg.effects.animatedTitle} onChange={v => set("effects", "animatedTitle", v)} />
            </Row>
            {cfg.effects.animatedTitle && (
              <Row label="Title text">
                <InputText value={cfg.effects.animatedTitleText} onChange={v => set("effects", "animatedTitleText", v)} placeholder="custom scrolling title…" />
              </Row>
            )}
          </SectionCard>

          {/* ─── SEO ─────────────────────────────────────────────────────────── */}
          <SectionCard icon={Globe} label="SEO & Metadata">
            <Row label="Page title">
              <InputText value={cfg.seo.title} onChange={v => setCfg(prev => {
                if (!prev) return prev;
                const next = { ...prev, seo: { ...prev.seo, title: v } };
                scheduleSave(next);
                return next;
              })} placeholder="username — brazy" />
            </Row>
            <Row label="Meta description">
              <TextArea value={cfg.seo.description} onChange={v => setCfg(prev => {
                if (!prev) return prev;
                const next = { ...prev, seo: { ...prev.seo, description: v } };
                scheduleSave(next);
                return next;
              })} placeholder="A short description for search engines and link previews…" rows={2} />
            </Row>
            <Row label="OG image URL">
              <InputText value={cfg.seo.ogImage} onChange={v => setCfg(prev => {
                if (!prev) return prev;
                const next = { ...prev, seo: { ...prev.seo, ogImage: v } };
                scheduleSave(next);
                return next;
              })} placeholder="https://..." />
            </Row>
          </SectionCard>

          {/* ─── Custom CSS ─────────────────────────────────────────────────── */}
          <SectionCard icon={Code} label="Custom CSS">
            <p className="text-[10px] text-neutral-500 leading-normal mb-3">
              Injected into your public profile page. Target <code className="font-mono bg-neutral-900 px-1 py-0.5 rounded text-neutral-300">.brazy-card</code> for the main card.
            </p>
            <textarea
              value={cfg.customCss}
              onChange={e => {
                const v = e.target.value;
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = { ...prev, customCss: v };
                  scheduleSave(next);
                  return next;
                });
              }}
              placeholder="/* Write your custom CSS styles here */"
              rows={8}
              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl p-4 text-xs font-mono text-neutral-300 placeholder-neutral-700 outline-none resize-none leading-relaxed transition"
            />
          </SectionCard>

        </div>

        {/* Right Column - Live Preview Mockup */}
        <div className="flex-1 w-full lg:sticky lg:top-[85px] flex flex-col items-center justify-start gap-4">
          <div className="flex items-center justify-between w-full max-w-[340px] bg-neutral-950/40 border border-neutral-900/60 rounded-xl p-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-2.5">Live Preview</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPreviewDevice("mobile")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 border cursor-pointer ${
                  previewDevice === "mobile" 
                    ? "bg-red-600/10 border-red-600/30 text-red-500" 
                    : "bg-neutral-900 border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button 
                onClick={() => setPreviewDevice("desktop")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 border cursor-pointer ${
                  previewDevice === "desktop" 
                    ? "bg-red-600/10 border-red-600/30 text-red-500" 
                    : "bg-neutral-900 border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" /> Desktop
              </button>
            </div>
          </div>

          {/* Viewport Frame */}
          {previewDevice === "mobile" ? (
            /* Mobile Device Mockup */
            <div className="relative w-[340px] h-[600px] rounded-[44px] border-[8px] border-neutral-900 bg-neutral-950 shadow-2xl overflow-hidden flex flex-col no-scrollbar">
              {/* iPhone Notch/Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full bg-black z-50 flex items-center justify-center" />
              {/* Inner content */}
              <div className="preview-wrapper flex-1 w-full overflow-y-auto no-scrollbar relative">
                <ProfileRenderer config={cfg} preview={true} />
              </div>
            </div>
          ) : (
            /* Desktop Mockup */
            <div className="relative w-full max-w-[680px] h-[480px] rounded-2xl border-4 border-neutral-900 bg-neutral-950 shadow-2xl overflow-hidden flex flex-col">
              {/* Header Bar */}
              <div className="h-7 w-full bg-neutral-900 border-b border-neutral-850 flex items-center justify-between px-4 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[8px] text-neutral-500 select-none font-mono">brazy.it/{cfg.identity.username || "preview"}</div>
                <div className="w-10" />
              </div>
              {/* Inner Content */}
              <div className="preview-wrapper flex-1 w-full overflow-y-auto no-scrollbar relative">
                <ProfileRenderer config={cfg} preview={true} />
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
