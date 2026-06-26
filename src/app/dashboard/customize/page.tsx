"use client";

import { AssetsUploader } from "@/components/dashboard/AssetsUploader";
import { GeneralCustomization } from "@/components/dashboard/GeneralCustomization";
import { ColorCustomization } from "@/components/dashboard/ColorCustomization";
import { OtherCustomization } from "@/components/dashboard/OtherCustomization";

export default function CustomizePage() {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <SectionCard title="Assets Uploader">
        <AssetsUploader />
      </SectionCard>

      <SectionCard title="General Customization">
        <GeneralCustomization />
      </SectionCard>

      <SectionCard title="Color Customization">
        <ColorCustomization />
      </SectionCard>

      <SectionCard title="Other Customization">
        <OtherCustomization />
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#141414",
        border: "2px solid #181818",
        borderRadius: 25,
        padding: 20,
      }}
    >
      <h3
        style={{
          margin: "0 0 5.5px 3px",
          fontSize: 16.5,
          fontWeight: 500,
          color: "#c5c5c5",
        }}
      >
        {title}
      </h3>
      <div className="flex flex-col" style={{ gap: 14 }}>
        {children}
      </div>
    </div>
  );
}
