"use client";

import { BackgroundUpload } from "@/components/dashboard/BackgroundUpload";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";
import { AudioManagerUpload } from "@/components/dashboard/AudioManagerUpload";
import { CursorUpload } from "@/components/dashboard/CursorUpload";
import { GeneralCustomization } from "@/components/dashboard/GeneralCustomization";
import { ColorCustomization } from "@/components/dashboard/ColorCustomization";

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white/90">Customize</h1>
        <p className="mt-0.5 text-sm text-white/40">Personalize your profile</p>
      </div>

      <div className="flex flex-col gap-5">
        <SectionCard title="Assets Uploader">
          <BackgroundUpload />
          <AvatarUpload />
          <AudioManagerUpload />
          <CursorUpload />
        </SectionCard>

        <SectionCard title="General Customization">
          <GeneralCustomization />
        </SectionCard>
        <SectionCard title="Color Customization">
          <ColorCustomization />
        </SectionCard>
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
