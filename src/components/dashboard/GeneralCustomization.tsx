"use client";

import type { ProfileConfig, Theme, Effects, Background, Identity, Audio, Social } from "@/lib/profile/schema";

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
  const bgEffectOptions: string[] = [
    "None", "Color", "Gradient", "Particles", "Matrix",
    "Starfield", "Aurora", "Rain", "Snow", "Bubbles", "Grid", "Image", "Video",
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
            width: 280,
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#333" }}
          onBlur={(e) => { e.target.style.borderColor = "#1b1b1b" }}
        />
      </Row>

      <Row label="Discord Presence">
        <Select
          value="Disabled"
          onChange={() => {}}
          options={["Disabled", "Enabled"]}
        />
      </Row>

      <Row label="Background Effects">
        <Select
          value={bgEffectValue.charAt(0).toUpperCase() + bgEffectValue.slice(1)}
          onChange={(v) => onUpdate("background", "type", v.toLowerCase())}
          options={bgEffectOptions}
        />
      </Row>

      <Row label="Username Effects">
        <Toggle
          value={effects.textGlow ?? false}
          onChange={(v) => onUpdate("effects", "textGlow", v)}
        />
      </Row>

      <Row label="Profile Opacity">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Slider
            value={theme.cardOpacity ?? 0.55}
            onChange={(v) => onUpdate("theme", "cardOpacity", v)}
            min={0}
            max={1}
            step={0.05}
          />
          <span style={{ fontSize: 14, color: "#909090", minWidth: 42, textAlign: "right" }}>
            {Math.round((theme.cardOpacity ?? 0.55) * 100)}%
          </span>
        </div>
      </Row>

      <Row label="Profile Blur">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Slider
            value={theme.cardBlur ?? 20}
            onChange={(v) => onUpdate("theme", "cardBlur", v)}
            min={0}
            max={60}
            step={1}
          />
          <span style={{ fontSize: 14, color: "#909090", minWidth: 42, textAlign: "right" }}>
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
            width: 280,
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#333" }}
          onBlur={(e) => { e.target.style.borderColor = "#1b1b1b" }}
        />
      </Row>

      <Row label="Glow Settings">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Toggle
            value={theme.glow ?? false}
            onChange={(v) => onUpdate("theme", "glow", v)}
          />
          <Slider
            value={theme.glowIntensity ?? 60}
            onChange={(v) => onUpdate("theme", "glowIntensity", v)}
            min={0}
            max={100}
            step={5}
          />
          <span style={{ fontSize: 14, color: "#909090", minWidth: 42, textAlign: "right" }}>
            {theme.glowIntensity ?? 60}%
          </span>
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
        gap: 10,
      }}
    >
      <span style={{ fontSize: 15, color: "#a5a4a4", fontWeight: 450 }}>{label}</span>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#1a1a1a",
        border: "2px solid #222222",
        borderRadius: 15,
        padding: "7px 10px",
        color: "#fafafa",
        fontSize: 16.5,
        fontFamily: "Satoshi, sans-serif",
        width: 140,
        outline: "none",
        cursor: "pointer",
        transition: "border-color 0.25s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#272727" }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#222222" }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
        backgroundColor: value ? "rgba(218,102,218,0.6)" : "#ffffff26",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
          left: value ? 18 : 2,
        }}
      />
    </button>
  );
}

function Slider({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        maxWidth: 160,
        accentColor: "rgba(218,102,218,0.8)",
        cursor: "pointer",
      }}
    />
  );
}
