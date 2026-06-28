"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig } from "@/lib/profile/schema";
import {
  Plus, Trash2, GripVertical, Link2, Check,
  Globe, Eye, EyeOff, LayoutGrid, AlignLeft, X, Save,
} from "lucide-react";
import {
  FaXTwitter, FaInstagram, FaYoutube, FaGithub,
  FaDiscord, FaSpotify, FaTiktok, FaTwitch,
  FaLinkedin, FaTelegram, FaSnapchat, FaReddit,
  FaBluesky, FaSteam, FaPaypal, FaSoundcloud,
} from "react-icons/fa6";
import { SiThreads, SiMastodon, SiKick, SiRoblox } from "react-icons/si";

const F = "Satoshi, system-ui, sans-serif";

const PLATFORMS = [
  { value: "twitter",     label: "Twitter / X",   Icon: FaXTwitter,   color: "#e7e9ea",  placeholder: "https://x.com/username" },
  { value: "instagram",   label: "Instagram",      Icon: FaInstagram,  color: "#E1306C",  placeholder: "https://instagram.com/username" },
  { value: "tiktok",      label: "TikTok",         Icon: FaTiktok,     color: "#ff0050",  placeholder: "https://tiktok.com/@username" },
  { value: "youtube",     label: "YouTube",        Icon: FaYoutube,    color: "#FF0000",  placeholder: "https://youtube.com/@channel" },
  { value: "twitch",      label: "Twitch",         Icon: FaTwitch,     color: "#9146FF",  placeholder: "https://twitch.tv/username" },
  { value: "discord",     label: "Discord",        Icon: FaDiscord,    color: "#5865F2",  placeholder: "https://discord.gg/invite" },
  { value: "github",      label: "GitHub",         Icon: FaGithub,     color: "#fafafa",  placeholder: "https://github.com/username" },
  { value: "spotify",     label: "Spotify",        Icon: FaSpotify,    color: "#1DB954",  placeholder: "https://open.spotify.com/user/..." },
  { value: "reddit",      label: "Reddit",         Icon: FaReddit,     color: "#FF4500",  placeholder: "https://reddit.com/u/username" },
  { value: "telegram",    label: "Telegram",       Icon: FaTelegram,   color: "#2AABEE",  placeholder: "https://t.me/username" },
  { value: "snapchat",    label: "Snapchat",       Icon: FaSnapchat,   color: "#FFFC00",  placeholder: "https://snapchat.com/add/username" },
  { value: "linkedin",    label: "LinkedIn",       Icon: FaLinkedin,   color: "#0A66C2",  placeholder: "https://linkedin.com/in/username" },
  { value: "bluesky",     label: "Bluesky",        Icon: FaBluesky,    color: "#0085ff",  placeholder: "https://bsky.app/profile/username" },
  { value: "threads",     label: "Threads",        Icon: SiThreads,    color: "#fafafa",  placeholder: "https://threads.net/@username" },
  { value: "mastodon",    label: "Mastodon",       Icon: SiMastodon,   color: "#6364FF",  placeholder: "https://mastodon.social/@username" },
  { value: "soundcloud",  label: "SoundCloud",     Icon: FaSoundcloud, color: "#FF5500",  placeholder: "https://soundcloud.com/username" },
  { value: "steam",       label: "Steam",          Icon: FaSteam,      color: "#c7d5e0",  placeholder: "https://steamcommunity.com/id/username" },
  { value: "roblox",      label: "Roblox",         Icon: SiRoblox,     color: "#e8e8e8",  placeholder: "https://roblox.com/users/..." },
  { value: "paypal",      label: "PayPal",         Icon: FaPaypal,     color: "#003087",  placeholder: "https://paypal.me/username" },
  { value: "kick",        label: "Kick",           Icon: SiKick,       color: "#53fc18",  placeholder: "https://kick.com/username" },
  { value: "website",     label: "Website",        Icon: Globe,        color: "#dc2626",  placeholder: "https://yourwebsite.com" },
];

type SocialLink = { id: string; platform: string; url: string; label: string; visible: boolean; color: string };
type DisplayMode = "full" | "icons";
type LinkCustom = { monochrome: boolean; glow: boolean; iconColor: string; glowStrength: number; iconSize: number };

function getPlatform(value: string) {
  return PLATFORMS.find(p => p.value === value) ?? PLATFORMS[PLATFORMS.length - 1];
}

function LinkIcon({ platform, custom, size = 15 }: { platform: ReturnType<typeof getPlatform>; custom: LinkCustom; size?: number }) {
  const { Icon, color } = platform;
  const iconColor = custom.monochrome ? custom.iconColor : color;
  const glowStyle = custom.glow ? { filter: `drop-shadow(0 0 ${custom.glowStrength * 4}px ${iconColor})` } : {};
  const scaledSize = Math.round(size * (custom.iconSize / 100));
  return <Icon style={{ width: scaledSize, height: scaledSize, color: iconColor, flexShrink: 0, ...glowStyle }} />;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 99, cursor: "pointer", border: "none", padding: 2, background: checked ? "#dc2626" : "rgba(255,255,255,0.1)", transition: "background 0.2s", display: "flex", alignItems: "center", flexShrink: 0 }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transform: checked ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)", display: "block", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
    </button>
  );
}

function Slider({ min, max, value, onChange, format = (v: number) => String(v) }: {
  min: number; max: number; value: number; onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, position: "relative", height: 22, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
          <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#dc2626,#e11d48)", borderRadius: 99 }} />
        </div>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: 22, margin: 0 }} />
        <div style={{ position: "absolute", left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: "50%", background: "#dc2626", border: "2px solid #fff", boxShadow: "0 1px 6px rgba(220,38,38,0.5)", pointerEvents: "none" }} />
      </div>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 32, textAlign: "right", flexShrink: 0 }}>{format(value)}</span>
    </div>
  );
}

function AddLinkDialog({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (link: Omit<SocialLink, "id" | "visible">) => void;
}) {
  const [platform, setPlatform] = useState("website");
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setPlatform("website"); setUrl(""); setLabel(""); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  if (!open) return null;
  const p = getPlatform(platform);

  const handleAdd = () => {
    if (!url.trim()) return;
    onAdd({ platform, url: url.trim(), label: label.trim() || p.label, color: p.color });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, borderRadius: 24, background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.09)", padding: 28, fontFamily: F, boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fafafa" }}>Add a link</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Choose a platform and paste your URL.</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />
          </button>
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Platform</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 18, maxHeight: 240, overflowY: "auto" }}>
          {PLATFORMS.map(pl => {
            const { Icon, color } = pl;
            const active = platform === pl.value;
            return (
              <button key={pl.value} onClick={() => setPlatform(pl.value)} title={pl.label}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 6px", borderRadius: 12, cursor: "pointer", border: active ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.06)", background: active ? `${color}18` : "rgba(255,255,255,0.02)", transition: "all 0.12s" }}>
                <Icon style={{ width: 16, height: 16, color: active ? color : "rgba(255,255,255,0.35)" }} />
                <span style={{ fontSize: 9, color: active ? color : "rgba(255,255,255,0.25)", fontWeight: 600, textAlign: "center", lineHeight: 1.2, fontFamily: F }}>{pl.label.split(" / ")[0]}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>URL</p>
        <input ref={inputRef} value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder={p.placeholder}
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", marginBottom: 10 }}
          onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.5)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
        />
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Label (optional)</p>
        <input value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder={p.label}
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", marginBottom: 20 }}
          onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.5)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Cancel</button>
          <button onClick={handleAdd} disabled={!url.trim()}
            style={{ flex: 2, padding: "11px", borderRadius: 12, background: url.trim() ? "linear-gradient(135deg,#dc2626,#e11d48)" : "rgba(255,255,255,0.04)", border: "none", color: url.trim() ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 700, cursor: url.trim() ? "pointer" : "default", fontFamily: F, boxShadow: url.trim() ? "0 4px 16px rgba(220,38,38,0.3)" : "none" }}>
            Add link
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [mode, setMode] = useState<DisplayMode>("full");
  const [custom, setCustom] = useState<LinkCustom>({ monochrome: false, glow: false, iconColor: "#dc2626", glowStrength: 2, iconSize: 100 });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const { data: profile } = await supabase.from("profiles").select("config").eq("user_id", user.id).maybeSingle();
        const cfg = normalizeConfig(profile?.config ?? {});
        if (cfg.social.links.length > 0) {
          setLinks(cfg.social.links.map((l, i) => ({
            id: `link-${i}-${l.platform}`,
            platform: l.platform,
            url: l.url,
            label: l.label,
            color: l.color || getPlatform(l.platform).color,
            visible: true,
          })));
        }
        // Legacy: check old format
        const legacy = (profile?.config as Record<string, unknown>)?.social as Record<string, unknown> | undefined;
        if (legacy?.display_mode) setMode(legacy.display_mode as DisplayMode);
        if (legacy?.link_custom) setCustom(prev => ({ ...prev, ...(legacy.link_custom as Partial<LinkCustom>) }));
      } catch {}
    })();
  }, []);

  const scheduleSave = useCallback((nextLinks: SocialLink[], nextMode: DisplayMode, nextCustom: LinkCustom) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (savingRef.current || !userId) { setSaveStatus("idle"); return; }
      savingRef.current = true;
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: profile } = await supabase.from("profiles").select("config").eq("user_id", userId).maybeSingle();
        const cfg = normalizeConfig(profile?.config ?? {});
        const newCfg = {
          ...cfg,
          social: {
            ...cfg.social,
            links: nextLinks.map(l => ({ platform: l.platform as "discord", url: l.url, label: l.label, color: l.color })),
            layout: nextMode === "icons" ? ("grid" as const) : ("wrap" as const),
          },
        };
        await supabase.from("profiles").upsert({ user_id: userId, config: newCfg, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
      finally { savingRef.current = false; }
    }, 600);
  }, [userId]);

  const addLink = (link: Omit<SocialLink, "id" | "visible">) => {
    const next = [...links, { ...link, id: Math.random().toString(36).slice(2), visible: true }];
    setLinks(next);
    scheduleSave(next, mode, custom);
  };

  const updateLink = (id: string, field: keyof SocialLink, value: string | boolean) => {
    const next = links.map(l => l.id === id ? { ...l, [field]: value } : l);
    setLinks(next);
    scheduleSave(next, mode, custom);
  };

  const removeLink = (id: string) => {
    const next = links.filter(l => l.id !== id);
    setLinks(next);
    scheduleSave(next, mode, custom);
  };

  const setCustomField = <K extends keyof LinkCustom>(k: K, v: LinkCustom[K]) => {
    const next = { ...custom, [k]: v };
    setCustom(next);
    scheduleSave(links, mode, next);
  };

  const setMode2 = (m: DisplayMode) => {
    setMode(m);
    scheduleSave(links, m, custom);
  };

  // Drag to reorder
  const handleDragEnd = () => {
    if (dragIdx !== null && dragOver !== null && dragIdx !== dragOver) {
      const next = [...links];
      const [removed] = next.splice(dragIdx, 1);
      next.splice(dragOver, 0, removed);
      setLinks(next);
      scheduleSave(next, mode, custom);
    }
    setDragIdx(null);
    setDragOver(null);
  };

  const MAX_LINKS = 25;
  const count = links.length;

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Profile Links</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Add the links that appear on your profile.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600, flexShrink: 0 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Auto-saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      {/* Links Card */}
      <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Your links <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>({count}/{MAX_LINKS})</span></p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Drag to reorder. Toggle visibility without deleting.</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            disabled={count >= MAX_LINKS}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: count >= MAX_LINKS ? "default" : "pointer", fontFamily: F, flexShrink: 0, opacity: count >= MAX_LINKS ? 0.5 : 1, transition: "all 0.15s" }}
            onMouseEnter={e => { if (count < MAX_LINKS) (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.1)"; }}
          >
            <Plus style={{ width: 13, height: 13 }} /> Add link
          </button>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
        <div style={{ padding: "16px 24px 20px" }}>
          {links.length === 0 ? (
            <div style={{ borderRadius: 16, border: "2px dashed rgba(255,255,255,0.07)", padding: "52px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Link2 style={{ width: 22, height: 22, color: "rgba(255,255,255,0.15)" }} />
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>No links yet.</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Add your first link so visitors can reach you.</p>
              <button
                onClick={() => setDialogOpen(true)}
                style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg,#dc2626,#e11d48)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: F }}
              >
                <Plus style={{ width: 13, height: 13 }} /> Add your first link
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {links.map((link, idx) => {
                const platform = getPlatform(link.platform);
                const isDragging = dragIdx === idx;
                const isOver = dragOver === idx;
                return (
                  <div
                    key={link.id}
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      borderRadius: 14,
                      background: isDragging ? "rgba(220,38,38,0.06)" : isOver ? "rgba(255,255,255,0.06)" : link.visible ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                      border: `1px solid ${isOver ? "rgba(220,38,38,0.3)" : link.visible ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                      opacity: isDragging ? 0.5 : link.visible ? 1 : 0.45,
                      transition: "all 0.15s",
                      cursor: "grab",
                    }}
                  >
                    <GripVertical style={{ width: 13, height: 13, color: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${custom.monochrome ? custom.iconColor : platform.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LinkIcon platform={platform} custom={custom} size={14} />
                    </div>
                    <select value={link.platform} onChange={e => updateLink(link.id, "platform", e.target.value)}
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 8px", fontSize: 11, color: "#fafafa", fontFamily: F, outline: "none", cursor: "pointer", flexShrink: 0 }}>
                      {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    <input value={link.url} onChange={e => updateLink(link.id, "url", e.target.value)}
                      placeholder={platform.placeholder}
                      style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#fafafa", fontFamily: F, outline: "none", minWidth: 0 }}
                      onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.4)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
                    />
                    <input value={link.label} onChange={e => updateLink(link.id, "label", e.target.value)}
                      placeholder="Label"
                      style={{ width: 90, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#fafafa", fontFamily: F, outline: "none", flexShrink: 0 }}
                      onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.4)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
                    />
                    <button onClick={() => updateLink(link.id, "visible", !link.visible)}
                      style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
                      title={link.visible ? "Hide" : "Show"}>
                      {link.visible
                        ? <Eye style={{ width: 12, height: 12, color: "rgba(255,255,255,0.4)" }} />
                        : <EyeOff style={{ width: 12, height: 12, color: "rgba(255,255,255,0.2)" }} />}
                    </button>
                    <button onClick={() => removeLink(link.id)}
                      style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}>
                      <Trash2 style={{ width: 12, height: 12, color: "#ef4444" }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Customization Card */}
      <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 0" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Link icon style</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Control how link icons look on your public page.</p>
        </div>
        <div style={{ padding: "18px 24px 22px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Display mode */}
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Display mode</p>
            <div style={{ display: "flex", gap: 8 }}>
              {(["full", "icons"] as DisplayMode[]).map(m => (
                <button key={m} onClick={() => setMode2(m)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", border: mode === m ? "1px solid rgba(220,38,38,0.45)" : "1px solid rgba(255,255,255,0.07)", background: mode === m ? "rgba(220,38,38,0.1)" : "rgba(255,255,255,0.03)", color: mode === m ? "#dc2626" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>
                  {m === "full" ? <AlignLeft style={{ width: 13, height: 13 }} /> : <LayoutGrid style={{ width: 13, height: 13 }} />}
                  {m === "full" ? "Full buttons" : "Icons only"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

          {/* Toggles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { key: "monochrome", label: "Monochrome icons", desc: "Render all icons in one color" },
              { key: "glow", label: "Icon glow", desc: "Soft glow behind icons" },
            ].map(item => (
              <div key={item.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fafafa" }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                <Toggle checked={custom[item.key as keyof LinkCustom] as boolean} onChange={v => setCustomField(item.key as keyof LinkCustom, v)} />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fafafa" }}>Icon color</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Used when monochrome is on</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "5px 10px", width: "fit-content" }}>
                <label style={{ cursor: "pointer", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: custom.iconColor, border: "1px solid rgba(255,255,255,0.15)" }} />
                  <input type="color" value={custom.iconColor} onChange={e => setCustomField("iconColor", e.target.value)} style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer" }} />
                </label>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{custom.iconColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#fafafa" }}>Glow strength</p>
              <Slider min={1} max={3} value={custom.glowStrength} onChange={v => setCustomField("glowStrength", v)} />
            </div>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#fafafa" }}>Icon size</p>
              <Slider min={50} max={150} value={custom.iconSize} onChange={v => setCustomField("iconSize", v)} format={v => `${v}%`} />
            </div>
          </div>
        </div>
      </div>

      <AddLinkDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={addLink} />
    </div>
  );
}
