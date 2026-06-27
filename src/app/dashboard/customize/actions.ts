"use server";

import { saveProfile } from "@/lib/profile/store";
import { createClient } from "@/lib/supabase/server";
import type { ProfileConfig } from "@/lib/profile/schema";

export async function saveProfileAction(
  config: ProfileConfig,
  audioMeta?: {
    audio_track_id?: string;
    audio_source?: string;
    audio_title?: string;
    audio_artist?: string;
    audio_thumb?: string;
  },
  customUsername?: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "database not configured" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not authenticated" };

  let username: string;

  if (customUsername !== undefined) {
    const key = customUsername.toLowerCase().trim();
    if (!/^[a-z0-9_]{3,20}$/.test(key)) {
      return { error: "username must be 3-20 chars: lowercase letters, numbers, underscores" };
    }
    username = key;
  } else {
    const identities = user.identities ?? [];
    const discordIdent = identities.find((i) => i.provider === "discord");
    username =
      (discordIdent?.identity_data?.username as string | undefined) ??
      user.user_metadata?.full_name ??
      user.email?.split("@")[0] ??
      "user";
  }

  const merged: ProfileConfig = {
    ...config,
    identity: { ...config.identity, username },
  };

  return saveProfile(user.id, username, merged, audioMeta);
}
