"use client";

import { AssetUploadCard, UploadZone } from "./AssetUploadCard";

export function AvatarUpload() {
  return (
    <AssetUploadCard title="Profile Avatar" subtitle="Upload your profile avatar.">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Avatar URL"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
        />
      </div>
      <UploadZone label="Upload avatar" />
    </AssetUploadCard>
  );
}
