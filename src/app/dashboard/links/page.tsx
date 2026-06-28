"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, GripVertical, Link2, Check,
  Globe, Eye, EyeOff, LayoutGrid, AlignLeft, X,
} from "lucide-react";
import {
  FaXTwitter, FaInstagram, FaYoutube, FaGithub,
  FaDiscord, FaSpotify, FaTiktok, FaTwitch,
  FaLinkedin, FaTelegram, FaSnapchat, FaReddit,
} from "react-icons/fa6";

const F = "Satoshi, system-ui, sans-serif";

const PLATFORMS = [
  { value: "twitter",   label: "Twitter / X",  Icon: FaXTwitter,  color: "#e7e9ea",  placeholder: "https://x.com/username" },
  { value: "instagram", label: "Instagram",    Icon: FaInstagram, color: "#E1306C",  placeholder: "https://instagram.com/username" },
  { value: "youtube",   label: "YouTube",      Icon: FaYoutube,   color: "#FF0000",  placeholder: "https://youtube.com/@channel" },
  { value: "github",    label: "GitHub",       Icon: FaGithub,    color: "#fafafa",  placeholder: "https://github.com/username" },
  { value: "discord",   label: "Discord",      Icon: FaDiscord,   color: "#5865F2",  placeholder: "https://discord.gg/invite" },
  { value: "spotify",   label: "Spotify",      Icon: FaSpotify,   color: "#1DB954",  placeholder: "https://open.spotify.com/user/..." },
  { value: "tiktok",    label: "TikTok",       Icon: FaTiktok,    color: "#ff0050",  placeholder: "https://tiktok.com/@username" },
  { value: "twitch",    label: "Twitch",       Icon: FaTwitch,    color: "#9146FF",  placeholder: "https://twitch.tv/username" },
  { value: "linkedin",  label: "LinkedIn",     Icon: FaLinkedin,  color: "#0A66C2",  placeholder: "https://linkedin.com/in/username" },
  { value: "telegram",  label: "Telegram",     Icon: FaTelegram,  color: "#2AABEE",  placeholder: "https://t.me/username" },
  { value: "snapchat",  label: "Snapchat",     Icon: FaSnapchat,  color: "#FFFC00",  placeholder: "https://snapchat.com/add/username" },
  { value: "reddit",    label: "Reddit",       Icon: FaReddit,    color: "#FF4500",  placeholder: "https://reddit.com/u/username" },
  { value: "website",   label: "Website",      Icon: Globe,       color: "#dc2626",  placeholder: "https://yourwebsite.com" },
];

type SocialLink = { id: string; platform: string; url: string; visible: boolean };
type DisplayMode = "full" | "icons";
type LinkCustom = {
  monochrome: boolean;
  glow: boolean;
  iconColor: string;
  glowStrength: number;
  iconSize: number;
};

function getPlatform(value: string) {
  return PLATFORMS.find(p => p.value === value) ?? PLATFORMS[12];
}

function LinkIcon({ platform, custom, size = 15 }: {
  platform: ReturnType<typeof getPlatform>;
  custom: LinkCustom;
  size?: number;
}) {
  const { Icon, color } = platform;
  const iconColor = custom.monochrome ? custom.iconColor : color;
  const glowStyle = custom.glow ? { filter: `drop-shadow(0 0 ${custom.glowStrength * 4}px ${iconColor})` } : {};
  const scaledSize = Math.round(size * (custom.iconSize / 100));
  return <Icon style={{ width: scaledSize, height: scaledSize, color: iconColor, flexShrink: 0, ...glowStyle }} />;
}

function AddLinkDialog({ open, onClose, onAdd }: {
  open: boolean;
  onClose: () => void;
  onAdd: (platform: string, url: string) => void;
}) {
  const [platform, setPlatform] = useState("website");
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setPlatform("website"); setUrl(""); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  if (!open) return null;
  const p = getPlatform(platform);

  const handleAdd = () => {
    if (!url.trim()) return;
    onAdd(platform, url.trim());
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, borderRadius: 20, background: "#111", border: "1px solid rgba(255,255,255,0.09)", padding: 24, fontFamily: F }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fafafa" }}>Add a link</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Choose a platform and paste your URL.</p>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />
          </button>
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Platform</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 16 }}>
          {PLATFORMS.map(pl => {
            const { Icon, color } = pl;
            const active = platform === pl.value;
            return (
              <button key={pl.value} onClick={() => setPlatform(pl.value)} title={pl.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 6px", borderRadius: 12, cursor: "pointer", border: active ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.06)", background: active ? `${color}18` : "rgba(255,255,255,0.02)", transition: "all 0.12s" }}>
                <Icon style={{ width: 16, height: 16, color: active ? color : "rgba(255,255,255,0.4)" }} />
                <span style={{ fontSize: 9, color: active ? color : "rgba(255,255,255,0.3)", fontWeight: 600, textAlign: "center", lineHeight: 1.2, fontFamily: F }}>{pl.label.split(" / ")[0]}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>URL</p>
        <input ref={inputRef} value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder={p.placeholder} style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Cancel</button>
          <button onClick={handleAdd} disabled={!url.trim()} style={{ flex: 2, padding: "10px", borderRadius: 12, background: url.trim() ? "linear-gradient(135deg,#dc2626,#e11d48)" : "rgba(255,255,255,0.04)", border: "none", color: url.trim() ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 600, cursor: url.trim() ? "pointer" : "default", fontFamily: F }}>Add link</button>
        </div>
      </div>
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ width: 44, height: 22, borderRadius: 99, cursor: "pointer", border: "none", padding: 2, background: checked ? "#dc2626" : "rgba(255,255,255,0.1)", transition: "background 0.2s", display: "flex", alignItems: "center", flexShrink: 0 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", transform: checked ? "translateX(22px)" : "translateX(0)", transition: "transform 0.2s", display: "block", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    </button>
  );
}

function Slider({ min, max, value, onChange, format = (v: number) => String(v) }: {
  min: number; max: number; value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{format(value)}</span>
      <div style={{ position: "relative", height: 22, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: "#dc2626", borderRadius: 99 }} />
        </div>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} style={{ position: "absolute", left: 0, right: 0, width: "100%", opacity: 0, cursor: "pointer", height: 22, margin: 0 }} />
        <div style={{ position: "absolute", left: `calc(${pct}% - 10px)`, width: 20, height: 20, borderRadius: "50%", background: "#dc2626", border: "2px solid #fff", boxShadow: "0 1px 6px rgba(220,38,38,0.4)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>{title}</p>
        {description && <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function LinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [mode, setMode] = useState<DisplayMode>("full");
  const [custom, setCustom] = useState<LinkCustom>({ monochrome: false, glow: false, iconColor: "#dc2626", glowStrength: 2, iconSize: 100 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const { data: profile } = await supabase.from("profiles").select("config").eq("id", user.id).maybeSingle();
        const social = profile?.config?.social;
        if (Array.isArray(social?.links)) {
          setLinks(social.links.map((l: SocialLink) => ({ ...l, visible: l.visible !== false })));
        }
        if (social?.display_mode) setMode(social.display_mode);
        if (social?.link_custom) setCustom((prev) => ({ ...prev, ...social.link_custom }));
      } catch {}
    })();
  }, []);

  const addLink = (platform: string, url: string) =>
    setLinks(prev => [...prev, { id: Math.random().toString(36).slice(2), platform, url, visible: true }]);

  const updateLink = (id: string, field: keyof SocialLink, value: string | boolean) =>
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));

  const removeLink = (id: string) =>
    setLinks(prev => prev.filter(l => l.id !== id));

  const setCustomField = <K extends keyof LinkCustom>(k: K, v: LinkCustom[K]) =>
    setCustom(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      if (!supabase) return;
      const { data: profile } = await supabase.from("profiles").select("config").eq("id", userId).maybeSingle();
      const config = profile?.config ?? {};
      await supabase.from("profiles").update({
        config: { ...config, social: { ...(config.social ?? {}), links, display_mode: mode, link_custom: custom } }
      }).eq("id", userId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    finally { setSaving(false); }
  };

  const MAX_LINKS = 25;
  const count = links.length;

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>

      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Profile Links</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Add the links that appear on your profile and tweak how they look.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 12, background: "linear-gradient(135deg,#dc2626,#e11d48)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "default" : "pointer", fontFamily: F, boxShadow: "0 4px 14px rgba(220,38,38,0.25)", flexShrink: 0, opacity: saving ? 0.7 : 1 }}
        >
          {saved ? <><Check style={{ width: 13, height: 13 }} />&nbsp;Saved!</> : saving ? "Saving…" : "Save changes"}
        </button>
      </header>

      <Card>
        <CardHeader
          title={`Your links (${count}/${MAX_LINKS})`}
          description="Drag to reorder. Disabled links won't appear on your page."
          action={
            <button
              onClick={() => setDialogOpen(true)}
              disabled={count >= MAX_LINKS}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: count >= MAX_LINKS ? "default" : "pointer", fontFamily: F, flexShrink: 0, opacity: count >= MAX_LINKS ? 0.5 : 1 }}
            >
              <Plus style={{ width: 13, height: 13 }} /> Add link
            </button>
          }
        />
        <div style={{ padding: "16px 24px 20px" }}>
          {links.length === 0 ? (
            <div style={{ borderRadius: 16, border: "2px dashed rgba(255,255,255,0.07)", padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Link2 style={{ width: 22, height: 22, color: "rgba(255,255,255,0.15)" }} />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>No links yet.</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Add your first link so visitors can reach you elsewhere.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {links.map(link => {
                const platform = getPlatform(link.platform);
                return (
                  <div key={link.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, background: link.visible ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)", border: `1px solid ${link.visible ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`, opacity: link.visible ? 1 : 0.45, transition: "opacity 0.15s, border-color 0.15s" }}>
                    <GripVertical style={{ width: 13, height: 13, color: "rgba(255,255,255,0.15)", flexShrink: 0, cursor: "grab" }} />
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${custom.monochrome ? custom.iconColor : platform.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LinkIcon platform={platform} custom={custom} size={14} />
                    </div>
                    <select value={link.platform} onChange={e => updateLink(link.id, "platform", e.target.value)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 8px", fontSize: 11, color: "#fafafa", fontFamily: F, outline: "none", cursor: "pointer", flexShrink: 0 }}>
                      {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    <input value={link.url} onChange={e => updateLink(link.id, "url", e.target.value)} placeholder={platform.placeholder} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#fafafa", fontFamily: F, outline: "none", minWidth: 0 }} />
                    <button onClick={() => updateLink(link.id, "visible", !link.visible)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                      {link.visible ? <Eye style={{ width: 12, height: 12, color: "rgba(255,255,255,0.4)" }} /> : <EyeOff style={{ width: 12, height: 12, color: "rgba(255,255,255,0.2)" }} />}
                    </button>
                    <button onClick={() => removeLink(link.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                      <Trash2 style={{ width: 12, height: 12, color: "#ef4444" }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Links customization" description="Control how link icons look on your page." />
        <div style={{ padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Display mode</p>
            <div style={{ display: "flex", gap: 8 }}>
              {(["full", "icons"] as DisplayMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", border: mode === m ? "1px solid rgba(220,38,38,0.45)" : "1px solid rgba(255,255,255,0.07)", background: mode === m ? "rgba(220,38,38,0.1)" : "rgba(255,255,255,0.03)", color: mode === m ? "#dc2626" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>
                  {m === "full" ? <AlignLeft style={{ width: 13, height: 13 }} /> : <LayoutGrid style={{ width: 13, height: 13 }} />}
                  {m === "full" ? "Full buttons" : "Icons only"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fafafa" }}>Monochrome icons</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Render all link icons in a single color.</p>
              <Switch checked={custom.monochrome} onChange={v => setCustomField("monochrome", v)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fafafa" }}>Icon glow</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Add a soft glow behind your link icons.</p>
              <Switch checked={custom.glow} onChange={v => setCustomField("glow", v)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fafafa" }}>Icon color</p>
              <div style={{ display: "flex", alignItems: "stretch", height: 36 }}>
                <label style={{ width: 40, borderRadius: "10px 0 0 10px", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
                  <span style={{ display: "block", width: "100%", height: "100%", background: custom.iconColor }} />
                  <input type="color" value={custom.iconColor} onChange={e => setCustomField("iconColor", e.target.value)} style={{ opacity: 0, position: "absolute", pointerEvents: "none" }} />
                </label>
                <input value={custom.iconColor} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setCustomField("iconColor", e.target.value); }} maxLength={7} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "none", borderRadius: "0 10px 10px 0", padding: "0 10px", fontSize: 12, color: "#fafafa", fontFamily: F, outline: "none" }} />
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fafafa" }}>Glow strength</p>
              <Slider min={1} max={3} value={custom.glowStrength} onChange={v => setCustomField("glowStrength", v)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fafafa" }}>Icon size</p>
              <Slider min={50} max={150} value={custom.iconSize} onChange={v => setCustomField("iconSize", v)} format={v => `${v}%`} />
            </div>
          </div>

        </div>
      </Card>

      <AddLinkDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={addLink} />
    </div>
  );
}
