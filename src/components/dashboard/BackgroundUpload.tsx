"use client";

import { AssetUploadCard, UploadZone } from "./AssetUploadCard";

export function BackgroundUpload() {
  return (
    <AssetUploadCard title="Background Image & Video" subtitle="Upload a background image or video for your profile.">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Image URL"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
        />
        <input
          type="text"
          placeholder="Video URL"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
        />
      </div>
      <UploadZone label="Upload image or video" />
    </AssetUploadCard>
  );
}
