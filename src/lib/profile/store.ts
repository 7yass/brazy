import type { ProfileConfig } from "./schema";
import { normalizeConfig } from "./schema";
import { brazyProfile } from "./defaults";
import { createClient } from "@/lib/supabase/server";

const seedProfiles: Record<string, ProfileConfig> = {
  brazy: brazyProfile,
};

export type ProfileRecord = {
  username: string;
  config: ProfileConfig;
  views: number;
  createdAt: string;
};

export async function getProfile(
  username: string,
): Promise<ProfileRecord | null> {
  const key = username.toLowerCase().trim();

  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, config, views, created_at")
      .eq("username", key)
      .maybeSingle();

    if (error || !data) {
      return seedProfiles[key]
        ? toRecord(key, seedProfiles[key])
        : null;
    }

    return {
      username: data.username,
      config: normalizeConfig(data.config),
      views: data.views ?? 0,
      createdAt: data.created_at ?? new Date().toISOString(),
    };
  }

  return seedProfiles[key] ? toRecord(key, seedProfiles[key]) : null;
}

export async function listUsernames(): Promise<string[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .order("created_at", { ascending: false });
    if (data && data.length) {
      return data.map((row: { username: string }) => row.username);
    }
  }
  return Object.keys(seedProfiles);
}

function toRecord(username: string, config: ProfileConfig): ProfileRecord {
  return {
    username,
    config,
    views: 0,
    createdAt: new Date().toISOString(),
  };
}
