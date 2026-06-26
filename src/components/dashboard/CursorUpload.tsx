"use client";

import { AssetUploadCard, UploadZone } from "./AssetUploadCard";

const cursorOpts = [
  { value: "none" as const, label: "None" },
  { value: "trail" as const, label: "Trail" },
  { value: "sparkles" as const, label: "Sparkles" },
  { value: "dots" as const, label: "Dots" },
  { value: "rings" as const, label: "Rings" },
];

export function CursorUpload() {
  return (
    <AssetUploadCard title="Custom Cursor" subtitle="Choose a cursor effect and color.">
      <div className="mb-3 flex items-center gap-3">
        <select className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50">
          {cursorOpts.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#15131f]">
              {o.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5">
          <input
            type="color"
            value="#a78bfa"
            className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <input
            type="text"
            value="#a78bfa"
            className="w-full bg-transparent text-xs text-white/70 outline-none"
          />
        </div>
      </div>
      <UploadZone label="Upload cursor file" />
    </AssetUploadCard>
  );
}
