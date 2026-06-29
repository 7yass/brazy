"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProfile(username: string) {
  if (username) {
    try {
      revalidatePath(`/${username}`);
      revalidatePath(`/[username]`);
    } catch (err) {
      console.error("Failed to revalidate profile path:", err);
    }
  }
}
