"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import { GripVertical, Eye, EyeOff, Check } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

const ALL_SECTIONS = [
  { id: "avatar",    label: "Avatar",              desc: "Your profile picture",                    emoji: "🖼️" },
  { id: "name",      label: "Display Name",         desc: "Your name and badges row",               emoji: "✍️" },
  { id: "identity",  label: "Username / Pronouns",  desc: "@username, pronouns, and location",      emoji: "🏷️" },
  { id: "bio",       label: "Bio",                  desc: "Your bio text or markdown",              emoji: "📝" },
  { id: "badges",    label: "Badges",               desc: "Achievement and role badges",            emoji: "🏅" },
  { id: "social",    label: "Social Links",          desc: "All your linked platforms",             emoji: "🔗" },
  { id: "audio",     label: "Audio Player",          desc: "Music player with visualizer",          emoji: "🎵" },
  { id: "discord",   label: "Discord Presence",      desc: "Real-time Discord status",              emoji: "💬" },
  { id: "views",     label: "View Counter",          desc: "Profile visit count",                   emoji: "👁️" },
  { id: "skills",    label: "Skills",               desc: "Your skills with progress bars",         emoji: "⚡" },
  { id: "projects",  label: "Projects",             desc: "Showcase your work",                     emoji: "🚀" },
  { id: "customHtml","label": "Custom HTML",        desc: "Inject your own HTML block",             emoji: "</>" },
];

const DEFAULT_ORDER = ALL_SECTIONS.map(s => s.id);
const DEFAULT_VISIBILITY: Record<string, boolean> = Object.fromEntries(ALL_SECTIONS.map(s => [s.id, true]));

export default function SectionsPage() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [visibility, setVisibility] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const { data: profile } = await supabase.from("profiles").select("config").eq("user_id", user.id).maybeSingle();
        const cfg = normalizeConfig(profile?.config ?? {});
        if (cfg.sections?.order?.length) setOrder(cfg.sections.order);
        if (cfg.sections?.visibility && Object.keys(cfg.sections.visibility).length) {
          setVisibility(prev => ({ ...prev, ...cfg.sections.visibility }));
        }
      } catch {}
    })();
  }, []);

  const scheduleSave = useCallback((nextOrder: string[], nextVis: Record<string, boolean>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (!userId || savingRef.current) { setSaveStatus("idle"); return; }
      savingRef.current = true;
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: profile } = await supabase.from("profiles").select("config").eq("user_id", userId).maybeSingle();
        const cfg = normalizeConfig(profile?.config ?? {});
        const next: ProfileConfig = { ...cfg, sections: { order: nextOrder, visibility: nextVis } };
        await supabase.from("profiles").upsert({ user_id: userId, config: next, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
      finally { savingRef.current = false; }
    }, 600);
  }, [userId]);

  const toggleVisibility = (id: string) => {
    const next = { ...visibility, [id]: !visibility[id] };
    setVisibility(next);
    scheduleSave(order, next);
  };

  const handleDragEnd = () => {
    if (dragIdx !== null && dragOver !== null && dragIdx !== dragOver) {
      const next = [...order];
      const [removed] = next.splice(dragIdx, 1);
      next.splice(dragOver, 0, removed);
      setOrder(next);
      scheduleSave(next, visibility);
    }
    setDragIdx(null);
    setDragOver(null);
  };

  const orderedSections = order
    .map(id => ALL_SECTIONS.find(s => s.id === id))
    .filter(Boolean) as typeof ALL_SECTIONS;

  const visibleCount = Object.values(visibility).filter(Boolean).length;

  return (
    <div style={{ fontFamily: F, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Sections</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Control what appears on your profile and in what order.
          </p>
        </div>
        {saveStatus !== "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 12, color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.5)", animation: "slideIn 0.2s ease", fontWeight: 600, flexShrink: 0 }}>
            {saveStatus === "saved" && <Check style={{ width: 12, height: 12 }} />}
            {saveStatus === "saving" ? "Auto-saving…" : saveStatus === "saved" ? "Saved!" : "Failed to save"}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Visible sections", value: visibleCount, color: "#22c55e" },
          { label: "Hidden sections", value: ALL_SECTIONS.length - visibleCount, color: "rgba(255,255,255,0.3)" },
          { label: "Total", value: ALL_SECTIONS.length, color: "#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.018)", padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Section list */}
      <div style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.018)", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>Profile sections</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Drag to reorder. Toggle eye to show/hide.</p>
          </div>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {orderedSections.map((section, idx) => {
            const isDragging = dragIdx === idx;
            const isOver = dragOver === idx;
            const isVisible = visibility[section.id] !== false;
            return (
              <div
                key={section.id}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
                onDragEnd={handleDragEnd}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 14,
                  background: isDragging ? "rgba(220,38,38,0.08)" : isOver ? "rgba(255,255,255,0.06)" : isVisible ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                  border: `1px solid ${isOver ? "rgba(220,38,38,0.3)" : isVisible ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)"}`,
                  opacity: isDragging ? 0.5 : isVisible ? 1 : 0.45,
                  transition: "all 0.15s",
                  cursor: "grab",
                  userSelect: "none",
                }}
              >
                <GripVertical style={{ width: 14, height: 14, color: "rgba(255,255,255,0.15)", flexShrink: 0 }} />

                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {section.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isVisible ? "#fafafa" : "rgba(255,255,255,0.4)" }}>{section.label}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{section.desc}</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>#{idx + 1}</span>
                  <button
                    onClick={() => toggleVisibility(section.id)}
                    style={{ width: 32, height: 32, borderRadius: 9, background: isVisible ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${isVisible ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                    title={isVisible ? "Hide section" : "Show section"}
                  >
                    {isVisible
                      ? <Eye style={{ width: 13, height: 13, color: "#22c55e" }} />
                      : <EyeOff style={{ width: 13, height: 13, color: "rgba(255,255,255,0.3)" }} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
        Changes are saved automatically. Hidden sections won't appear on your public profile.
      </p>
    </div>
  );
}
