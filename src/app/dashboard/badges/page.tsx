"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, GripVertical, Trash2, Check, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

const F = "Satoshi, system-ui, sans-serif";

type BadgeItem = { id: string; label: string; emoji: string; color: string; tooltip: string };

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

export default function BadgesPage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const cfgRef = useRef<ProfileConfig | null>(null);

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

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
        // ensure items have unique ids for drag and drop
        if (loaded.badges && loaded.badges.items) {
          loaded.badges.items = loaded.badges.items.map((b: any) => ({ ...b, id: b.id || Math.random().toString(36).slice(2) }));
        }
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
        // strip internal 'id' before saving
        const toSave = { ...cfgRef.current, badges: { ...cfgRef.current?.badges, items: cfgRef.current?.badges.items.map(({ id, ...rest }: any) => rest) } };
        await supabase.from("profiles").upsert({ user_id: userId, config: toSave, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
      finally { savingRef.current = false; }
    }, 800);
  }, [userId]);

  const updateBadges = (updates: Partial<ProfileConfig["badges"]>) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = { ...prev, badges: { ...prev.badges, ...updates } } as ProfileConfig;
      scheduleSave(next);
      return next;
    });
  };

  const updateItem = (index: number, updates: Partial<BadgeItem>) => {
    if (!cfg) return;
    const nextItems = [...cfg.badges.items];
    nextItems[index] = { ...nextItems[index], ...updates };
    updateBadges({ items: nextItems });
  };

  const removeItem = (index: number) => {
    if (!cfg) return;
    const nextItems = cfg.badges.items.filter((_, i) => i !== index);
    updateBadges({ items: nextItems });
  };

  const addItem = () => {
    if (!cfg) return;
    const nextItems = [...cfg.badges.items, { id: Math.random().toString(36).slice(2), label: "", emoji: "⭐", color: "#22d3ee", tooltip: "" }];
    updateBadges({ items: nextItems });
  };

  const handleDragEnd = () => {
    if (!cfg || dragIdx === null || dragOver === null || dragIdx === dragOver) {
      setDragIdx(null); setDragOver(null); return;
    }
    const nextItems = [...cfg.badges.items];
    const [removed] = nextItems.splice(dragIdx, 1);
    nextItems.splice(dragOver, 0, removed);
    updateBadges({ items: nextItems });
    setDragIdx(null);
    setDragOver(null);
  };

  if (!cfg) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: F }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Loading…</span>
      </div>
    );
  }

  const { badges } = cfg;

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Custom Badges</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Create and display custom badges on your profile.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600, flexShrink: 0 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Auto-saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles style={{ width: 16, height: 16, color: "#dc2626" }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Enable Custom Badges</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Display badges below your display name</p>
            </div>
          </div>
          <Toggle value={badges.enabled} onChange={v => updateBadges({ enabled: v })} />
        </div>
        
        {badges.enabled && (
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Your Badges ({badges.items.length}/10)</span>
              <button 
                onClick={addItem} 
                disabled={badges.items.length >= 10}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: badges.items.length >= 10 ? "not-allowed" : "pointer", opacity: badges.items.length >= 10 ? 0.5 : 1 }}
              >
                <Plus style={{ width: 12, height: 12 }} /> Add Badge
              </button>
            </div>

            {badges.items.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", background: "rgba(255,255,255,0.01)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)" }}>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No custom badges created yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {badges.items.map((item: any, idx) => {
                  const isDragging = dragIdx === idx;
                  const isOver = dragOver === idx;
                  
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
                      onDragEnd={handleDragEnd}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                        borderRadius: 14,
                        background: isDragging ? "rgba(220,38,38,0.08)" : isOver ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isOver ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.07)"}`,
                        opacity: isDragging ? 0.5 : 1,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ cursor: "grab", display: "flex", padding: 4 }}>
                        <GripVertical style={{ width: 14, height: 14, color: "rgba(255,255,255,0.15)" }} />
                      </div>
                      
                      <div style={{ width: 44 }}>
                        <InputText value={item.emoji} onChange={v => updateItem(idx, { emoji: v })} placeholder="⭐" />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 100 }}>
                        <InputText value={item.label} onChange={v => updateItem(idx, { label: v })} placeholder="Label (e.g. VIP)" />
                      </div>
                      
                      <div style={{ flex: 1.5, minWidth: 120 }}>
                        <InputText value={item.tooltip} onChange={v => updateItem(idx, { tooltip: v })} placeholder="Tooltip (optional)" />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => removeItem(idx)}
                          style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                        >
                          <Trash2 style={{ width: 13, height: 13, color: "#ef4444" }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
