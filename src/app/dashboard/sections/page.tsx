"use client";

import { useState } from "react";
import {
  GripVertical, Plus, Link2, Music, Code, Type, Image, Video,
  Award, Puzzle, Clock, Square, Trash2, Eye, EyeOff,
} from "lucide-react";

interface ProfileSection {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
  description: string;
}

const availableSections = [
  { type: "links", label: "Links", icon: Link2, description: "Your social links and buttons" },
  { type: "social-icons", label: "Social Icons", icon: Puzzle, description: "Icon-only social links row" },
  { type: "badges", label: "Badges", icon: Award, description: "Custom badges and achievements" },
  { type: "projects", label: "Projects", icon: Image, description: "Showcase your projects" },
  { type: "audio", label: "Audio Player", icon: Music, description: "Music player with visualizer" },
  { type: "text", label: "Text Block", icon: Type, description: "Custom text or markdown" },
  { type: "image", label: "Image", icon: Image, description: "Single image display" },
  { type: "video", label: "Video", icon: Video, description: "Embed a video" },
  { type: "countdown", label: "Countdown", icon: Clock, description: "Countdown timer" },
  { type: "divider", label: "Divider", icon: Square, description: "Visual separator" },
  { type: "spacer", label: "Spacer", icon: Square, description: "Empty space" },
  { type: "custom-html", label: "Custom HTML", icon: Code, description: "Arbitrary HTML content" },
];

const sectionIcons: Record<string, typeof Link2> = {
  "links": Link2, "social-icons": Puzzle, "badges": Award, "projects": Image,
  "audio": Music, "text": Type, "image": Image, "video": Video,
  "countdown": Clock, "divider": Square, "spacer": Square, "custom-html": Code,
};

export default function SectionsPage() {
  const [sections, setSections] = useState<ProfileSection[]>([
    { id: "1", type: "social-icons", label: "Social Icons", enabled: true, description: "" },
    { id: "2", type: "links", label: "Links", enabled: true, description: "" },
    { id: "3", type: "badges", label: "Badges", enabled: false, description: "" },
    { id: "4", type: "audio", label: "Audio Player", enabled: true, description: "" },
  ]);
  const [showPicker, setShowPicker] = useState(false);

  const toggleSection = (id: string) => setSections(sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  const removeSection = (id: string) => setSections(sections.filter((s) => s.id !== id));

  const addSection = (type: string) => {
    const info = availableSections.find((s) => s.type === type);
    if (!info) return;
    setSections([...sections, { id: Date.now().toString(), type, label: info.label, enabled: true, description: info.description }]);
    setShowPicker(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...sections];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setSections(arr);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const arr = [...sections];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setSections(arr);
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Section Builder</h1>
          <p className="mt-1 text-sm text-white/40">Drag to reorder. Toggle sections on or off to compose your perfect profile.</p>
        </div>
        <button onClick={() => setShowPicker(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500">
          <Plus className="h-4 w-4" /> Add section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-24 text-center">
          <svg className="mx-auto mb-4 h-10 w-10 text-white/20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
          <p className="text-sm text-white/30">No sections yet. Add one to start building your profile.</p>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Profile Sections</p>
          <div className="space-y-2">
            {sections.map((section, index) => {
              const Icon = sectionIcons[section.type] || Link2;
              return (
                <div
                  key={section.id}
                  className="flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-all duration-200 hover:border-white/[0.10]"
                  style={{ backdropFilter: "blur(4px)" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveUp(index)} className="text-white/20 transition hover:text-white/60">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 0L10 6H0z" /></svg>
                    </button>
                    <button onClick={() => moveDown(index)} className="text-white/20 transition hover:text-white/60">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10z" /></svg>
                    </button>
                  </div>
                  <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Icon className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{section.label}</p>
                    <p className="text-xs text-white/30">{section.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/30">#{index + 1}</span>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`rounded-lg p-2 transition-all duration-200 ${section.enabled ? "text-emerald-400 hover:bg-emerald-500/10" : "text-white/20 hover:bg-white/5"}`}
                    >
                      {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => removeSection(section.id)} className="rounded-lg p-2 text-white/20 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0f0d1a] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Add Section</h2>
              <button onClick={() => setShowPicker(false)} className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4L14 14M14 4L4 14" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableSections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.type}
                    onClick={() => addSection(sec.type)}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-left transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                      <Icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{sec.label}</p>
                      <p className="text-xs text-white/30">{sec.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
