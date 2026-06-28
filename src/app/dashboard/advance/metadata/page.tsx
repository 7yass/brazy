"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Sparkles, Image as ImageIcon, Text, Globe, Type } from "lucide-react";
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

function InputText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 w-full transition"
    />
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-neutral-300">{label}</span>
        {hint && <span className="text-[10px] text-neutral-500 mt-0.5 max-w-sm leading-normal">{hint}</span>}
      </div>
      <div className="shrink-0 w-72">{children}</div>
    </div>
  );
}

export default function MetadataPage() {
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
        console.error("Load metadata error:", err);
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
        console.error("Save metadata error:", err);
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

  const updateSeo = (updates: Partial<ProfileConfig["seo"]>) => {
    if (!cfg) return;
    updateCfg({ seo: { ...cfg.seo, ...updates } });
  };

  const updateEffects = (updates: Partial<ProfileConfig["effects"]>) => {
    if (!cfg) return;
    updateCfg({ effects: { ...cfg.effects, ...updates } });
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
            <Globe className="w-6 h-6 text-red-500" /> SEO & Browser Metadata
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Control how search engines display your bio link and customize browser tabs.</p>
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
        {/* SEO Settings */}
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-neutral-900/60 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
              <Globe className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Social & Search engine previews</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">Customize titles and descriptions seen on Google search, Discord embeds, or Twitter posts.</p>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <Row label="Page Title" hint="Overrides the browser tab default title (e.g. '@username')">
              <InputText value={cfg.seo.title} onChange={v => updateSeo({ title: v })} placeholder="Custom Title Preview" />
            </Row>
            <Row label="Meta Description" hint="A short summary of your page bio for search results.">
              <InputText value={cfg.seo.description} onChange={v => updateSeo({ description: v })} placeholder="My official links and socials." />
            </Row>
            <Row label="Preview Banner URL" hint="OpenGraph image displayed when sharing links.">
              <InputText value={cfg.seo.ogImage || ""} onChange={v => updateSeo({ ogImage: v })} placeholder="https://..." />
            </Row>
          </div>
        </div>

        {/* Animated Browser Title */}
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 flex items-center justify-between gap-4 border-b border-neutral-900/60">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                <Type className="w-4.5 h-4.5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Animated Browser Tab Title</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">Continuously scrolls custom marquee text on the browser tab title.</p>
              </div>
            </div>
            <Toggle value={cfg.effects.animatedTitle} onChange={v => updateEffects({ animatedTitle: v })} />
          </div>
          
          {cfg.effects.animatedTitle && (
            <div className="p-5 flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
              <Row label="Marquee Title Text" hint="Text sequence to scroll (e.g. 'Welcome to my bio • ')">
                <InputText value={cfg.effects.animatedTitleText || ""} onChange={v => updateEffects({ animatedTitleText: v })} placeholder="Enter marquee text..." />
              </Row>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
