"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { AssetsUploader } from "@/components/dashboard/AssetsUploader";
import { GeneralCustomization } from "@/components/dashboard/GeneralCustomization";
import { ColorCustomization } from "@/components/dashboard/ColorCustomization";
import { OtherCustomization } from "@/components/dashboard/OtherCustomization";
import { MusicSearch } from "@/components/dashboard/MusicSearch";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { saveProfileAction } from "./actions";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { createClient } from "@/lib/supabase/client";

function showToast(msg: string) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = [
    "position:fixed",
    "bottom:24px",
    "left:50%",
    "transform:translateX(-50%)",
    "background:#141414",
    "border:2px solid #181818",
    "border-radius:999px",
    "padding:8px 18px",
    "color:#a1a1a1",
    "font-size:13px",
    "font-family:Satoshi,sans-serif",
    "z-index:99999",
    "transition:opacity 0.3s",
    "opacity:1",
    "pointer-events:none",
  ].join(";");
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

export default function CustomizePage() {
  const [cfg, setCfg] = useState<ProfileConfig>(() => normalizeConfig(brazyProfile));
  const [cursorUploadUrl, setCursorUploadUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lyrics, setLyrics] = useState<{ time: number | null; text: string }[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<{ trackId: string; title: string; artist: string; thumb: string } | null>(null);

  const cfgRef = useRef(cfg);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);
  const selectedTrackRef = useRef(selectedTrack);

  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  useEffect(() => { selectedTrackRef.current = selectedTrack; }, [selectedTrack]);

  const doSave = useCallback(async (config: ProfileConfig) => {
    if (isSavingRef.current) {
      pendingSaveRef.current = true;
      return;
    }
    isSavingRef.current = true;
    pendingSaveRef.current = false;
    setSaveStatus("saving");
    try {
      const track = selectedTrackRef.current;
      await saveProfileAction(config, track ? {
        audio_track_id: track.trackId,
        audio_source: "youtube",
        audio_title: track.title,
        audio_artist: track.artist,
        audio_thumb: track.thumb,
      } : undefined);
      if (pendingSaveRef.current) {
        isSavingRef.current = false;
        doSave(cfgRef.current);
        return;
      }
      setSaveStatus("saved");
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
      savedFadeRef.current = setTimeout(() => {
        setSaveStatus("idle");
        savedFadeRef.current = null;
      }, 2000);
    } catch {
      /* silently retry next change */
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  const scheduleSave = useCallback((immediate = false) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    if (immediate) {
      doSave(cfgRef.current);
    } else {
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        doSave(cfgRef.current);
      }, 800);
    }
  }, [doSave]);

  const updateNested = useCallback(
    (section: keyof ProfileConfig, key: string, value: unknown) => {
      setCfg((c) => {
        const next = {
          ...c,
          [section]: { ...(c[section] as Record<string, unknown>), [key]: value } as never,
        };
        cfgRef.current = next;
        return next;
      });
      scheduleSave(false);
    },
    [scheduleSave],
  );

  const uploadCallback = useCallback(
    (section: keyof ProfileConfig, key: string, value: unknown) => {
      setCfg((c) => {
        const next = {
          ...c,
          [section]: { ...(c[section] as Record<string, unknown>), [key]: value } as never,
        };
        cfgRef.current = next;
        return next;
      });
      scheduleSave(true);
    },
    [scheduleSave],
  );

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
        setCfg((c) => {
          const next = { ...c, identity: { ...c.identity, username } };
          cfgRef.current = next;
          return next;
        });
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
      if (!isSavingRef.current && cfgRef.current) {
        const track = selectedTrackRef.current;
        saveProfileAction(cfgRef.current, track ? {
          audio_track_id: track.trackId,
          audio_source: "youtube",
          audio_title: track.title,
          audio_artist: track.artist,
          audio_thumb: track.thumb,
        } : undefined).then(() => showToast("Changes saved")).catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col" style={{ gap: 15, position: "relative" }}>
      {saveStatus !== "idle" && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#141414",
            border: "2px solid #181818",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 13,
            color: "#a1a1a1",
            fontFamily: "Satoshi, sans-serif",
            transition: saveStatus === "saved" ? "opacity 0.4s" : "none",
          }}
        >
          {saveStatus === "saving" ? (
            "Saving..."
          ) : (
            <>
              <Check style={{ width: 12, height: 12, color: "#22c55e" }} />
              Saved
            </>
          )}
        </div>
      )}

      <SectionCard title="Assets Uploader">
        <AssetsUploader
          backgroundUrl={cfg.background.imageUrl}
          onBackgroundChange={(url) => uploadCallback("background", "imageUrl", url)}
          avatarUrl={cfg.identity.avatarUrl}
          onAvatarChange={(url) => uploadCallback("identity", "avatarUrl", url)}
          cursorUrl={cursorUploadUrl}
          onCursorChange={setCursorUploadUrl}
          audioUrl={cfg.audio.src}
          onAudioChange={(url) => uploadCallback("audio", "src", url)}
          audioVolume={cfg.audio.volume}
          onAudioVolumeChange={(v) => updateNested("audio", "volume", v)}
          lyrics={lyrics}
          onLyricsChange={setLyrics}
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

      <SectionCard title="Music Search">
        <MusicSearch
          selectedTrack={selectedTrack}
          onSelect={(track) => {
            setSelectedTrack(track);
            uploadCallback("audio", "src", `https://www.youtube.com/watch?v=${track.trackId}`);
          }}
          onClear={() => {
            setSelectedTrack(null);
            uploadCallback("audio", "src", "");
          }}
        />
      </SectionCard>
    </div>
  );
}
