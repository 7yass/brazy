"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import type { UsernameEffect } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { TextInput, TextArea, ColorInput, Slider, Toggle } from "./controls";
import { DashboardCard } from "./DashboardCard";
import CustomSelect from "@/components/ui/CustomSelect";
import UsernameEffectsModal from "./UsernameEffectsModal";
import PresetsPanel from "./PresetsPanel";

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
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const cursorFileRef = useRef<HTMLInputElement>(null);
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

  const handleUpload = useCallback(async (file: File, type: string, onSuccess: (url: string) => void) => {
    setUploading(type);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", type);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onSuccess(data.url);
    } catch (e: any) {
      setUploadError(e.message || "Upload failed");
      setTimeout(() => setUploadError(null), 4000);
    } finally {
      setUploading(null);
    }
  }, []);

  const applyPreset = useCallback((partial: Partial<ProfileConfig>) => {
    setCfg((c) => {
      const next = {
        ...c,
        ...(partial.theme ? { theme: { ...c.theme, ...partial.theme } } : {}),
        ...(partial.background ? { background: { ...c.background, ...partial.background } } : {}),
        ...(partial.effects ? { effects: { ...c.effects, ...partial.effects } } : {}),
      };
      cfgRef.current = next;
      return next;
    });
    scheduleSave();
  }, [scheduleSave]);

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
            {/* 0. Style Presets */}
            <DashboardCard title="Style Presets">
              <PresetsPanel config={cfg} onApply={applyPreset} />
            </DashboardCard>

            {/* 1. Assets Uploader */}
            <DashboardCard title="Assets Uploader">
              {uploadError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{uploadError}</div>
              )}

              {/* Hidden file inputs */}
              <input ref={bgFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "background", (url) => updateNested("background", "imageUrl", url)); e.target.value = ""; }} />
              <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "avatar", (url) => updateNested("identity", "avatarUrl", url)); e.target.value = ""; }} />
              <input ref={audioFileRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "audio", (url) => updateNested("audio", "src", url)); e.target.value = ""; }} />
              <input ref={cursorFileRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "cursor", (url) => updateCursor("customUrl", url)); e.target.value = ""; }} />

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Background Image & Video</p>
                <div className="mb-3 flex items-center gap-2">
                  <TextInput value={cfg.background.imageUrl} onChange={(v) => updateNested("background", "imageUrl", v)} placeholder="Image URL" />
                  <TextInput value={cfg.background.videoUrl} onChange={(v) => updateNested("background", "videoUrl", v)} placeholder="Video URL" />
                </div>
                <div onClick={() => bgFileRef.current?.click()} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  {uploading === "background" ? <Loader2 className="h-4 w-4 animate-spin text-violet-400" /> : <Upload className="h-4 w-4 text-white/30" />}
                  <p className="text-xs text-white/40">{uploading === "background" ? "Uploading..." : <><span className="font-medium text-violet-400">Upload</span> image or video</>}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Profile Avatar</p>
                <div className="mb-3">
                  <TextInput value={cfg.identity.avatarUrl} onChange={(v) => updateNested("identity", "avatarUrl", v)} placeholder="Avatar URL" />
                </div>
                <div onClick={() => avatarFileRef.current?.click()} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  {uploading === "avatar" ? <Loader2 className="h-4 w-4 animate-spin text-violet-400" /> : <Upload className="h-4 w-4 text-white/30" />}
                  <p className="text-xs text-white/40">{uploading === "avatar" ? "Uploading..." : <><span className="font-medium text-violet-400">Upload</span> avatar image</>}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white/80">Audio Manager / Audios</p>
                <div className="mb-3">
                  <TextInput value={cfg.audio.src} onChange={(v) => updateNested("audio", "src", v)} placeholder="Audio URL (mp3)" />
                </div>
                <div onClick={() => audioFileRef.current?.click()} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  {uploading === "audio" ? <Loader2 className="h-4 w-4 animate-spin text-violet-400" /> : <Upload className="h-4 w-4 text-white/30" />}
                  <p className="text-xs text-white/40">{uploading === "audio" ? "Uploading..." : <><span className="font-medium text-violet-400">Upload</span> audio file</>}</p>
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
                <div onClick={() => cursorFileRef.current?.click()} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
                  {uploading === "cursor" ? <Loader2 className="h-4 w-4 animate-spin text-violet-400" /> : <Upload className="h-4 w-4 text-white/30" />}
                  <p className="text-xs text-white/40">{uploading === "cursor" ? "Uploading..." : <><span className="font-medium text-violet-400">Upload</span> cursor file</>}</p>
                </div>
              </div>
            </DashboardCard>

            {/* 2. General Customization */}
            <DashboardCard title="General Customization">
              <Row label="Description">
                <TextArea value={cfg.identity.bio} onChange={(v) => updateNested("identity", "bio", v)} placeholder="Bio" rows={2} />
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
            </DashboardCard>

            {/* 3. Color Customization */}
            <DashboardCard title="Color Customization">
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
            </DashboardCard>

            {/* 4. Widget Style Controls */}
            <DashboardCard title="Widget Style Controls">
              {(["discordPresence", "youtube", "github", "time", "spotify", "telegram"] as const).map((key) => {
                const w = cfg.widgets[key];
                const labels: Record<string, string> = {
                  discordPresence: "Discord Presence",
                  youtube: "YouTube",
                  github: "GitHub",
                  time: "Time",
                  spotify: "Spotify",
                  telegram: "Telegram",
                };
                return (
                  <div key={key} className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-white/80">{labels[key]}</p>
                      <Toggle value={w.enabled} onChange={(v) => updateNested("widgets", key, { ...w, enabled: v })} label="" />
                    </div>
                    {w.enabled && (
                      <div className="flex flex-col gap-3">
                        <Row label="Placement">
                          <CustomSelect
                            value={w.placement}
                            onChange={(v) => updateNested("widgets", key, { ...w, placement: v as "card" | "bottom" })}
                            options={[
                              { value: "card", label: "Inside Card" },
                              { value: "bottom", label: "Bottom" },
                            ]}
                          />
                        </Row>
                        {key === "discordPresence" && (
                          <Row label="Discord User ID">
                            <TextInput
                              value={(w as any).discordId ?? ""}
                              onChange={(v) => updateNested("widgets", key, { ...w, discordId: v } as any)}
                              placeholder="Your 18-digit Discord user ID"
                            />
                          </Row>
                        )}
                        <Row label="Compact Mode">
                          <Toggle value={w.compact} onChange={(v) => updateNested("widgets", key, { ...w, compact: v })} label="" />
                        </Row>
                        <Row label="Show Background">
                          <Toggle value={w.showBackground} onChange={(v) => updateNested("widgets", key, { ...w, showBackground: v })} label="" />
                        </Row>
                        <Row label="Theme Sync">
                          <Toggle value={w.themeSync} onChange={(v) => updateNested("widgets", key, { ...w, themeSync: v })} label="" />
                        </Row>
                      </div>
                    )}
                  </div>
                );
              })}
            </DashboardCard>

            {/* 5. Other Customization */}
            <DashboardCard title="Other Customization">
              <Row label="Social Icon Hover Effect">
                <Toggle value={cfg.social.hoverEffect} onChange={(v) => updateNested("social", "hoverEffect", v)} label="" />
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
              <Row label="Content Alignment">
                <CustomSelect
                  value={cfg.theme.contentAlign}
                  onChange={(v) => updateNested("theme", "contentAlign", v as ProfileConfig["theme"]["contentAlign"])}
                  options={[{ value: "center", label: "Center" }, { value: "left", label: "Left" }]}
                />
              </Row>
              <Row label="Volume Control">
                <Slider value={cfg.audio.volume} onChange={(v) => updateNested("audio", "volume", v)} min={0} max={1} step={0.05} />
              </Row>
              <Row label="Music Autoplay">
                <Toggle value={cfg.audio.autoplay} onChange={(v) => updateNested("audio", "autoplay", v)} label="" />
              </Row>
              <Row label="Loop Music">
                <Toggle value={cfg.audio.loop} onChange={(v) => updateNested("audio", "loop", v)} label="" />
              </Row>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
