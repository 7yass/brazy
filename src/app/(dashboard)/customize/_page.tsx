"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import {
  Image as ImageIcon, Palette, Type, MousePointer2, Sparkles,
  Music, Link2, Layout, Globe, Code, ChevronDown, ChevronRight,
  Check, Save, RotateCcw, Zap, Eye, EyeOff,
} from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

// ─── Shared primitives ─────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon, label, children, defaultOpen = true,
}: {
  icon: React.ElementType; label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.018)", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", borderBottom: open ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "border 0.2s" }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(220,38,38,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 13, height: 13, color: "#dc2626" }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", flex: 1, textAlign: "left" }}>{label}</span>
        {open
          ? <ChevronDown style={{ width: 14, height: 14, color: "rgba(255,255,255,0.3)" }} />
          : <ChevronRight style={{ width: 14, height: 14, color: "rgba(255,255,255,0.3)" }} />}
      </button>
      {open && <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 36 }}>
      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "block" }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", display: "block", marginTop: 1 }}>{hint}</span>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function ColorPill({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "5px 10px", cursor: "pointer" }}>
      <label style={{ cursor: "pointer", position: "relative" }}>
        <div style={{ width: 18, height: 18, borderRadius: 5, background: value, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
        <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ opacity: 0, position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }} />
      </label>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{value.toUpperCase()}</span>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 99, cursor: "pointer", border: "none", padding: 2, background: value ? "#dc2626" : "rgba(255,255,255,0.1)", transition: "background 0.2s", display: "flex", alignItems: "center", flexShrink: 0 }}
    >
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transform: value ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)", display: "block", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
    </button>
  );
}

function SliderRow({ value, onChange, min, max, step = 1, format }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : String(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 260 }}>
      <div style={{ flex: 1, position: "relative", height: 22, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
          <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#dc2626,#e11d48)", borderRadius: 99 }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: 22, margin: 0 }} />
        <div style={{ position: "absolute", left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: "50%", background: "#dc2626", border: "2px solid #fff", boxShadow: "0 1px 6px rgba(220,38,38,0.5)", pointerEvents: "none" }} />
      </div>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 38, textAlign: "right", flexShrink: 0 }}>{display}</span>
    </div>
  );
}

function Chips<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{ padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: F, cursor: "pointer", border: value === o.value ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.07)", background: value === o.value ? "rgba(220,38,38,0.12)" : "rgba(255,255,255,0.03)", color: value === o.value ? "#dc2626" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}
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
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.15s" }}
      onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.5)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", transition: "border-color 0.15s", lineHeight: 1.6 }}
      onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.5)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
    />
  );
}

function TileGrid<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; emoji?: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 6 }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 6px", borderRadius: 12, cursor: "pointer", border: value === o.value ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.06)", background: value === o.value ? "rgba(220,38,38,0.1)" : "rgba(255,255,255,0.02)", transition: "all 0.15s", fontFamily: F }}
        >
          {o.emoji && <span style={{ fontSize: 16 }}>{o.emoji}</span>}
          <span style={{ fontSize: 10, fontWeight: 600, color: value === o.value ? "#dc2626" : "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.2 }}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "2px 0" }} />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizePage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const cfgRef = useRef<ProfileConfig | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const { data: profile } = await supabase.from("profiles").select("config").eq("user_id", user.id).maybeSingle();
        const loaded = normalizeConfig(profile?.config ?? {});
        setCfg(loaded);
        cfgRef.current = loaded;
      } catch { setCfg(normalizeConfig({})); }
    })();
  }, []);

  const doSave = useCallback(async (config: ProfileConfig) => {
    if (!userId || savingRef.current) return;
    savingRef.current = true;
    setSaveStatus("saving");
    try {
      const supabase = createClient();
      if (!supabase) return;
      await supabase.from("profiles").upsert({ user_id: userId, config, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: F }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", animation: "pulse 1.2s ease-in-out infinite" }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Loading your profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Customize</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Design every pixel of your brazy page.</p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ─── Identity ─────────────────────────────────────────────── */}
        <SectionCard icon={Type} label="Identity">
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Type</span>
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Card style</span>
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Font family</span>
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Profile size</span>
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Username effect</span>
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Cursor effect</span>
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
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Click effect</span>
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
        <SectionCard icon={Eye} label="Enter Screen" defaultOpen={false}>
          <Row label="Enable enter screen">
            <Toggle value={cfg.splash.enabled} onChange={v => set("splash", "enabled", v)} />
          </Row>
          {cfg.splash.enabled && (
            <>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Type</span>
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
        <SectionCard icon={Music} label="Audio" defaultOpen={false}>
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
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Player style</span>
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
        <SectionCard icon={Layout} label="Layout" defaultOpen={false}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Content alignment</span>
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
        <SectionCard icon={Globe} label="SEO & Metadata" defaultOpen={false}>
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
        <SectionCard icon={Code} label="Custom CSS" defaultOpen={false}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
            Injected into your public profile page. Target <code style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4 }}>.brazy-card</code> for the main card.
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
            placeholder="/* your custom CSS */"
            rows={8}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "#e2e8f0", fontFamily: "monospace", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.7 }}
            onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.4)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </SectionCard>

      </div>
    </div>
  );
}
