"use client";

import type { ProfileConfig, Effects, Audio } from "@/lib/profile/schema";
import { Toggle } from "./controls";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <Row label="Monochrome Icons">
        <Toggle value={effects.glowPulse ?? false} onChange={(v) => onUpdate("effects", "glowPulse", v)} label="" />
      </Row>
      <Row label="Animated Title">
        <Toggle value={effects.typewriterTitle ?? false} onChange={(v) => onUpdate("effects", "typewriterTitle", v)} label="" />
      </Row>
      <Row label="Swap Box Colors">
        <Toggle value={effects.tilt3d ?? false} onChange={(v) => onUpdate("effects", "tilt3d", v)} label="" />
      </Row>
      <Row label="Volume Control">
        <Toggle value={audio.enabled ?? false} onChange={(v) => onUpdate("audio", "enabled", v)} label="" />
      </Row>
      <Row label="Use Discord Avatar">
        <Toggle value={effects.cursor?.enabled ?? false} onChange={(v) => onUpdate("effects", "textGlow", v)} label="" />
      </Row>
      <Row label="Discord Avatar Decoration">
        <Toggle value={effects.click?.enabled ?? false} onChange={(v) => onUpdate("effects", "textGlow", v)} label="" />
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
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}
