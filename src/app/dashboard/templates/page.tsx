"use client";

import { useState } from "react";
import { LayoutTemplate, Heart, Upload, Search, Check } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

const TEMPLATES = [
  { name: "Minimal Dark",  tags: ["dark", "minimal"],  hearts: 214, gradient: "linear-gradient(135deg,#1a1a2e,#16213e)",        accent: "#a78bfa" },
  { name: "Neon Glow",     tags: ["colorful", "glow"],  hearts: 189, gradient: "linear-gradient(135deg,#0d0d0d,#1a0533)",        accent: "#e879f9" },
  { name: "Glass Card",    tags: ["glass", "modern"],   hearts: 167, gradient: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", accent: "#60a5fa" },
  { name: "Terminal",      tags: ["dark", "tech"],      hearts: 142, gradient: "linear-gradient(135deg,#0a0a0a,#0d1f0d)",        accent: "#34d399" },
  { name: "Pastel Soft",   tags: ["light", "cute"],     hearts: 138, gradient: "linear-gradient(135deg,#fce4ec,#f8bbd0)",        accent: "#ec4899" },
  { name: "Crimson",       tags: ["dark", "red"],       hearts: 201, gradient: "linear-gradient(135deg,#1a0000,#2d0000)",        accent: "#dc2626" },
];

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const filtered = TEMPLATES.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const apply = (name: string) => {
    setApplied(name);
    setTimeout(() => setApplied(null), 2000);
  };

  return (
    <div style={{ width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>

      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Templates</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Start from a preset look, then customise to your taste.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 12px", flexShrink: 0 }}>
          <Search style={{ width: 13, height: 13, color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#fafafa", width: 150, fontFamily: F }} />
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {filtered.map((t) => {
          const isApplied = applied === t.name;
          return (
            <div key={t.name} style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
              {/* Thumbnail */}
              <div style={{ height: 110, background: t.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Fake mini profile elements */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${t.accent}44`, border: `2px solid ${t.accent}66` }} />
                  <div style={{ width: 48, height: 5, borderRadius: 99, background: `${t.accent}55` }} />
                  <div style={{ width: 32, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
                  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: `${t.accent}33`, border: `1px solid ${t.accent}44` }} />)}
                  </div>
                </div>
                <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.35)", borderRadius: 99, padding: "3px 8px" }}>
                  <Heart style={{ width: 9, height: 9, color: t.accent }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{t.hearts}</span>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: "14px 16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{t.name}</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: `${t.accent}15`, color: t.accent, fontWeight: 600, border: `1px solid ${t.accent}25` }}>{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => apply(t.name)}
                  style={{ width: "100%", padding: "8px", borderRadius: 10, background: isApplied ? `${t.accent}20` : `${t.accent}12`, border: `1px solid ${isApplied ? t.accent + "55" : t.accent + "28"}`, color: t.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}
                >
                  {isApplied ? <><Check style={{ width: 12, height: 12 }} /> Applied!</> : "Use template"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>No templates match "{search}"</div>
      )}

      {/* Submit banner */}
      <div style={{ borderRadius: 16, border: "1px dashed rgba(255,255,255,0.08)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Upload style={{ width: 15, height: 15, color: "rgba(255,255,255,0.3)" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Submit your template</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Share your design with the community.</p>
        </div>
      </div>

    </div>
  );
}
