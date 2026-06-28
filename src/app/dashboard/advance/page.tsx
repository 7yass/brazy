"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Globe, AlertTriangle, Check, Code2, Code, BarChart, Trash2 } from "lucide-react";
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, color, title, description, action }: { icon: React.ElementType; color: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 16, height: 16, color }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>{title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>{description}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
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
      if (!userId || savingRef.current) return;
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

  const updateAnalytics = (updates: Partial<ProfileConfig["analytics"]>) => {
    if (!cfg) return;
    updateCfg({ analytics: { ...cfg.analytics, ...updates } });
  };

  if (!cfg) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: F }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Loading…</span>
      </div>
    );
  }

  const inputBase: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "#fafafa", fontFamily: "var(--font-geist-mono), monospace", outline: "none", width: "100%", boxSizing: "border-box", minHeight: 120, resize: "vertical" };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Advanced</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Power user settings for your profile.</p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600, flexShrink: 0 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Auto-saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      <Card>
        <CardHeader 
          icon={BarChart} color="#3b82f6" 
          title="Analytics" 
          description="Track how many people are viewing your profile."
          action={<Toggle value={cfg.analytics.trackViews} onChange={v => updateAnalytics({ trackViews: v })} />}
        />
      </Card>

      <Card>
        <CardHeader icon={Code2} color="#a78bfa" title="Custom CSS" description="Inject your own CSS to fully override the default styles on your profile page. Applies to the entire page." />
        <div style={{ padding: "20px 24px" }}>
          <textarea 
            value={cfg.customCss || ""} 
            onChange={e => updateCfg({ customCss: e.target.value })} 
            placeholder="/* Add your custom styles here */&#10;.brazy-card {&#10;  border-radius: 0px;&#10;}" 
            style={inputBase} 
          />
        </div>
      </Card>

      <Card>
        <CardHeader icon={Code} color="#10b981" title="Custom HTML Block" description="Inject arbitrary HTML into the Custom HTML section on your profile. Enable it in the Sections tab." />
        <div style={{ padding: "20px 24px" }}>
          <textarea 
            value={cfg.customHtml || ""} 
            onChange={e => updateCfg({ customHtml: e.target.value })} 
            placeholder='<div class="my-custom-widget">Hello world!</div>' 
            style={inputBase} 
          />
        </div>
      </Card>

      <div style={{ borderRadius: 20, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#ef4444" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Danger Zone</p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
        </div>
        <div style={{ padding: "16px 24px 22px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}>
            <Trash2 style={{ width: 14, height: 14 }} /> Delete account
          </button>
        </div>
      </div>

    </div>
  );
}
