"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Trash2, Copy, Check, Sparkles } from "lucide-react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import type { UsernameEffect } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { TextInput, TextArea, ColorInput, Slider, Toggle } from "./controls";
import { SectionCard } from "./SectionCard";
import CustomSelect from "@/components/ui/CustomSelect";
import UsernameEffectsModal from "./UsernameEffectsModal";

const backgroundOpts = [
  { value: "none" as const, label: "None" },
  { value: "color" as const, label: "Color" },
  { value: "gradient" as const, label: "Gradient" },
  { value: "particles" as const, label: "Particles" },
  { value: "matrix" as const, label: "Matrix" },
  { value: "starfield" as const, label: "Starfield" },
  { value: "aurora" as const, label: "Aurora" },
  { value: "rain" as const, label: "Rain" },
  { value: "snow" as const, label: "Snow" },
  { value: "bubbles" as const, label: "Bubbles" },
  { value: "grid" as const, label: "Grid" },
  { value: "image" as const, label: "Image" },
  { value: "video" as const, label: "Video" },
];

const cursorOpts = [
  { value: "none",      label: "None" },
  { value: "trail",     label: "Trail" },
  { value: "sparkles",  label: "Sparkles" },
  { value: "dots",      label: "Dots" },
  { value: "rings",     label: "Rings" },
  { value: "glow",      label: "Glow" },
  { value: "dot",       label: "Following Dot" },
  { value: "ghost",     label: "Ghost Cursor" },
  { value: "particles", label: "Particles" },
  { value: "shooting",  label: "Shooting Star" },
  { value: "cat",       label: "Cursor Cat" },
  { value: "snowflake", label: "Snowflake" },
  { value: "bubble",    label: "Bubble" },
];

const EFFECT_LABELS: Record<string, string> = {
  none: "None", typewriter: "Typewriter", rainbow: "Rainbow", glitch: "Glitch",
  glow: "Glow", neon: "Neon", shake: "Shake", gradient: "Gradient",
  bounce: "Bounce", pulse: "Pulse", wave: "Wave",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-white/60">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function ProfileEditor({
  initialConfig,
  username,
  onSave,
  saving: externalSaving,
}: {
  initialConfig?: ProfileConfig;
  username?: string;
  onSave: (config: ProfileConfig) => Promise<void>;
  saving: boolean;
}) {
  const [cfg, setCfg] = useState<ProfileConfig>(normalizeConfig(initialConfig ?? brazyProfile));
  const [assets, setAssets] = useState<{ id: string; name: string; type: string; size: string; url: string }[]>([
    { id: "1", name: "avatar-default.png", type: "image", size: "24 KB", url: "/assets/avatar.png" },
    { id: "2", name: "background.mp4", type: "video", size: "1.2 MB", url: "/assets/bg.mp4" },
    { id: "3", name: "track.mp3", type: "audio", size: "3.4 MB", url: "/assets/track.mp3" },
  ]);
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  const cfgRef = useRef(cfg);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const doSave = useCallback(async (config: ProfileConfig) => {
    if (savingRef.current) { pendingRef.current = true; return; }
    savingRef.current = true;
    pendingRef.current = false;
    setSaveStatus("saving");
    try {
      await onSave(config);
      if (pendingRef.current) { savingRef.current = false; doSave(cfgRef.current); return; }
      setSaveStatus("saved");
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
      savedFadeRef.current = setTimeout(() => { setSaveStatus("idle"); savedFadeRef.current = null; }, 2000);
    } catch {
      setSaveStatus("error");
      console.error("Auto-save failed");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      savingRef.current = false;
    }
  }, [onSave]);

  const scheduleSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      doSave(cfgRef.current);
    }, 800);
  }, [doSave]);

  const updateNested = useCallback(<S extends keyof ProfileConfig, K extends keyof ProfileConfig[S]>(
    section: S, key: K, val: ProfileConfig[S][K],
  ) => {
    setCfg((c) => {
      const next = { ...c, [section]: { ...(c[section] as Record<string, unknown>), [key]: val } as ProfileConfig[S] };
      cfgRef.current = next;
      return next;
    });
    scheduleSave();
  }, [scheduleSave]);

  const updateEffect = useCallback(<K extends keyof ProfileConfig["effects"]>(key: K, val: ProfileConfig["effects"][K]) => {
    setCfg((c) => ({ ...c, effects: { ...c.effects, [key]: val } }));
    scheduleSave();
  }, [scheduleSave]);

  const updateCursor = useCallback(<K extends keyof ProfileConfig["effects"]["cursor"]>(key: K, val: ProfileConfig["effects"]["cursor"][K]) => {
    setCfg((c) => ({ ...c, effects: { ...c.effects, cursor: { ...c.effects.cursor, [key]: val } } }));
    scheduleSave();
  }, [scheduleSave]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); if (savedFadeRef.current) clearTimeout(savedFadeRef.current); };
  }, []);

  const copyAssetUrl = useCallback(async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedAssetId(id);
      setTimeout(() => setCopiedAssetId(null), 2000);
    } catch {}
  }, []);

  const removeAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const accent = cfg.theme.primaryColor || "#a855f7";

  return (
    <div className="flex h-full flex-col" style={{ background: "#08070d", color: "#e2e8f0" }}>
      {/* Username Effects Modal */}
      <UsernameEffectsModal
        open={usernameModalOpen}
        current={cfg.effects.usernameEffect || "none"}
        username={cfg.identity.displayName || cfg.identity.username || username || "brazy"}
        accent={accent}
        onSelect={(v) => updateEffect("usernameEffect", v as UsernameEffect)}
        onClose={() => setUsernameModalOpen(false)}
      />

      {saveStatus !== "idle" && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#141414",
            border: "2px solid #181818",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 13,
            color: "#a1a1a1",
            fontFamily: "Satoshi, sans-serif",
            transition: saveStatus === "saved" ? "opacity 0.4s" : "none",
          }}
        >
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved ✓" : "Failed to save"}
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white/90">Customize</h2>
              <p className="text-sm text-white/40">Personalize your profile</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1. Assets Uploader */}
            <SectionCard title="Assets Uploader">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Background Image & Video</p>
                <div className="mb-3 flex items-center gap-2">
                  <TextInput value={cfg.background.imageUrl} onChange={(v) => updateNested("background", "imageUrl", v)} placeholder="Image URL" />
                  <TextInput value={cfg.background.videoUrl} onChange={(v) => updateNested("background", "videoUrl", v)} placeholder="Video URL" />
                </div>
                <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  <Upload className="h-4 w-4 text-white/30" />
                  <p className="text-xs text-white/40"><span className="font-medium text-violet-400">Upload</span> image or video</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Profile Avatar</p>
                <div className="mb-3">
                  <TextInput value={cfg.identity.avatarUrl} onChange={(v) => updateNested("identity", "avatarUrl", v)} placeholder="Avatar URL" />
                </div>
                <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  <Upload className="h-4 w-4 text-white/30" />
                  <p className="text-xs text-white/40"><span className="font-medium text-violet-400">Upload</span> avatar image</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Audio Manager / Audios</p>
                <div className="mb-3">
                  <TextInput value={cfg.audio.src} onChange={(v) => updateNested("audio", "src", v)} placeholder="Audio URL (mp3)" />
                </div>
                <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  <Upload className="h-4 w-4 text-white/30" />
                  <p className="text-xs text-white/40"><span className="font-medium text-violet-400">Upload</span> audio file</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Custom Cursor</p>
                <div className="mb-3 flex items-center gap-3">
                  <CustomSelect
                    value={cfg.effects.cursor.type}
                    onChange={(v) => updateCursor("type", v as ProfileConfig["effects"]["cursor"]["type"])}
                    options={cursorOpts}
                  />
                  <ColorInput value={cfg.effects.cursor.color} onChange={(v) => updateCursor("color", v)} />
                </div>
                <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  <Upload className="h-4 w-4 text-white/30" />
                  <p className="text-xs text-white/40"><span className="font-medium text-violet-400">Upload</span> cursor file</p>
                </div>
              </div>

              {assets.length > 0 && (
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/[0.12]">
                      <p className="truncate text-xs font-medium text-white/70">{asset.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase text-white/30">{asset.type}</span>
                        <span className="text-[10px] text-white/20">{asset.size}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <button onClick={() => copyAssetUrl(asset.url, asset.id)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-white/30 transition hover:bg-white/[0.04] hover:text-white/50">
                          {copiedAssetId === asset.id ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                          {copiedAssetId === asset.id ? "Copied" : "Copy URL"}
                        </button>
                        <button onClick={() => removeAsset(asset.id)} className="rounded-lg p-1 text-white/20 transition hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* 2. General Customization */}
            <SectionCard title="General Customization">
              <Row label="Description">
                <TextArea value={cfg.identity.bio} onChange={(v) => updateNested("identity", "bio", v)} placeholder="Bio" rows={2} />
              </Row>
              <Row label="Discord Presence">
                <CustomSelect
                  value={cfg.background.type}
                  onChange={(v) => updateNested("background", "type", v as ProfileConfig["background"]["type"])}
                  options={[{ value: "none", label: "Disabled" }, { value: "particles", label: "Enabled" }]}
                />
              </Row>
              <Row label="Background Effects">
                <CustomSelect
                  value={cfg.background.type}
                  onChange={(v) => updateNested("background", "type", v as ProfileConfig["background"]["type"])}
                  options={backgroundOpts}
                />
              </Row>
              <Row label="Username Effects">
                <button
                  onClick={() => setUsernameModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 10,
                    background: `${accent}14`,
                    border: `1px solid ${accent}33`,
                    color: accent,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background .15s, border-color .15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}22`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}14`; }}
                >
                  <Sparkles size={13} />
                  {EFFECT_LABELS[cfg.effects.usernameEffect] ?? "None"}
                </button>
              </Row>
              <Row label="Profile Opacity">
                <Slider value={cfg.theme.cardOpacity} onChange={(v) => updateNested("theme", "cardOpacity", v)} min={0} max={1} step={0.05} />
              </Row>
              <Row label="Profile Blur">
                <Slider value={cfg.theme.cardBlur} onChange={(v) => updateNested("theme", "cardBlur", v)} min={0} max={60} step={1} />
              </Row>
              <Row label="Location">
                <TextInput value={cfg.identity.location} onChange={(v) => updateNested("identity", "location", v)} placeholder="Location" />
              </Row>
              <Row label="Glow Settings">
                <div className="flex items-center gap-3">
                  <Toggle value={cfg.theme.glow} onChange={(v) => updateNested("theme", "glow", v)} label="" />
                  <Slider value={cfg.theme.glowIntensity} onChange={(v) => updateNested("theme", "glowIntensity", v)} min={0} max={100} step={5} />
                </div>
              </Row>
            </SectionCard>

            {/* 3. Color Customization */}
            <SectionCard title="Color Customization">
              <Row label="Accent Color">
                <ColorInput value={cfg.theme.primaryColor} onChange={(v) => updateNested("theme", "primaryColor", v)} />
              </Row>
              <Row label="Background Color">
                <ColorInput value={cfg.theme.backgroundColor} onChange={(v) => updateNested("theme", "backgroundColor", v)} />
              </Row>
              <Row label="Text Color">
                <ColorInput value={cfg.theme.textColor} onChange={(v) => updateNested("theme", "textColor", v)} />
              </Row>
              <Row label="Icon Color">
                <ColorInput value={cfg.theme.accentColor} onChange={(v) => updateNested("theme", "accentColor", v)} />
              </Row>
              <Row label="Profile Gradient">
                <div className="flex items-center gap-2">
                  <ColorInput value={cfg.background.color1} onChange={(v) => updateNested("background", "color1", v)} />
                  <ColorInput value={cfg.background.color2} onChange={(v) => updateNested("background", "color2", v)} />
                </div>
              </Row>
            </SectionCard>

            {/* 4. Other Customization */}
            <SectionCard title="Other Customization">
              <Row label="Monochrome Icons">
                <Toggle value={!cfg.social.hoverEffect} onChange={(v) => updateNested("social", "hoverEffect", v)} label="" />
              </Row>
              <Row label="Animated Title">
                <Toggle value={cfg.effects.typewriterTitle} onChange={(v) => updateEffect("typewriterTitle", v)} label="" />
              </Row>
              <Row label="Motion Profile">
                <CustomSelect
                  value={cfg.theme.motionProfile ?? "balanced"}
                  onChange={(v) => updateNested("theme", "motionProfile", v as ProfileConfig["theme"]["motionProfile"])}
                  options={[
                    { value: "none", label: "None" },
                    { value: "minimal", label: "Minimal" },
                    { value: "balanced", label: "Balanced" },
                    { value: "rich", label: "Rich" },
                  ]}
                />
              </Row>
              <Row label="Swap Box Colors">
                <CustomSelect
                  value={cfg.theme.contentAlign}
                  onChange={(v) => updateNested("theme", "contentAlign", v as ProfileConfig["theme"]["contentAlign"])}
                  options={[{ value: "center", label: "Center" }, { value: "left", label: "Left" }]}
                />
              </Row>
              <Row label="Volume Control">
                <Slider value={cfg.audio.volume} onChange={(v) => updateNested("audio", "volume", v)} min={0} max={1} step={0.05} />
              </Row>
              <Row label="Use Discord Avatar">
                <Toggle value={cfg.audio.autoplay} onChange={(v) => updateNested("audio", "autoplay", v)} label="" />
              </Row>
              <Row label="Discord Avatar Decoration">
                <Toggle value={cfg.audio.loop} onChange={(v) => updateNested("audio", "loop", v)} label="" />
              </Row>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
