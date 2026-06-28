"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Sparkles, Image as ImageIcon, Text, Globe, Type } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

const F = "Satoshi, system-ui, sans-serif";

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
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.15s" }}
      onFocus={e => { e.target.style.borderColor = "rgba(220,38,38,0.5)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
    />
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 36 }}>
      <div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", display: "block" }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "block", marginTop: 2 }}>{hint}</span>}
      </div>
      <div style={{ flexShrink: 0, minWidth: 200 }}>{children}</div>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: F }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Loading…</span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Metadata & SEO</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Control how your profile appears in search results and when shared on social media.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600, flexShrink: 0 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Auto-saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* SEO Settings */}
        <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(96,165,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Globe style={{ width: 16, height: 16, color: "#60a5fa" }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>SEO Settings</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>These values are used by search engines (Google) and social previews (Twitter, iMessage).</p>
            </div>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <Row label="Page Title" hint="Overrides the default 'brazy | @username'">
              <InputText value={cfg.seo.title} onChange={v => updateSeo({ title: v })} placeholder="My Custom Profile Title" />
            </Row>
            <Row label="Description" hint="A short summary of your page.">
              <InputText value={cfg.seo.description} onChange={v => updateSeo({ description: v })} placeholder="The best profile on the internet." />
            </Row>
            <Row label="OG Image URL" hint="The image shown when your link is shared.">
              <InputText value={cfg.seo.ogImage || ""} onChange={v => updateSeo({ ogImage: v })} placeholder="https://..." />
            </Row>
          </div>
        </div>

        {/* Animated Browser Title */}
        <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: cfg.effects.animatedTitle ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(167,139,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Type style={{ width: 16, height: 16, color: "#a78bfa" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Animated Browser Title</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Scrolls your page title in the browser tab continuously.</p>
              </div>
            </div>
            <Toggle value={cfg.effects.animatedTitle} onChange={v => updateEffects({ animatedTitle: v })} />
          </div>
          
          {cfg.effects.animatedTitle && (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
              <Row label="Animated Text" hint="The text that will scroll. Leave blank to use your name.">
                <InputText value={cfg.effects.animatedTitleText || ""} onChange={v => updateEffects({ animatedTitleText: v })} placeholder="e.g. Welcome to my world • " />
              </Row>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
