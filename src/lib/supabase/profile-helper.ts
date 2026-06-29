// src/lib/supabase/profile-helper.ts
"use client";

import { normalizeConfig, ProfileConfig } from "../profile/schema";
import { createClient } from "./client";

export async function clientGetProfile() {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase client not configured");

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  // Try user_id first, fall back to id
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("id, user_id, username, config, views, audio_title, audio_artist, audio_thumb, audio_track_id, audio_source, created_at, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile) {
    const { data: profileById } = await supabase
      .from("profiles")
      .select("id, user_id, username, config, views, audio_title, audio_artist, audio_thumb, audio_track_id, audio_source, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();
    if (profileById) profile = profileById;
  }

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

  // Try updating by user_id first
  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ config })
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (!error && updated) return;

  // Fall back to updating by id
  const { error: error2 } = await supabase
    .from("profiles")
    .update({ config })
    .eq("id", user.id);

  if (error2) {
    console.error("clientSaveProfile failed:", error2);
    throw new Error(error2.message);
  }
}