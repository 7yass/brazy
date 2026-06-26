"use client";

import type { ProfileConfig, Effects, Audio } from "@/lib/profile/schema";

export function OtherCustomization({
  effects,
  audio,
  onUpdate,
}: {
  effects: Partial<Effects>;
  audio: Partial<Audio>;
  onUpdate: (section: keyof ProfileConfig, key: string, value: unknown) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Row label="Monochrome Icons">
        <Toggle
          value={effects.glowPulse ?? false}
          onChange={(v) => onUpdate("effects", "glowPulse", v)}
        />
      </Row>
      <Row label="Animated Title">
        <Toggle
          value={effects.typewriterTitle ?? false}
          onChange={(v) => onUpdate("effects", "typewriterTitle", v)}
        />
      </Row>
      <Row label="Swap Box Colors">
        <Toggle
          value={effects.tilt3d ?? false}
          onChange={(v) => onUpdate("effects", "tilt3d", v)}
        />
      </Row>
      <Row label="Volume Control">
        <Toggle
          value={audio.enabled ?? false}
          onChange={(v) => onUpdate("audio", "enabled", v)}
        />
      </Row>
      <Row label="Use Discord Avatar">
        <Toggle
          value={effects.cursor?.enabled ?? false}
          onChange={(v) => onUpdate("effects", "textGlow", v)}
        />
      </Row>
      <Row label="Discord Avatar Decoration">
        <Toggle
          value={effects.click?.enabled ?? false}
          onChange={(v) => onUpdate("effects", "textGlow", v)}
        />
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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        borderRadius: 999,
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
