"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Image as ImageIcon, Palette, Type, MousePointer2, Sparkles,
  Music, Link2, Layout, Globe, Code, ChevronDown, ChevronRight,
  Check, Save, RotateCcw, Zap, Eye, EyeOff, Laptop, Smartphone,
  Settings, Pin, ShieldCheck, Award
} from "lucide-react";

import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import ProfileRenderer from "@/components/profile/ProfileRenderer";
import { AssetsUploader } from "@/components/dashboard/AssetsUploader";

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

function ColorPill({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5 font-sans">
      {label && <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</span>}
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 w-full max-w-[180px] hover:border-neutral-700 transition duration-150 relative">
        <label className="cursor-pointer relative shrink-0">
          <div className="w-5 h-5 rounded-md border border-white/10" style={{ backgroundColor: value }} />
          <input type="color" value={value} onChange={e => onChange(e.target.value)} className="opacity-0 absolute inset-0 cursor-pointer w-full h-full" />
        </label>
        <span className="text-[11px] font-mono text-neutral-400 font-semibold">{value.toUpperCase()}</span>
      </div>
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

function SliderRow({ value, onChange, min, max, step = 1, format, label }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string; label?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : String(value);
  return (
    <div className="flex flex-col gap-2 font-sans w-full">
      <div className="flex items-center justify-between">
        {label && <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</span>}
        <span className="text-[10px] font-mono text-neutral-500 font-semibold">{display}</span>
      </div>
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

function InputText({ value, onChange, placeholder, icon: Icon }: { value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ElementType }) {
  return (
    <div className="relative flex items-center w-full font-sans">
      {Icon && <Icon className="absolute left-3 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 w-full transition ${Icon ? "pl-9" : ""}`}
      />
    </div>
  );
}

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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full font-sans">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border bg-neutral-950 transition duration-150 cursor-pointer group text-center ${
            value === o.value
              ? "border-red-600/30 bg-red-600/5"
              : "border-neutral-900 hover:border-red-600/30 hover:bg-neutral-900/30"
          }`}
        >
          {o.emoji && <span className="text-sm mb-1 transition-transform duration-200 group-hover:scale-110">{o.emoji}</span>}
          <span className={`text-[10px] font-bold tracking-tight truncate w-full ${value === o.value ? "text-red-500" : "text-neutral-400 group-hover:text-white"}`}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// Custom Select primitive matching guns.lol layout
function SelectControl<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5 font-sans w-full">
      {label && <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</span>}
      <div className="relative w-full">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className="bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500/40 w-full appearance-none transition cursor-pointer"
        >
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-neutral-950 text-neutral-300">{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
      </div>
    </div>
  );
}

// Glow setting toggle pill button
function GlowPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold transition duration-200 border cursor-pointer ${
        active
          ? "bg-emerald-600/10 border-emerald-600/40 text-emerald-400 hover:bg-emerald-600/20"
          : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900/60"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
      {label}
    </button>
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

        {/* Left Column - Form controls in guns.lol Layout */}
        <div className="w-full lg:w-[48%] xl:w-[45%] shrink-0 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-2 scrollbar-none pb-8">
          
          {/* 1. Assets Uploader Section */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-4 font-sans">
            <h2 className="text-sm font-extrabold text-neutral-300 tracking-tight flex items-center gap-2 uppercase text-neutral-500 text-[10px] tracking-widest border-b border-neutral-900 pb-2">
              Assets Uploader
            </h2>
            <AssetsUploader
              backgroundUrl={cfg.background.imageUrl || cfg.background.videoUrl || ""}
              onBackgroundChange={(url) => {
                const isVideo = url.endsWith(".mp4") || url.endsWith(".webm") || url.toLowerCase().includes("video");
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = {
                    ...prev,
                    background: {
                      ...prev.background,
                      type: url ? (isVideo ? "video" as const : "image" as const) : "none" as const,
                      imageUrl: isVideo ? "" : url,
                      videoUrl: isVideo ? url : "",
                    }
                  };
                  scheduleSave(next);
                  return next;
                });
              }}
              avatarUrl={cfg.identity.avatarUrl}
              onAvatarChange={(url) => set("identity", "avatarUrl", url)}
              cursorUrl={cfg.effects.cursor.url || ""}
              onCursorChange={(url) => {
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = {
                    ...prev,
                    effects: {
                      ...prev.effects,
                      cursor: {
                        ...prev.effects.cursor,
                        type: url ? "custom" as const : "none" as const,
                        url,
                      }
                    }
                  };
                  scheduleSave(next);
                  return next;
                });
              }}
              audioUrl={cfg.audio.src}
              onAudioChange={(url) => {
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = {
                    ...prev,
                    audio: {
                      ...prev.audio,
                      enabled: !!url,
                      src: url,
                    }
                  };
                  scheduleSave(next);
                  return next;
                });
              }}
              audioVolume={cfg.audio.volume}
              onAudioVolumeChange={(v) => set("audio", "volume", v)}
              selectedTrack={cfg.audio.src ? {
                trackId: "",
                title: cfg.audio.title,
                artist: cfg.audio.artist,
                thumb: "",
              } : null}
              onAudioMetaChange={(meta) => {
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = {
                    ...prev,
                    audio: {
                      ...prev.audio,
                      title: meta?.title || "",
                      artist: meta?.artist || "",
                    }
                  };
                  scheduleSave(next);
                  return next;
                });
              }}
            />
          </div>

          {/* 2. General Customization Section */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-5 font-sans">
            <h2 className="text-sm font-extrabold text-neutral-300 tracking-tight flex items-center gap-2 uppercase text-neutral-500 text-[10px] tracking-widest border-b border-neutral-900 pb-2">
              General Customization
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Description/Bio */}
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Bio / Description</span>
                <TextArea 
                  value={cfg.identity.bio} 
                  onChange={v => set("identity", "bio", v)} 
                  placeholder="Tell the world about yourself (markdown supported)..." 
                  rows={2} 
                />
              </div>

              {/* Tagline / Pronouns */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Tagline</span>
                <InputText value={cfg.identity.tagline} onChange={v => set("identity", "tagline", v)} placeholder="founder · designer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pronouns</span>
                <InputText value={cfg.identity.pronouns} onChange={v => set("identity", "pronouns", v)} placeholder="they/them" />
              </div>

              {/* Discord Presence */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Discord Presence</span>
                <div className="flex gap-2">
                  <SelectControl
                    value={cfg.widgets.discordPresence.enabled ? "enabled" : "disabled"}
                    onChange={(v) => setCfg(prev => {
                      if (!prev) return prev;
                      const next = {
                        ...prev,
                        widgets: {
                          ...prev.widgets,
                          discordPresence: {
                            ...prev.widgets.discordPresence,
                            enabled: v === "enabled",
                          }
                        }
                      };
                      scheduleSave(next);
                      return next;
                    })}
                    options={[
                      { value: "enabled", label: "Enabled" },
                      { value: "disabled", label: "Disabled" },
                    ]}
                  />
                  {cfg.widgets.discordPresence.enabled && (
                    <div className="w-[120px] shrink-0">
                      <InputText 
                        value={cfg.widgets.discordPresence.discordId} 
                        onChange={(v) => setCfg(prev => {
                          if (!prev) return prev;
                          const next = {
                            ...prev,
                            widgets: {
                              ...prev.widgets,
                              discordPresence: {
                                ...prev.widgets.discordPresence,
                                discordId: v,
                              }
                            }
                          };
                          scheduleSave(next);
                          return next;
                        })} 
                        placeholder="Discord ID" 
                        icon={Settings} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Location</span>
                <InputText value={cfg.identity.location} onChange={v => set("identity", "location", v)} placeholder="italy" icon={Pin} />
              </div>

              {/* Profile Opacity */}
              <SliderRow
                label="Profile Opacity"
                value={cfg.theme.cardOpacity}
                onChange={v => set("theme", "cardOpacity", v)}
                min={0}
                max={1}
                step={0.01}
                format={v => `${Math.round(v * 100)}%`}
              />

              {/* Profile Blur */}
              <SliderRow
                label="Profile Blur"
                value={cfg.theme.cardBlur}
                onChange={v => set("theme", "cardBlur", v)}
                min={0}
                max={60}
                step={1}
                format={v => `${v}px`}
              />

              {/* Background Effects */}
              <SelectControl
                label="Background Effects"
                value={cfg.background.type}
                onChange={v => set("background", "type", v)}
                options={[
                  { value: "none", label: "None / Solid" },
                  { value: "particles", label: "Blurred Particles" },
                  { value: "matrix", label: "Matrix Rain" },
                  { value: "starfield", label: "Moving Starfield" },
                  { value: "aurora", label: "Northern Aurora" },
                  { value: "rain", label: "Falling Rain" },
                  { value: "snow", label: "Falling Snow" },
                  { value: "bubbles", label: "Floating Bubbles" },
                  { value: "grid", label: "Retro Grid" },
                  { value: "image", label: "Static Image" },
                  { value: "video", label: "Looping Video" },
                ]}
              />

              {/* Username Effects */}
              <SelectControl
                label="Username Effects"
                value={cfg.effects.usernameEffect}
                onChange={v => set("effects", "usernameEffect", v)}
                options={[
                  { value: "none", label: "Default" },
                  { value: "glow", label: "Pulsing Glow" },
                  { value: "glitch", label: "Glitch Scanlines" },
                  { value: "typewriter", label: "Typewriter Text" },
                  { value: "rainbow", label: "Rainbow Flow" },
                  { value: "neon", label: "Neon Sparkle" },
                  { value: "shake", label: "Shaking Text" },
                ]}
              />

              {/* Glow Settings */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Glow Settings</span>
                <div className="flex gap-2 flex-wrap">
                  <GlowPill 
                    label="Username" 
                    active={cfg.effects.textGlow} 
                    onClick={() => set("effects", "textGlow", !cfg.effects.textGlow)} 
                  />
                  <GlowPill 
                    label="Socials" 
                    active={cfg.theme.glow} 
                    onClick={() => set("theme", "glow", !cfg.theme.glow)} 
                  />
                  <GlowPill 
                    label="Badges" 
                    active={cfg.badges.enabled} 
                    onClick={() => set("badges", "enabled", !cfg.badges.enabled)} 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 3. Color Customization Section */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-5 font-sans">
            <h2 className="text-sm font-extrabold text-neutral-300 tracking-tight flex items-center gap-2 uppercase text-neutral-500 text-[10px] tracking-widest border-b border-neutral-900 pb-2">
              Color Customization
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ColorPill label="Accent Color" value={cfg.theme.primaryColor} onChange={v => set("theme", "primaryColor", v)} />
              <ColorPill label="Text Color" value={cfg.theme.textColor} onChange={v => set("theme", "textColor", v)} />
              <ColorPill label="Muted Color" value={cfg.theme.mutedTextColor} onChange={v => set("theme", "mutedTextColor", v)} />
              
              <ColorPill label="Primary BG" value={cfg.background.color1} onChange={v => set("background", "color1", v)} />
              <ColorPill label="Secondary BG" value={cfg.background.color2} onChange={v => set("background", "color2", v)} />
              <ColorPill label="Accent BG" value={cfg.background.color3} onChange={v => set("background", "color3", v)} />
            </div>

            <Divider />

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-neutral-300">Disable Background Gradient</span>
                <span className="text-[10px] text-neutral-500">Locks background to a solid color type</span>
              </div>
              <button
                onClick={() => set("background", "type", cfg.background.type === "color" ? "gradient" : "color")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border cursor-pointer text-center ${
                  cfg.background.type === "color"
                    ? "bg-red-600/10 border-red-600/40 text-red-500"
                    : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                }`}
              >
                {cfg.background.type === "color" ? "Enable Background Gradient" : "Disable Background Gradient"}
              </button>
            </div>
          </div>

          {/* 4. Layout & Details Section */}
          <SectionCard icon={Layout} label="Card Border & Typography">
            <Row label="Border radius">
              <SliderRow value={cfg.theme.borderRadius} onChange={v => set("theme", "borderRadius", v)} min={0} max={48} step={1} format={v => `${v}px`} />
            </Row>
            <Row label="Border width">
              <SliderRow value={cfg.theme.borderWidth} onChange={v => set("theme", "borderWidth", v)} min={0} max={8} step={0.5} format={v => `${v}px`} />
            </Row>
            <Row label="Card border animation" hint="Rotating gradient rainbow border">
              <Toggle value={cfg.theme.animatedBorder} onChange={v => set("theme", "animatedBorder", v)} />
            </Row>
            <Divider />
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">Card style</span>
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
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">Font family</span>
              <Chips
                value={cfg.theme.fontFamily}
                onChange={v => set("theme", "fontFamily", v)}
                options={[
                  { value: "geist", label: "Geist" },
                  { value: "inter", label: "Inter" },
                  { value: "poppins", label: "Poppins" },
                  { value: "mono", label: "Monospace" },
                  { value: "serif", label: "Serif" },
                ]}
              />
            </div>
          </SectionCard>

          {/* 5. SEO & Custom Injections Accordion */}
          <SectionCard icon={Globe} label="SEO & Custom Code Injection">
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
              })} placeholder="A short description for previews…" rows={2} />
            </Row>
            <Row label="OG image URL">
              <InputText value={cfg.seo.ogImage} onChange={v => setCfg(prev => {
                if (!prev) return prev;
                const next = { ...prev, seo: { ...prev.seo, ogImage: v } };
                scheduleSave(next);
                return next;
              })} placeholder="https://..." />
            </Row>
            <Divider />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Custom CSS Injection</span>
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
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-850 rounded-xl p-4 text-xs font-mono text-neutral-300 placeholder-neutral-700 outline-none resize-none leading-relaxed transition"
              />
            </div>
          </SectionCard>

        </div>

        {/* Right Column - Live Preview Mockup */}
        <div className="flex-1 w-full lg:sticky lg:top-[85px] flex flex-col items-center justify-start gap-4">
          <div className="flex items-center justify-between w-full max-w-[340px] bg-neutral-950/40 border border-neutral-900/60 rounded-xl p-2 font-sans">
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
              <div className="h-7 w-full bg-neutral-900 border-b border-neutral-850 flex items-center justify-between px-4 shrink-0 font-sans">
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
