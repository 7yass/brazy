"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { brazyProfile } from "@/lib/profile/defaults";
import { normalizeConfig } from "@/lib/profile/schema";
import { checkUsernameAction, registerCompleteAction } from "./actions";

type UsernameStatus = "idle" | "invalid" | "checking" | "available" | "taken";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [discordConnected, setDiscordConnected] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef<{ id: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        userRef.current = data.user;
        setDiscordConnected(true);
      }
    });
  }, []);

  useEffect(() => {
    const q = username.trim().toLowerCase();
    if (!q) { setStatus("idle"); return; }
    if (!/^[a-z0-9_]{3,20}$/.test(q)) { setStatus("invalid"); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const { available } = await checkUsernameAction(q);
      setStatus(available ? "available" : "taken");
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username]);

  const canRegister = status === "available" && discordConnected;

  const handleDiscordConnect = async () => {
    const supabase = createClient();
    if (!supabase) return;
    try { localStorage.setItem("brazy_pending_username", username.trim().toLowerCase()); } catch {}
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=/register/complete` },
    });
  };

  const handleRegister = async () => {
    if (!canRegister || !userRef.current) return;
    setRegistering(true);
    setRegisterError("");
    const key = username.trim().toLowerCase();
    const config = normalizeConfig(brazyProfile);
    config.identity.username = key;
    config.identity.displayName = key;
    const res = await registerCompleteAction(key, config);
    if (res.error) {
      setRegisterError(res.error);
      setRegistering(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8" style={{ backdropFilter: "blur(4px)" }}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold text-white">
            B
          </div>
          <h1 className="text-2xl font-bold text-white">Claim your page</h1>
          <p className="mt-1 text-sm text-white/40">Pick your username, then connect Discord</p>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Your URL</p>
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3">
            <span className="shrink-0 text-sm text-white/30">brazy.it/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
              placeholder="username"
              className="ml-1 min-w-0 flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/20"
              autoFocus
            />
          </div>

          {status !== "idle" && (
            <div className="mt-2 flex items-center gap-1.5">
              {statusIcon(status)}
              {statusText(status, username)}
            </div>
          )}
        </div>

        {(status === "available" || discordConnected) && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Connect</p>
            {discordConnected ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Discord connected</span>
              </div>
            ) : (
              <button
                onClick={handleDiscordConnect}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#4752C4]"
              >
                <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                Connect with Discord
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={!canRegister || registering}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            canRegister && !registering
              ? "bg-violet-600 text-white hover:bg-violet-500"
              : "cursor-not-allowed bg-white/[0.04] text-white/30 opacity-50"
          }`}
        >
          {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {registering ? "Creating your page..." : "Claim your page"}
        </button>

        {registerError && (
          <p className="mt-3 text-center text-xs text-red-400">{registerError}</p>
        )}

        <p className="mt-6 text-center text-xs text-white/20">
          By registering you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}

function statusIcon(status: UsernameStatus) {
  switch (status) {
    case "checking": return <Loader2 className="h-4 w-4 animate-spin text-white/30" />;
    case "available": return <Check className="h-4 w-4 text-emerald-400" />;
    case "taken": return <X className="h-4 w-4 text-red-400" />;
    default: return null;
  }
}

function statusText(status: UsernameStatus, username: string) {
  switch (status) {
    case "invalid": return <span className="text-xs text-red-400">3-20 chars, lowercase letters, numbers, underscores only</span>;
    case "checking": return <span className="text-xs text-white/30">Checking...</span>;
    case "available": return <span className="text-xs text-emerald-400">brazy.it/{username.trim().toLowerCase()} is yours!</span>;
    case "taken": return <span className="text-xs text-red-400">Already taken</span>;
    default: return null;
  }
}
