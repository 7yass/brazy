"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import {
  MessageSquare, Clock, Music2,
  Check, ChevronDown, ChevronRight, ExternalLink, Sparkles,
} from "lucide-react";
import { FaYoutube, FaGithub } from "react-icons/fa6";

import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";

// ─── Shared primitives ──────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${value ? "bg-red-600" : "bg-neutral-800"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function InputText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 w-56 transition"
    />
  );
}

function Chips<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex gap-2">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 border cursor-pointer ${
            value === o.value
              ? "bg-red-600/10 border-red-600/40 text-red-500"
              : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-neutral-250 hover:bg-neutral-900/60"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function WidgetCard({
  icon: Icon, iconColor, label, description, badge, enabled, onToggle, children, defaultOpen = false,
}: {
  icon: React.ElementType; iconColor: string; label: string; description: string; badge?: string;
  enabled: boolean; onToggle: (v: boolean) => void; children?: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen || enabled);

  return (
    <div className={`bg-neutral-950/40 border rounded-2xl overflow-hidden transition-all duration-200 ${
      enabled ? "border-red-500/20 bg-red-950/[0.02]" : "border-neutral-900/80"
    }`}>
      <div className="flex items-center gap-3.5 p-5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${iconColor}15` }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{label}</span>
            {badge && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 uppercase tracking-wide">{badge}</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">{description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {children && enabled && (
            <button onClick={() => setOpen(!open)}
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition">
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          <Toggle value={enabled} onChange={v => { onToggle(v); if (v) setOpen(true); }} />
        </div>
      </div>
      {enabled && open && children && (
        <div className="px-6 pb-6 pt-3 border-t border-neutral-900/60 flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-neutral-300">{label}</span>
        {hint && <span className="text-[10px] text-neutral-500 mt-0.5 max-w-sm leading-normal">{hint}</span>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────

export default function WidgetsPage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const cfgRef = useRef<ProfileConfig | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { userId: uid, config: loaded } = await clientGetProfile();
        setUserId(uid);
        setCfg(loaded);
        cfgRef.current = loaded;
      } catch (err) {
        console.error("Load widgets error:", err);
        setCfg(normalizeConfig({}));
      }
    })();
  }, []);

  const scheduleSave = useCallback((next: ProfileConfig) => {
    cfgRef.current = next;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (!userId || savingRef.current) { setSaveStatus("idle"); return; }
      savingRef.current = true;
      try {
        await clientSaveProfile(next);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save widgets error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
      finally { savingRef.current = false; }
    }, 800);
  }, [userId]);

  const setWidget = useCallback(<W extends keyof ProfileConfig["widgets"], K extends keyof ProfileConfig["widgets"][W]>(
    widget: W, key: K, val: ProfileConfig["widgets"][W][K]
  ) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = {
        ...prev,
        widgets: {
          ...prev.widgets,
          [widget]: { ...prev.widgets[widget], [key]: val },
        },
      } as ProfileConfig;
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  if (!cfg) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-semibold text-neutral-500">Loading widgets…</span>
        </div>
      </div>
    );
  }

  const w = cfg.widgets;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-500" /> Widgets Setup
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Embed live, interactive cards and integrations onto your public profile.</p>
        </div>
        {saveStatus !== "idle" && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-355 ${
            saveStatus === "saved" ? "bg-green-500/10 border-green-500/30 text-green-400" :
            saveStatus === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
            "bg-neutral-900/50 border-neutral-800 text-neutral-400 animate-pulse"
          }`}>
            {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
            {saveStatus === "saving" ? "Saving updates..." : saveStatus === "saved" ? "Saved!" : "Connection error"}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">

        {/* Discord Presence */}
        <WidgetCard
          icon={MessageSquare} iconColor="#5865F2"
          label="Discord Presence"
          description="Show your real-time Discord status and activity on your profile."
          badge="Live"
          enabled={w.discordPresence.enabled}
          onToggle={v => setWidget("discordPresence", "enabled", v)}
        >
          <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(88,101,242,0.06)", border: "1px solid rgba(88,101,242,0.15)" }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#fafafa" }}>How it works</p>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              Join <strong style={{ color: "rgba(255,255,255,0.7)" }}>brazy.it/discord</strong> and your live status will automatically sync to your profile. No bots to add — just join and it works.
            </p>
            <a href="https://brazy.it/discord" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "#5865F2", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              <MessageSquare style={{ width: 12, height: 12 }} />
              Join brazy Discord
              <ExternalLink style={{ width: 11, height: 11, opacity: 0.7 }} />
            </a>
          </div>
          <Row label="Your Discord ID" hint="Enable after joining the server">
            <InputText value={w.discordPresence.discordId} onChange={v => setWidget("discordPresence", "discordId", v)} placeholder="123456789012345678" />
          </Row>
          <Row label="Placement">
            <Chips value={w.discordPresence.placement} onChange={v => setWidget("discordPresence", "placement", v)}
              options={[{ value: "card", label: "In card" }, { value: "bottom", label: "Below card" }]} />
          </Row>
        </WidgetCard>

        {/* YouTube */}
        <WidgetCard
          icon={FaYoutube} iconColor="#FF0000"
          label="YouTube"
          description="Embed a YouTube video or playlist directly on your profile."
          enabled={w.youtube.enabled}
          onToggle={v => setWidget("youtube", "enabled", v)}
        >
          <Row label="YouTube URL">
            <InputText value={w.youtube.url} onChange={v => setWidget("youtube", "url", v)} placeholder="https://youtube.com/watch?v=..." />
          </Row>
          <Row label="Placement">
            <Chips value={w.youtube.placement} onChange={v => setWidget("youtube", "placement", v)}
              options={[{ value: "card", label: "In card" }, { value: "bottom", label: "Below card" }]} />
          </Row>
        </WidgetCard>

        {/* GitHub Stats */}
        <WidgetCard
          icon={FaGithub} iconColor="#e2e8f0"
          label="GitHub Stats"
          description="Show your GitHub contribution activity as a stats card."
          enabled={w.github.enabled}
          onToggle={v => setWidget("github", "enabled", v)}
        >
          <Row label="GitHub username">
            <InputText value={w.github.username} onChange={v => setWidget("github", "username", v)} placeholder="yourusername" />
          </Row>
          {w.github.username && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-850">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">Live Preview</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${w.github.username}&show_icons=true&theme=dark&bg_color=00000000&hide_border=true&text_color=94a3b8&icon_color=dc2626&title_color=fafafa`}
                alt="GitHub Stats"
                className="max-w-full rounded-lg"
              />
            </div>
          )}
          <Row label="Placement">
            <Chips value={w.github.placement} onChange={v => setWidget("github", "placement", v)}
              options={[{ value: "card", label: "In card" }, { value: "bottom", label: "Below card" }]} />
          </Row>
        </WidgetCard>

        {/* Time Widget */}
        <WidgetCard
          icon={Clock} iconColor="#a78bfa"
          label="Time & Timezone"
          description="Display your local time on your profile so visitors know when you're active."
          enabled={w.time.enabled}
          onToggle={v => setWidget("time", "enabled", v)}
        >
          <Row label="Timezone">
            <select 
              value={w.time.timezone} 
              onChange={e => setWidget("time", "timezone", e.target.value)}
              className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-red-500/40 w-56 font-semibold"
            >
              {[
                "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
                "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
                "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Tokyo", "Asia/Shanghai",
                "Australia/Sydney", "Pacific/Auckland",
              ].map(tz => <option key={tz} value={tz}>{tz.replace("_", " ")}</option>)}
            </select>
          </Row>
          <Row label="Format">
            <Chips value={w.time.format} onChange={v => setWidget("time", "format", v)}
              options={[{ value: "12h", label: "12-hour" }, { value: "24h", label: "24-hour" }]} />
          </Row>
          <Row label="Placement">
            <Chips value={w.time.placement} onChange={v => setWidget("time", "placement", v)}
              options={[{ value: "card", label: "In card" }, { value: "bottom", label: "Below card" }]} />
          </Row>
        </WidgetCard>

        {/* Spotify */}
        <WidgetCard
          icon={Music2} iconColor="#1DB954"
          label="Spotify Embed"
          description="Embed a Spotify track or playlist on your profile."
          enabled={w.spotify.enabled}
          onToggle={v => setWidget("spotify", "enabled", v)}
        >
          <Row label="Spotify URL">
            <InputText value={w.spotify.url} onChange={v => setWidget("spotify", "url", v)} placeholder="https://open.spotify.com/track/..." />
          </Row>
          {w.spotify.url && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-850">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">Embed Preview</p>
              <iframe
                src={`https://open.spotify.com/embed/${w.spotify.url.split("spotify.com/")[1]?.replace(/\?.*/, "")}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-xl border-none"
              />
            </div>
          )}
          <Row label="Placement">
            <Chips value={w.spotify.placement} onChange={v => setWidget("spotify", "placement", v)}
              options={[{ value: "card", label: "In card" }, { value: "bottom", label: "Below card" }]} />
          </Row>
        </WidgetCard>

      </div>
    </div>
  );
}
