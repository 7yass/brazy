import type { ProfileConfig } from "./schema";
import { normalizeConfig } from "./schema";
import { brazyProfile } from "./defaults";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const key = username.toLowerCase().trim();
  if (key === brazyProfile.identity.username) return false;
  const supabase = await createClient();
  if (!supabase) return true;
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", key)
    .maybeSingle();
  return !data;
}

export async function getCurrentUserProfile(userId: string): Promise<ProfileRecord | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("username, config, views, created_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return null;
  return {
    username: data.username,
    config: normalizeConfig(data.config),
    views: data.views ?? 0,
    createdAt: data.created_at ?? new Date().toISOString(),
  };
}

export async function saveProfile(
  userId: string,
  username: string,
  config: ProfileConfig,
): Promise<{ error: string | null }> {
  const key = username.toLowerCase().trim();
  if (!/^[a-z0-9_]{3,20}$/.test(key)) {
    return { error: "username must be 3-20 chars: lowercase letters, numbers, underscores" };
  }
  if (key === brazyProfile.identity.username) {
    return { error: "that username is reserved" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "database not configured" };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      { user_id: userId, username: key, config, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );

  if (error) {
    if (error.code === "23505") {
      return { error: "that username is already taken" };
    }
    return { error: error.message };
  }

  return { error: null };
}
