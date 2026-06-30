"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Image as ImageIcon, Palette, Type, MousePointer2, Sparkles,
  Music, Link2, Layout, Globe, Code, ChevronDown, ChevronRight,
  Check, Save, RotateCcw, Zap, Eye, EyeOff, Laptop, Smartphone,
  Settings, Pin, ShieldCheck, Award, Gamepad2, X, Type as TypeIcon
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
function SelectControl<T extends string>({
  value,
  onChange,
  options,
  label,
  icon: Icon,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1.5 font-sans w-full">
      {label && <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</span>}
      <div className="relative flex items-center w-full">
        {Icon && (
          <Icon className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none z-10" />
        )}
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className={`
            w-full appearance-none
            bg-neutral-950 border border-white/[0.06]
            rounded-xl px-3.5 py-2 text-xs text-neutral-300
            focus:outline-none focus:border-white/20
            cursor-pointer transition
            ${Icon ? "pl-10" : ""}
          `}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-neutral-950 text-neutral-300">{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
      </div>
    </div>
  );
}

// Visual chip grid for effect pickers
function EffectChips<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; emoji?: string }[];
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2 font-sans w-full">
      {label && <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 border cursor-pointer ${
              value === o.value
                ? "bg-red-600/10 border-red-600/40 text-red-500"
                : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            {o.emoji && <span>{o.emoji}</span>}
            {o.label}
          </button>
        ))}
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

// ─── Username Effect Live Preview Tile ────────────────────────────────────────

type UsernameEffectValue = "none" | "glow" | "glitch" | "typewriter" | "rainbow" | "neon" | "shake" | "gradient" | "bounce" | "pulse" | "wave";

const USERNAME_EFFECTS: { value: UsernameEffectValue; label: string }[] = [
  { value: "none",       label: "None" },
  { value: "typewriter", label: "Typewriter" },
  { value: "rainbow",    label: "Rainbow" },
  { value: "glow",       label: "Pulsing Glow" },
  { value: "glitch",     label: "Glitch" },
  { value: "neon",       label: "Neon Sparkle" },
  { value: "shake",      label: "Shake" },
  { value: "gradient",   label: "Gradient" },
  { value: "bounce",     label: "Bounce" },
  { value: "pulse",      label: "Pulse" },
  { value: "wave",       label: "Wave" },
];

function EffectPreviewText({ effect, name }: { effect: UsernameEffectValue; name: string }) {
  const [tick, setTick] = useState(0);
  const [typewriterIdx, setTypewriterIdx] = useState(0);
  const [typewriterForward, setTypewriterForward] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(interval);
  }, []);

  // Typewriter logic
  useEffect(() => {
    if (effect !== "typewriter") return;
    const interval = setInterval(() => {
      setTypewriterIdx(prev => {
        if (typewriterForward) {
          if (prev >= name.length) { setTypewriterForward(false); return prev; }
          return prev + 1;
        } else {
          if (prev <= 0) { setTypewriterForward(true); return prev; }
          return prev - 1;
        }
      });
    }, 120);
    return () => clearInterval(interval);
  }, [effect, name, typewriterForward]);

  const baseClass = "text-sm font-extrabold tracking-tight select-none";

  if (effect === "none") {
    return <span className={`${baseClass} text-white`}>{name}</span>;
  }

  if (effect === "typewriter") {
    return (
      <span className={`${baseClass} text-white font-mono`}>
        {name.slice(0, typewriterIdx)}
        <span className="animate-pulse">|</span>
      </span>
    );
  }

  if (effect === "rainbow") {
    const colors = ["#ff0000","#ff7700","#ffff00","#00ff00","#0099ff","#9900ff"];
    return (
      <span className={baseClass}>
        {name.split("").map((ch, i) => (
          <span key={i} style={{ color: colors[(i + tick) % colors.length], transition: "color 0.1s" }}>{ch}</span>
        ))}
      </span>
    );
  }

  if (effect === "glow") {
    const glowOpacity = 0.5 + 0.5 * Math.sin(tick * 0.15);
    return (
      <span
        className={`${baseClass} text-white`}
        style={{ textShadow: `0 0 ${8 + glowOpacity * 14}px rgba(255,255,255,${0.4 + glowOpacity * 0.6})` }}
      >
        {name}
      </span>
    );
  }

  if (effect === "glitch") {
    const glitching = tick % 20 < 3;
    return (
      <span
        className={`${baseClass} text-white`}
        style={{
          textShadow: glitching ? "2px 0 #ff0040, -2px 0 #00ffff" : "none",
          transform: glitching ? `translate(${(Math.random() - 0.5) * 3}px, 0)` : "none",
          display: "inline-block",
        }}
      >
        {name}
      </span>
    );
  }

  if (effect === "neon") {
    const pulse = 0.6 + 0.4 * Math.sin(tick * 0.12);
    return (
      <span
        className={`${baseClass}`}
        style={{
          color: `rgba(200,180,255,${0.8 + pulse * 0.2})`,
          textShadow: `0 0 8px rgba(160,100,255,${pulse}), 0 0 20px rgba(160,100,255,${pulse * 0.5})`,
        }}
      >
        {name}
      </span>
    );
  }

  if (effect === "shake") {
    const shaking = tick % 30 < 5;
    return (
      <span
        className={`${baseClass} text-white`}
        style={{
          display: "inline-block",
          transform: shaking ? `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*3}px)` : "none",
        }}
      >
        {name}
      </span>
    );
  }

  if (effect === "gradient") {
    const offset = (tick * 2) % 360;
    return (
      <span
        className={baseClass}
        style={{
          background: `linear-gradient(${offset}deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {name}
      </span>
    );
  }

  if (effect === "bounce") {
    return (
      <span className={baseClass}>
        {name.split("").map((ch, i) => (
          <span
            key={i}
            className="inline-block text-white"
            style={{ transform: `translateY(${Math.sin((tick * 0.2) + i * 0.6) * 4}px)` }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  }

  if (effect === "pulse") {
    const scale = 1 + 0.06 * Math.sin(tick * 0.12);
    return (
      <span
        className={`${baseClass} text-white inline-block`}
        style={{ transform: `scale(${scale})` }}
      >
        {name}
      </span>
    );
  }

  if (effect === "wave") {
    return (
      <span className={baseClass}>
        {name.split("").map((ch, i) => (
          <span
            key={i}
            className="inline-block text-white"
            style={{ transform: `translateY(${Math.sin((tick * 0.15) + i * 0.8) * 5}px)` }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  }

  return <span className={`${baseClass} text-white`}>{name}</span>;
}

// ─── Username Effect Modal ─────────────────────────────────────────────────────

function UsernameEffectModal({
  current,
  onClose,
  onSave,
  previewName,
}: {
  current: UsernameEffectValue;
  onClose: () => void;
  onSave: (v: UsernameEffectValue) => void;
  previewName: string;
}) {
  const [selected, setSelected] = useState<UsernameEffectValue>(current);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900">
          <span className="text-sm font-extrabold text-white tracking-tight">Username Effects</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-4 grid grid-cols-3 gap-2.5 max-h-[400px] overflow-y-auto">
          {USERNAME_EFFECTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition duration-150 cursor-pointer h-[80px] overflow-hidden ${
                selected === opt.value
                  ? "border-red-500/50 bg-red-600/5"
                  : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/60"
              }`}
            >
              {selected === opt.value && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
              <EffectPreviewText effect={opt.value} name={previewName || "brazy"} />
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 py-3 border-t border-neutral-900">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(selected); onClose(); }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizePage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [showEffectModal, setShowEffectModal] = useState(false);
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

  const currentEffectLabel = USERNAME_EFFECTS.find(e => e.value === cfg.effects.usernameEffect)?.label ?? "None";

  return (
    <div className="flex flex-col gap-6 w-full max-w-full mx-auto pb-12 select-none font-sans">
      
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

      {/* Username Effect Modal */}
      {showEffectModal && (
        <UsernameEffectModal
          current={cfg.effects.usernameEffect as UsernameEffectValue}
          previewName={cfg.identity.displayName || cfg.identity.username || "brazy"}
          onClose={() => setShowEffectModal(false)}
          onSave={(v) => set("effects", "usernameEffect", v)}
        />
      )}

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

      <div className="w-full max-w-full mx-auto flex flex-col gap-6 pb-8">
          
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
                trackId: cfg.audio.trackId || "",
                title: cfg.audio.title || "",
                artist: cfg.audio.artist || "",
                thumb: cfg.audio.coverUrl || "",
              } : null}
              onAudioMetaChange={(meta) => {
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = {
                    ...prev,
                    audio: {
                      ...prev.audio,
                      trackId: meta?.trackId || "",
                      title: meta?.title || "",
                      artist: meta?.artist || "",
                      coverUrl: meta?.thumb || "",
                    }
                  };
                  scheduleSave(next);
                  return next;
                });
              }}
              lyrics={cfg.audio.lyrics || []}
              onLyricsChange={(lyrics) => {
                setCfg(prev => {
                  if (!prev) return prev;
                  const next = {
                    ...prev,
                    audio: {
                      ...prev.audio,
                      lyrics,
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
                    icon={Gamepad2}
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

              {/* Background Blur */}
              <SliderRow
                label="Background Blur"
                value={cfg.background.blur ?? 0}
                onChange={v => set("background", "blur", v)}
                min={0}
                max={40}
                step={1}
                format={v => `${v}px`}
              />

              {/* Background Effects */}
              <SelectControl
                icon={Sparkles}
                label="Background Effects"
                value={cfg.background.type}
                onChange={v => set("background", "type", v)}
                options={[
                  { value: "none", label: "None" },
                  { value: "particles", label: "Blurred Particles" },
                  { value: "matrix", label: "Matrix Rain" },
                  { value: "starfield", label: "Moving Starfield" },
                  { value: "aurora", label: "Northern Aurora" },
                  { value: "rain", label: "Falling Rain" },
                  { value: "snow", label: "Falling Snow" },
                  { value: "bubbles", label: "Floating Bubbles" },
                  { value: "grid", label: "Retro Grid" },
                  { value: "gradient", label: "Animated Gradient" },
                ]}
              />

              {/* Username Effects — opens modal picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Username Effects</span>
                <button
                  onClick={() => setShowEffectModal(true)}
                  className="flex items-center justify-between gap-2 w-full bg-neutral-950 border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs text-neutral-300 hover:border-white/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{currentEffectLabel}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                </button>
              </div>

              {/* Views Placement */}
              <SelectControl
                icon={Eye}
                label="Views Placement"
                value={cfg.analytics?.viewsPlacement ?? "inside"}
                onChange={v => {
                  setCfg(prev => {
                    if (!prev) return prev;
                    const next = {
                      ...prev,
                      analytics: {
                        ...prev.analytics,
                        viewsPlacement: v as "none" | "inside" | "outside",
                        showViews: v !== "none",
                      }
                    };
                    scheduleSave(next);
                    return next;
                  });
                }}
                options={[
                  { value: "inside", label: "Inside Card" },
                  { value: "outside", label: "Outside Card" },
                  { value: "none", label: "Hidden / Disabled" },
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
                  <GlowPill 
                    label="Views Counter" 
                    active={cfg.analytics?.showViews ?? true} 
                    onClick={() => {
                      const currentVal = cfg.analytics?.showViews ?? true;
                      setCfg(prev => {
                        if (!prev) return prev;
                        const next = {
                          ...prev,
                          analytics: {
                            ...prev.analytics,
                            showViews: !currentVal,
                            viewsPlacement: (!currentVal ? (prev.analytics?.viewsPlacement === "none" ? "inside" : prev.analytics?.viewsPlacement ?? "inside") : "none") as "none" | "inside" | "outside",
                          }
                        };
                        scheduleSave(next);
                        return next;
                      });
                    }} 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Cursor & Click Effects Section */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-4 font-sans">
            <h2 className="text-sm font-extrabold text-neutral-300 tracking-tight flex items-center gap-2 uppercase text-neutral-500 text-[10px] tracking-widest border-b border-neutral-900 pb-2">
              Cursor & Click Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cursor Effect Card */}
              <div className="border border-neutral-900 bg-neutral-900/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Cursor Effect</span>
                  <Toggle value={cfg.effects.cursor.enabled} onChange={v => setCursor("enabled", v)} />
                </div>
                {cfg.effects.cursor.enabled && (
                  <>
                    <EffectChips
                      label="Effect Type"
                      value={cfg.effects.cursor.type}
                      onChange={v => setCursor("type", v as any)}
                      options={[
                        { value: "trail", label: "Trail" },
                        { value: "sparkles", label: "Sparkles", emoji: "✨" },
                        { value: "dots", label: "Dots" },
                        { value: "rings", label: "Rings" },
                        { value: "glow", label: "Glow" },
                        { value: "cat", label: "Cat", emoji: "🐱" },
                        { value: "bubble", label: "Bubble", emoji: "🫧" },
                        { value: "snowflake", label: "Snow", emoji: "❄️" },
                      ]}
                    />
                    <ColorPill label="Effect Color" value={cfg.effects.cursor.color} onChange={v => setCursor("color", v)} />
                    <SliderRow
                      label="Cursor Size"
                      value={cfg.effects.cursor.size}
                      onChange={v => setCursor("size", v)}
                      min={2}
                      max={24}
                      step={1}
                      format={v => `${v}px`}
                    />
                  </>
                )}
              </div>

              {/* Click Effect Card */}
              <div className="border border-neutral-900 bg-neutral-900/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Click Effect</span>
                  <Toggle value={cfg.effects.click.enabled} onChange={v => setClick("enabled", v)} />
                </div>
                {cfg.effects.click.enabled && (
                  <>
                    <EffectChips
                      label="Effect Type"
                      value={cfg.effects.click.type}
                      onChange={v => setClick("type", v as any)}
                      options={[
                        { value: "burst", label: "Burst" },
                        { value: "ripple", label: "Ripple" },
                        { value: "hearts", label: "Hearts", emoji: "❤️" },
                        { value: "confetti", label: "Confetti", emoji: "🎉" },
                        { value: "emojis", label: "Emoji", emoji: "😄" },
                      ]}
                    />
                    {cfg.effects.click.type === "emojis" ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Custom Emoji</span>
                        <InputText value={cfg.effects.click.emoji} onChange={v => setClick("emoji", v)} placeholder="✨" />
                      </div>
                    ) : (
                      <ColorPill label="Effect Color" value={cfg.effects.click.color} onChange={v => setClick("color", v)} />
                    )}
                  </>
                )}
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
                <span className="text-xs font-bold text-neutral-300">Background Base</span>
                <span className="text-[10px] text-neutral-500">Upload an image/video above, or use a solid color below</span>
              </div>
              <button
                onClick={() => {
                  setCfg(prev => {
                    if (!prev) return prev;
                    const next = {
                      ...prev,
                      background: {
                        ...prev.background,
                        imageUrl: "",
                        videoUrl: "",
                      }
                    };
                    scheduleSave(next);
                    return next;
                  });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border cursor-pointer text-center ${
                  !cfg.background.imageUrl && !cfg.background.videoUrl
                    ? "bg-red-600/10 border-red-600/40 text-red-500"
                    : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                }`}
              >
                {!cfg.background.imageUrl && !cfg.background.videoUrl ? "Using Solid Color" : "Clear Uploaded Background"}
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
                  { value: "portfolio", label: "Portfolio" },
                  { value: "simplistic", label: "Simplistic" },
                  { value: "modern", label: "Modern" },
                  { value: "sleek", label: "Sleek" },
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

    </div>
  );
}
