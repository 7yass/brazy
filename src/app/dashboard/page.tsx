"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProfileConfig } from "@/lib/profile/schema";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ProfileEditor from "@/components/dashboard/ProfileEditor";

const STORAGE_KEY = "brazy_demo_config";

export default function DashboardPage() {
  const [config, setConfig] = useState<ProfileConfig | null>(null);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(normalizeConfig(JSON.parse(stored)));
        return;
      } catch {}
    }
    setConfig(normalizeConfig(brazyProfile));
  }, []);

  const onSave = useCallback(async (cfg: ProfileConfig) => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
  }, []);

  if (!config) return null;

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <ProfileEditor initialConfig={config} onSave={onSave} saving={saving} />
    </div>
  );
}
