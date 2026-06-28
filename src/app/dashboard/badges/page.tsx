"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, GripVertical, Trash2, Check, Sparkles, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";

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
        const { userId: uid, config: loaded } = await clientGetProfile();
        setUserId(uid);
        // ensure items have unique ids for drag and drop
        if (loaded.badges && loaded.badges.items) {
          loaded.badges.items = loaded.badges.items.map((b: any) => ({ ...b, id: b.id || Math.random().toString(36).slice(2) }));
        }
        setCfg(loaded);
        cfgRef.current = loaded;
      } catch (err) {
        console.error("Load badges error:", err);
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
        // strip internal 'id' before saving
        const toSave = { ...cfgRef.current, badges: { ...cfgRef.current?.badges, items: cfgRef.current?.badges.items.map(({ id, ...rest }: any) => rest) } } as ProfileConfig;
        await clientSaveProfile(toSave);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save badges error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
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
      <div className="flex items-center justify-center h-80">
        <div className="flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-semibold text-neutral-500">Loading badges…</span>
        </div>
      </div>
    );
  }

  const { badges } = cfg;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-red-500" /> Custom Badges
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Design and order unique achievement, role, or hobby badges for your profile name row.</p>
        </div>
        {saveStatus !== "idle" && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-350 ${
            saveStatus === "saved" ? "bg-green-500/10 border-green-500/30 text-green-400" :
            saveStatus === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
            "bg-neutral-900/50 border-neutral-800 text-neutral-400 animate-pulse"
          }`}>
            {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
            {saveStatus === "saving" ? "Saving updates..." : saveStatus === "saved" ? "Saved!" : "Connection error"}
          </div>
        )}
      </div>

      <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl overflow-hidden mt-2">
        <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Enable Custom Badges</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Toggle display of badges under your name row.</p>
            </div>
          </div>
          <Toggle value={badges.enabled} onChange={v => updateBadges({ enabled: v })} />
        </div>
        
        {badges.enabled && (
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-1">
              <span className="text-xs font-bold text-neutral-400">Your Badges ({badges.items.length}/10)</span>
              <button 
                onClick={addItem} 
                disabled={badges.items.length >= 10}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/10 border border-red-600/25 hover:bg-red-600/20 text-red-500 text-xs font-bold transition duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <Plus className="w-4.5 h-4.5" /> Add Badge
              </button>
            </div>

            {badges.items.length === 0 ? (
              <div className="border border-dashed border-neutral-850 rounded-2xl py-12 px-4 text-center flex flex-col items-center gap-3 bg-neutral-950/20">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <Award className="w-6 h-6 text-neutral-600" />
                </div>
                <p className="text-sm font-semibold text-neutral-450">No custom badges built yet</p>
                <p className="text-xs text-neutral-600 max-w-[280px]">Enable layout slots and press "Add Badge" above to start custom design rows.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
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
                      className={`flex items-center gap-3 p-3 rounded-xl border bg-neutral-950 transition duration-150 cursor-grab active:cursor-grabbing ${
                        isDragging ? "opacity-40 border-red-500/50 bg-red-950/10" :
                        isOver ? "border-red-500/30 bg-red-950/5" :
                        "border-neutral-900/60 hover:border-neutral-800"
                      }`}
                    >
                      <div className="text-neutral-600 hover:text-neutral-400 p-1 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <div className="w-16 shrink-0">
                        <InputText value={item.emoji} onChange={v => updateItem(idx, { emoji: v })} placeholder="⭐" />
                      </div>
                      
                      <div className="flex-1 min-w-[100px]">
                        <InputText value={item.label} onChange={v => updateItem(idx, { label: v })} placeholder="VIP / Founder" />
                      </div>
                      
                      <div className="flex-1.5 min-w-[120px]">
                        <InputText value={item.tooltip} onChange={v => updateItem(idx, { tooltip: v })} placeholder="Tooltip on hover" />
                      </div>

                      <div className="flex items-center shrink-0">
                        <button
                          onClick={() => removeItem(idx)}
                          className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 hover:bg-red-600 hover:border-red-600 text-red-500 hover:text-white flex items-center justify-center transition duration-150"
                          title="Delete badge"
                        >
                          <Trash2 className="w-4 h-4" />
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
