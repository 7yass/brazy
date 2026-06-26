"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, ExternalLink, Eye, EyeOff } from "lucide-react";

interface LinkItem {
  id: string;
  platform: string;
  url: string;
  label: string;
  enabled: boolean;
}

const platforms = [
  "website", "twitter", "x", "github", "youtube", "twitch", "discord",
  "instagram", "tiktok", "snapchat", "telegram", "whatsapp", "linkedin",
  "facebook", "spotify", "soundcloud", "steam", "reddit", "patreon",
  "kofi", "etsy", "custom",
];

const platformColors: Record<string, string> = {
  discord: "bg-indigo-500/10 text-indigo-400",
  twitter: "bg-sky-500/10 text-sky-400",
  github: "bg-white/5 text-white/50",
  youtube: "bg-red-500/10 text-red-400",
  instagram: "bg-pink-500/10 text-pink-400",
  tiktok: "bg-white/5 text-white/50",
  spotify: "bg-emerald-500/10 text-emerald-400",
  twitch: "bg-purple-500/10 text-purple-400",
  telegram: "bg-blue-500/10 text-blue-400",
  whatsapp: "bg-emerald-500/10 text-emerald-400",
  linkedin: "bg-blue-500/10 text-blue-400",
  facebook: "bg-blue-500/10 text-blue-400",
  soundcloud: "bg-orange-500/10 text-orange-400",
  steam: "bg-white/5 text-white/50",
  reddit: "bg-orange-500/10 text-orange-400",
  patreon: "bg-orange-500/10 text-orange-400",
  kofi: "bg-yellow-500/10 text-yellow-400",
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", platform: "github", url: "https://github.com", label: "GitHub", enabled: true },
    { id: "2", platform: "twitter", url: "https://twitter.com", label: "Twitter", enabled: true },
    { id: "3", platform: "spotify", url: "https://open.spotify.com", label: "Spotify", enabled: false },
  ]);

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      platform: "custom",
      url: "",
      label: "",
      enabled: true,
    };
    setLinks([...links, newLink]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: string, key: keyof LinkItem, value: string | boolean) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  };

  const toggleLink = (id: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...links];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setLinks(arr);
  };

  const moveDown = (index: number) => {
    if (index === links.length - 1) return;
    const arr = [...links];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setLinks(arr);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Links</h1>
          <p className="mt-1 text-sm text-white/40">
            Manage the links displayed on your profile. Drag to reorder.
          </p>
        </div>
        <button
          onClick={addLink}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          Add link
        </button>
      </div>

      <div className="space-y-2">
        {links.map((link, index) => {
          const colorClass = platformColors[link.platform] || "bg-violet-500/10 text-violet-400";
          return (
            <div
              key={link.id}
              className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                link.enabled
                  ? "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                  : "border-white/[0.03] bg-white/[0.01] opacity-50"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveUp(index)}
                  className="text-white/20 transition hover:text-white/60"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                    <path d="M5 0L10 6H0z" />
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  className="text-white/20 transition hover:text-white/60"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                    <path d="M5 6L0 0H10z" />
                  </svg>
                </button>
              </div>
              <GripVertical className="h-4 w-4 shrink-0 text-white/20" />

              <select
                value={link.platform}
                onChange={(e) => updateLink(link.id, "platform", e.target.value)}
                className="w-32 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
              >
                {platforms.map((p) => (
                  <option key={p} value={p} className="bg-[#0f0d1a]">{p}</option>
                ))}
              </select>

              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(link.id, "url", e.target.value)}
                placeholder="https://"
                className="flex-1 min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
              />

              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(link.id, "label", e.target.value)}
                placeholder="Label"
                className="w-36 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
              />

              <span className={`rounded-lg px-2.5 py-1 text-[10px] font-medium ${colorClass}`}>
                {link.platform}
              </span>

              <button
                onClick={() => toggleLink(link.id)}
                className={`rounded-lg p-2 transition ${
                  link.enabled
                    ? "text-emerald-400 hover:bg-emerald-500/10"
                    : "text-white/20 hover:bg-white/5"
                }`}
              >
                {link.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>

              <button
                onClick={() => removeLink(link.id)}
                className="rounded-lg p-2 text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {links.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] py-20 text-center">
            <ExternalLink className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/30">No links yet. Click "Add link" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
