"use server";

import { isUsernameAvailable, saveProfile } from "@/lib/profile/store";
import { createClient } from "@/lib/supabase/server";
import type { ProfileConfig } from "@/lib/profile/schema";

export async function checkUsernameAction(username: string): Promise<{ available: boolean }> {
  const available = await isUsernameAvailable(username);
  return { available };
}

export async function registerCompleteAction(
  pendingUsername: string,
  config: ProfileConfig,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "database not configured" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not authenticated" };

  return saveProfile(user.id, pendingUsername, config);
}
