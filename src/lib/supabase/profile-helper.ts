// src/lib/supabase/profile-helper.ts
"use client";

import { hasuraRequest } from "@/lib/hasuraClient";
import { GET_PROFILE, UPDATE_PROFILE } from "@/lib/hasuraQueries";
import { normalizeConfig, ProfileConfig } from "../profile/schema";
import { createClient } from "./client";

export async function clientGetProfile() {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase client not configured");

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  const data = await hasuraRequest<{
    profiles: { id: string; user_id: string; username: string; config: Record<string, unknown> }[];
  }>(GET_PROFILE, { user_id: user.id });

  const profile = data.profiles[0] ?? null;

  return {
    userId: user.id,
    config: normalizeConfig(profile?.config ?? {}),
    profile,
  };
}

export async function clientSaveProfile(config: ProfileConfig) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase client not configured");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  await hasuraRequest(UPDATE_PROFILE, {
    user_id: user.id,
    changes: { config },
  });
}