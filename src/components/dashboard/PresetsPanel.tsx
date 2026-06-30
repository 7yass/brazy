"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Copy, Trash2, Check, FolderOpen } from "lucide-react";
import type { ProfileConfig } from "@/lib/profile/schema";
import {
  listPresets,
  savePreset,
  duplicatePreset,
  deletePreset,
  applyPreset,
  type StylePreset,
} from "@/lib/profile/presets";

export default function PresetsPanel({
  config,
  onApply,
}: {
  config: ProfileConfig;
  onApply: (partial: Partial<ProfileConfig>) => void;
}) {
  const [presets, setPresets] = useState<StylePreset[]>([]);
  const [name, setName] = useState("");
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const refresh = useCallback(() => setPresets(listPresets()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleSave = () => {
    const preset = savePreset(name || `Preset ${presets.length + 1}`, config);
    setName("");
    refresh();
    setAppliedId(preset.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  const handleApply = (id: string) => {
    const partial = applyPreset(id);
    if (partial) {
      onApply(partial);
      setAppliedId(id);
      setTimeout(() => setAppliedId(null), 2000);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicatePreset(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    deletePreset(id);
    refresh();
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <FolderOpen className="h-4 w-4 text-white/40" />
        <p className="text-sm font-medium text-white/80">Style Presets</p>
      </div>

      {/* Save new preset */}
      <div className="mb-3 flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="Preset name..."
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/25"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
      </div>

      {/* Presets list */}
      {presets.length === 0 ? (
        <p className="py-4 text-center text-xs text-white/30">
          No saved presets yet. Save your current style to reuse it later.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition hover:border-white/[0.12]"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {/* Accent swatch */}
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-white/10"
                  style={{ background: preset.theme.primaryColor || "#7c3aed" }}
                />
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-medium text-white/70">{preset.name}</p>
                  <p className="text-[10px] text-white/25">
                    {new Date(preset.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => handleApply(preset.id)}
                  title="Apply preset"
                  className="rounded-md p-1.5 text-white/30 transition hover:bg-white/[0.06] hover:text-white/60"
                >
                  {appliedId === preset.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <FolderOpen className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDuplicate(preset.id)}
                  title="Duplicate preset"
                  className="rounded-md p-1.5 text-white/30 transition hover:bg-white/[0.06] hover:text-white/60"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(preset.id)}
                  title="Delete preset"
                  className="rounded-md p-1.5 text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}