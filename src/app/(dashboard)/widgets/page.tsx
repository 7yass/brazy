"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import {
  MessageSquare, Clock, Music2,
  Check, ChevronDown, ChevronRight, ExternalLink,
} from "lucide-react";
import { FaYoutube, FaGithub } from "react-icons/fa6";

const F = "Satoshi, system-ui, sans-serif";

// ─── Shared primitives ──────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={value} onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 99, cursor: "pointer", border: "none", padding: 2, background: value ? "#dc2626" : "rgba(255,255,255,0.1)", transition: "background 0.2s", display: "flex", alignItems: "center", flexShrink: 0 }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transform: value ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)", display: "block", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
    </button>
  );
}

function InputText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.15s" }}
      onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.5)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
    />
  );
}

function Chips<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          style={{ padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: F, cursor: "pointer", border: value === o.value ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.07)", background: value === o.value ? "rgba(220,38,38,0.12)" : "rgba(255,255,255,0.03)", color: value === o.value ? "#dc2626" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>
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
    <div style={{ borderRadius: 18, border: `1px solid ${enabled ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)"}`, background: enabled ? "rgba(220,38,38,0.04)" : "rgba(255,255,255,0.018)", overflow: "hidden", transition: "border-color 0.2s, background 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${iconColor}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 18, height: 18, color: iconColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fafafa" }}>{label}</span>
            {badge && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e", letterSpacing: "0.05em", textTransform: "uppercase" }}>{badge}</span>
            )}
          </div>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{description}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {children && enabled && (
            <button onClick={() => setOpen(!open)}
              style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {open ? <ChevronDown style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} /> : <ChevronRight style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />}
            </button>
          )}
          <Toggle value={enabled} onChange={v => { onToggle(v); if (v) setOpen(true); }} />
        </div>
      </div>
      {enabled && open && children && (
        <>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 36 }}>
      <div>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "block" }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", display: "block", marginTop: 1 }}>{hint}</span>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
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
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const { data: profile } = await supabase.from("profiles").select("config").eq("user_id", user.id).maybeSingle();
        const loaded = normalizeConfig(profile?.config ?? {});
        setCfg(loaded);
        cfgRef.current = loaded;
      } catch { setCfg(normalizeConfig({})); }
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
        const supabase = createClient();
        if (!supabase) return;
        await supabase.from("profiles").upsert({ user_id: userId, config: cfgRef.current, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: F }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Loading…</span>
      </div>
    );
  }

  const w = cfg.widgets;

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Widgets</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Embed rich content on your profile page.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600, flexShrink: 0 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Auto-saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

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
            <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Preview</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${w.github.username}&show_icons=true&theme=dark&bg_color=00000000&hide_border=true&text_color=94a3b8&icon_color=dc2626&title_color=fafafa`}
                alt="GitHub Stats"
                style={{ maxWidth: "100%", borderRadius: 8 }}
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
            <select value={w.time.timezone} onChange={e => setWidget("time", "timezone", e.target.value)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 10px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none" }}>
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
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Preview</p>
              <iframe
                src={`https://open.spotify.com/embed/${w.spotify.url.split("spotify.com/")[1]?.replace(/\?.*/, "")}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ borderRadius: 12 }}
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
