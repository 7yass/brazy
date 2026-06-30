"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Loader2, Sparkles, Palette, Link2, Image as ImageIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { brazyProfile } from "@/lib/profile/defaults";
import { normalizeConfig } from "@/lib/profile/schema";
import { checkUsernameAction, registerCompleteAction } from "./actions";
import { SpiderLogo } from "@/components/spider-logo";

type UsernameStatus = "idle" | "invalid" | "checking" | "available" | "taken";

type OnboardingStep = "identity" | "purpose" | "layout" | "theme" | "avatar" | "links" | "complete";

const PROFILE_PURPOSES = [
  { id: "creator", label: "Creator", emoji: "🎨", desc: "Content, art, music" },
  { id: "developer", label: "Developer", emoji: "💻", desc: "Projects, code, GitHub" },
  { id: "streamer", label: "Streamer", emoji: "🎮", desc: "Twitch, YouTube, community" },
  { id: "business", label: "Business", emoji: "💼", desc: "Brand, products, contact" },
  { id: "personal", label: "Personal", emoji: "✨", desc: "Links, bio, vibes" },
];

const LAYOUT_OPTIONS = [
  { id: "modern", label: "Modern", desc: "Clean card-based layout" },
  { id: "sleek", label: "Sleek", desc: "Premium glassmorphism" },
  { id: "minimal", label: "Minimal", desc: "Typography-led, low-glow" },
  { id: "portfolio", label: "Portfolio", desc: "Editorial, content-first" },
];

const THEME_OPTIONS = [
  { id: "obsidian", name: "Obsidian", accent: "#a78bfa", gradient: "linear-gradient(135deg,#1a1a2e,#16213e)" },
  { name: "Crimson", id: "crimson", accent: "#dc2626", gradient: "linear-gradient(135deg,#1a0000,#2d0000)" },
  { name: "Frost", id: "frost", accent: "#60a5fa", gradient: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)" },
  { name: "Emerald", id: "emerald", accent: "#34d399", gradient: "linear-gradient(135deg,#0a0a0a,#0d1f0d)" },
  { name: "Mono", id: "mono", accent: "#94a3b8", gradient: "linear-gradient(135deg,#18181b,#27272a)" },
  { name: "Pastel", id: "pastel", accent: "#ec4899", gradient: "linear-gradient(135deg,#fce4ec,#f8bbd0)" },
];

const THEME_MAP: Record<string, any> = {
  obsidian: { cardStyle: "glass", mode: "dark", primaryColor: "#a78bfa", textColor: "#fafafa", mutedTextColor: "#94a3b8", cardOpacity: 0.5, borderRadius: 22, borderWidth: 1, glow: true },
  crimson: { cardStyle: "sleek", mode: "dark", primaryColor: "#dc2626", textColor: "#ffffff", mutedTextColor: "#ef4444", cardOpacity: 0.5, cardBlur: 20, borderRadius: 22, borderWidth: 1, glow: true },
  frost: { cardStyle: "sleek", mode: "dark", primaryColor: "#60a5fa", textColor: "#ffffff", mutedTextColor: "#93c5fd", cardOpacity: 0.35, cardBlur: 30, borderRadius: 24, borderWidth: 1, glow: true },
  emerald: { cardStyle: "solid", mode: "dark", primaryColor: "#34d399", textColor: "#34d399", mutedTextColor: "#065f46", fontFamily: "mono", cardOpacity: 0.95, borderRadius: 8, borderWidth: 1.5, glow: false },
  mono: { cardStyle: "minimal", mode: "dark", primaryColor: "#94a3b8", textColor: "#fafafa", mutedTextColor: "#71717a", cardOpacity: 0, borderRadius: 0, borderWidth: 0, glow: false },
  pastel: { cardStyle: "solid", mode: "light", primaryColor: "#ec4899", textColor: "#ec4899", mutedTextColor: "#f472b6", cardOpacity: 0.9, borderRadius: 28, borderWidth: 0, glow: false },
};

const LAYOUT_MAP: Record<string, { cardStyle: string; contentAlign?: string }> = {
  modern: { cardStyle: "glass", contentAlign: "center" },
  sleek: { cardStyle: "sleek", contentAlign: "center" },
  minimal: { cardStyle: "minimal", contentAlign: "left" },
  portfolio: { cardStyle: "portfolio", contentAlign: "left" },
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("identity");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [discordConnected, setDiscordConnected] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [purpose, setPurpose] = useState("");
  const [layout, setLayout] = useState("modern");
  const [theme, setTheme] = useState("obsidian");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [links, setLinks] = useState<{ platform: string; url: string; label: string }[]>([{ platform: "website", url: "", label: "" }, { platform: "website", url: "", label: "" }, { platform: "website", url: "", label: "" }]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef<{ id: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        userRef.current = data.user;
        setDiscordConnected(true);
      }
    });
  }, []);

  useEffect(() => {
    const q = username.trim().toLowerCase();
    if (!q) { setStatus("idle"); return; }
    if (!/^[a-z0-9_]{3,20}$/.test(q)) { setStatus("invalid"); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const { available } = await checkUsernameAction(q);
      setStatus(available ? "available" : "taken");
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username]);

  const canClaim = status === "available" && discordConnected;
  const stepIndex = ["identity", "purpose", "layout", "theme", "avatar", "links", "complete"].indexOf(step);
  const progress = Math.max(0, ((stepIndex) / 6) * 100);

  const updateLink = (idx: number, field: "platform" | "url" | "label", value: string) => {
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const detectPlatform = (url: string): string => {
    if (!url) return "website";
    if (url.includes("discord")) return "discord";
    if (url.includes("twitter") || url.includes("x.com")) return "twitter";
    if (url.includes("instagram")) return "instagram";
    if (url.includes("github")) return "github";
    if (url.includes("youtube")) return "youtube";
    if (url.includes("tiktok")) return "tiktok";
    if (url.includes("spotify")) return "spotify";
    if (url.includes("twitch")) return "twitch";
    if (url.includes("telegram")) return "telegram";
    if (url.includes("kick")) return "kick";
    if (url.includes("reddit")) return "reddit";
    if (url.includes("linkedin")) return "linkedin";
    if (url.includes("snapchat")) return "snapchat";
    if (url.includes("roblox")) return "roblox";
    if (url.includes("steam")) return "steam";
    if (url.includes("paypal")) return "paypal";
    if (url.includes("mastodon")) return "mastodon";
    if (url.includes("bluesky")) return "bluesky";
    if (url.includes("threads")) return "threads";
    if (url.includes("soundcloud")) return "soundcloud";
    if (url.includes("email")) return "email";
    return "custom";
  };

  const handleFinish = async () => {
    if (!canClaim || !userRef.current) return;
    setRegistering(true);
    setRegisterError("");
    const key = username.trim().toLowerCase();
    const base = normalizeConfig(brazyProfile);
    const themePatch = THEME_MAP[theme] || THEME_MAP.obsidian;
    const layoutPatch = LAYOUT_MAP[layout] || LAYOUT_MAP.modern;

    const config = {
      ...base,
      identity: {
        ...base.identity,
        username: key,
        displayName: key,
        avatarUrl: avatarUrl || base.identity.avatarUrl,
      },
      theme: { ...base.theme, ...themePatch, ...layoutPatch } as any,
      background: { ...base.background, type: layout === "minimal" ? "none" : base.background.type } as any,
      effects: { ...base.effects, usernameEffect: layout === "minimal" ? "none" : base.effects.usernameEffect } as any,
      social: {
        ...base.social,
        links: links.filter(l => l.url.trim()).map(l => ({ platform: l.platform, url: l.url, label: l.label || l.platform, color: "" })),
      } as any,
    };

    const res = await registerCompleteAction(key, config);
    if (res.error) {
      setRegisterError(res.error);
      setRegistering(false);
    } else {
      router.push("/dashboard");
    }
  };

  const next = () => {
    if (step === "identity" && canClaim) setStep("purpose");
    else if (step === "purpose" && purpose) setStep("layout");
    else if (step === "layout") setStep("theme");
    else if (step === "theme") setStep("avatar");
    else if (step === "avatar") setStep("links");
    else if (step === "links") setStep("complete");
  };

  const prev = () => {
    if (step === "complete") setStep("links");
    else if (step === "links") setStep("avatar");
    else if (step === "avatar") setStep("theme");
    else if (step === "theme") setStep("layout");
    else if (step === "layout") setStep("purpose");
    else if (step === "purpose") setStep("identity");
  };

  const canNext = () => {
    if (step === "identity") return canClaim;
    if (step === "purpose") return !!purpose;
    if (step === "layout") return !!layout;
    if (step === "theme") return !!theme;
    if (step === "avatar") return true;
    if (step === "links") return links.some(l => l.url.trim());
    return true;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "#0a0404",
        fontFamily: "Satoshi, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: 24,
        border: "1px solid rgba(220,38,38,0.12)",
        background: "rgba(15,5,5,0.9)",
        backdropFilter: "blur(20px)",
        padding: "32px 28px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 14,
            background: "rgba(220,38,38,0.12)",
            border: "1px solid rgba(220,38,38,0.25)",
            marginBottom: 14,
            color: "#dc2626",
          }}>
            <SpiderLogo width={22} height={22} />
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>
            {step === "complete" ? "You're all set" : "Create your brazy page"}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
            {step === "identity" && "Start by claiming your username"}
            {step === "purpose" && "What best describes you?"}
            {step === "layout" && "Pick a layout family"}
            {step === "theme" && "Choose a starting theme"}
            {step === "avatar" && "Add an avatar image URL (optional)"}
            {step === "links" && "Add your first links"}
            {step === "complete" && "Your page is ready to go"}
          </p>
        </div>

        {/* Progress bar */}
        {step !== "complete" && (
          <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginBottom: 22, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #dc2626, #e11d48)", borderRadius: 99, transition: "width .3s" }} />
          </div>
        )}

        {/* Step: Identity */}
        {step === "identity" && (
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Your URL</p>
            <div style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 12,
              border: `1px solid ${
                status === "available" ? "rgba(34,197,94,0.3)" :
                status === "taken" || status === "invalid" ? "rgba(220,38,38,0.3)" :
                "rgba(255,255,255,0.08)"
              }`,
              background: "rgba(255,255,255,0.03)",
              padding: "10px 14px",
              transition: "border-color 0.2s",
            }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>brazy.it/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                placeholder="username"
                autoFocus
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fafafa",
                  fontFamily: "inherit",
                }}
              />
              {status === "checking" && <Loader2 style={{ width: 16, height: 16, color: "rgba(255,255,255,0.3)", flexShrink: 0, animation: "spin 1s linear infinite" }} />}
              {status === "available" && <Check style={{ width: 16, height: 16, color: "#22c55e", flexShrink: 0 }} />}
              {(status === "taken" || status === "invalid") && <X style={{ width: 16, height: 16, color: "#dc2626", flexShrink: 0 }} />}
            </div>
            {status !== "idle" && (
              <p style={{ margin: "6px 0 0", fontSize: 12, color:
                status === "available" ? "#22c55e" :
                status === "checking" ? "rgba(255,255,255,0.3)" :
                "#f87171"
              }}>
                {status === "invalid" && "3–20 chars · lowercase letters, numbers, underscores only"}
                {status === "checking" && "Checking availability..."}
                {status === "available" && `brazy.it/${username.trim().toLowerCase()} is yours!`}
                {status === "taken" && "Already taken, try another"}
              </p>
            )}

            {/* Discord connect */}
            <div style={{ marginTop: 18 }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Connect</p>
              {discordConnected ? (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 12,
                  border: "1px solid rgba(34,197,94,0.2)",
                  background: "rgba(34,197,94,0.06)",
                  padding: "10px 14px",
                }}>
                  <Check style={{ width: 16, height: 16, color: "#22c55e" }} />
                  <span style={{ fontSize: 14, color: "#22c55e" }}>Discord connected</span>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    if (!supabase) return;
                    try { localStorage.setItem("brazy_pending_username", username.trim().toLowerCase()); } catch {}
                    await supabase.auth.signInWithOAuth({
                      provider: "discord",
                      options: { redirectTo: `${window.location.origin}/auth/callback?next=/register/complete` },
                    });
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    borderRadius: 12,
                    background: "#5865F2",
                    border: "none",
                    padding: "11px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#4752C4"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#5865F2"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.09ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  Connect with Discord
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step: Purpose */}
        {step === "purpose" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {PROFILE_PURPOSES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                style={{
                  padding: "14px 12px",
                  borderRadius: 14,
                  border: purpose === p.id ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  background: purpose === p.id ? "rgba(220,38,38,0.08)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all .15s",
                }}
              >
                <p style={{ margin: "0 0 2px", fontSize: 18 }}>{p.emoji}</p>
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{p.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step: Layout */}
        {step === "layout" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {LAYOUT_OPTIONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                style={{
                  padding: "14px 12px",
                  borderRadius: 14,
                  border: layout === l.id ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  background: layout === l.id ? "rgba(220,38,38,0.08)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all .15s",
                }}
              >
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{l.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{l.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step: Theme */}
        {step === "theme" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: 0,
                  borderRadius: 14,
                  border: theme === t.id ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  background: theme === t.id ? "rgba(220,38,38,0.08)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all .15s",
                }}
              >
                <div style={{ height: 64, background: t.gradient }} />
                <div style={{ padding: "10px 10px 12px" }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fafafa" }}>{t.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.accent, boxShadow: `0 0 8px ${t.accent}55` }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Preview</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step: Avatar */}
        {step === "avatar" && (
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Avatar URL</p>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "#fafafa",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            {avatarUrl && (
              <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
                <img src={avatarUrl} alt="Avatar preview" style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <p style={{ margin: "10px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>You can skip this and add it later.</p>
          </div>
        )}

        {/* Step: Links */}
        {step === "links" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {links.map((link, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={link.url}
                    onChange={(e) => { updateLink(idx, "url", e.target.value); updateLink(idx, "platform", detectPlatform(e.target.value)); }}
                    placeholder="Link URL"
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: "#fafafa",
                      fontSize: 13,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(idx, "label", e.target.value)}
                    placeholder="Label"
                    style={{
                      width: 110,
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: "#fafafa",
                      fontSize: 13,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                </div>
                {link.platform !== "website" && (
                  <p style={{ margin: "0 0 0 2px", fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "capitalize" }}>Detected: {link.platform}</p>
                )}
              </div>
            ))}
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Add at least one link to get started.</p>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🚀</div>
            <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#fafafa" }}>Your page is ready</p>
            <p style={{ margin: "0 0 18px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>brazy.it/{username.trim().toLowerCase()}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 12, fontWeight: 700 }}>
              <Sparkles style={{ width: 12, height: 12 }} /> Free forever · No paywalls
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          {step !== "identity" && step !== "complete" && (
            <button
              onClick={prev}
              style={{
                flex: 1,
                padding: "11px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "#fafafa",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} /> Back
            </button>
          )}
          {step === "complete" ? (
            <button
              onClick={handleFinish}
              disabled={registering}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                background: registering ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #dc2626, #e11d48)",
                color: registering ? "rgba(255,255,255,0.3)" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: registering ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: !registering ? "0 0 24px rgba(220,38,38,0.3)" : "none",
              }}
            >
              {registering && <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />}
              {registering ? "Creating your page..." : "Launch my page →"}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canNext()}
              style={{
                flex: 1,
                padding: "11px 16px",
                borderRadius: 12,
                border: "none",
                background: canNext() ? "linear-gradient(135deg, #dc2626, #e11d48)" : "rgba(255,255,255,0.05)",
                color: canNext() ? "#fff" : "rgba(255,255,255,0.3)",
                fontSize: 14,
                fontWeight: 700,
                cursor: canNext() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: canNext() ? "0 0 24px rgba(220,38,38,0.3)" : "none",
              }}
            >
              Continue <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {registerError && (
          <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 12, color: "#f87171" }}>{registerError}</p>
        )}

        <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#dc2626", textDecoration: "none" }}>Sign in →</Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
