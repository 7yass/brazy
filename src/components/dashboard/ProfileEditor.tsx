"use client";

import { useState, useCallback } from "react";
import {
  User,
  Palette,
  Image,
  FolderOpen,
  Sparkles,
  Music,
  Link2,
  Code,
  Save,
  Upload,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import ProfileRenderer from "@/components/profile/ProfileRenderer";
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

const cardStyleOpts = [
  { value: "glass" as const, label: "Glass" },
  { value: "solid" as const, label: "Solid" },
  { value: "outline" as const, label: "Outline" },
  { value: "neon" as const, label: "Neon" },
  { value: "minimal" as const, label: "Minimal" },
];

const cursorOpts = [
  { value: "none" as const, label: "None" },
  { value: "trail" as const, label: "Trail" },
  { value: "sparkles" as const, label: "Sparkles" },
  { value: "dots" as const, label: "Dots" },
  { value: "rings" as const, label: "Rings" },
];

const navItems = [
  { id: "identity", label: "Profile", icon: User },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "background", label: "Background", icon: Image },
  { id: "assets", label: "Assets", icon: FolderOpen },
  { id: "effects", label: "Effects", icon: Sparkles },
  { id: "audio", label: "Audio", icon: Music },
  { id: "social", label: "Social", icon: Link2 },
  { id: "custom", label: "Custom", icon: Code },
];

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
      {title && (
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-3">
        {children}
      </div>
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
  const [tab, setTab] = useState("identity");
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
    section: S,
    key: K,
    val: ProfileConfig[S][K],
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

  const updateClick = useCallback(<K extends keyof ProfileConfig["effects"]["click"]>(key: K, val: ProfileConfig["effects"]["click"][K]) => {
    setCfg((c) => ({ ...c, effects: { ...c.effects, click: { ...c.effects.click, [key]: val } } }));
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
    <div className="flex h-screen" style={{ background: "#08070d", color: "#e2e8f0" }}>
      {/* Sidebar */}
      <nav className="flex w-56 shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <span className="text-sm font-semibold text-white/60">Editor</span>
          <button
            onClick={() => onSave(cfg)}
            disabled={saving}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              saving
                ? "bg-violet-500/40 text-white/40 cursor-not-allowed"
                : "bg-violet-500 text-white hover:bg-violet-400 cursor-pointer",
            )}
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Controls */}
      <div className="flex w-[420px] shrink-0 flex-col overflow-y-auto border-r border-white/[0.06]">
        <div className="flex flex-col gap-5 p-6">
          {tab === "identity" && (
            <>
              <SectionCard title="Display">
                <TextInput value={cfg.identity.displayName} onChange={(v) => updateNested("identity", "displayName", v)} placeholder="Display name" />
                <TextInput value={cfg.identity.tagline} onChange={(v) => updateNested("identity", "tagline", v)} placeholder="Tagline" />
                <TextInput value={cfg.identity.pronouns} onChange={(v) => updateNested("identity", "pronouns", v)} placeholder="Pronouns" />
                <TextInput value={cfg.identity.location} onChange={(v) => updateNested("identity", "location", v)} placeholder="Location" />
                <TextArea value={cfg.identity.bio} onChange={(v) => updateNested("identity", "bio", v)} placeholder="Bio" rows={3} />
              </SectionCard>
              <SectionCard title="Avatar">
                <TextInput value={cfg.identity.avatarUrl} onChange={(v) => updateNested("identity", "avatarUrl", v)} placeholder="Avatar URL" />
              </SectionCard>
              <SectionCard title="Badges">
                <Toggle value={cfg.identity.verified} onChange={(v) => updateNested("identity", "verified", v)} label="Verified badge" />
              </SectionCard>
            </>
          )}

          {tab === "theme" && (
            <>
              <SectionCard title="Colors">
                <div className="grid grid-cols-2 gap-3">
                  <ColorInput value={cfg.theme.primaryColor} onChange={(v) => updateNested("theme", "primaryColor", v)} />
                  <ColorInput value={cfg.theme.secondaryColor} onChange={(v) => updateNested("theme", "secondaryColor", v)} />
                  <ColorInput value={cfg.theme.accentColor} onChange={(v) => updateNested("theme", "accentColor", v)} />
                  <ColorInput value={cfg.theme.backgroundColor} onChange={(v) => updateNested("theme", "backgroundColor", v)} />
                  <ColorInput value={cfg.theme.textColor} onChange={(v) => updateNested("theme", "textColor", v)} />
                  <ColorInput value={cfg.theme.mutedTextColor} onChange={(v) => updateNested("theme", "mutedTextColor", v)} />
                </div>
              </SectionCard>
              <SectionCard title="Card">
                <SelectInput value={cfg.theme.cardStyle} onChange={(v) => updateNested("theme", "cardStyle", v)} options={cardStyleOpts} />
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Opacity: {cfg.theme.cardOpacity.toFixed(2)}</span>
                  <Slider value={cfg.theme.cardOpacity} onChange={(v) => updateNested("theme", "cardOpacity", v)} min={0} max={1} step={0.05} />
                </div>
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Blur: {cfg.theme.cardBlur}px</span>
                  <Slider value={cfg.theme.cardBlur} onChange={(v) => updateNested("theme", "cardBlur", v)} min={0} max={60} step={1} />
                </div>
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Border radius: {cfg.theme.borderRadius}px</span>
                  <Slider value={cfg.theme.borderRadius} onChange={(v) => updateNested("theme", "borderRadius", v)} min={0} max={48} step={2} />
                </div>
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Max width: {cfg.theme.maxWidth}px</span>
                  <Slider value={cfg.theme.maxWidth} onChange={(v) => updateNested("theme", "maxWidth", v)} min={300} max={800} step={20} />
                </div>
              </SectionCard>
              <SectionCard title="Glow">
                <Toggle value={cfg.theme.glow} onChange={(v) => updateNested("theme", "glow", v)} label="Enable glow" />
                {cfg.theme.glow && (
                  <div>
                    <span className="mb-1 block text-[11px] text-white/30">Intensity: {cfg.theme.glowIntensity}</span>
                    <Slider value={cfg.theme.glowIntensity} onChange={(v) => updateNested("theme", "glowIntensity", v)} min={0} max={100} step={5} />
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {tab === "background" && (
            <>
              <SectionCard title="Type">
                <SelectInput
                  value={cfg.background.type}
                  onChange={(v) => updateNested("background", "type", v)}
                  options={backgroundOpts}
                />
              </SectionCard>
              <SectionCard title="Colors">
                <div className="grid grid-cols-3 gap-2">
                  <ColorInput value={cfg.background.color1} onChange={(v) => updateNested("background", "color1", v)} />
                  <ColorInput value={cfg.background.color2} onChange={(v) => updateNested("background", "color2", v)} />
                  <ColorInput value={cfg.background.color3} onChange={(v) => updateNested("background", "color3", v)} />
                </div>
              </SectionCard>
              <SectionCard title="Adjustments">
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Speed: {cfg.background.speed.toFixed(1)}</span>
                  <Slider value={cfg.background.speed} onChange={(v) => updateNested("background", "speed", v)} min={0} max={5} step={0.2} />
                </div>
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Density: {cfg.background.density.toFixed(1)}</span>
                  <Slider value={cfg.background.density} onChange={(v) => updateNested("background", "density", v)} min={0} max={5} step={0.2} />
                </div>
                <div>
                  <span className="mb-1 block text-[11px] text-white/30">Size: {cfg.background.size.toFixed(1)}</span>
                  <Slider value={cfg.background.size} onChange={(v) => updateNested("background", "size", v)} min={0} max={12} step={1} />
                </div>
              </SectionCard>
              {cfg.background.type === "image" && (
                <SectionCard title="Image">
                  <TextInput value={cfg.background.imageUrl} onChange={(v) => updateNested("background", "imageUrl", v)} placeholder="Image URL" />
                </SectionCard>
              )}
              {cfg.background.type === "video" && (
                <SectionCard title="Video">
                  <TextInput value={cfg.background.videoUrl} onChange={(v) => updateNested("background", "videoUrl", v)} placeholder="Video URL" />
                </SectionCard>
              )}
            </>
          )}

          {tab === "effects" && (
            <>
              <SectionCard title="Cursor">
                <Toggle value={cfg.effects.cursor.enabled} onChange={(v) => updateCursor("enabled", v)} label="Cursor effect" />
                {cfg.effects.cursor.enabled && (
                  <>
                    <SelectInput value={cfg.effects.cursor.type} onChange={(v) => updateCursor("type", v)} options={cursorOpts} />
                    <ColorInput value={cfg.effects.cursor.color} onChange={(v) => updateCursor("color", v)} />
                    <div>
                      <span className="mb-1 block text-[11px] text-white/30">Size: {cfg.effects.cursor.size}</span>
                      <Slider value={cfg.effects.cursor.size} onChange={(v) => updateCursor("size", v)} min={2} max={20} step={1} />
                    </div>
                  </>
                )}
              </SectionCard>
              <SectionCard title="Click">
                <Toggle value={cfg.effects.click.enabled} onChange={(v) => updateClick("enabled", v)} label="Click effect" />
                {cfg.effects.click.enabled && (
                  <>
                    <SelectInput
                      value={cfg.effects.click.type}
                      onChange={(v) => updateClick("type", v)}
                      options={[
                        { value: "burst", label: "Burst" },
                        { value: "ripple", label: "Ripple" },
                        { value: "hearts", label: "Hearts" },
                        { value: "confetti", label: "Confetti" },
                        { value: "emojis", label: "Emojis" },
                      ]}
                    />
                    <ColorInput value={cfg.effects.click.color} onChange={(v) => updateClick("color", v)} />
                  </>
                )}
              </SectionCard>
              <SectionCard title="Other">
                <Toggle value={cfg.effects.tilt3d} onChange={(v) => updateEffect("tilt3d", v)} label="3D tilt" />
                <Toggle value={cfg.effects.glowPulse} onChange={(v) => updateEffect("glowPulse", v)} label="Glow pulse" />
                <Toggle value={cfg.effects.textGlow} onChange={(v) => updateEffect("textGlow", v)} label="Text glow" />
              </SectionCard>
            </>
          )}

          {tab === "audio" && (
            <>
              <SectionCard title="Player">
                <Toggle value={cfg.audio.enabled} onChange={(v) => updateNested("audio", "enabled", v)} label="Audio player" />
              </SectionCard>
              {cfg.audio.enabled && (
                <>
                  <SectionCard title="Track">
                    <TextInput value={cfg.audio.src} onChange={(v) => updateNested("audio", "src", v)} placeholder="Audio URL (mp3)" />
                    <TextInput value={cfg.audio.title} onChange={(v) => updateNested("audio", "title", v)} placeholder="Track title" />
                    <TextInput value={cfg.audio.artist} onChange={(v) => updateNested("audio", "artist", v)} placeholder="Artist name" />
                  </SectionCard>
                  <SectionCard title="Settings">
                    <div>
                      <span className="mb-1 block text-[11px] text-white/30">Volume: {(cfg.audio.volume * 100).toFixed(0)}%</span>
                      <Slider value={cfg.audio.volume} onChange={(v) => updateNested("audio", "volume", v)} min={0} max={1} step={0.05} />
                    </div>
                    <Toggle value={cfg.audio.loop} onChange={(v) => updateNested("audio", "loop", v)} label="Loop" />
                    <Toggle value={cfg.audio.autoplay} onChange={(v) => updateNested("audio", "autoplay", v)} label="Autoplay" />
                    <Toggle value={cfg.audio.showVisualizer} onChange={(v) => updateNested("audio", "showVisualizer", v)} label="Visualizer" />
                  </SectionCard>
                </>
              )}
            </>
          )}

          {tab === "social" && (
            <>
              <SectionCard title="Links">
                {cfg.social.links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <TextInput
                      value={link.platform}
                      onChange={(v) => {
                        const links = [...cfg.social.links];
                        links[i] = { ...links[i], platform: v as ProfileConfig["social"]["links"][number]["platform"] };
                        update("social", { ...cfg.social, links });
                      }}
                      placeholder="Platform"
                    />
                    <TextInput
                      value={link.url}
                      onChange={(v) => {
                        const links = [...cfg.social.links];
                        links[i] = { ...links[i], url: v };
                        update("social", { ...cfg.social, links });
                      }}
                      placeholder="URL"
                    />
                    <button
                      onClick={() => update("social", { ...cfg.social, links: cfg.social.links.filter((_, j) => j !== i) })}
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-xs text-white/30 hover:border-red-500/50 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    update("social", { ...cfg.social, links: [...cfg.social.links, { platform: "website", url: "", label: "", color: "" }] })
                  }
                  className="w-full rounded-lg border border-dashed border-white/15 py-2 text-xs text-white/40 transition hover:border-white/30 hover:text-white/60"
                >
                  + Add link
                </button>
              </SectionCard>
              <SectionCard title="Layout">
                <SelectInput
                  value={cfg.social.layout}
                  onChange={(v) => updateNested("social", "layout", v)}
                  options={[{ value: "wrap", label: "Wrap" }, { value: "row", label: "Row" }, { value: "grid", label: "Grid" }]}
                />
                <SelectInput
                  value={cfg.social.size}
                  onChange={(v) => updateNested("social", "size", v)}
                  options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]}
                />
                <SelectInput
                  value={cfg.social.shape}
                  onChange={(v) => updateNested("social", "shape", v)}
                  options={[{ value: "circle", label: "Circle" }, { value: "square", label: "Square" }, { value: "rounded", label: "Rounded" }]}
                />
                <Toggle value={cfg.social.hoverEffect} onChange={(v) => updateNested("social", "hoverEffect", v)} label="Hover effect" />
              </SectionCard>
            </>
          )}

          {tab === "assets" && (
            <>
              <SectionCard title="Upload">
                <div className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/[0.08] px-6 py-8 transition hover:border-white/[0.2]">
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
              </SectionCard>
              <SectionCard title="Files">
                {assets.length === 0 ? (
                  <p className="py-6 text-center text-sm text-white/30">No assets yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/[0.12]"
                      >
                        <div className="mb-2 flex aspect-video items-center justify-center rounded-lg bg-white/[0.03]">
                          {asset.type === "image" ? (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5">
                              <Image className="h-6 w-6 text-white/20" />
                            </div>
                          ) : asset.type === "audio" ? (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/5">
                              <Music className="h-6 w-6 text-white/20" />
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                              <svg className="h-6 w-6 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            </div>
                          )}
                        </div>
                        <p className="truncate text-xs font-medium text-white/70">{asset.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase text-white/30">
                            {asset.type}
                          </span>
                          <span className="text-[10px] text-white/20">{asset.size}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            onClick={() => copyAssetUrl(asset.url, asset.id)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-white/30 transition hover:bg-white/[0.04] hover:text-white/50"
                          >
                            {copiedAssetId === asset.id ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                            {copiedAssetId === asset.id ? "Copied" : "Copy URL"}
                          </button>
                          <button
                            onClick={() => removeAsset(asset.id)}
                            className="rounded-lg p-1 text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {tab === "custom" && (
            <>
              <SectionCard title="Custom CSS">
                <TextArea value={cfg.customCss} onChange={(v) => update("customCss", v)} rows={8} placeholder="/* your styles */" />
              </SectionCard>
              <SectionCard title="Custom HTML">
                <TextArea value={cfg.customHtml} onChange={(v) => update("customHtml", v)} rows={8} placeholder="<!-- your html -->" />
              </SectionCard>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1">
          <ProfileRenderer config={cfg} preview />
        </div>
      </div>
    </div>
  );
}
