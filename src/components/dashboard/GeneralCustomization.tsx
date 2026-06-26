"use client";

import type { ProfileConfig, Theme, Effects, Background, Identity, Audio } from "@/lib/profile/schema";
import { Toggle, SelectInput, Slider } from "./controls";

 export function GeneralCustomization({
  identity,
  theme,
  background,
  effects,
  audio,
  onUpdate,
}: {
  identity: Partial<Identity>;
  theme: Partial<Theme>;
  background: Partial<Background>;
  effects: Partial<Effects>;
  audio: Partial<Audio>;
  onUpdate: (section: keyof ProfileConfig, key: string, value: unknown) => void;
}) {
  const bgEffectValue = background.type ?? "none";
  const bgEffectOptions = [
    { value: "none", label: "None" },
    { value: "color", label: "Color" },
    { value: "gradient", label: "Gradient" },
    { value: "particles", label: "Particles" },
    { value: "matrix", label: "Matrix" },
    { value: "starfield", label: "Starfield" },
    { value: "aurora", label: "Aurora" },
    { value: "rain", label: "Rain" },
    { value: "snow", label: "Snow" },
    { value: "bubbles", label: "Bubbles" },
    { value: "grid", label: "Grid" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <Row label="Description">
        <textarea
          value={identity.bio ?? ""}
          onChange={(e) => onUpdate("identity", "bio", e.target.value)}
          placeholder="Bio"
          rows={3}
          style={{
            background: "#121212",
            border: "2px solid #1b1b1b",
            borderRadius: 14,
            padding: 14,
            color: "#f1f1f1",
            fontSize: 17,
            fontWeight: 500,
            resize: "none",
            width: "100%",
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#333" }}
          onBlur={(e) => { e.target.style.borderColor = "#1b1b1b" }}
        />
      </Row>

      <Row label="Discord Presence">
        <div style={{ width: 140 }}>
          <SelectInput value="Disabled" onChange={() => {}} options={[{ value: "Disabled", label: "Disabled" }, { value: "Enabled", label: "Enabled" }]} />
        </div>
      </Row>

      <Row label="Background Effects">
        <div style={{ width: 140 }}>
          <SelectInput
            value={bgEffectValue}
            onChange={(v) => onUpdate("background", "type", v)}
            options={bgEffectOptions}
          />
        </div>
      </Row>

      <Row label="Username Effects">
        <Toggle
          value={effects.textGlow ?? false}
          onChange={(v) => onUpdate("effects", "textGlow", v)}
          label=""
        />
      </Row>

      <Row label="Profile Opacity">
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 220 }}>
          <Slider
            value={theme.cardOpacity ?? 0.55}
            onChange={(v) => onUpdate("theme", "cardOpacity", v)}
            min={0}
            max={1}
            step={0.05}
          />
          <span style={{ fontSize: 12, color: "#797979", minWidth: 32, textAlign: "right", flexShrink: 0 }}>
            {Math.round((theme.cardOpacity ?? 0.55) * 100)}%
          </span>
        </div>
      </Row>

      <Row label="Profile Blur">
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 220 }}>
          <Slider
            value={theme.cardBlur ?? 20}
            onChange={(v) => onUpdate("theme", "cardBlur", v)}
            min={0}
            max={60}
            step={1}
          />
          <span style={{ fontSize: 12, color: "#797979", minWidth: 32, textAlign: "right", flexShrink: 0 }}>
            {theme.cardBlur ?? 20}px
          </span>
        </div>
      </Row>

      <Row label="Location">
        <input
          value={identity.location ?? ""}
          onChange={(e) => onUpdate("identity", "location", e.target.value)}
          placeholder="Location"
          style={{
            background: "#121212",
            border: "2px solid #1b1b1b",
            borderRadius: 14,
            padding: "8px 14px",
            color: "#f1f1f1",
            fontSize: 17,
            fontWeight: 500,
            width: "100%",
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#333" }}
          onBlur={(e) => { e.target.style.borderColor = "#1b1b1b" }}
        />
      </Row>

      <Row label="Glow Settings">
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 280 }}>
          <Toggle
            value={theme.glow ?? false}
            onChange={(v) => onUpdate("theme", "glow", v)}
            label=""
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <Slider
              value={theme.glowIntensity ?? 60}
              onChange={(v) => onUpdate("theme", "glowIntensity", v)}
              min={0}
              max={100}
              step={5}
            />
            <span style={{ fontSize: 12, color: "#797979", minWidth: 32, textAlign: "right", flexShrink: 0 }}>
              {theme.glowIntensity ?? 60}%
            </span>
          </div>
        </div>
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: 36,
      }}
    >
      <span style={{ fontSize: 15, color: "#a5a4a4", fontWeight: 450, flexShrink: 0, minWidth: 120 }}>
        {label}
      </span>
      <div style={{ display: "flex", justifyContent: "flex-end", flex: 1, maxWidth: 300 }}>
        {children}
      </div>
    </div>
  );
}
