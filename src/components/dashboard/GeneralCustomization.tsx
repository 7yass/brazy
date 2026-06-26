"use client";

import { useRef, useCallback, useEffect } from "react";
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
    <>
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
        <div style={{ maxWidth: 160, display: "flex", alignItems: "center", gap: 8 }}>
          <Slider
            value={theme.cardOpacity ?? 0.55}
            onChange={(v) => onUpdate("theme", "cardOpacity", v)}
            min={0}
            max={1}
            step={0.05}
          />
          <span style={{ fontSize: 12, color: "#797979", minWidth: 36, textAlign: "right" }}>
            {Math.round((theme.cardOpacity ?? 0.55) * 100)}%
          </span>
        </div>
      </Row>

      <Row label="Profile Blur">
        <div style={{ maxWidth: 160, display: "flex", alignItems: "center", gap: 8 }}>
          <Slider
            value={theme.cardBlur ?? 20}
            onChange={(v) => onUpdate("theme", "cardBlur", v)}
            min={0}
            max={60}
            step={1}
          />
          <span style={{ fontSize: 12, color: "#797979", minWidth: 36, textAlign: "right" }}>
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
          <div style={{ maxWidth: 160, display: "flex", alignItems: "center", gap: 8 }}>
            <Slider
              value={theme.glowIntensity ?? 60}
              onChange={(v) => onUpdate("theme", "glowIntensity", v)}
              min={0}
              max={100}
              step={5}
            />
            <span style={{ fontSize: 12, color: "#797979", minWidth: 36, textAlign: "right" }}>
              {theme.glowIntensity ?? 60}%
            </span>
          </div>
        </div>
      </Row>
      </div>
    </>
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
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const computeValue = useCallback((clientX: number) => {
    if (!trackRef.current) return valueRef.current;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  }, [min, max, step]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    draggingRef.current = true;
    onChange(computeValue(e.clientX));
  }, [onChange, computeValue]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      onChange(computeValue(e.clientX));
    };
    const handleUp = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [onChange, computeValue]);

  const pct = max !== min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div
      ref={trackRef}
      style={{
        position: "relative",
        width: "100%",
        height: 4,
        background: "#2a2a2a",
        borderRadius: 999,
        cursor: "pointer",
        flexShrink: 0,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: "rgba(218,102,218,0.7)",
          borderRadius: 999,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${Math.max(0, Math.min(100, pct))}%`,
          transform: "translate(-50%, -50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid rgba(218,102,218,0.8)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
