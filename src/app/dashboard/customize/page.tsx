"use client";

import { Upload } from "lucide-react";
import { TextInput, SelectInput, ColorInput } from "@/components/dashboard/controls";

const cursorOpts = [
  { value: "none" as const, label: "None" },
  { value: "trail" as const, label: "Trail" },
  { value: "sparkles" as const, label: "Sparkles" },
  { value: "dots" as const, label: "Dots" },
  { value: "rings" as const, label: "Rings" },
];

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white/90">Customize</h1>
        <p className="mt-0.5 text-sm text-white/40">Personalize your profile</p>
      </div>

      <div className="flex flex-col gap-5">
        <SectionCard title="Assets Uploader">
          <AssetCard
            title="Background Image & Video"
            helper="Upload a background image or video for your profile."
          >
            <div className="mb-3 flex items-center gap-2">
              <TextInput value="" onChange={() => {}} placeholder="Image URL" />
              <TextInput value="" onChange={() => {}} placeholder="Video URL" />
            </div>
            <UploadZone label="Upload image or video" />
          </AssetCard>

          <AssetCard
            title="Profile Avatar"
            helper="Upload your profile avatar."
          >
            <div className="mb-3">
              <TextInput value="" onChange={() => {}} placeholder="Avatar URL" />
            </div>
            <UploadZone label="Upload avatar" />
          </AssetCard>

          <AssetCard
            title="Audio Manager"
            helper="Upload an audio file for background music."
          >
            <div className="mb-3">
              <TextInput value="" onChange={() => {}} placeholder="Audio URL (mp3)" />
            </div>
            <UploadZone label="Upload audio" />
          </AssetCard>

          <AssetCard
            title="Custom Cursor"
            helper="Choose a cursor effect and color."
          >
            <div className="mb-3 flex items-center gap-3">
              <SelectInput value="none" onChange={() => {}} options={cursorOpts} />
              <ColorInput value="#a78bfa" onChange={() => {}} />
            </div>
            <UploadZone label="Upload cursor file" />
          </AssetCard>
        </SectionCard>

        <SectionCard title="General Customization" />
        <SectionCard title="Color Customization" />
        <SectionCard title="Other Customization" />
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-[15px] border border-white/[0.06] bg-[#111] px-6 py-5">
      <h3 className="mb-5 text-base font-semibold text-white/90">{title}</h3>
      {children && <div className="flex flex-col gap-4">{children}</div>}
    </div>
  );
}

function AssetCard({ title, helper, children }: { title: string; helper: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-sm font-medium text-white/80">{title}</p>
      <p className="mb-3 text-xs text-white/40">{helper}</p>
      {children}
    </div>
  );
}

function UploadZone({ label }: { label: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
      <Upload className="h-4 w-4 text-white/30" />
      <p className="text-xs text-white/40">
        <span className="font-medium text-violet-400">Click to upload</span> — {label}
      </p>
    </div>
  );
}
