"use client";

import { useState, useCallback } from "react";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { TextInput, TextArea, SelectInput, ColorInput, Slider, Toggle } from "./controls";
import { cn } from "@/lib/utils";

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
  { value: "none" as const, label: "None" },
  { value: "trail" as const, label: "Trail" },
  { value: "sparkles" as const, label: "Sparkles" },
  { value: "dots" as const, label: "Dots" },
  { value: "rings" as const, label: "Rings" },
];

const cardStyleOpts = [
  { value: "glass" as const, label: "Glass" },
  { value: "solid" as const, label: "Solid" },
  { value: "outline" as const, label: "Outline" },
  { value: "neon" as const, label: "Neon" },
  { value: "minimal" as const, label: "Minimal" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-white/60">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[15px] border border-white/[0.06] bg-[#111111] px-6 py-5">
      <h3 className="mb-5 text-base font-semibold text-white/90">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export default function ProfileEditor({
  initialConfig,
  username,
  onSave,
  saving,
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

  const update = useCallback(<K extends keyof ProfileConfig>(section: K, val: ProfileConfig[K]) => {
    setCfg((c) => ({ ...c, [section]: val }));
  }, []);

  const updateNested = useCallback(<S extends keyof ProfileConfig, K extends keyof ProfileConfig[S]>(
    section: S, key: K, val: ProfileConfig[S][K],
  ) => {
    setCfg((c) => ({
      ...c,
      [section]: { ...(c[section] as Record<string, unknown>), [key]: val } as ProfileConfig[S],
    }));
  }, []);

  const updateEffect = useCallback(<K extends keyof ProfileConfig["effects"]>(key: K, val: ProfileConfig["effects"][K]) => {
    setCfg((c) => ({ ...c, effects: { ...c.effects, [key]: val } }));
  }, []);

  const updateCursor = useCallback(<K extends keyof ProfileConfig["effects"]["cursor"]>(key: K, val: ProfileConfig["effects"]["cursor"][K]) => {
    setCfg((c) => ({ ...c, effects: { ...c.effects, cursor: { ...c.effects.cursor, [key]: val } } }));
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

  return (
    <div className="flex h-full flex-col" style={{ background: "#08070d", color: "#e2e8f0" }}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white/90">Customize</h2>
              <p className="text-sm text-white/40">Personalize your profile</p>
            </div>
            <button
              onClick={() => onSave(cfg)}
              disabled={saving}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition",
                saving
                  ? "bg-violet-500/40 text-white/40 cursor-not-allowed"
                  : "bg-violet-500 text-white hover:bg-violet-400 cursor-pointer",
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1. Assets Uploader */}
            <SectionCard title="Assets Uploader">
              <Row label="Background Image & Video">
                <div className="flex gap-2">
                  <TextInput
                    value={cfg.background.imageUrl}
                    onChange={(v) => updateNested("background", "imageUrl", v)}
                    placeholder="Image URL"
                  />
                  <TextInput
                    value={cfg.background.videoUrl}
                    onChange={(v) => updateNested("background", "videoUrl", v)}
                    placeholder="Video URL"
                  />
                </div>
              </Row>
              <Row label="Profile Avatar">
                <TextInput
                  value={cfg.identity.avatarUrl}
                  onChange={(v) => updateNested("identity", "avatarUrl", v)}
                  placeholder="Avatar URL"
                />
              </Row>
              <Row label="Audios using Audio Manager">
                <TextInput
                  value={cfg.audio.src}
                  onChange={(v) => updateNested("audio", "src", v)}
                  placeholder="Audio URL (mp3)"
                />
              </Row>
              <Row label="Custom Cursor">
                <div className="flex items-center gap-3">
                  <SelectInput
                    value={cfg.effects.cursor.type}
                    onChange={(v) => updateCursor("type", v)}
                    options={cursorOpts}
                  />
                  <ColorInput value={cfg.effects.cursor.color} onChange={(v) => updateCursor("color", v)} />
                </div>
              </Row>

              {/* Upload drop zone */}
              <div
                className="mt-2 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/[0.08] px-6 py-6 transition hover:border-white/[0.2]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <Upload className="h-5 w-5 text-white/30" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/50">
                    <span className="font-medium text-violet-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-white/30">PNG, JPG, GIF, MP3, MP4, WEBM up to 10MB</p>
                </div>
              </div>
              {assets.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/[0.12]">
                      <p className="truncate text-xs font-medium text-white/70">{asset.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase text-white/30">{asset.type}</span>
                        <span className="text-[10px] text-white/20">{asset.size}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <button onClick={() => copyAssetUrl(asset.url, asset.id)}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-white/30 transition hover:bg-white/[0.04] hover:text-white/50">
                          {copiedAssetId === asset.id ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                          {copiedAssetId === asset.id ? "Copied" : "Copy URL"}
                        </button>
                        <button onClick={() => removeAsset(asset.id)}
                          className="rounded-lg p-1 text-white/20 transition hover:bg-red-500/10 hover:text-red-400">
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
                <SelectInput
                  value={cfg.background.type}
                  onChange={(v) => updateNested("background", "type", v)}
                  options={[{ value: "none" as const, label: "Disabled" }, { value: "particles" as const, label: "Enabled" }]}
                />
              </Row>
              <Row label="Background Effects">
                <SelectInput value={cfg.background.type} onChange={(v) => updateNested("background", "type", v)} options={backgroundOpts} />
              </Row>
              <Row label="Username Effects">
                <Toggle value={cfg.theme.glow} onChange={(v) => updateNested("theme", "glow", v)} label="" />
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
              <Row label="Swap Box Colors">
                <SelectInput
                  value={cfg.theme.contentAlign}
                  onChange={(v) => updateNested("theme", "contentAlign", v)}
                  options={[{ value: "center" as const, label: "Center" }, { value: "left" as const, label: "Left" }]}
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
