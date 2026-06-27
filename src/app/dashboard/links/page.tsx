"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
  X,
  BarChart3,
  Link2,
  MousePointerClick,
  ChevronUp,
  ChevronDown,
  Pencil,
  CheckCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
  clicks: number;
}

interface SocialPreset {
  id: string;
  name: string;
  emoji: string;
  baseUrl: string;
}

const SOCIAL_PRESETS: SocialPreset[] = [
  { id: "instagram", name: "Instagram", emoji: "📷", baseUrl: "https://instagram.com/" },
  { id: "twitter", name: "Twitter / X", emoji: "🐦", baseUrl: "https://x.com/" },
  { id: "tiktok", name: "TikTok", emoji: "🎵", baseUrl: "https://tiktok.com/@" },
  { id: "youtube", name: "YouTube", emoji: "▶️", baseUrl: "https://youtube.com/@" },
  { id: "twitch", name: "Twitch", emoji: "📺", baseUrl: "https://twitch.tv/" },
  { id: "discord", name: "Discord", emoji: "💬", baseUrl: "https://discord.gg/" },
  { id: "github", name: "GitHub", emoji: "💻", baseUrl: "https://github.com/" },
  { id: "spotify", name: "Spotify", emoji: "🎧", baseUrl: "https://open.spotify.com/user/" },
  { id: "telegram", name: "Telegram", emoji: "✈️", baseUrl: "https://t.me/" },
  { id: "snapchat", name: "Snapchat", emoji: "👻", baseUrl: "https://snapchat.com/add/" },
  { id: "reddit", name: "Reddit", emoji: "🤖", baseUrl: "https://reddit.com/u/" },
  { id: "kick", name: "Kick", emoji: "🦵", baseUrl: "https://kick.com/" },
  { id: "website", name: "Website", emoji: "🌐", baseUrl: "" },
  { id: "custom", name: "Custom", emoji: "🔗", baseUrl: "" },
];

function detectPlatform(url: string): { emoji: string; name: string } {
  const u = url.toLowerCase();
  if (u.includes("instagram")) return { emoji: "📷", name: "Instagram" };
  if (u.includes("x.com") || u.includes("twitter")) return { emoji: "🐦", name: "Twitter" };
  if (u.includes("tiktok")) return { emoji: "🎵", name: "TikTok" };
  if (u.includes("youtube")) return { emoji: "▶️", name: "YouTube" };
  if (u.includes("twitch")) return { emoji: "📺", name: "Twitch" };
  if (u.includes("discord")) return { emoji: "💬", name: "Discord" };
  if (u.includes("github")) return { emoji: "💻", name: "GitHub" };
  if (u.includes("spotify")) return { emoji: "🎧", name: "Spotify" };
  if (u.includes("t.me") || u.includes("telegram")) return { emoji: "✈️", name: "Telegram" };
  if (u.includes("snapchat")) return { emoji: "👻", name: "Snapchat" };
  if (u.includes("reddit")) return { emoji: "🤖", name: "Reddit" };
  if (u.includes("kick")) return { emoji: "🦵", name: "Kick" };
  if (u.startsWith("http")) return { emoji: "🌐", name: "Website" };
  return { emoji: "🔗", name: "Custom" };
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loading, setLoading] = useState(true);
  const [presetModal, setPresetModal] = useState<SocialPreset | null>(null);
  const [presetInput, setPresetInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const userRef = useRef<string | null>(null);
  const linksRef = useRef(links);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);

  useEffect(() => { linksRef.current = links; }, [links]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      userRef.current = user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("config")
        .eq("user_id", user.id)
        .maybeSingle();
      const savedLinks: LinkItem[] = (profile?.config as { links?: LinkItem[] })?.links ?? [];
      setLinks(savedLinks);
      setLoading(false);
    })();
  }, []);

  const doSave = useCallback(async (items: LinkItem[]) => {
    const supabase = createClient();
    const uid = userRef.current;
    if (!supabase || !uid) return;
    if (isSavingRef.current) { pendingSaveRef.current = true; return; }
    isSavingRef.current = true;
    pendingSaveRef.current = false;
    setSaveStatus("saving");
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("config")
        .eq("user_id", uid)
        .maybeSingle();
      const currentConfig = (existing?.config ?? {}) as Record<string, unknown>;
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: uid, config: { ...currentConfig, links: items }, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );
      if (error) { setSaveStatus("error"); return; }
      if (pendingSaveRef.current) { isSavingRef.current = false; doSave(linksRef.current); return; }
      setSaveStatus("saved");
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
      savedFadeRef.current = setTimeout(() => { setSaveStatus("idle"); savedFadeRef.current = null; }, 2000);
    } catch { setSaveStatus("error"); }
    isSavingRef.current = false;
  }, []);

  const scheduleSave = useCallback((items: LinkItem[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      doSave(items);
    }, 800);
  }, [doSave]);

  const addLink = useCallback((title: string, url: string) => {
    const newLink: LinkItem = { id: crypto.randomUUID(), title, url, enabled: true, clicks: 0 };
    setLinks((prev) => {
      const next = [...prev, newLink];
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const toggleLink = useCallback((id: string) => {
    setLinks((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const moveLink = useCallback((index: number, dir: -1 | 1) => {
    setLinks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const saveEdit = useCallback((id: string) => {
    setLinks((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, title: editTitle, url: editUrl } : l));
      scheduleSave(next);
      return next;
    });
    setEditingId(null);
  }, [editTitle, editUrl, scheduleSave]);

  const openPresetModal = useCallback((preset: SocialPreset) => {
    setPresetModal(preset);
    setPresetInput("");
  }, []);

  const confirmPreset = useCallback(() => {
    if (!presetModal || !presetInput.trim()) return;
    const url = presetModal.baseUrl ? `${presetModal.baseUrl}${presetInput.trim()}` : presetInput.trim();
    addLink(presetModal.name, url);
    setPresetModal(null);
    setPresetInput("");
  }, [presetModal, presetInput, addLink]);

  const stats = useMemo(() => ({
    total: links.length,
    active: links.filter((l) => l.enabled).length,
    clicks: links.reduce((sum, l) => sum + l.clicks, 0),
  }), [links]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Links</h1>
          <p className="mt-1 text-sm text-white/40">Manage the links displayed on your profile.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-opacity duration-300 ${
                saveStatus === "saving"
                  ? "border-white/[0.06] bg-[#141414] text-white/60"
                  : saveStatus === "saved"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {saveStatus === "saving" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>
              ) : saveStatus === "saved" ? (
                <><Check className="h-3 w-3" /> Saved</>
              ) : (
                <><AlertCircle className="h-3 w-3" /> Error saving</>
              )}
            </motion.div>
          )}
          <button
            onClick={() => setShowPresets(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" /> Add link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Links", value: stats.total, icon: Link2, color: "from-violet-500/20 to-fuchsia-500/10 border-violet-500/20" },
          { label: "Active Links", value: stats.active, icon: Eye, color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20" },
          { label: "Total Clicks", value: stats.clicks, icon: MousePointerClick, color: "from-amber-500/20 to-orange-500/10 border-amber-500/20" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${stat.color} p-5 backdrop-blur`}
              style={{ backdropFilter: "blur(4px)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/30">{stat.label}</span>
                <Icon className="h-4 w-4 text-white/20" />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Your Links</p>
        </div>

        {links.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-white/[0.08] py-20 text-center"
          >
            <ExternalLink className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/30">No links yet.</p>
            <button
              onClick={() => setShowPresets(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600/80 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500"
            >
              <Plus className="h-4 w-4" /> Add your first link
            </button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {links.map((link, index) => {
                const platform = detectPlatform(link.url);
                const isEditing = editingId === link.id;
                return (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, y: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.97, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className={`group flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-200 ${
                      link.enabled
                        ? "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]"
                        : "border-white/[0.03] bg-white/[0.01] opacity-50"
                    }`}
                    style={{ backdropFilter: link.enabled ? "blur(4px)" : undefined }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveLink(index, -1)}
                        disabled={index === 0}
                        className="text-white/20 transition hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveLink(index, 1)}
                        disabled={index === links.length - 1}
                        className="text-white/20 transition hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-base">
                      {platform.emoji}
                    </span>
                    {isEditing ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                          className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-violet-500/50"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(link.id); if (e.key === "Escape") setEditingId(null); }}
                        />
                        <input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://"
                          className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-violet-500/50"
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(link.id); if (e.key === "Escape") setEditingId(null); }}
                        />
                        <button
                          onClick={() => saveEdit(link.id)}
                          className="rounded-lg p-2 text-emerald-400 transition-all duration-200 hover:bg-emerald-500/10"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center gap-3 min-w-0">
                        <span className="truncate text-sm font-medium text-white/80">{link.title || platform.name}</span>
                        <span className="hidden truncate text-xs text-white/30 sm:block">{link.url}</span>
                      </div>
                    )}
                    {!isEditing && (
                      <>
                        <span className="hidden rounded-lg bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/40 sm:inline-flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3" />
                          {link.clicks}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-white/20 transition-all duration-200 hover:bg-white/[0.04] hover:text-white/60"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => { setEditingId(link.id); setEditTitle(link.title); setEditUrl(link.url); }}
                          className="rounded-lg p-2 text-white/20 transition-all duration-200 hover:bg-white/[0.04] hover:text-white/60"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleLink(link.id)}
                          className={`rounded-lg p-2 transition-all duration-200 ${
                            link.enabled
                              ? "text-emerald-400 hover:bg-emerald-500/10"
                              : "text-white/20 hover:bg-white/5"
                          }`}
                        >
                          {link.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => removeLink(link.id)}
                          className="rounded-lg p-2 text-white/20 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showPresets && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPresets(false); }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6 shadow-2xl"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add a Link</h2>
              <button
                onClick={() => setShowPresets(false)}
                className="rounded-lg p-1.5 text-white/30 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 grid grid-cols-4 gap-2.5 sm:grid-cols-4">
              {SOCIAL_PRESETS.map((preset) => (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openPresetModal(preset)}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3 text-sm text-white/70 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
                >
                  <span className="text-xl">{preset.emoji}</span>
                  <span className="text-[10px] font-medium leading-tight">{preset.name}</span>
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowPresets(false); addLink("Custom Link", ""); }}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3 text-sm text-white/70 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
              >
                <span className="text-xl">🔗</span>
                <span className="text-[10px] font-medium leading-tight">Custom</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {presetModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setPresetModal(null); }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6 shadow-2xl"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-2xl">{presetModal.emoji}</span>
              <div>
                <h3 className="font-bold text-white">{presetModal.name}</h3>
                {presetModal.baseUrl && (
                  <p className="text-xs text-white/30">{presetModal.baseUrl}</p>
                )}
              </div>
            </div>
            {presetModal.id === "website" || presetModal.id === "custom" ? (
              <div className="space-y-3">
                <p className="text-xs text-white/40">Enter the full URL</p>
                <input
                  value={presetInput}
                  onChange={(e) => setPresetInput(e.target.value)}
                  placeholder={presetModal.id === "website" ? "https://example.com" : "https://"}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-violet-500/50"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") confirmPreset(); }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-white/40">Enter your username</p>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5">
                  {presetModal.baseUrl && (
                    <span className="shrink-0 text-xs text-white/30">{presetModal.baseUrl}</span>
                  )}
                  <input
                    value={presetInput}
                    onChange={(e) => setPresetInput(e.target.value)}
                    placeholder="username"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") confirmPreset(); }}
                  />
                </div>
              </div>
            )}
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setPresetModal(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/50 transition-all duration-200 hover:border-white/[0.15] hover:text-white/70"
              >
                Cancel
              </button>
              <button
                onClick={confirmPreset}
                disabled={!presetInput.trim()}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 disabled:opacity-40"
              >
                Add link
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
