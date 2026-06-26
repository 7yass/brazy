"use client";

import type { ProfileConfig, Theme, Background } from "@/lib/profile/schema";

export function ColorCustomization({
  theme,
  background,
  onUpdate,
}: {
  theme: Partial<Theme>;
  background: Partial<Background>;
  onUpdate: (section: keyof ProfileConfig, key: string, value: unknown) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <ColorRow
        label="Accent Color"
        value={theme.primaryColor ?? "#7c3aed"}
        onChange={(v) => onUpdate("theme", "primaryColor", v)}
      />
      <ColorRow
        label="Background Color"
        value={theme.backgroundColor ?? "#08070d"}
        onChange={(v) => onUpdate("theme", "backgroundColor", v)}
      />
      <ColorRow
        label="Text Color"
        value={theme.textColor ?? "#f8fafc"}
        onChange={(v) => onUpdate("theme", "textColor", v)}
      />
      <ColorRow
        label="Icon Color"
        value={theme.accentColor ?? "#22d3ee"}
        onChange={(v) => onUpdate("theme", "accentColor", v)}
      />

      <Row label="Profile Gradient">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ColorSwatchPicker value={background.color1 ?? "#7c3aed"} onChange={(v) => onUpdate("background", "color1", v)} />
          <ColorSwatchPicker value={background.color2 ?? "#22d3ee"} onChange={(v) => onUpdate("background", "color2", v)} />
          <select
            value={background.direction ?? "down"}
            onChange={(e) => onUpdate("background", "direction", e.target.value)}
            style={{
              background: "#1a1a1a",
              border: "2px solid #222222",
              borderRadius: 15,
              padding: "5px 8px",
              color: "#fafafa",
              fontSize: 14,
              fontFamily: "Satoshi, sans-serif",
              outline: "none",
              cursor: "pointer",
              transition: "border-color 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#272727" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#222222" }}
          >
            <option value="down">↓ Down</option>
            <option value="up">↑ Up</option>
            <option value="left">← Left</option>
            <option value="right">→ Right</option>
            <option value="random">✧ Random</option>
          </select>
        </div>
      </Row>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Row label={label}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ColorSwatchPicker value={value} onChange={onChange} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: "#1a1a1a",
            border: "2px solid #222",
            borderRadius: 10,
            padding: "5px 10px",
            color: "#fafafa",
            fontSize: 14,
            width: 100,
            fontFamily: "Satoshi, sans-serif",
            outline: "none",
          }}
        />
      </div>
    </Row>
  );
}

function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid #222222",
          backgroundColor: value,
        }}
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
      />
    </label>
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
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}
