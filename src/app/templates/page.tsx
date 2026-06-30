"use client";

import { useState } from "react";
import { Heart, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import ProfileRenderer from "@/components/profile/ProfileRenderer";

const F = "Satoshi, system-ui, sans-serif";

const TEMPLATES: {
  name: string;
  slug: string;
  tags: string[];
  hearts: number;
  gradient: string;
  accent: string;
  theme: Partial<ProfileConfig["theme"]>;
  background: Partial<ProfileConfig["background"]>;
  effects: Partial<ProfileConfig["effects"]>;
}[] = [
  {
    name: "Minimal Dark",
    slug: "minimal-dark",
    tags: ["dark", "minimal"],
    hearts: 214,
    gradient: "linear-gradient(135deg,#1a1a2e,#16213e)",
    accent: "#a78bfa",
    theme: {
      cardStyle: "minimal",
      mode: "dark",
      primaryColor: "#a78bfa",
      textColor: "#fafafa",
      mutedTextColor: "#94a3b8",
      cardOpacity: 0,
      borderRadius: 0,
      borderWidth: 0,
      animatedBorder: false,
      glow: false,
    },
    background: {
      type: "none",
      color1: "#09090b",
      color2: "#09090b",
      color3: "#09090b",
    },
    effects: {
      textGlow: false,
      usernameEffect: "none",
    },
  },
  {
    name: "Neon Glow",
    slug: "neon-glow",
    tags: ["colorful", "glow"],
    hearts: 189,
    gradient: "linear-gradient(135deg,#0d0d0d,#1a0533)",
    accent: "#e879f9",
    theme: {
      cardStyle: "glass",
      mode: "dark",
      primaryColor: "#e879f9",
      textColor: "#ffffff",
      mutedTextColor: "#a21caf",
      cardOpacity: 0.55,
      borderRadius: 22,
      borderWidth: 1,
      animatedBorder: true,
      glow: true,
      glowIntensity: 80,
    },
    background: {
      type: "matrix",
      color1: "#090514",
      color2: "#e879f9",
      color3: "#090514",
    },
    effects: {
      textGlow: true,
      usernameEffect: "glow",
    },
  },
  {
    name: "Glass Card",
    slug: "glass-card",
    tags: ["glass", "modern"],
    hearts: 167,
    gradient: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    accent: "#60a5fa",
    theme: {
      cardStyle: "sleek",
      mode: "dark",
      primaryColor: "#60a5fa",
      textColor: "#ffffff",
      mutedTextColor: "#93c5fd",
      cardOpacity: 0.35,
      cardBlur: 30,
      borderRadius: 24,
      borderWidth: 1,
      animatedBorder: false,
      glow: true,
    },
    background: {
      type: "particles",
      color1: "#0f172a",
      color2: "#60a5fa",
      color3: "#0f172a",
    },
    effects: {
      textGlow: true,
      usernameEffect: "none",
    },
  },
  {
    name: "Terminal",
    slug: "terminal",
    tags: ["dark", "tech"],
    hearts: 142,
    gradient: "linear-gradient(135deg,#0a0a0a,#0d1f0d)",
    accent: "#34d399",
    theme: {
      cardStyle: "solid",
      mode: "dark",
      primaryColor: "#34d399",
      textColor: "#34d399",
      mutedTextColor: "#065f46",
      fontFamily: "mono",
      cardOpacity: 0.95,
      borderRadius: 8,
      borderWidth: 1.5,
      animatedBorder: false,
      glow: false,
    },
    background: {
      type: "grid",
      color1: "#051505",
      color2: "#34d399",
      color3: "#051505",
    },
    effects: {
      textGlow: false,
      usernameEffect: "none",
    },
  },
  {
    name: "Pastel Soft",
    slug: "pastel-soft",
    tags: ["light", "cute"],
    hearts: 138,
    gradient: "linear-gradient(135deg,#fce4ec,#f8bbd0)",
    accent: "#ec4899",
    theme: {
      cardStyle: "solid",
      mode: "light",
      primaryColor: "#ec4899",
      textColor: "#ec4899",
      mutedTextColor: "#f472b6",
      cardOpacity: 0.9,
      borderRadius: 28,
      borderWidth: 0,
      animatedBorder: false,
      glow: false,
    },
    background: {
      type: "gradient",
      color1: "#fff1f2",
      color2: "#ffe4e6",
      color3: "#fff1f2",
    },
    effects: {
      textGlow: false,
      usernameEffect: "none",
    },
  },
  {
    name: "Crimson",
    slug: "crimson",
    tags: ["dark", "red"],
    hearts: 201,
    gradient: "linear-gradient(135deg,#1a0000,#2d0000)",
    accent: "#dc2626",
    theme: {
      cardStyle: "sleek",
      mode: "dark",
      primaryColor: "#dc2626",
      textColor: "#ffffff",
      mutedTextColor: "#ef4444",
      cardOpacity: 0.5,
      cardBlur: 20,
      borderRadius: 22,
      borderWidth: 1,
      animatedBorder: false,
      glow: true,
    },
    background: {
      type: "starfield",
      color1: "#1a0000",
      color2: "#dc2626",
      color3: "#1a0000",
    },
    effects: {
      textGlow: true,
      usernameEffect: "glow",
    },
  },
];

function buildDemoConfig(t: (typeof TEMPLATES)[number]): ProfileConfig {
  const base = normalizeConfig(brazyProfile);
  return {
    ...base,
    theme: { ...base.theme, ...t.theme } as ProfileConfig["theme"],
    background: { ...base.background, ...t.background } as ProfileConfig["background"],
    effects: { ...base.effects, ...t.effects } as ProfileConfig["effects"],
  };
}

export default function TemplatesPreviewPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.slug === selected) ?? null;

  return (
    <div style={{ minHeight: "100vh", background: "#050507", color: "#e2e8f0", fontFamily: F }}>
      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,5,7,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center" }}>
              <ArrowLeft style={{ width: 16, height: 16 }} />
            </Link>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.02em" }}>brazy templates</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Pick a vibe. Make it yours.</p>
            </div>
          </div>
          <Link href="/register" style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fafafa", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            Get started
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 900, color: "#fafafa", letterSpacing: "-0.04em", lineHeight: 1.1 }}>Start with a template</h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Every great profile starts somewhere. Choose a look, then tweak colors, effects, and widgets to make it yours.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {TEMPLATES.map((t) => {
            const isSelected = selected === t.slug;
            return (
              <div
                key={t.slug}
                onClick={() => setSelected(t.slug)}
                style={{
                  borderRadius: 18,
                  border: `1px solid ${isSelected ? `${t.accent}66` : "rgba(255,255,255,0.07)"}`,
                  background: isSelected ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color .15s, background .15s",
                }}
              >
                {/* Thumbnail */}
                <div style={{ height: 120, background: t.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${t.accent}44`, border: `2px solid ${t.accent}66` }} />
                    <div style={{ width: 56, height: 6, borderRadius: 99, background: `${t.accent}55` }} />
                    <div style={{ width: 40, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
                    <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{ width: 16, height: 16, borderRadius: 5, background: `${t.accent}33`, border: `1px solid ${t.accent}44` }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.4)", borderRadius: 99, padding: "3px 8px" }}>
                    <Heart style={{ width: 10, height: 10, color: t.accent }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>{t.hearts}</span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 800, color: "#fafafa" }}>{t.name}</p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                    {t.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: `${t.accent}15`, color: t.accent, fontWeight: 700, border: `1px solid ${t.accent}25` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(t.slug); }}
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: 10,
                      background: isSelected ? `${t.accent}22` : `${t.accent}12`,
                      border: `1px solid ${isSelected ? t.accent + "55" : t.accent + "28"}`,
                      color: t.accent,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      fontFamily: F,
                      transition: "all .15s",
                    }}
                  >
                    {isSelected ? "Previewing" : "Preview"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview pane */}
        {template && (
          <div style={{ marginTop: 28, borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#fafafa" }}>{template.name} preview</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>This is how your profile could look.</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/register"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fafafa",
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Sign up free
                </Link>
                <Link
                  href="/customize"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: `${template.accent}18`,
                    border: `1px solid ${template.accent}44`,
                    color: template.accent,
                    fontSize: 12,
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Use this template
                </Link>
              </div>
            </div>

            {/* Live mini profile */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "#08070d", padding: 16, overflow: "hidden" }}>
              <ProfileRenderer config={buildDemoConfig(template)} username="brazy" />
            </div>

            {applied === template.slug && (
              <p style={{ margin: "10px 0 0", fontSize: 12, color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}>
                <Check style={{ width: 14, height: 14 }} /> Template applied to your profile
              </p>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 28, textAlign: "center" }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Free to use. No paywalls. No gimmicks.</p>
          <Link href="/register" style={{ padding: "10px 18px", borderRadius: 12, background: "#fafafa", color: "#050507", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>
            Create your brazy profile
          </Link>
        </div>
      </div>
    </div>
  );
}