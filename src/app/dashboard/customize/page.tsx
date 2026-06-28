"use client";

import { Palette } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

export default function CustomizePage() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Customize</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Make your page look exactly how you want it.</p>
      </div>
      <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", padding: "48px 24px", textAlign: "center" }}>
        <Palette style={{ width: 32, height: 32, color: "rgba(255,255,255,0.15)", margin: "0 auto 12px" }} />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>Full customize panel coming soon</p>
      </div>
    </div>
  );
}
