import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProfileRenderer from "@/components/profile/ProfileRenderer";
import { getProfile } from "@/lib/profile/store";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return { title: "brazy" };
  const title = profile.config.seo.title || `${profile.config.identity.displayName || username} — brazy`;
  const description = profile.config.seo.description || profile.config.identity.bio || "";
  return { title, description };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    if (username.toLowerCase() === brazyProfile.identity.username.toLowerCase()) {
      return <ProfileRenderer config={brazyProfile} />;
    }
    return notFound();
  }

  const config = normalizeConfig(profile.config);
  let profileBadges: { id: string; label: string; description: string; icon: string; color: string }[] = [];

  if (profile.user_id) {
    const supabase = await createClient();
    if (supabase) {
      const { data: badgeRows } = await supabase
        .from("profile_badges")
        .select("badge_id, badges(id, label, description, icon, color, order_index)")
        .eq("user_id", profile.user_id)
        .order("order_index", { referencedTable: "badges", ascending: true });
      for (const row of badgeRows ?? []) {
        const b = row.badges;
        if (Array.isArray(b)) {
          for (const bg of b) if (bg) profileBadges.push(bg);
        } else if (b) {
          profileBadges.push(b);
        }
      }
    }
  }

  if (config.badges?.enabled && config.badges.items) {
    const configBadges = config.badges.items.map((item: any) => ({
      id: item.id || item.emoji || Math.random().toString(),
      label: item.label || item.emoji,
      description: item.tooltip || "",
      icon: item.emoji,
      color: item.color || "#ffffff"
    }));
    profileBadges = [...profileBadges, ...configBadges];
  }

  return (
    <ProfileRenderer
      config={config}
      audioTrackId={profile.audio_track_id}
      audioTitle={profile.audio_title}
      audioArtist={profile.audio_artist}
      audioThumb={profile.audio_thumb}
      profileBadges={profileBadges}
    />
  );
}
