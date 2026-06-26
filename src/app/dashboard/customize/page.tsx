"use client";

import { useState, useCallback, useEffect } from "react";
import { AssetsUploader } from "@/components/dashboard/AssetsUploader";
import { GeneralCustomization } from "@/components/dashboard/GeneralCustomization";
import { ColorCustomization } from "@/components/dashboard/ColorCustomization";
import { OtherCustomization } from "@/components/dashboard/OtherCustomization";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { saveProfileAction } from "./actions";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { createClient } from "@/lib/supabase/client";

export default function CustomizePage() {
  const [cfg, setCfg] = useState<ProfileConfig>(() => normalizeConfig(brazyProfile));
  const [cursorUploadUrl, setCursorUploadUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const identities = data.user.identities ?? [];
        const discordIdent = identities.find((i) => i.provider === "discord");
        const username =
          (discordIdent?.identity_data?.username as string | undefined) ??
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          "user";
        setCfg((c) => ({
          ...c,
          identity: { ...c.identity, username },
        }));
      }
    });
  }, []);

  const updateNested = useCallback(
    (section: keyof ProfileConfig, key: string, value: unknown) => {
      setCfg((c) => ({
        ...c,
        [section]: { ...(c[section] as Record<string, unknown>), [key]: value } as never,
      }));
    },
    [],
  );

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("saving");
    try {
      const { error } = await saveProfileAction(cfg);
      if (error) {
        setSaveStatus("error");
        console.error("Save failed:", error);
      } else {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ gap: 15 }}>
      <SectionCard title="Assets Uploader">
        <AssetsUploader
          backgroundUrl={cfg.background.imageUrl}
          onBackgroundChange={(url) => updateNested("background", "imageUrl", url)}
          avatarUrl={cfg.identity.avatarUrl}
          onAvatarChange={(url) => updateNested("identity", "avatarUrl", url)}
          cursorUrl={cursorUploadUrl}
          onCursorChange={setCursorUploadUrl}
        />
      </SectionCard>

      <SectionCard title="General Customization">
        <GeneralCustomization
          identity={cfg.identity}
          theme={cfg.theme}
          background={cfg.background}
          effects={cfg.effects}
          audio={cfg.audio}
          onUpdate={updateNested}
        />
      </SectionCard>

      <SectionCard title="Color Customization">
        <ColorCustomization
          theme={cfg.theme}
          background={cfg.background}
          onUpdate={updateNested}
        />
      </SectionCard>

      <SectionCard title="Other Customization">
        <OtherCustomization
          effects={cfg.effects}
          audio={cfg.audio}
          onUpdate={updateNested}
        />
      </SectionCard>

      <button
        style={{
          display: "flex",
          justifyContent: "center",
          color: "#fafafa",
          width: "100%",
          backgroundColor:
            saveStatus === "success"
              ? "rgba(34,197,94,0.44)"
              : saveStatus === "error"
                ? "rgba(239,68,68,0.44)"
                : "rgba(126,44,139,0.44)",
          border: `2px solid ${
            saveStatus === "success"
              ? "rgba(34,197,94,0.61)"
              : saveStatus === "error"
                ? "rgba(239,68,68,0.61)"
                : "rgba(126,44,139,0.61)"
          }`,
          padding: 10,
          borderRadius: 20,
          cursor: saving ? "not-allowed" : "pointer",
          height: 45,
          alignItems: "center",
          transition: "0.25s",
          marginTop: 15,
          fontSize: 16,
          fontWeight: 500,
          fontFamily: "Satoshi, sans-serif",
          opacity: saving ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!saving && saveStatus !== "success" && saveStatus !== "error")
            e.currentTarget.style.backgroundColor = "rgba(126,44,139,0.49)";
        }}
        onMouseDown={(e) => {
          if (!saving) e.currentTarget.style.transform = "translateY(4px)";
        }}
        onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        onMouseLeave={(e) => {
          if (saveStatus !== "success" && saveStatus !== "error")
            e.currentTarget.style.backgroundColor = "rgba(126,44,139,0.44)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        onClick={handleSave}
        disabled={saving}
      >
        {saveStatus === "saving"
          ? "Saving..."
          : saveStatus === "success"
            ? "Saved!"
            : saveStatus === "error"
              ? "Failed — try again"
              : "Save Changes"}
      </button>
    </div>
  );
}
