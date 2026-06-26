"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Palette,
  User,
  Link2,
  Users,
  Award,
  EyeOff,
  Sparkles,
  Type,
  Image,
  Music,
  Globe,
  BarChart3,
  Code2,
  Layout,
  Zap,
} from "lucide-react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { TextInput, TextArea, SelectInput, ColorInput, Slider, Toggle } from "./controls";

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

const fontOpts = [
  { value: "geist" as const, label: "Geist" },
  { value: "inter" as const, label: "Inter" },
  { value: "poppins" as const, label: "Poppins" },
  { value: "mono" as const, label: "Mono" },
  { value: "serif" as const, label: "Serif" },
  { value: "comic" as const, label: "Comic" },
  { value: "custom" as const, label: "Custom" },
];

const splashTypeOpts = [
  { value: "blur" as const, label: "Blur" },
  { value: "black" as const, label: "Black" },
  { value: "image" as const, label: "Image" },
  { value: "glitch" as const, label: "Glitch" },
  { value: "gradient" as const, label: "Gradient" },
];

type NavItem =
  | { type: "header"; label: string; key: string }
  | { type: "item"; label: string; key: string; icon: typeof User };

const navStructure: NavItem[] = [
  { type: "header", label: "General Customization", key: "general" },
  { type: "item", label: "Assets", key: "assets", icon: Image },
  { type: "item", label: "Profile", key: "profile", icon: User },
  { type: "item", label: "Links", key: "links", icon: Link2 },
  { type: "item", label: "Socials", key: "socials", icon: Users },
  { type: "item", label: "Badges", key: "badges", icon: Award },
  { type: "item", label: "Hide profile", key: "hide", icon: EyeOff },
  { type: "header", label: "Color Customization", key: "color" },
  { type: "item", label: "Appearance", key: "appearance", icon: Palette },
  { type: "header", label: "Other Customization", key: "other" },
  { type: "item", label: "Background", key: "background", icon: Layout },
  { type: "item", label: "Font", key: "font", icon: Type },
  { type: "item", label: "Splash", key: "splash", icon: Music },
  { type: "item", label: "Effects", key: "effects", icon: Zap },
  { type: "item", label: "SEO", key: "seo", icon: Globe },
  { type: "item", label: "Analytics", key: "analytics", icon: BarChart3 },
  { type: "item", label: "Custom", key: "custom", icon: Code2 },
];

function SectionCard({ title, children, subtitle }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#111", borderRadius: 15, padding: "25px 25px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
      {title && (
        <div>
          <h1 style={{ margin: 0, fontSize: 23, color: "#e7e7e7", fontWeight: 550, display: "flex", alignItems: "center", gap: 8 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: "4px 0 0", fontSize: 15.5, color: "#838383", fontWeight: 500 }}>{subtitle}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-[10px]" style={{ marginTop: 0 }}>
        {children}
      </div>
    </div>
  );
}

function GunInput({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 13.5, display: "flex", flexDirection: "column", gap: 10 }}>
      {children}
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
  const [activeTab, setActiveTab] = useState("assets");
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

  const updateClick = useCallback(<K extends keyof ProfileConfig["effects"]["click"]>(key: K, val: ProfileConfig["effects"]["click"][K]) => {
    setCfg((c) => ({ ...c, effects: { ...c.effects, click: { ...c.effects.click, [key]: val } } }));
  }, []);

  const updateBadge = useCallback((i: number, key: string, val: string) => {
    setCfg((c) => {
      const items = [...c.badges.items];
      items[i] = { ...items[i], [key]: val };
      return { ...c, badges: { ...c.badges, items } };
    });
  }, []);

  const addBadge = useCallback(() => {
    setCfg((c) => ({ ...c, badges: { ...c.badges, items: [...c.badges.items, { label: "", emoji: "⭐", color: "#22d3ee", tooltip: "" }] } }));
  }, []);

  const removeBadge = useCallback((i: number) => {
    setCfg((c) => ({ ...c, badges: { ...c.badges, items: c.badges.items.filter((_, j) => j !== i) } }));
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

  const renderContent = () => {
    switch (activeTab) {
      case "assets":
        return (
          <SectionCard title="Assets Uploader" subtitle="Upload and manage your profile's media files.">
            <div
              style={{
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                border: "2px dashed rgba(255,255,255,0.08)", borderRadius: 15, padding: "32px 24px",
                transition: "border-color .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "rgba(255,255,255,0.04)" }}>
                <Upload size={20} style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ fontWeight: 500, color: "rgb(168,85,247)" }}>Click to upload</span> or drag and drop
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.2)" }}>PNG, JPG, GIF, MP3, MP4, WEBM up to 10MB</p>
              </div>
            </div>
            {assets.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {assets.map((asset) => (
                  <div key={asset.id} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: 12, transition: "border-color .2s" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{asset.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "2px 6px", borderRadius: 4 }}>{asset.type}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{asset.size}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                      <button onClick={() => copyAssetUrl(asset.url, asset.id)} style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, fontSize: 10, color: "rgba(255,255,255,0.3)", transition: "all .2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}>
                        {copiedAssetId === asset.id ? <Check size={10} style={{ color: "#34d399" }} /> : <Copy size={10} />}
                        {copiedAssetId === asset.id ? "Copied" : "Copy URL"}
                      </button>
                      <button onClick={() => removeAsset(asset.id)} style={{ all: "unset", cursor: "pointer", padding: 4, borderRadius: 8, color: "rgba(255,255,255,0.2)", transition: "all .2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "rgb(248,113,113)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.2)"; }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        );

      case "profile":
        return (
          <SectionCard title="Profile" subtitle="Customize your profile's appearance and general preferences.">
            <GunInput>
              <TextInput value={cfg.identity.displayName} onChange={(v) => updateNested("identity", "displayName", v)} placeholder="Display name" />
              <TextInput value={cfg.identity.tagline} onChange={(v) => updateNested("identity", "tagline", v)} placeholder="Tagline" />
              <TextInput value={cfg.identity.pronouns} onChange={(v) => updateNested("identity", "pronouns", v)} placeholder="Pronouns" />
              <TextInput value={cfg.identity.location} onChange={(v) => updateNested("identity", "location", v)} placeholder="Location" />
              <TextArea value={cfg.identity.bio} onChange={(v) => updateNested("identity", "bio", v)} placeholder="Bio" rows={3} />
              <TextInput value={cfg.identity.avatarUrl} onChange={(v) => updateNested("identity", "avatarUrl", v)} placeholder="Avatar URL" />
              <Toggle value={cfg.identity.verified} onChange={(v) => updateNested("identity", "verified", v)} label="Verified badge" />
            </GunInput>
          </SectionCard>
        );

      case "links":
        return (
          <SectionCard title="Links" subtitle="Manage your social media links and URLs.">
            <GunInput>
              {cfg.social.links.length === 0 ? (
                <p style={{ padding: "8px 0", textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>No links yet.</p>
              ) : (
                cfg.social.links.map((link, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TextInput value={link.platform} onChange={(v) => {
                      const links = [...cfg.social.links];
                      links[i] = { ...links[i], platform: v as any };
                      update("social", { ...cfg.social, links });
                    }} placeholder="Platform" />
                    <TextInput value={link.url} onChange={(v) => {
                      const links = [...cfg.social.links];
                      links[i] = { ...links[i], url: v };
                      update("social", { ...cfg.social, links });
                    }} placeholder="URL" />
                    <button onClick={() => update("social", { ...cfg.social, links: cfg.social.links.filter((_, j) => j !== i) })}
                      style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, color: "rgba(255,255,255,0.3)", transition: "all .2s", flexShrink: 0 }}>
                      ✕
                    </button>
                  </div>
                ))
              )}
              <button onClick={() => update("social", { ...cfg.social, links: [...cfg.social.links, { platform: "website", url: "", label: "", color: "" }] })}
                style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.15)", padding: "8px 0", fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", transition: "all .2s" }}>
                + Add link
              </button>
            </GunInput>
          </SectionCard>
        );

      case "socials":
        return (
          <SectionCard title="Socials" subtitle="Configure how your social icons look and behave.">
            <GunInput>
              <SelectInput value={cfg.social.layout} onChange={(v) => updateNested("social", "layout", v)}
                options={[{ value: "wrap", label: "Wrap" }, { value: "row", label: "Row" }, { value: "grid", label: "Grid" }]} />
              <SelectInput value={cfg.social.size} onChange={(v) => updateNested("social", "size", v)}
                options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
              <SelectInput value={cfg.social.shape} onChange={(v) => updateNested("social", "shape", v)}
                options={[{ value: "circle", label: "Circle" }, { value: "square", label: "Square" }, { value: "rounded", label: "Rounded" }]} />
              <Toggle value={cfg.social.showLabels} onChange={(v) => updateNested("social", "showLabels", v)} label="Show labels" />
              <Toggle value={cfg.social.hoverEffect} onChange={(v) => updateNested("social", "hoverEffect", v)} label="Hover effect" />
            </GunInput>
          </SectionCard>
        );

      case "badges":
        return (
          <SectionCard title="Badges" subtitle="Create and manage custom badges for your profile.">
            <GunInput>
              <Toggle value={cfg.badges.enabled} onChange={(v) => updateNested("badges", "enabled", v)} label="Enable badges" />
              {cfg.badges.enabled && (
                <>
                  <SelectInput value={cfg.badges.position} onChange={(v) => updateNested("badges", "position", v)}
                    options={[{ value: "top", label: "Top" }, { value: "bottom", label: "Bottom" }, { value: "inline", label: "Inline" }]} />
                  {cfg.badges.items.length === 0 ? (
                    <p style={{ padding: "8px 0", textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>No badges yet.</p>
                  ) : (
                    cfg.badges.items.map((badge, i) => (
                      <div key={i} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 18 }}>{badge.emoji}</span>
                          <TextInput value={badge.emoji} onChange={(v) => updateBadge(i, "emoji", v)} placeholder="Emoji" />
                        </div>
                        <TextInput value={badge.label} onChange={(v) => updateBadge(i, "label", v)} placeholder="Label" />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                          <ColorInput value={badge.color} onChange={(v) => updateBadge(i, "color", v)} />
                          <input type="text" value={badge.tooltip} onChange={(e) => updateBadge(i, "tooltip", e.target.value)} placeholder="Tooltip" style={{ all: "unset", cursor: "text", width: "100%", boxSizing: "border-box", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)", padding: "8px 12px", fontSize: 14, color: "#fff", transition: "border-color .2s" }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} />
                          <button onClick={() => removeBadge(i)} style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, color: "rgba(255,255,255,0.3)", transition: "all .2s", flexShrink: 0 }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  <button onClick={addBadge} style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.15)", padding: "8px 0", fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", transition: "all .2s" }}>
                    + Add badge
                  </button>
                </>
              )}
            </GunInput>
          </SectionCard>
        );

      case "hide":
        return (
          <SectionCard title="Hide profile" subtitle="Control the visibility of your profile page.">
            <GunInput>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                Toggle the visibility of your profile page. When hidden, visitors will see a placeholder instead of your content.
              </p>
            </GunInput>
          </SectionCard>
        );

      case "appearance":
        return (
          <>
            <SectionCard title="Color Customization" subtitle="Customize the colors of your profile.">
              <GunInput>
                <div className="grid grid-cols-2 gap-3">
                  <ColorInput value={cfg.theme.primaryColor} onChange={(v) => updateNested("theme", "primaryColor", v)} />
                  <ColorInput value={cfg.theme.secondaryColor} onChange={(v) => updateNested("theme", "secondaryColor", v)} />
                  <ColorInput value={cfg.theme.accentColor} onChange={(v) => updateNested("theme", "accentColor", v)} />
                  <ColorInput value={cfg.theme.backgroundColor} onChange={(v) => updateNested("theme", "backgroundColor", v)} />
                  <ColorInput value={cfg.theme.textColor} onChange={(v) => updateNested("theme", "textColor", v)} />
                  <ColorInput value={cfg.theme.mutedTextColor} onChange={(v) => updateNested("theme", "mutedTextColor", v)} />
                </div>
                <SelectInput value={cfg.theme.contentAlign} onChange={(v) => updateNested("theme", "contentAlign", v)}
                  options={[{ value: "center", label: "Center" }, { value: "left", label: "Left" }]} />
              </GunInput>
            </SectionCard>
            <SectionCard title="Card Style">
              <GunInput>
                <SelectInput value={cfg.theme.cardStyle} onChange={(v) => updateNested("theme", "cardStyle", v)} options={cardStyleOpts} />
                <div>
                  <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Opacity: {cfg.theme.cardOpacity.toFixed(2)}</span>
                  <Slider value={cfg.theme.cardOpacity} onChange={(v) => updateNested("theme", "cardOpacity", v)} min={0} max={1} step={0.05} />
                </div>
                <div>
                  <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Blur: {cfg.theme.cardBlur}px</span>
                  <Slider value={cfg.theme.cardBlur} onChange={(v) => updateNested("theme", "cardBlur", v)} min={0} max={60} step={1} />
                </div>
                <div>
                  <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Border radius: {cfg.theme.borderRadius}px</span>
                  <Slider value={cfg.theme.borderRadius} onChange={(v) => updateNested("theme", "borderRadius", v)} min={0} max={48} step={2} />
                </div>
                <div>
                  <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Border width: {cfg.theme.borderWidth}px</span>
                  <Slider value={cfg.theme.borderWidth} onChange={(v) => updateNested("theme", "borderWidth", v)} min={0} max={8} step={1} />
                </div>
                <div>
                  <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Max width: {cfg.theme.maxWidth}px</span>
                  <Slider value={cfg.theme.maxWidth} onChange={(v) => updateNested("theme", "maxWidth", v)} min={300} max={800} step={20} />
                </div>
              </GunInput>
            </SectionCard>
            <SectionCard title="Glow">
              <GunInput>
                <Toggle value={cfg.theme.glow} onChange={(v) => updateNested("theme", "glow", v)} label="Enable glow" />
                {cfg.theme.glow && (
                  <div>
                    <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Intensity: {cfg.theme.glowIntensity}</span>
                    <Slider value={cfg.theme.glowIntensity} onChange={(v) => updateNested("theme", "glowIntensity", v)} min={0} max={100} step={5} />
                  </div>
                )}
              </GunInput>
            </SectionCard>
          </>
        );

      case "background":
        return (
          <SectionCard title="Background" subtitle="Customize your profile's background.">
            <GunInput>
              <SelectInput value={cfg.background.type} onChange={(v) => updateNested("background", "type", v)} options={backgroundOpts} />
              {cfg.background.type !== "none" && cfg.background.type !== "image" && cfg.background.type !== "video" && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <ColorInput value={cfg.background.color1} onChange={(v) => updateNested("background", "color1", v)} />
                    <ColorInput value={cfg.background.color2} onChange={(v) => updateNested("background", "color2", v)} />
                    <ColorInput value={cfg.background.color3} onChange={(v) => updateNested("background", "color3", v)} />
                  </div>
                  <div>
                    <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Speed: {cfg.background.speed.toFixed(1)}</span>
                    <Slider value={cfg.background.speed} onChange={(v) => updateNested("background", "speed", v)} min={0} max={5} step={0.2} />
                  </div>
                  <div>
                    <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Density: {cfg.background.density.toFixed(1)}</span>
                    <Slider value={cfg.background.density} onChange={(v) => updateNested("background", "density", v)} min={0} max={5} step={0.2} />
                  </div>
                  <div>
                    <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Size: {cfg.background.size.toFixed(1)}</span>
                    <Slider value={cfg.background.size} onChange={(v) => updateNested("background", "size", v)} min={0} max={12} step={1} />
                  </div>
                  <Toggle value={cfg.background.glow} onChange={(v) => updateNested("background", "glow", v)} label="Glow" />
                </>
              )}
              {cfg.background.type === "image" && (
                <TextInput value={cfg.background.imageUrl} onChange={(v) => updateNested("background", "imageUrl", v)} placeholder="Image URL" />
              )}
              {cfg.background.type === "video" && (
                <TextInput value={cfg.background.videoUrl} onChange={(v) => updateNested("background", "videoUrl", v)} placeholder="Video URL" />
              )}
            </GunInput>
          </SectionCard>
        );

      case "font":
        return (
          <SectionCard title="Font" subtitle="Choose and customize your profile's font.">
            <GunInput>
              <SelectInput value={cfg.theme.fontFamily} onChange={(v) => updateNested("theme", "fontFamily", v)} options={fontOpts} />
              {cfg.theme.fontFamily === "custom" && (
                <TextInput value={cfg.theme.fontFamilyUrl} onChange={(v) => updateNested("theme", "fontFamilyUrl", v)} placeholder="Font URL (Google Fonts link)" />
              )}
            </GunInput>
          </SectionCard>
        );

      case "splash":
        return (
          <SectionCard title="Splash Screen" subtitle="Configure your profile's intro animation.">
            <GunInput>
              <Toggle value={cfg.splash.enabled} onChange={(v) => updateNested("splash", "enabled", v)} label="Enable splash intro" />
              {cfg.splash.enabled && (
                <>
                  <SelectInput value={cfg.splash.type} onChange={(v) => updateNested("splash", "type", v)} options={splashTypeOpts} />
                  <TextInput value={cfg.splash.text} onChange={(v) => updateNested("splash", "text", v)} placeholder="Main text" />
                  <TextInput value={cfg.splash.subtext} onChange={(v) => updateNested("splash", "subtext", v)} placeholder="Sub text" />
                  <TextInput value={cfg.splash.cta} onChange={(v) => updateNested("splash", "cta", v)} placeholder="CTA button text" />
                  <Toggle value={cfg.splash.showEnterButton} onChange={(v) => updateNested("splash", "showEnterButton", v)} label="Show enter button" />
                  <ColorInput value={cfg.splash.bgColor} onChange={(v) => updateNested("splash", "bgColor", v)} />
                  <ColorInput value={cfg.splash.textColor} onChange={(v) => updateNested("splash", "textColor", v)} />
                  <ColorInput value={cfg.splash.accentColor} onChange={(v) => updateNested("splash", "accentColor", v)} />
                  {cfg.splash.type === "blur" && (
                    <div>
                      <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Blur amount: {cfg.splash.blurAmount}px</span>
                      <Slider value={cfg.splash.blurAmount} onChange={(v) => updateNested("splash", "blurAmount", v)} min={0} max={40} step={2} />
                    </div>
                  )}
                  {cfg.splash.type === "image" && (
                    <TextInput value={cfg.splash.imageUrl} onChange={(v) => updateNested("splash", "imageUrl", v)} placeholder="Background image URL" />
                  )}
                </>
              )}
            </GunInput>
          </SectionCard>
        );

      case "effects":
        return (
          <>
            <SectionCard title="Cursor Effect">
              <GunInput>
                <Toggle value={cfg.effects.cursor.enabled} onChange={(v) => updateCursor("enabled", v)} label="Enable cursor effect" />
                {cfg.effects.cursor.enabled && (
                  <>
                    <SelectInput value={cfg.effects.cursor.type} onChange={(v) => updateCursor("type", v)} options={cursorOpts} />
                    <ColorInput value={cfg.effects.cursor.color} onChange={(v) => updateCursor("color", v)} />
                    <div>
                      <span style={{ display: "block", marginBottom: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Size: {cfg.effects.cursor.size}</span>
                      <Slider value={cfg.effects.cursor.size} onChange={(v) => updateCursor("size", v)} min={2} max={20} step={1} />
                    </div>
                  </>
                )}
              </GunInput>
            </SectionCard>
            <SectionCard title="Click Effect">
              <GunInput>
                <Toggle value={cfg.effects.click.enabled} onChange={(v) => updateClick("enabled", v)} label="Enable click effect" />
                {cfg.effects.click.enabled && (
                  <>
                    <SelectInput value={cfg.effects.click.type} onChange={(v) => updateClick("type", v)}
                      options={[{ value: "burst", label: "Burst" }, { value: "ripple", label: "Ripple" }, { value: "hearts", label: "Hearts" }, { value: "confetti", label: "Confetti" }, { value: "emojis", label: "Emojis" }]} />
                    <ColorInput value={cfg.effects.click.color} onChange={(v) => updateClick("color", v)} />
                  </>
                )}
              </GunInput>
            </SectionCard>
            <SectionCard title="Other Effects">
              <GunInput>
                <Toggle value={cfg.effects.tilt3d} onChange={(v) => updateEffect("tilt3d", v)} label="3D tilt" />
                <Toggle value={cfg.effects.typewriterTitle} onChange={(v) => updateEffect("typewriterTitle", v)} label="Typewriter title" />
                <Toggle value={cfg.effects.glowPulse} onChange={(v) => updateEffect("glowPulse", v)} label="Glow pulse" />
                <Toggle value={cfg.effects.textGlow} onChange={(v) => updateEffect("textGlow", v)} label="Text glow" />
              </GunInput>
            </SectionCard>
          </>
        );

      case "seo":
        return (
          <SectionCard title="SEO" subtitle="Customize how search engines see your profile.">
            <GunInput>
              <TextInput value={cfg.seo.title} onChange={(v) => update("seo", { ...cfg.seo, title: v })} placeholder="Page title" />
              <TextArea value={cfg.seo.description} onChange={(v) => update("seo", { ...cfg.seo, description: v })} placeholder="Meta description" rows={2} />
              <TextInput value={cfg.seo.ogImage} onChange={(v) => update("seo", { ...cfg.seo, ogImage: v })} placeholder="OG image URL" />
            </GunInput>
          </SectionCard>
        );

      case "analytics":
        return (
          <SectionCard title="Analytics" subtitle="Track your profile's performance.">
            <GunInput>
              <Toggle value={cfg.analytics.trackViews} onChange={(v) => update("analytics", { ...cfg.analytics, trackViews: v })} label="Track profile views" />
            </GunInput>
          </SectionCard>
        );

      case "custom":
        return (
          <>
            <SectionCard title="Custom CSS" subtitle="Add custom CSS to your profile.">
              <GunInput>
                <TextArea value={cfg.customCss} onChange={(v) => update("customCss", v)} rows={6} placeholder="/* your styles */" />
              </GunInput>
            </SectionCard>
            <SectionCard title="Custom HTML" subtitle="Add custom HTML to your profile.">
              <GunInput>
                <TextArea value={cfg.customHtml} onChange={(v) => update("customHtml", v)} rows={6} placeholder="<!-- your html -->" />
              </GunInput>
            </SectionCard>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#08070d" }}>
      <div style={{ height: "100%", width: "100%", display: "flex" }}>
        {/* Sidebar */}
        <aside
          style={{
            zIndex: 999999, height: "100%", minWidth: 300, maxWidth: 300, padding: 25,
            background: "#0e0e0e", display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxSizing: "border-box", borderTopRightRadius: 50, borderBottomRightRadius: 50,
            overflowY: "auto", position: "fixed", left: 0, scrollbarWidth: "none" as const,
          }}
        >
          <div>
            {/* User Info */}
            <div style={{ display: "flex", gap: 11, alignItems: "center", borderBottom: "1px solid #181818", paddingBottom: 20 }}>
              <svg width="41.5" height="41.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ color: "#575555", minWidth: 41.5, background: "linear-gradient(120deg,#2f2d30,#140f14)", borderRadius: "50%", padding: 7 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <h1 style={{ margin: 0, fontSize: 18.5, fontWeight: 550, color: "#fafafa", width: "fit-content" }}>
                  {username || "brazyuser"}
                </h1>
                <a href="#" style={{ margin: 0, width: "fit-content", fontSize: 14.5, textDecoration: "none", color: "#a5a4a4", fontWeight: 500 }}>
                  brazy.lol/@{username || "user"}
                </a>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 0, marginLeft: -10, marginTop: 20 }}>
              {navStructure.map((item) => {
                if (item.type === "header") {
                  return (
                    <p key={item.key} style={{
                      margin: "18px 0 5px 15px", fontSize: 12.5, fontWeight: 600, textTransform: "uppercase",
                      letterSpacing: "1.5px", color: activeTab.startsWith(item.key === "general" ? "a" : item.key === "color" ? "c" : "o") ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.25)",
                    }}>
                      {item.label}
                    </p>
                  );
                }
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    style={{
                      all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                      textDecoration: "none", color: isActive ? "#fafafa" : "#a5a4a4",
                      fontSize: 16.5, padding: "9px 10px 9px 15px", fontWeight: isActive ? 550 : 500,
                      width: "100%", boxSizing: "border-box" as const, borderRadius: 12,
                      transition: "all .15s", background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Save */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => onSave(cfg)}
              disabled={saving}
              style={{
                all: "unset", cursor: saving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", boxSizing: "border-box" as const, padding: "12px 20px",
                borderRadius: 15, fontSize: 16, fontWeight: 600,
                color: saving ? "rgba(255,255,255,0.3)" : "#fff",
                background: saving ? "rgba(126,44,139,0.3)" : "rgba(126,44,139,0.5)",
                border: saving ? "2px solid rgba(126,44,139,0.3)" : "2px solid rgba(126,44,139,0.4)",
                transition: "all .15s",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </aside>

        {/* Content */}
        <div
          style={{
            width: "100%", boxSizing: "border-box", overflowY: "scroll", overflowX: "hidden",
            padding: "45px 45px 45px calc(300px + 2 * 25px - 5px)",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 25 }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
