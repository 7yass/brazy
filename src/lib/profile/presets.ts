"use client";

import type { ProfileConfig } from "./schema";

export interface StylePreset {
  id: string;
  name: string;
  createdAt: number;
  /** Snapshot of style-related sections (theme, background, effects). */
  theme: ProfileConfig["theme"];
  background: ProfileConfig["background"];
  effects: ProfileConfig["effects"];
}

const STORAGE_KEY = "brazy:style-presets";

function readStore(): StylePreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(presets: StylePreset[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function listPresets(): StylePreset[] {
  return readStore().sort((a, b) => b.createdAt - a.createdAt);
}

export function savePreset(name: string, config: ProfileConfig): StylePreset {
  const preset: StylePreset = {
    id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || `Preset ${new Date().toLocaleDateString()}`,
    createdAt: Date.now(),
    theme: config.theme,
    background: config.background,
    effects: config.effects,
  };
  const presets = readStore();
  presets.push(preset);
  writeStore(presets);
  return preset;
}

export function duplicatePreset(id: string): StylePreset | null {
  const presets = readStore();
  const original = presets.find((p) => p.id === id);
  if (!original) return null;
  const copy: StylePreset = {
    ...original,
    id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: `${original.name} (copy)`,
    createdAt: Date.now(),
  };
  presets.push(copy);
  writeStore(presets);
  return copy;
}

export function deletePreset(id: string): void {
  const presets = readStore().filter((p) => p.id !== id);
  writeStore(presets);
}

export function renamePreset(id: string, name: string): void {
  const presets = readStore();
  const preset = presets.find((p) => p.id === id);
  if (preset) {
    preset.name = name.trim() || preset.name;
    writeStore(presets);
  }
}

export function applyPreset(id: string): Partial<ProfileConfig> | null {
  const presets = readStore();
  const preset = presets.find((p) => p.id === id);
  if (!preset) return null;
  return {
    theme: preset.theme,
    background: preset.background,
    effects: preset.effects,
  };
}