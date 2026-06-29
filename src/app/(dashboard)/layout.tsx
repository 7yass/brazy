import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PageTransition from "@/components/dashboard/PageTransition";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  if (configured) {
    const supabase = await createClient();
    if (!supabase) return <>{children}</>;
    const { data } = await supabase.auth.getUser();
    if (!data?.user) redirect("/");
  }
  return (
    <div className="flex h-screen overflow-hidden bg-[#08070d]" style={{ fontFamily: "Satoshi, sans-serif" }}>
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ padding: "45px" }}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
