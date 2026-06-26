import ProfileRenderer from "@/components/profile/ProfileRenderer";
import { brazyProfile } from "@/lib/profile/defaults";

export default function Home() {
  return <ProfileRenderer config={brazyProfile} />;
}
