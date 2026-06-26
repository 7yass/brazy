"use client";

import { AssetUploadCard, UploadZone } from "./AssetUploadCard";

export function BackgroundUpload() {
  return (
    <AssetUploadCard title="Background Image & Video" subtitle="Upload a background image or video for your profile.">
      <UploadZone label="Upload image or video" />
    </AssetUploadCard>
  );
}
