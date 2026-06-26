import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();

  if (configured) {
    const supabase = await createClient();
    if (!supabase) return <>{children}</>;
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      redirect("/");
    }
  }

  return <>{children}</>;
}
