"use client";
import { Sparkles } from "lucide-react";
const F = "Satoshi, sans-serif";
export default function WidgetsPage() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Widgets</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Embeds, music players & more.</p>
      </div>
      <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", padding: "48px 24px", textAlign: "center" }}>
        <Sparkles style={{ width: 32, height: 32, color: "rgba(255,255,255,0.15)", margin: "0 auto 12px" }} />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>Widget library coming soon</p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Spotify, YouTube, Discord widgets and more.</p>
      </div>
    </div>
  );
}
