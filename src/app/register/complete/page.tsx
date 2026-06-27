"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { brazyProfile } from "@/lib/profile/defaults";
import { normalizeConfig } from "@/lib/profile/schema";
import { registerCompleteAction } from "../actions";

export default function RegisterCompletePage() {
  const router = useRouter();
  const [message, setMessage] = useState("Setting up your profile...");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      if (!supabase) { setMessage("Database not configured"); return; }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/register");
        return;
      }

      let pendingUsername = "";
      try { pendingUsername = localStorage.getItem("brazy_pending_username") ?? ""; } catch {}

      if (!pendingUsername) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.username) {
          router.push("/dashboard");
          return;
        }
        router.push("/register");
        return;
      }

      try { localStorage.removeItem("brazy_pending_username"); } catch {}

      setMessage(`Creating brazy.it/${pendingUsername} ...`);

      const config = normalizeConfig(brazyProfile);
      config.identity.username = pendingUsername;
      config.identity.displayName = pendingUsername;

      const res = await registerCompleteAction(pendingUsername, config);
      if (res.error) {
        setMessage(res.error);
        setTimeout(() => router.push("/register"), 2000);
      } else {
        router.push("/dashboard");
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
        <p className="text-sm text-white/60">{message}</p>
      </div>
    </div>
  );
}
