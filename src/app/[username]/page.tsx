import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProfileRenderer from "@/components/profile/ProfileRenderer";
import { getProfile } from "@/lib/profile/store";
import { normalizeConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";

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
      return <ProfileRenderer config={brazyProfile} username={username} views={0} />;
    }
    return notFound();
  }

  const config = normalizeConfig(profile.config);

  return <ProfileRenderer config={config} username={username} views={profile.views} />;
}
