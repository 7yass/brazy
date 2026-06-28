"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Globe, AlertTriangle, Check, Code2, Code, BarChart, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden shadow-2xl">
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, color, title, description, action }: { icon: React.ElementType; color: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="p-5 border-b border-neutral-900/60 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-snug">{title}</h3>
          <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal max-w-xl">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default function AdvancePage() {
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
        console.error("Load advance error:", err);
        setCfg(normalizeConfig({}));
      }
    })();
  }, []);

  const scheduleSave = useCallback((next: ProfileConfig) => {
    cfgRef.current = next;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (!userId || savingRef.current) return;
      savingRef.current = true;
      try {
        await clientSaveProfile(next);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save advance error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
      finally { savingRef.current = false; }
    }, 800);
  }, [userId]);

  const updateCfg = (updates: Partial<ProfileConfig>) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates } as ProfileConfig;
      scheduleSave(next);
      return next;
    });
  };

  const updateAnalytics = (updates: Partial<ProfileConfig["analytics"]>) => {
    if (!cfg) return;
    updateCfg({ analytics: { ...cfg.analytics, ...updates } });
  };

  if (!cfg) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-semibold text-neutral-500">Loading settings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-red-500" /> Advanced Options
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Configure tracking, custom code injections, and profile account management.</p>
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

      <Card>
        <CardHeader 
          icon={BarChart} color="#ef4444" 
          title="Profile Analytics" 
          description="Enables tracking of page visit counts and analytics. You can view stats under Overview."
          action={<Toggle value={cfg.analytics.trackViews} onChange={v => updateAnalytics({ trackViews: v })} />}
        />
      </Card>

      <Card>
        <CardHeader icon={Code2} color="#ec4899" title="Custom CSS Styling" description="Write custom CSS rules to fully override the appearance of your public bio card (e.g. targeting .brazy-card)." />
        <div className="p-5">
          <textarea 
            value={cfg.customCss || ""} 
            onChange={e => updateCfg({ customCss: e.target.value })} 
            placeholder="/* Write custom CSS styles here */&#10;.brazy-card {&#10;  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.25);&#10;}" 
            className="w-full bg-neutral-900/40 border border-neutral-850 focus:border-red-500/40 rounded-xl p-4 text-xs font-mono text-neutral-300 placeholder-neutral-700 outline-none resize-none leading-relaxed min-h-[140px] transition"
          />
        </div>
      </Card>

      <Card>
        <CardHeader icon={Code} color="#10b981" title="Custom HTML Block" description="Inject a custom HTML chunk onto your page layout. Make sure to toggle its visibility on in the Layout/Sections tab." />
        <div className="p-5">
          <textarea 
            value={cfg.customHtml || ""} 
            onChange={e => updateCfg({ customHtml: e.target.value })} 
            placeholder='<div class="custom-widget-block">&#10;  <h3>Custom block title</h3>&#10;  <p>Hello world!</p>&#10;</div>' 
            className="w-full bg-neutral-900/40 border border-neutral-850 focus:border-red-500/40 rounded-xl p-4 text-xs font-mono text-neutral-300 placeholder-neutral-700 outline-none resize-none leading-relaxed min-h-[140px] transition"
          />
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="bg-red-950/5 border border-red-500/25 rounded-2xl overflow-hidden">
        <div className="p-5 flex items-start gap-4 border-b border-red-500/10">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-500">Danger Zone</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-normal max-w-xl">Permanently delete your profile page, username reservation, custom layout, and all associated analytics data. This operation is absolute and cannot be undone.</p>
          </div>
        </div>
        <div className="p-5">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 text-xs font-bold transition duration-150 cursor-pointer">
            <Trash2 className="w-4 h-4" /> Delete Profile & Account
          </button>
        </div>
      </div>

    </div>
  );
}
