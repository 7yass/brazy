"use client";

import { useState } from "react";
import {
  Music,
  Clock,
  Code,
  MessageSquare,
  Cloud,
  ShoppingCart,
  Gamepad2,
  Calendar,
  Settings2,
  Eye,
  EyeOff,
} from "lucide-react";

interface Widget {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
  accentColor: string;
  opacity: number;
  description: string;
}

const presetWidgets: Widget[] = [
  { id: "1", type: "audio", label: "Audio Player", enabled: true, accentColor: "#a855f7", opacity: 0.4, description: "Music player with waveform visualizer" },
  { id: "2", type: "countdown", label: "Countdown Timer", enabled: false, accentColor: "#22d3ee", opacity: 0.3, description: "Countdown to a target date" },
  { id: "3", type: "custom-html", label: "Custom HTML", enabled: false, accentColor: "#f59e0b", opacity: 0.3, description: "Embed any HTML content" },
  { id: "4", type: "spotify", label: "Spotify Embed", enabled: false, accentColor: "#1DB954", opacity: 0.3, description: "Spotify track or playlist embed" },
  { id: "5", type: "text", label: "Rich Text", enabled: true, accentColor: "#e9d5ff", opacity: 0.2, description: "Formatted text block" },
  { id: "6", type: "weather", label: "Weather", enabled: false, accentColor: "#60a5fa", opacity: 0.3, description: "Live weather display" },
];

const widgetIcons: Record<string, typeof Music> = {
  "audio": Music,
  "countdown": Clock,
  "custom-html": Code,
  "spotify": Music,
  "text": MessageSquare,
  "weather": Cloud,
};

const widgetColors: Record<string, string> = {
  "audio": "text-violet-400",
  "countdown": "text-cyan-400",
  "custom-html": "text-amber-400",
  "spotify": "text-emerald-400",
  "text": "text-pink-400",
  "weather": "text-blue-400",
};

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>(presetWidgets);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const updateWidget = (id: string, key: keyof Widget, value: string | number | boolean) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, [key]: value } : w));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Widgets</h1>
        <p className="mt-1 text-sm text-white/40">
          Manage profile widgets and their styling. Configure accent colors, opacity, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {widgets.map((widget) => {
          const Icon = widgetIcons[widget.type] || Code;
          const colorClass = widgetColors[widget.type] || "text-white/50";
          return (
            <div
              key={widget.id}
              className={`group rounded-2xl border p-5 transition ${
                widget.enabled
                  ? "border-white/[0.08] bg-white/[0.03]"
                  : "border-white/[0.04] bg-white/[0.01] opacity-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Icon className={`h-5 w-5 ${colorClass}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{widget.label}</h3>
                    <p className="text-xs text-white/30">{widget.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleWidget(widget.id)}
                  className={`rounded-lg p-2 transition ${
                    widget.enabled
                      ? "text-emerald-400 hover:bg-emerald-500/10"
                      : "text-white/20 hover:bg-white/5"
                  }`}
                >
                  {widget.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>

              {editingId === widget.id ? (
                <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
                  <div>
                    <label className="mb-1.5 block text-xs text-white/40">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={widget.accentColor}
                        onChange={(e) => updateWidget(widget.id, "accentColor", e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                      />
                      <span className="text-xs text-white/50">{widget.accentColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-white/40">
                      Container Opacity: {Math.round(widget.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={widget.opacity}
                      onChange={(e) => updateWidget(widget.id, "opacity", parseFloat(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-white/40 transition hover:border-violet-500/30 hover:text-violet-400">
                        Glass
                      </button>
                      <button className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-white/40 transition hover:border-violet-500/30 hover:text-violet-400">
                        Solid
                      </button>
                      <button className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-white/40 transition hover:border-violet-500/30 hover:text-violet-400">
                        Outline
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingId(widget.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-white/30 transition hover:text-white/50"
                >
                  <Settings2 className="h-3 w-3" />
                  Widget styling
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
