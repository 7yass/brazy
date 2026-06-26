"use client";

import { useState } from "react";

const backgroundOpts = [
  "None", "Color", "Gradient", "Particles", "Matrix",
  "Starfield", "Aurora", "Rain", "Snow", "Bubbles", "Grid", "Image", "Video",
];

export function GeneralCustomization() {
  const [description, setDescription] = useState("");
  const [presence, setPresence] = useState("Disabled");
  const [bgEffect, setBgEffect] = useState("None");
  const [usernameFx, setUsernameFx] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [blur, setBlur] = useState(0);
  const [location, setLocation] = useState("");
  const [glow, setGlow] = useState(false);
  const [glowValue, setGlowValue] = useState(50);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <Row label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <Select value={presence} onChange={(v) => setPresence(v)} options={["Disabled", "Enabled"]} />
      </Row>

      <Row label="Background Effects">
        <Select value={bgEffect} onChange={(v) => setBgEffect(v)} options={backgroundOpts} />
      </Row>

      <Row label="Username Effects">
        <Toggle value={usernameFx} onChange={(v) => setUsernameFx(v)} />
      </Row>

      <Row label="Profile Opacity">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Slider value={opacity} onChange={(v) => setOpacity(v)} min={0} max={1} step={0.05} />
          <span style={{ fontSize: 14, color: "#909090", minWidth: 42, textAlign: "right" }}>
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </Row>

      <Row label="Profile Blur">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Slider value={blur} onChange={(v) => setBlur(v)} min={0} max={60} step={1} />
          <span style={{ fontSize: 14, color: "#909090", minWidth: 42, textAlign: "right" }}>
            {blur}px
          </span>
        </div>
      </Row>

      <Row label="Location">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
          <Toggle value={glow} onChange={(v) => setGlow(v)} />
          <Slider value={glowValue} onChange={(v) => setGlowValue(v)} min={0} max={100} step={5} />
          <span style={{ fontSize: 14, color: "#909090", minWidth: 42, textAlign: "right" }}>
            {glowValue}%
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
        <option key={opt} value={opt}>
          {opt}
        </option>
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
