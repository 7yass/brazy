"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GripVertical, Trash2, Check, Sparkles, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";
import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";
import { PREDEFINED_BADGES } from "@/lib/profile/badges-data";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
        value ? "bg-red-600" : "bg-neutral-800"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
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
      if (!userId || savingRef.current) {
        setSaveStatus("idle");
        return;
      }
      savingRef.current = true;
      try {
        const toSave = cfgRef.current as ProfileConfig;
        await clientSaveProfile(toSave);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save badges error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } finally {
        savingRef.current = false;
      }
    }, 800);
  }, [userId]);

  const updateBadges = (updates: Partial<ProfileConfig["badges"]>) => {
    setCfg((prev) => {
      if (!prev) return prev;
      const next = { ...prev, badges: { ...prev.badges, ...updates } } as ProfileConfig;
      scheduleSave(next);
      return next;
    });
  };

  const handleDragEnd = () => {
    if (!cfg || dragIdx === null || dragOver === null || dragIdx === dragOver) {
      setDragIdx(null);
      setDragOver(null);
      return;
    }
    const nextItems = [...cfg.badges.items];
    const [removed] = nextItems.splice(dragIdx, 1);
    nextItems.splice(dragOver, 0, removed);
    updateBadges({ items: nextItems });
    setDragIdx(null);
    setDragOver(null);
  };

  const toggleBadge = (badgeKey: string, badgeName: string, color: string, desc: string) => {
    if (!cfg) return;
    const existsIdx = cfg.badges.items.findIndex(
      (b: any) => b.emoji?.toLowerCase() === badgeKey.toLowerCase()
    );

    let nextItems = [...cfg.badges.items];
    if (existsIdx !== -1) {
      nextItems.splice(existsIdx, 1);
    } else {
      if (nextItems.length >= 10) return;
      nextItems.push({
        label: badgeName,
        emoji: badgeKey,
        color: color,
        tooltip: desc,
      });
    }
    updateBadges({ items: nextItems });
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
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-red-500" /> Profile Badges
          </h1>
          <p className="text-neutral-400 text-xs mt-1">
            Choose which badges appear on your public profile name row. Claim any of the premium badges for free.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold backdrop-blur-md transition-all duration-350 ${
              saveStatus === "saved"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : saveStatus === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-neutral-900/50 border-neutral-800 text-neutral-400 animate-pulse"
            }`}
          >
            {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
            {saveStatus === "saving" ? "Saving updates..." : saveStatus === "saved" ? "Saved!" : "Connection error"}
          </div>
        )}
      </div>

      {/* Main Switch Box */}
      <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">Enable Badges</h3>
            <p className="text-[11px] text-neutral-500 mt-1.5 leading-none">
              Toggle display of active badges under your profile avatar name row.
            </p>
          </div>
        </div>
        <Toggle value={badges.enabled} onChange={(v) => updateBadges({ enabled: v })} />
      </div>

      {badges.enabled && (
        <>
          {/* Active Badges List */}
          <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                Your Active Badges ({badges.items.length}/10)
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1">
                Drag items using the handle to change public profile render order.
              </p>
            </div>

            {badges.items.length === 0 ? (
              <div className="border border-dashed border-neutral-850 rounded-xl py-8 px-4 text-center flex flex-col items-center gap-2 bg-neutral-950/10">
                <Award className="w-6 h-6 text-neutral-600" />
                <p className="text-xs font-bold text-neutral-500">No active badges</p>
                <p className="text-[10px] text-neutral-600 max-w-[280px]">
                  Select and enable badges from the available inventory list below.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {badges.items.map((item: any, idx) => {
                  const isDragging = dragIdx === idx;
                  const isOver = dragOver === idx;
                  const lowerIcon = item.emoji?.toLowerCase().replace(/ /g, "_");
                  const predefined = PREDEFINED_BADGES[lowerIcon];
                  // item.color is the source of truth — predefined.color is only the fallback for brand new badges
                  const activeColor = item.color || predefined?.color || "#ffffff";

                  return (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(idx);
                      }}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 p-3 rounded-xl border bg-neutral-900/40 transition duration-150 cursor-grab active:cursor-grabbing ${
                        isDragging
                          ? "opacity-40 border-red-500/50 bg-red-950/10"
                          : isOver
                          ? "border-red-500/30 bg-red-950/5"
                          : "border-neutral-900/60 hover:border-neutral-850"
                      }`}
                    >
                      <div className="text-neutral-600 hover:text-neutral-400 p-1 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5"
                        style={{
                          backgroundColor: `${activeColor}20`,
                          color: activeColor,
                        }}
                      >
                        {predefined ? (
                          <div
                            className="w-4.5 h-4.5"
                            dangerouslySetInnerHTML={{ __html: predefined.svg.replace('<svg ', '<svg fill="currentColor" ') }}
                          />
                        ) : (
                          <span className="text-sm font-semibold">{item.emoji}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                          {predefined ? predefined.description : "Custom emoji badge"}
                        </div>
                      </div>

                      <label className="relative shrink-0 cursor-pointer group/color" title="Change badge color">
                        <div
                          className="w-7 h-7 rounded-lg border border-white/10 group-hover/color:border-white/30 transition duration-150"
                          style={{ backgroundColor: activeColor }}
                        />
                        <input
                          type="color"
                          value={activeColor}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            setCfg((prev) => {
                              if (!prev) return prev;
                              const nextItems = [...prev.badges.items];
                              nextItems[idx] = { ...nextItems[idx], color: newColor };
                              const next = { ...prev, badges: { ...prev.badges, items: nextItems } } as ProfileConfig;
                              scheduleSave(next);
                              return next;
                            });
                          }}
                          className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                        />
                      </label>

                      <button
                        onClick={() => toggleBadge(item.emoji, item.label, item.color, item.tooltip)}
                        className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/20 hover:bg-red-600 hover:border-red-600 text-red-500 hover:text-white flex items-center justify-center transition duration-150 cursor-pointer"
                        title="Remove badge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Badges Inventory */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
              Available Badges Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(PREDEFINED_BADGES).map(([key, badge]) => {
                const isActive = badges.items.some(
                  (b: any) => b.emoji?.toLowerCase() === key.toLowerCase()
                );

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/[0.03] bg-neutral-900/20 hover:bg-neutral-900/30 transition duration-150"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5"
                      style={{
                        backgroundColor: `${badge.color}15`,
                        color: badge.color,
                      }}
                    >
                      <div
                        className="w-5 h-5"
                        dangerouslySetInnerHTML={{ __html: badge.svg.replace('<svg ', '<svg fill="currentColor" ') }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                      <p className="text-[10px] text-neutral-500 mt-1 leading-snug truncate">
                        {badge.description}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBadge(key, badge.name, badge.color, badge.description)}
                      disabled={!isActive && badges.items.length >= 10}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 border cursor-pointer select-none outline-none disabled:opacity-40 disabled:pointer-events-none ${
                        isActive
                          ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                          : "bg-neutral-900 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-850"
                      }`}
                    >
                      {isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
