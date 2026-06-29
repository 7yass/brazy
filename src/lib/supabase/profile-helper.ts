// src/lib/supabase/profile-helper.ts
"use client";

import { normalizeConfig, ProfileConfig } from "../profile/schema";
import { createClient } from "./client";
import { revalidateProfile } from "@/lib/profile/actions";

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

  const audioMeta = config.audio;
  const updates = {
    config,
    audio_title: audioMeta?.title || null,
    audio_artist: audioMeta?.artist || null,
    audio_thumb: audioMeta?.coverUrl || null,
    audio_track_id: audioMeta?.trackId || null,
    audio_source: audioMeta?.src || null,
  };

  // Try updating by user_id first
  const { data: updated, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select("id, username")
    .maybeSingle();

  let username = updated?.username;

  if (error || !updated) {
    // Fall back to updating by id
    const { data: updatedById } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select("username")
      .maybeSingle();
    username = updatedById?.username;
  }

  if (username) {
    await revalidateProfile(username);
  }
}