"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Sparkles, LayoutTemplate, AlignCenter, AlignLeft, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";
import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
        value ? "bg-red-600" : "bg-neutral-800"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SliderRow({
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  label?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : String(value);
  return (
    <div className="flex flex-col gap-2 font-sans w-full">
      <div className="flex items-center justify-between">
        {label && <span className="text-xs font-bold text-neutral-400">{label}</span>}
        <span className="text-xs font-mono text-neutral-500 font-semibold">{display}</span>
      </div>
      <div className="relative flex-1 h-5 flex items-center">
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-neutral-800">
          <div
            className="absolute left-0 h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-5 opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-red-650 border-2 border-white shadow-md pointer-events-none transition-all duration-75"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

function Chips<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-150 border cursor-pointer select-none outline-none ${
            value === o.value
              ? "bg-red-600/10 border-red-600/40 text-red-500"
              : "bg-neutral-900 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-850"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function AdvanceLayoutPage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
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
        console.error("Load advance layout error:", err);
        setCfg(normalizeConfig({}));
      }
    })();
  }, []);

  const scheduleSave = useCallback((next: ProfileConfig) => {
    cfgRef.current = next;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (!userId || savingRef.current) return;
      savingRef.current = true;
      try {
        await clientSaveProfile(next);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save advance layout error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } finally {
        savingRef.current = false;
      }
    }, 800);
  }, [userId]);

  const updateTheme = (updates: Partial<ProfileConfig["theme"]>) => {
    setCfg((prev) => {
      if (!prev) return prev;
      const next = { ...prev, theme: { ...prev.theme, ...updates } } as ProfileConfig;
      scheduleSave(next);
      return next;
    });
  };

  if (!cfg) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-semibold text-neutral-500">Loading settings…</span>
        </div>
      </div>
    );
  }

  const { theme } = cfg;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-red-500" /> Advanced Layout Settings
          </h1>
          <p className="text-neutral-400 text-xs mt-1">
            Configure profile card geometries, widths, card glass styles, alignments, and glow attributes.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold backdrop-blur-md transition-all duration-355 ${
              saveStatus === "saved"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : saveStatus === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-neutral-900/50 border-neutral-800 text-neutral-400 animate-pulse"
            }`}
          >
            {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
            {saveStatus === "saving" ? "Saving updates..." : saveStatus === "saved" ? "Saved!" : "Connection error"}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Card Style & Layout Selection */}
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Card Style</span>
            <Chips
              value={theme.cardStyle}
              onChange={(v) => updateTheme({ cardStyle: v })}
              options={[
                { value: "glass", label: "Glassmorphism" },
                { value: "solid", label: "Solid Color" },
                { value: "outline", label: "Outline Only" },
                { value: "neon", label: "Neon Glow Outline" },
                { value: "minimal", label: "Minimalist Transparent" },
              ]}
            />
          </div>

          <div className="h-px bg-neutral-900" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-300">Profile Width Size</span>
              <span className="text-[10px] text-neutral-500 mt-1 max-w-sm">Select profile box card padding scale.</span>
            </div>
            <Chips
              value={theme.profileSize || "default"}
              onChange={(v) => updateTheme({ profileSize: v })}
              options={[
                { value: "default", label: "Compact" },
                { value: "medium", label: "Standard" },
                { value: "large", label: "Large" },
              ]}
            />
          </div>

          <div className="h-px bg-neutral-900" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-300">Content Text Alignment</span>
              <span className="text-[10px] text-neutral-500 mt-1 max-w-sm">Align name and descriptions within card.</span>
            </div>
            <Chips
              value={theme.contentAlign || "center"}
              onChange={(v) => updateTheme({ contentAlign: v })}
              options={[
                { value: "center", label: "Centered Align" },
                { value: "left", label: "Left Align" },
              ]}
            />
          </div>
        </div>

        {/* Sliders Box */}
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-6 shadow-2xl">
          <SliderRow
            value={theme.borderRadius}
            onChange={(v) => updateTheme({ borderRadius: v })}
            min={0}
            max={48}
            step={1}
            format={(v) => `${v}px`}
            label="Border Corner Radius"
          />

          <SliderRow
            value={theme.borderWidth}
            onChange={(v) => updateTheme({ borderWidth: v })}
            min={0}
            max={8}
            step={0.5}
            format={(v) => `${v}px`}
            label="Border Stroke Width"
          />

          <SliderRow
            value={theme.cardOpacity}
            onChange={(v) => updateTheme({ cardOpacity: v })}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            label="Card Background Opacity"
          />

          <SliderRow
            value={theme.cardBlur}
            onChange={(v) => updateTheme({ cardBlur: v })}
            min={0}
            max={60}
            step={1}
            format={(v) => `${v}px`}
            label="Card Backdrop Blur strength"
          />

          <SliderRow
            value={theme.maxWidth}
            onChange={(v) => updateTheme({ maxWidth: v })}
            min={320}
            max={800}
            step={10}
            format={(v) => `${v}px`}
            label="Profile Maximum Card Width"
          />
        </div>

        {/* Glow & Borders toggles */}
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-300">Glow Aura Effect</span>
              <span className="text-[10px] text-neutral-500 mt-1">Render neon shadows around the card.</span>
            </div>
            <Toggle value={theme.glow} onChange={(v) => updateTheme({ glow: v })} />
          </div>

          {theme.glow && (
            <div className="animate-in slide-in-from-top-1 duration-150">
              <SliderRow
                value={theme.glowIntensity}
                onChange={(v) => updateTheme({ glowIntensity: v })}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v}%`}
                label="Glow Shadow Intensity"
              />
            </div>
          )}

          <div className="h-px bg-neutral-900" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-300">Animated Gradient Border</span>
              <span className="text-[10px] text-neutral-500 mt-1">Animates borders with flowing accent gradients.</span>
            </div>
            <Toggle value={theme.animatedBorder} onChange={(v) => updateTheme({ animatedBorder: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}
