"use client";

import { createClient } from "./client";
import { normalizeConfig, ProfileConfig } from "../profile/schema";

export async function clientGetProfile() {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase client not configured");

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  // Try querying by user_id
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("config, id, username")
    .eq("user_id", user.id)
    .maybeSingle();

  // If that failed or column doesn't exist, try querying by id
  if (error || !profile) {
    const { data: profileById, error: errorById } = await supabase
      .from("profiles")
      .select("config, id, username")
      .eq("id", user.id)
      .maybeSingle();
    
    if (!errorById && profileById) {
      profile = profileById;
    } else {
      console.error("Failed to fetch profile by both user_id and id:", error, errorById);
    }
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

  // Try upserting with id first
  const { error: errorId } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (!errorId) return;

  // If that fails, try upserting with user_id
  const { error: errorUserId } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (errorUserId) {
    console.error("Failed to save profile config by both id and user_id:", errorId, errorUserId);
    throw new Error(errorUserId.message || errorId.message);
  }
}
