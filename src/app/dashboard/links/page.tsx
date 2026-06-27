"use client";

import { useState } from "react";
import {
  Plus, GripVertical, Trash2, ExternalLink,
  Link2, Eye, EyeOff, ChevronDown, ChevronUp,
  Pencil, Check, X
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface LinkItem {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
  clicks: number;
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED: LinkItem[] = [
  { id: "1", title: "My Website",   url: "https://example.com",        enabled: true,  clicks: 142 },
  { id: "2", title: "GitHub",       url: "https://github.com",         enabled: true,  clicks: 89  },
  { id: "3", title: "Twitter / X",  url: "https://x.com",             enabled: false, clicks: 23  },
];

// ── Add Link Modal ────────────────────────────────────────────────────────────
function AddLinkModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (title: string, url: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl]     = useState("");

  const submit = () => {
    if (!title.trim() || !url.trim()) return;
    onAdd(title.trim(), url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Add a link</h2>
          <button onClick={onClose} className="text-white/30 transition-colors hover:text-white/60">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs text-white/40">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Portfolio"
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-white/20 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/40">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-sm text-white/40 transition-all hover:border-white/[0.10] hover:text-white/60"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!title.trim() || !url.trim()}
            className="flex-1 rounded-xl bg-violet-500/20 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Link Row ──────────────────────────────────────────────────────────────────
function LinkRow({
  link,
  onToggle,
  onDelete,
  onEdit,
}: {
  link: LinkItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, url: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle]     = useState(link.title);
  const [url, setUrl]         = useState(link.url);

  const save = () => {
    if (title.trim() && url.trim()) onEdit(link.id, title.trim(), url.trim());
    setEditing(false);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
        link.enabled
          ? "border-white/[0.06] bg-white/[0.02]"
          : "border-white/[0.03] bg-white/[0.01] opacity-50"
      }`}
    >
      {/* Drag handle */}
      <span className="cursor-grab text-white/20 active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </span>

      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04]">
        <Link2 className="h-4 w-4 text-white/30" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="space-y-1.5">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-sm text-white/80 outline-none focus:border-white/20"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-xs text-white/50 outline-none focus:border-white/20"
            />
          </div>
        ) : (
          <>
            <p className="truncate text-sm font-medium text-white/80">{link.title}</p>
            <p className="truncate text-xs text-white/30">{link.url}</p>
          </>
        )}
      </div>

      {/* Click count */}
      {!editing && (
        <span className="shrink-0 rounded-lg border border-white/[0.04] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/25">
          {link.clicks} clicks
        </span>
      )}

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <button
              onClick={save}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 transition-all hover:bg-green-500/20"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setTitle(link.title); setUrl(link.url); setEditing(false); }}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/30 transition-all hover:text-white/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/30 transition-all hover:border-white/[0.10] hover:text-white/60"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/30 transition-all hover:border-white/[0.10] hover:text-white/60"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => onToggle(link.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/30 transition-all hover:border-white/[0.10] hover:text-white/60"
            >
              {link.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => onDelete(link.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LinksPage() {
  const [links, setLinks]       = useState<LinkItem[]>(SEED);
  const [showModal, setModal]   = useState(false);

  const addLink = (title: string, url: string) => {
    setLinks((prev) => [
      ...prev,
      { id: Date.now().toString(), title, url, enabled: true, clicks: 0 },
    ]);
  };

  const toggleLink = (id: string) =>
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l));

  const deleteLink = (id: string) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));

  const editLink = (id: string, title: string, url: string) =>
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, title, url } : l));

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const activeCount = links.filter((l) => l.enabled).length;

  return (
    <div className="p-8">
      {showModal && <AddLinkModal onClose={() => setModal(false)} onAdd={addLink} />}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Links</h1>
          <p className="mt-1 text-sm text-white/30">Manage the links on your profile page.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-4 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/30 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add Link
        </button>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Total Links",   value: links.length },
          { label: "Active Links",  value: activeCount },
          { label: "Total Clicks",  value: totalClicks },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-white/30">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Links list */}
      <div className="space-y-2">
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-16 text-center">
            <Link2 className="mb-3 h-8 w-8 text-white/15" />
            <p className="text-sm font-medium text-white/30">No links yet</p>
            <p className="mt-1 text-xs text-white/20">Click &ldquo;Add Link&rdquo; to get started</p>
            <button
              onClick={() => setModal(true)}
              className="mt-4 flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-white/40 transition-all hover:border-white/[0.10] hover:text-white/60"
            >
              <Plus className="h-3.5 w-3.5" /> Add your first link
            </button>
          </div>
        ) : (
          links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onToggle={toggleLink}
              onDelete={deleteLink}
              onEdit={editLink}
            />
          ))
        )}
      </div>

      {/* Premium upsell — embed links */}
      <div className="mt-8 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
            <Link2 className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80">Embed Links <span className="ml-1.5 rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-300">PREMIUM</span></p>
            <p className="mt-1 text-xs text-white/35">Embed YouTube videos, Spotify tracks, SoundCloud playlists and more directly on your profile.</p>
          </div>
          <button className="shrink-0 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition-all hover:bg-violet-500/20">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
