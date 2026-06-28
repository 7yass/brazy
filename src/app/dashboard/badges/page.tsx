"use client";

import { Award, Lock, Sparkles } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

const earnedBadges: { name: string; desc: string; icon: string; color: string }[] = [];

const lockedBadges = [
  { name: "Early Adopter", desc: "Joined during beta",        color: "#fbbf24" },
  { name: "Link Master",   desc: "Added 10+ links",           color: "#a78bfa" },
  { name: "Customizer",    desc: "Changed your theme",        color: "#dc2626" },
  { name: "Viral",         desc: "100+ profile views",        color: "#34d399" },
  { name: "OG",            desc: "One of the first 100 users",color: "#fb7185" },
  { name: "Night Owl",     desc: "Logged in after midnight",  color: "#60a5fa" },
];

export default function BadgesPage() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Badges</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Earn badges by using brazy.</p>
      </div>
      {earnedBadges.length > 0 ? (
        <div>
          <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Earned</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {earnedBadges.map((b) => (
              <div key={b.name} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{b.name}</p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", padding: "32px 24px", textAlign: "center" }}>
          <Sparkles style={{ width: 28, height: 28, color: "rgba(255,255,255,0.15)", margin: "0 auto 10px" }} />
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>No badges yet — keep using brazy!</p>
        </div>
      )}
      <div>
        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Locked</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {lockedBadges.map((b) => (
            <div key={b.name} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", padding: "16px", textAlign: "center", opacity: 0.5 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${b.color}15`, border: `1px solid ${b.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Lock style={{ width: 14, height: 14, color: b.color }} />
              </div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fafafa" }}>{b.name}</p>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
