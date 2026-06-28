"use client";

import { Eye, MousePointerClick, Users, TrendingUp, MonitorSmartphone, Globe } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

const stats = [
  { icon: Eye,               label: "Total Views",    color: "#a78bfa" },
  { icon: MousePointerClick, label: "Link Clicks",     color: "#dc2626" },
  { icon: Users,             label: "Unique Visitors", color: "#34d399" },
  { icon: TrendingUp,        label: "Growth",          color: "#fbbf24" },
  { icon: MonitorSmartphone, label: "Mobile %",        color: "#fb7185" },
  { icon: Globe,             label: "Countries",       color: "#60a5fa" },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>

      <header>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Analytics</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Track your page performance over time.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ borderRadius: 16, border: `1px solid ${s.color}22`, background: `${s.color}0a`, padding: "18px 20px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon style={{ width: 15, height: 15, color: s.color }} />
              </div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa" }}>—</p>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <Card>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Views over time</p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Daily profile views for the last 30 days</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["7d", "30d", "90d"].map(r => (
              <button key={r} style={{ padding: "5px 11px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: F, cursor: "pointer", border: r === "30d" ? "1px solid rgba(220,38,38,0.4)" : "1px solid rgba(255,255,255,0.07)", background: r === "30d" ? "rgba(220,38,38,0.1)" : "rgba(255,255,255,0.03)", color: r === "30d" ? "#dc2626" : "rgba(255,255,255,0.35)" }}>{r}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "32px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: "100%", height: 120, display: "flex", alignItems: "flex-end", gap: 6 }}>
            {[40,55,35,70,50,80,45,60,75,55,65,70,50,85,60,75,55,90,65,70,80,55,75,60,85,70,90,65,80,95].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: i === 29 ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.07)" }} />
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <TrendingUp style={{ width: 22, height: 22, color: "rgba(255,255,255,0.12)" }} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.25)" }}>Detailed analytics coming soon</p>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.15)" }}>Real visitor data will populate once your page goes live.</p>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Top clicked links</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Which links your visitors click most</p>
        </div>
        <div style={{ padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {["Twitter / X", "Instagram", "GitHub", "Website"].map((name, i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 18, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.2)", textAlign: "right", flexShrink: 0 }}>#{i + 1}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ width: `${75 - i * 15}%`, height: "100%", borderRadius: 99, background: "rgba(220,38,38,0.35)" }} />
              </div>
              <span style={{ width: 80, fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{name}</span>
              <span style={{ width: 24, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.2)", textAlign: "right" }}>—</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
