"use server";

import { saveProfile } from "@/lib/profile/store";
import { createClient } from "@/lib/supabase/server";
import type { ProfileConfig } from "@/lib/profile/schema";

export async function saveProfileAction(config: ProfileConfig): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "database not configured" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not authenticated" };

  const identities = user.identities ?? [];
  const discordIdent = identities.find((i) => i.provider === "discord");
  const username =
    (discordIdent?.identity_data?.username as string | undefined) ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "user";

  const merged: ProfileConfig = {
    ...config,
    identity: { ...config.identity, username },
  };

  return saveProfile(user.id, username, merged);
}
