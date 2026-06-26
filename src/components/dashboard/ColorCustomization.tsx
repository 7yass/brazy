"use client";

import { useState } from "react";

export function ColorCustomization() {
  const [accent, setAccent] = useState("#8b5cf6");
  const [bgColor, setBgColor] = useState("#0a0911");
  const [textColor, setTextColor] = useState("#e2e8f0");
  const [iconColor, setIconColor] = useState("#a78bfa");
  const [gradientStart, setGradientStart] = useState("#6366f1");
  const [gradientEnd, setGradientEnd] = useState("#a855f7");
  const [gradientDir, setGradientDir] = useState("135deg");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <ColorRow label="Accent Color" value={accent} onChange={setAccent} />
      <ColorRow label="Background Color" value={bgColor} onChange={setBgColor} />
      <ColorRow label="Text Color" value={textColor} onChange={setTextColor} />
      <ColorRow label="Icon Color" value={iconColor} onChange={setIconColor} />

      <Row label="Profile Gradient">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ColorSwatchPicker value={gradientStart} onChange={setGradientStart} />
          <ColorSwatchPicker value={gradientEnd} onChange={setGradientEnd} />
          <select
            value={gradientDir}
            onChange={(e) => setGradientDir(e.target.value)}
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
            <option value="135deg">↘ 135°</option>
            <option value="0deg">→ 0°</option>
            <option value="45deg">↗ 45°</option>
            <option value="90deg">↓ 90°</option>
            <option value="180deg">← 180°</option>
            <option value="270deg">↑ 270°</option>
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
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          cursor: "pointer",
        }}
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
        gap: 10,
      }}
    >
      <span style={{ fontSize: 15, color: "#a5a4a4", fontWeight: 450 }}>{label}</span>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}
