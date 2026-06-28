"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus, Trash2, GripVertical, Link2, Check,
  Globe, Eye, EyeOff, LayoutGrid, AlignLeft, X, Save, Sparkles, HelpCircle,
} from "lucide-react";
import {
  FaXTwitter, FaInstagram, FaYoutube, FaGithub,
  FaDiscord, FaSpotify, FaTiktok, FaTwitch,
  FaLinkedin, FaTelegram, FaSnapchat, FaReddit,
  FaBluesky, FaSteam, FaPaypal, FaSoundcloud,
} from "react-icons/fa6";
import { SiThreads, SiMastodon, SiKick, SiRoblox } from "react-icons/si";

import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";

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
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${checked ? "bg-red-600" : "bg-neutral-800"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function Slider({ min, max, value, onChange, format = (v: number) => String(v) }: {
  min: number; max: number; value: number; onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative flex-1 h-5 flex items-center">
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-neutral-800">
          <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-5 opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-4.5 h-4.5 rounded-full bg-red-600 border-2 border-white shadow-md pointer-events-none transition-all duration-75"
          style={{ left: `calc(${pct}% - 9px)` }}
        />
      </div>
      <span className="text-xs text-neutral-500 font-medium min-w-[32px] text-right">{format(value)}</span>
    </div>
  );
}

export default function LinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [mode, setMode] = useState<DisplayMode>("full");
  const [custom, setCustom] = useState<LinkCustom>({ monochrome: false, glow: false, iconColor: "#dc2626", glowStrength: 2, iconSize: 100 });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Modal State
  const [activePlatformVal, setActivePlatformVal] = useState<string | null>(null);
  const [modalUrl, setModalUrl] = useState("");
  const [modalLabel, setModalLabel] = useState("");
  
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const { userId: uid, config: cfg, profile } = await clientGetProfile();
        setUserId(uid);
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
        const legacy = (profile?.config as Record<string, unknown>)?.social as Record<string, unknown> | undefined;
        if (legacy?.display_mode) setMode(legacy.display_mode as DisplayMode);
        if (legacy?.link_custom) setCustom(prev => ({ ...prev, ...(legacy.link_custom as Partial<LinkCustom>) }));
      } catch (err) {
        console.error("Load links error:", err);
      }
    })();
  }, []);

  const scheduleSave = useCallback((nextLinks: SocialLink[], nextMode: DisplayMode, nextCustom: LinkCustom) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (savingRef.current || !userId) { setSaveStatus("idle"); return; }
      savingRef.current = true;
      try {
        const { config: cfg } = await clientGetProfile();
        const newCfg = {
          ...cfg,
          social: {
            ...cfg.social,
            links: nextLinks.map(l => ({ platform: l.platform as any, url: l.url, label: l.label, color: l.color })),
            layout: nextMode === "icons" ? ("grid" as const) : ("wrap" as const),
          },
        };
        await clientSaveProfile(newCfg);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save links error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
      finally { savingRef.current = false; }
    }, 600);
  }, [userId]);

  const addLink = (platformValue: string, url: string, label: string) => {
    const p = getPlatform(platformValue);
    const next = [...links, {
      id: Math.random().toString(36).slice(2),
      platform: platformValue,
      url: url.trim(),
      label: label.trim() || p.label,
      color: p.color,
      visible: true
    }];
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

  const openAddModal = (platformVal: string) => {
    setActivePlatformVal(platformVal);
    setModalUrl("");
    setModalLabel("");
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlatformVal || !modalUrl.trim()) return;
    addLink(activePlatformVal, modalUrl, modalLabel);
    setActivePlatformVal(null);
  };

  const selectedPlatform = activePlatformVal ? getPlatform(activePlatformVal) : null;
  const count = links.length;
  const MAX_LINKS = 25;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12 select-none">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Link2 className="w-6 h-6 text-red-500" /> Link your social media profiles
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Pick a social platform below to add to your custom public page.</p>
        </div>
        
        {saveStatus !== "idle" && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
            saveStatus === "saved" ? "bg-green-500/10 border-green-500/30 text-green-400" :
            saveStatus === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
            "bg-neutral-900/50 border-neutral-800 text-neutral-400 animate-pulse"
          }`}>
            {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
            {saveStatus === "saving" ? "Saving updates..." : saveStatus === "saved" ? "Saved!" : "Connection error"}
          </div>
        )}
      </div>

      {/* Grid of Platforms (Guns.lol Direct layout) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Available Platforms ({PLATFORMS.length})</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3">
          {PLATFORMS.map(pl => {
            const { Icon, color } = pl;
            const isAdded = links.some(l => l.platform === pl.value);
            return (
              <button
                key={pl.value}
                onClick={() => openAddModal(pl.value)}
                disabled={count >= MAX_LINKS}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border bg-neutral-950 transition duration-200 cursor-pointer group text-center select-none ${
                  isAdded 
                    ? "border-red-600/30 bg-red-600/5 hover:bg-red-600/10" 
                    : "border-neutral-900 hover:border-red-600/30 hover:bg-neutral-900/30"
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 transition duration-200"
                  style={{ backgroundColor: `${color}12` }}
                >
                  <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" style={{ color: color }} />
                </div>
                <span className="text-[11px] font-semibold text-neutral-300 group-hover:text-white transition-colors truncate w-full">
                  {pl.label.split(" / ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Links Listing */}
      <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl overflow-hidden mt-2">
        <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Your Profile Links ({count}/{MAX_LINKS})</h3>
            <p className="text-xs text-neutral-500 mt-1">Drag rows using the handle to change layout ordering. Active links save in real-time.</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {links.length === 0 ? (
            <div className="border border-dashed border-neutral-800 rounded-xl py-12 px-4 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-neutral-600" />
              </div>
              <p className="text-sm font-semibold text-neutral-400">No links added to your page yet</p>
              <p className="text-xs text-neutral-600 max-w-[280px]">Select any platform from the grid above to insert it onto your live bio page.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
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
                    className={`flex items-center gap-3 p-3 rounded-xl border bg-neutral-950 transition duration-150 cursor-grab active:cursor-grabbing ${
                      isDragging ? "opacity-40 border-red-500/50 bg-red-950/10" :
                      isOver ? "border-red-500/30 bg-red-950/5" :
                      "border-neutral-900/60 hover:border-neutral-800"
                    }`}
                  >
                    <div className="text-neutral-600 hover:text-neutral-400 p-1 cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${custom.monochrome ? custom.iconColor : platform.color}15` }}
                    >
                      <LinkIcon platform={platform} custom={custom} size={15} />
                    </div>

                    <select 
                      value={link.platform} 
                      onChange={e => updateLink(link.id, "platform", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs font-semibold text-neutral-200 outline-none cursor-pointer focus:border-red-500/40"
                    >
                      {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label.split(" / ")[0]}</option>)}
                    </select>

                    <input 
                      value={link.url} 
                      onChange={e => updateLink(link.id, "url", e.target.value)}
                      placeholder={platform.placeholder}
                      className="flex-1 bg-neutral-900/60 border border-neutral-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 min-w-0"
                    />

                    <input 
                      value={link.label} 
                      onChange={e => updateLink(link.id, "label", e.target.value)}
                      placeholder="Custom Label"
                      className="w-32 bg-neutral-900/60 border border-neutral-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 shrink-0"
                    />

                    <button 
                      onClick={() => updateLink(link.id, "visible", !link.visible)}
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                        link.visible 
                          ? "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white" 
                          : "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                      }`}
                      title={link.visible ? "Visible on page" : "Hidden on page"}
                    >
                      {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button 
                      onClick={() => removeLink(link.id)}
                      className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 hover:bg-red-600 hover:border-red-600 text-red-500 hover:text-white flex items-center justify-center transition duration-150"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Visual Customization Card */}
      <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl overflow-hidden mt-2">
        <div className="p-5 border-b border-neutral-900">
          <h3 className="text-sm font-bold text-white">Visual Customization</h3>
          <p className="text-xs text-neutral-500 mt-1">Configure exactly how link buttons and icons render on your public profile card.</p>
        </div>

        <div className="p-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Display Layout</label>
            <div className="flex gap-2">
              {(["full", "icons"] as DisplayMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode2(m)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200 border cursor-pointer ${
                    mode === m 
                      ? "bg-red-600/10 border-red-600 text-red-500" 
                      : "bg-neutral-900/50 border-neutral-850 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {m === "full" ? <AlignLeft className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                  {m === "full" ? "Standard Buttons" : "Social Icons Grid"}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-neutral-900" />

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Monochrome Theme</h4>
              <p className="text-xs text-neutral-500">Forces all icons to use a single unified color instead of their original brand color.</p>
              <Toggle checked={custom.monochrome} onChange={v => setCustomField("monochrome", v)} />
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Glow Effects</h4>
              <p className="text-xs text-neutral-500">Enables a subtle, high-end neon aura around the icons matching their brand/monochrome color.</p>
              <Toggle checked={custom.glow} onChange={v => setCustomField("glow", v)} />
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Custom Accent Color</h4>
              <p className="text-xs text-neutral-500">Specify the color to apply to icons when Monochrome is active.</p>
              <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-2.5 w-fit">
                <label className="cursor-pointer relative">
                  <div className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: custom.iconColor }} />
                  <input 
                    type="color" 
                    value={custom.iconColor} 
                    onChange={e => setCustomField("iconColor", e.target.value)} 
                    className="opacity-0 absolute inset-0 cursor-pointer" 
                  />
                </label>
                <span className="text-xs font-mono text-neutral-400 font-semibold">{custom.iconColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-900" />

          {/* Slider Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Icon Glow Strength</h4>
              <Slider min={1} max={3} value={custom.glowStrength} onChange={v => setCustomField("glowStrength", v)} />
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Icon Scaling Size</h4>
              <Slider min={50} max={150} value={custom.iconSize} onChange={v => setCustomField("iconSize", v)} format={v => `${v}%`} />
            </div>
          </div>
        </div>
      </div>

      {/* Add URL Dialog Modal */}
      {activePlatformVal && selectedPlatform && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleModalSubmit}
            className="w-full max-w-md bg-neutral-950 border border-neutral-900 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center" 
                  style={{ backgroundColor: `${selectedPlatform.color}15` }}
                >
                  <selectedPlatform.Icon className="w-4.5 h-4.5" style={{ color: selectedPlatform.color }} />
                </div>
                <h3 className="text-sm font-bold text-white">Add {selectedPlatform.label.split(" / ")[0]}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setActivePlatformVal(null)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-400">Profile URL</label>
                <input 
                  type="text"
                  required
                  value={modalUrl}
                  onChange={e => setModalUrl(e.target.value)}
                  placeholder={selectedPlatform.placeholder}
                  className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-400">Button Label (Optional)</label>
                <input 
                  type="text"
                  value={modalLabel}
                  onChange={e => setModalLabel(e.target.value)}
                  placeholder={selectedPlatform.label}
                  className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-900">
              <button 
                type="button" 
                onClick={() => setActivePlatformVal(null)}
                className="flex-1 bg-neutral-900 border border-neutral-850 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-xl py-2.5 text-xs font-bold transition duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!modalUrl.trim()}
                className="flex-[2] bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white rounded-xl py-2.5 text-xs font-bold transition duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-lg shadow-red-600/10"
              >
                Add Link
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
