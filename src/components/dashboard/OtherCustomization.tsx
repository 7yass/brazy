"use client";

import { useState } from "react";

export function OtherCustomization() {
  const [monochrome, setMonochrome] = useState(false);
  const [animatedTitle, setAnimatedTitle] = useState(false);
  const [swapBoxColors, setSwapBoxColors] = useState(false);
  const [volume, setVolume] = useState(false);
  const [useDiscordAvatar, setUseDiscordAvatar] = useState(false);
  const [decoration, setDecoration] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Row label="Monochrome Icons">
        <Toggle value={monochrome} onChange={setMonochrome} />
      </Row>
      <Row label="Animated Title">
        <Toggle value={animatedTitle} onChange={setAnimatedTitle} />
      </Row>
      <Row label="Swap Box Colors">
        <Toggle value={swapBoxColors} onChange={setSwapBoxColors} />
      </Row>
      <Row label="Volume Control">
        <Toggle value={volume} onChange={setVolume} />
      </Row>
      <Row label="Use Discord Avatar">
        <Toggle value={useDiscordAvatar} onChange={setUseDiscordAvatar} />
      </Row>
      <Row label="Discord Avatar Decoration">
        <Toggle value={decoration} onChange={setDecoration} />
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
