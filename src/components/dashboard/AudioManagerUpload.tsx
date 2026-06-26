"use client";

import { useState } from "react";
import { AssetUploadCard } from "./AssetUploadCard";

const demo = [
  { id: "t1", name: "background-loop.mp3", duration: "3:24" },
  { id: "t2", name: "ambient-sound.mp3", duration: "5:12" },
];

export function AudioManagerUpload() {
  const [tracks] = useState(demo);

  return (
    <AssetUploadCard title="Audio Manager" subtitle="Manage background audio tracks for your profile.">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Audio URL (mp3)"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
        />
      </div>

      {tracks.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {tracks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <MusicIcon />
                <div>
                  <p className="text-xs font-medium text-white/70">{t.name}</p>
                  <p className="text-[10px] text-white/30">{t.duration}</p>
                </div>
              </div>
              <button className="rounded px-2 py-1 text-[10px] text-white/30 transition hover:bg-white/[0.04] hover:text-red-400">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-4 text-xs text-white/40 transition hover:border-white/[0.2] hover:text-violet-400">
        <PlusIcon />
        Add track
      </button>
    </AssetUploadCard>
  );
}

function MusicIcon() {
  return (
    <svg className="h-4 w-4 text-cyan-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
