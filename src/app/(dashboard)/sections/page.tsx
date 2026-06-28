"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig } from "@/lib/profile/schema";
import type { ProfileConfig } from "@/lib/profile/schema";
import { GripVertical, Eye, EyeOff, Check, Layers } from "lucide-react";
import { clientGetProfile, clientSaveProfile } from "@/lib/supabase/profile-helper";

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

export default function SectionsPage() {
  const [order, setOrder] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    avatar: true, name: true, identity: true, bio: true, badges: true,
    social: true, audio: true, discord: true, views: true, skills: true, projects: true, customHtml: true
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const { userId: uid, config: cfg } = await clientGetProfile();
        setUserId(uid);
        if (cfg.sections?.order?.length) setOrder(cfg.sections.order);
        if (cfg.sections?.visibility && Object.keys(cfg.sections.visibility).length) {
          setVisibility(prev => ({ ...prev, ...cfg.sections.visibility }));
        }
      } catch (err) {
        console.error("Load sections error:", err);
      }
    })();
  }, []);

  const scheduleSave = useCallback((nextOrder: string[], nextVis: Record<string, boolean>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      if (!userId || savingRef.current) { setSaveStatus("idle"); return; }
      savingRef.current = true;
      try {
        const { config: cfg } = await clientGetProfile();
        const next: ProfileConfig = { ...cfg, sections: { order: nextOrder, visibility: nextVis } };
        await clientSaveProfile(next);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Save sections error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
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
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-red-500" /> Sections Layout
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Control exactly which features display on your profile and their layout order.</p>
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

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Visible sections", value: visibleCount, colorClass: "text-green-400" },
          { label: "Hidden sections", value: ALL_SECTIONS.length - visibleCount, colorClass: "text-neutral-500" },
          { label: "Total sections", value: ALL_SECTIONS.length, colorClass: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-4.5">
            <p className={`text-2xl font-black ${s.colorClass}`}>{s.value}</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Section List Card */}
      <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl overflow-hidden mt-2">
        <div className="p-5 border-b border-neutral-900">
          <h3 className="text-sm font-bold text-white">Profile sections</h3>
          <p className="text-xs text-neutral-500 mt-1">Drag rows using the handle to change layout ordering. Active settings save in real-time.</p>
        </div>

        <div className="p-5 flex flex-col gap-2">
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
                className={`flex items-center gap-3.5 p-3 rounded-xl border bg-neutral-950 transition duration-150 cursor-grab active:cursor-grabbing ${
                  isDragging ? "opacity-40 border-red-500/50 bg-red-950/10" :
                  isOver ? "border-red-500/30 bg-red-950/5" :
                  "border-neutral-900/60 hover:border-neutral-800"
                }`}
              >
                <div className="text-neutral-600 hover:text-neutral-400 p-1 cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-base shrink-0 select-none">
                  {section.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isVisible ? "text-white" : "text-neutral-500"}`}>{section.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{section.desc}</p>
                </div>

                <div className="flex items-center gap-3.5 shrink-0 select-none">
                  <span className="text-[10px] font-mono font-semibold text-neutral-600">#{idx + 1}</span>
                  <button
                    onClick={() => toggleVisibility(section.id)}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                      isVisible 
                        ? "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white" 
                        : "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                    }`}
                    title={isVisible ? "Hide section" : "Show section"}
                  >
                    {isVisible
                      ? <Eye className="w-4 h-4 text-green-400" />
                      : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-neutral-500 text-center leading-relaxed">
        Changes are saved automatically. Hidden sections won't appear on your public profile.
      </p>
    </div>
  );
}
