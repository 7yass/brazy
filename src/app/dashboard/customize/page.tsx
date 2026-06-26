"use client";

import { AssetsUploader } from "@/components/dashboard/AssetsUploader";
import { GeneralCustomization } from "@/components/dashboard/GeneralCustomization";
import { ColorCustomization } from "@/components/dashboard/ColorCustomization";
import { OtherCustomization } from "@/components/dashboard/OtherCustomization";
import { SectionCard } from "@/components/dashboard/SectionCard";

export default function CustomizePage() {
  return (
    <div className="flex flex-col" style={{ gap: 15 }}>
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

      <button
        style={{
          display: "flex",
          justifyContent: "center",
          color: "#fafafa",
          width: "100%",
          backgroundColor: "rgba(126,44,139,0.44)",
          border: "2px solid rgba(126,44,139,0.61)",
          padding: 10,
          borderRadius: 20,
          cursor: "pointer",
          height: 45,
          alignItems: "center",
          transition: "0.25s",
          marginTop: 15,
          fontSize: 16,
          fontWeight: 500,
          fontFamily: "Satoshi, sans-serif",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(126,44,139,0.49)" }}
        onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(4px)" }}
        onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)" }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(126,44,139,0.44)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        onClick={() => {}}
      >
        Save Changes
      </button>
    </div>
  );
}
