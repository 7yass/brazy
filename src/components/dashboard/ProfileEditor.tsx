"use client";

import { useState, useCallback } from "react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import ProfileRenderer from "@/components/profile/ProfileRenderer";
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
      [section]: { ...(c[section] as any), [key]: val } as ProfileConfig[S],
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

  const tabs = [
    { id: "identity", label: "Profile" },
    { id: "theme", label: "Theme" },
    { id: "background", label: "Background" },
    { id: "effects", label: "Effects" },
    { id: "audio", label: "Audio" },
    { id: "social", label: "Social" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#08070d", color: "#e2e8f0" }}>
      {/* Left: Controls */}
      <div style={{ width: 380, minWidth: 380, borderRight: "1px solid rgba(255,255,255,0.08)", overflowY: "auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Editor</h2>
          <button
            onClick={() => onSave(cfg)}
            disabled={saving}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#a855f7,#22d3ee)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                background: tab === t.id ? "rgba(168,85,247,0.2)" : "transparent",
                color: tab === t.id ? "#c084fc" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "identity" && (
            <>
              <div>
                <TextInput value={cfg.identity.displayName} onChange={(v) => updateNested("identity", "displayName", v)} placeholder="Display name" />
              </div>
              <div>
                <TextInput value={cfg.identity.tagline} onChange={(v) => updateNested("identity", "tagline", v)} placeholder="Tagline" />
              </div>
              <div>
                <TextInput value={cfg.identity.pronouns} onChange={(v) => updateNested("identity", "pronouns", v)} placeholder="Pronouns" />
              </div>
              <div>
                <TextInput value={cfg.identity.location} onChange={(v) => updateNested("identity", "location", v)} placeholder="Location" />
              </div>
              <div>
                <TextArea value={cfg.identity.bio} onChange={(v) => updateNested("identity", "bio", v)} placeholder="Bio" rows={3} />
              </div>
              <div>
                <TextInput value={cfg.identity.avatarUrl} onChange={(v) => updateNested("identity", "avatarUrl", v)} placeholder="Avatar URL" />
              </div>
              <div>
                <Toggle value={cfg.identity.verified} onChange={(v) => updateNested("identity", "verified", v)} label="Verified badge" />
              </div>
            </>
          )}

          {tab === "theme" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><ColorInput value={cfg.theme.primaryColor} onChange={(v) => updateNested("theme", "primaryColor", v)} /></div>
                <div><ColorInput value={cfg.theme.secondaryColor} onChange={(v) => updateNested("theme", "secondaryColor", v)} /></div>
                <div><ColorInput value={cfg.theme.accentColor} onChange={(v) => updateNested("theme", "accentColor", v)} /></div>
                <div><ColorInput value={cfg.theme.backgroundColor} onChange={(v) => updateNested("theme", "backgroundColor", v)} /></div>
                <div><ColorInput value={cfg.theme.textColor} onChange={(v) => updateNested("theme", "textColor", v)} /></div>
                <div><ColorInput value={cfg.theme.mutedTextColor} onChange={(v) => updateNested("theme", "mutedTextColor", v)} /></div>
              </div>
              <div>
                <SelectInput value={cfg.theme.cardStyle} onChange={(v) => updateNested("theme", "cardStyle", v)} options={cardStyleOpts} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Card opacity: {cfg.theme.cardOpacity.toFixed(2)}</label>
                <Slider value={cfg.theme.cardOpacity} onChange={(v) => updateNested("theme", "cardOpacity", v)} min={0} max={1} step={0.05} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Blur: {cfg.theme.cardBlur}px</label>
                <Slider value={cfg.theme.cardBlur} onChange={(v) => updateNested("theme", "cardBlur", v)} min={0} max={60} step={1} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Border radius: {cfg.theme.borderRadius}px</label>
                <Slider value={cfg.theme.borderRadius} onChange={(v) => updateNested("theme", "borderRadius", v)} min={0} max={48} step={2} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Glow intensity: {cfg.theme.glowIntensity}</label>
                <Slider value={cfg.theme.glowIntensity} onChange={(v) => updateNested("theme", "glowIntensity", v)} min={0} max={100} step={5} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Max width: {cfg.theme.maxWidth}px</label>
                <Slider value={cfg.theme.maxWidth} onChange={(v) => updateNested("theme", "maxWidth", v)} min={300} max={800} step={20} />
              </div>
              <Toggle value={cfg.theme.glow} onChange={(v) => updateNested("theme", "glow", v)} label="Glow" />
            </>
          )}

          {tab === "background" && (
            <>
              <div>
                <SelectInput
                  value={cfg.background.type}
                  onChange={(v) => updateNested("background", "type", v)}
                  options={backgroundOpts}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <ColorInput value={cfg.background.color1} onChange={(v) => updateNested("background", "color1", v)} />
                <ColorInput value={cfg.background.color2} onChange={(v) => updateNested("background", "color2", v)} />
                <ColorInput value={cfg.background.color3} onChange={(v) => updateNested("background", "color3", v)} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Speed: {cfg.background.speed.toFixed(1)}</label>
                <Slider value={cfg.background.speed} onChange={(v) => updateNested("background", "speed", v)} min={0} max={5} step={0.2} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Density: {cfg.background.density.toFixed(1)}</label>
                <Slider value={cfg.background.density} onChange={(v) => updateNested("background", "density", v)} min={0} max={5} step={0.2} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Size: {cfg.background.size.toFixed(1)}</label>
                <Slider value={cfg.background.size} onChange={(v) => updateNested("background", "size", v)} min={0} max={12} step={1} />
              </div>
              {cfg.background.type === "image" && (
                <TextInput value={cfg.background.imageUrl} onChange={(v) => updateNested("background", "imageUrl", v)} placeholder="Image URL" />
              )}
              {cfg.background.type === "video" && (
                <TextInput value={cfg.background.videoUrl} onChange={(v) => updateNested("background", "videoUrl", v)} placeholder="Video URL" />
              )}
            </>
          )}

          {tab === "effects" && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Cursor</div>
              <Toggle value={cfg.effects.cursor.enabled} onChange={(v) => updateCursor("enabled", v)} label="Cursor effect" />
              {cfg.effects.cursor.enabled && (
                <>
                  <SelectInput value={cfg.effects.cursor.type} onChange={(v) => updateCursor("type", v)} options={cursorOpts} />
                  <ColorInput value={cfg.effects.cursor.color} onChange={(v) => updateCursor("color", v)} />
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Size: {cfg.effects.cursor.size}</label>
                    <Slider value={cfg.effects.cursor.size} onChange={(v) => updateCursor("size", v)} min={2} max={20} step={1} />
                  </div>
                </>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>Click</div>
              <Toggle value={cfg.effects.click.enabled} onChange={(v) => updateClick("enabled", v)} label="Click burst" />
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

              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>Other</div>
              <Toggle value={cfg.effects.tilt3d} onChange={(v) => updateEffect("tilt3d", v)} label="3D tilt" />
              <Toggle value={cfg.effects.glowPulse} onChange={(v) => updateEffect("glowPulse", v)} label="Glow pulse" />
              <Toggle value={cfg.effects.textGlow} onChange={(v) => updateEffect("textGlow", v)} label="Text glow" />
            </>
          )}

          {tab === "audio" && (
            <>
              <Toggle value={cfg.audio.enabled} onChange={(v) => updateNested("audio", "enabled", v)} label="Audio player" />
              {cfg.audio.enabled && (
                <>
                  <TextInput value={cfg.audio.src} onChange={(v) => updateNested("audio", "src", v)} placeholder="Audio URL (mp3)" />
                  <TextInput value={cfg.audio.title} onChange={(v) => updateNested("audio", "title", v)} placeholder="Track title" />
                  <TextInput value={cfg.audio.artist} onChange={(v) => updateNested("audio", "artist", v)} placeholder="Artist name" />
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Volume: {(cfg.audio.volume * 100).toFixed(0)}%</label>
                    <Slider value={cfg.audio.volume} onChange={(v) => updateNested("audio", "volume", v)} min={0} max={1} step={0.05} />
                  </div>
                  <Toggle value={cfg.audio.loop} onChange={(v) => updateNested("audio", "loop", v)} label="Loop" />
                  <Toggle value={cfg.audio.autoplay} onChange={(v) => updateNested("audio", "autoplay", v)} label="Autoplay" />
                  <Toggle value={cfg.audio.showVisualizer} onChange={(v) => updateNested("audio", "showVisualizer", v)} label="Visualizer" />
                </>
              )}
            </>
          )}

          {tab === "social" && (
            <>
              {cfg.social.links.map((link, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <TextInput
                    value={link.platform}
                    onChange={(v) => {
                      const links = [...cfg.social.links];
                      links[i] = { ...links[i], platform: v as any };
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
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16, padding: "4px 6px" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  update("social", { ...cfg.social, links: [...cfg.social.links, { platform: "website", url: "", label: "", color: "" }] })
                }
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px dashed rgba(255,255,255,0.2)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                + Add link
              </button>
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
            </>
          )}

          {tab === "custom" && (
            <>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4, display: "block" }}>Custom CSS</label>
                <TextArea value={cfg.customCss} onChange={(v) => update("customCss", v)} rows={6} placeholder="/* your styles */" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4, display: "block" }}>Custom HTML</label>
                <TextArea value={cfg.customHtml} onChange={(v) => update("customHtml", v)} rows={6} placeholder="<!-- your html -->" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Preview */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <ProfileRenderer config={cfg} />
        </div>
      </div>
    </div>
  );
}
