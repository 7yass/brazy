"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Check } from "lucide-react";
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

function showToast(msg: string) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.className = [
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999]",
    "rounded-full border border-white/[0.06] bg-[#141414] px-4 py-2",
    "text-sm text-white/60 font-sans transition-opacity duration-300 pointer-events-none",
  ].join(" ");
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

export default function CustomizePage() {
  const STORAGE_KEY = "brazy_customize_state";

  const loadState = () => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
    return {};
  };

  const saveState = (state: Record<string, unknown>) => {
    try { const existing = loadState(); localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...state })); } catch {}
  };

  const persisted = loadState();

  const [cfg, setCfg] = useState<ProfileConfig>(() => ({
    ...normalizeConfig(brazyProfile),
    ...(persisted.config ?? {}),
  }));
  const [cursorUploadUrl, setCursorUploadUrl] = useState(persisted.cursorUploadUrl ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lyrics, setLyrics] = useState<{ time: number | null; text: string }[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<{ trackId: string; title: string; artist: string; thumb: string } | null>(persisted.selectedTrack ?? null);

  const cfgRef = useRef(cfg);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);
  const selectedTrackRef = useRef(selectedTrack);

  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  useEffect(() => { selectedTrackRef.current = selectedTrack; }, [selectedTrack]);

  const doSave = useCallback(async (config: ProfileConfig) => {
    if (isSavingRef.current) { pendingSaveRef.current = true; return; }
    isSavingRef.current = true;
    pendingSaveRef.current = false;
    setSaveStatus("saving");
    try {
      const track = selectedTrackRef.current;
      await saveProfileAction(config, track ? { audio_track_id: track.trackId, audio_source: "youtube", audio_title: track.title, audio_artist: track.artist, audio_thumb: track.thumb } : undefined);
      if (pendingSaveRef.current) { isSavingRef.current = false; doSave(cfgRef.current); return; }
      setSaveStatus("saved");
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
      savedFadeRef.current = setTimeout(() => { setSaveStatus("idle"); savedFadeRef.current = null; }, 2000);
    } catch {} finally { isSavingRef.current = false; }
  }, []);

  const scheduleSave = useCallback((immediate = false) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    if (immediate) { doSave(cfgRef.current); } else { debounceRef.current = setTimeout(() => { debounceRef.current = null; doSave(cfgRef.current); }, 800); }
  }, [doSave]);

  const updateNested = useCallback(
    (section: keyof ProfileConfig, key: string, value: unknown) => {
      setCfg((c) => { const next = { ...c, [section]: { ...(c[section] as Record<string, unknown>), [key]: value } as never }; cfgRef.current = next; saveState({ config: next }); return next; });
      scheduleSave(false);
    },
    [scheduleSave],
  );

  const uploadCallback = useCallback(
    (section: keyof ProfileConfig, key: string, value: unknown) => {
      setCfg((c) => { const next = { ...c, [section]: { ...(c[section] as Record<string, unknown>), [key]: value } as never }; cfgRef.current = next; saveState({ config: next }); return next; });
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
        const username = (discordIdent?.identity_data?.username as string | undefined) ?? data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0] ?? "user";
        setCfg((c) => { const next = { ...c, identity: { ...c.identity, username } }; cfgRef.current = next; return next; });
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current);
      if (!isSavingRef.current && cfgRef.current) {
        const track = selectedTrackRef.current;
        saveProfileAction(cfgRef.current, track ? { audio_track_id: track.trackId, audio_source: "youtube", audio_title: track.title, audio_artist: track.artist, audio_thumb: track.thumb } : undefined)
          .then(() => showToast("Changes saved")).catch(() => {});
      }
    };
  }, []);

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customize</h1>
          <p className="mt-1 text-sm text-white/40">Make your profile page yours.</p>
        </div>
        {saveStatus !== "idle" && (
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-[#141414] px-3 py-1.5 text-xs text-white/60 transition-opacity duration-300">
            {saveStatus === "saving" ? "Saving..." : <><Check className="h-3 w-3 text-emerald-400" /> Saved</>}
          </div>
        )}
      </div>

      <SectionCard title="Assets Uploader">
        <AssetsUploader
          backgroundUrl={cfg.background.imageUrl}
          onBackgroundChange={(url) => uploadCallback("background", "imageUrl", url)}
          avatarUrl={cfg.identity.avatarUrl}
          onAvatarChange={(url) => uploadCallback("identity", "avatarUrl", url)}
          cursorUrl={cursorUploadUrl}
          onCursorChange={(url) => { setCursorUploadUrl(url); saveState({ cursorUploadUrl: url }); }}
          audioUrl={cfg.audio.src}
          onAudioChange={(url) => uploadCallback("audio", "src", url)}
          audioVolume={cfg.audio.volume}
          onAudioVolumeChange={(v) => updateNested("audio", "volume", v)}
          lyrics={lyrics}
          onLyricsChange={setLyrics}
          selectedTrack={selectedTrack}
          onAudioMetaChange={(meta) => {
            setSelectedTrack(meta);
            saveState({ selectedTrack: meta });
            if (meta) { uploadCallback("audio", "src", `https://www.youtube.com/watch?v=${meta.trackId}`); } else { uploadCallback("audio", "src", ""); }
          }}
        />
      </SectionCard>

      <SectionCard title="General Customization">
        <GeneralCustomization identity={cfg.identity} theme={cfg.theme} background={cfg.background} effects={cfg.effects} audio={cfg.audio} onUpdate={updateNested} />
      </SectionCard>

      <SectionCard title="Color Customization">
        <ColorCustomization theme={cfg.theme} background={cfg.background} onUpdate={updateNested} />
      </SectionCard>

      <SectionCard title="Other Customization">
        <OtherCustomization effects={cfg.effects} audio={cfg.audio} onUpdate={updateNested} />
      </SectionCard>
    </div>
  );
}
