"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { brazyProfile } from "@/lib/profile/defaults";
import { normalizeConfig } from "@/lib/profile/schema";
import { checkUsernameAction, registerCompleteAction } from "./actions";
import { SpiderLogo } from "@/components/spider-logo";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "#0a0404",
        fontFamily: "Satoshi, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 420,
        borderRadius: 24,
        border: "1px solid rgba(220,38,38,0.12)",
        background: "rgba(15,5,5,0.9)",
        backdropFilter: "blur(20px)",
        padding: "36px 32px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "rgba(220,38,38,0.12)",
            border: "1px solid rgba(220,38,38,0.25)",
            marginBottom: 16,
            color: "#dc2626",
          }}>
            <SpiderLogo width={24} height={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>
            Claim your page
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
            Pick your username, then connect Discord
          </p>
        </div>

        {/* Username input */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Your URL</p>
          <div style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 12,
            border: `1px solid ${
              status === "available" ? "rgba(34,197,94,0.3)" :
              status === "taken" || status === "invalid" ? "rgba(220,38,38,0.3)" :
              "rgba(255,255,255,0.08)"
            }`,
            background: "rgba(255,255,255,0.03)",
            padding: "10px 14px",
            transition: "border-color 0.2s",
          }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>brazy.it/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
              placeholder="username"
              autoFocus
              style={{
                flex: 1,
                minWidth: 0,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 16,
                fontWeight: 600,
                color: "#fafafa",
                fontFamily: "inherit",
              }}
            />
            {status === "checking" && <Loader2 style={{ width: 16, height: 16, color: "rgba(255,255,255,0.3)", flexShrink: 0, animation: "spin 1s linear infinite" }} />}
            {status === "available" && <Check style={{ width: 16, height: 16, color: "#22c55e", flexShrink: 0 }} />}
            {(status === "taken" || status === "invalid") && <X style={{ width: 16, height: 16, color: "#dc2626", flexShrink: 0 }} />}
          </div>
          {status !== "idle" && (
            <p style={{ margin: "6px 0 0", fontSize: 12, color:
              status === "available" ? "#22c55e" :
              status === "checking" ? "rgba(255,255,255,0.3)" :
              "#f87171"
            }}>
              {status === "invalid" && "3–20 chars · lowercase letters, numbers, underscores only"}
              {status === "checking" && "Checking availability..."}
              {status === "available" && `brazy.it/${username.trim().toLowerCase()} is yours!`}
              {status === "taken" && "Already taken, try another"}
            </p>
          )}
        </div>

        {/* Discord connect */}
        {(status === "available" || discordConnected) && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Connect</p>
            {discordConnected ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 12,
                border: "1px solid rgba(34,197,94,0.2)",
                background: "rgba(34,197,94,0.06)",
                padding: "10px 14px",
              }}>
                <Check style={{ width: 16, height: 16, color: "#22c55e" }} />
                <span style={{ fontSize: 14, color: "#22c55e" }}>Discord connected</span>
              </div>
            ) : (
              <button
                onClick={handleDiscordConnect}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  borderRadius: 12,
                  background: "#5865F2",
                  border: "none",
                  padding: "11px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#4752C4"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#5865F2"; }}
              >
                <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                Connect with Discord
              </button>
            )}
          </div>
        )}

        {/* Claim button */}
        <button
          onClick={handleRegister}
          disabled={!canRegister || registering}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 12,
            border: "none",
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 700,
            color: canRegister && !registering ? "#fff" : "rgba(255,255,255,0.3)",
            background: canRegister && !registering
              ? "linear-gradient(135deg, #dc2626, #e11d48)"
              : "rgba(255,255,255,0.05)",
            cursor: canRegister && !registering ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.2s",
            boxShadow: canRegister && !registering ? "0 0 24px rgba(220,38,38,0.3)" : "none",
          }}
        >
          {registering && <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />}
          {registering ? "Creating your page..." : "Claim your page →"}
        </button>

        {registerError && (
          <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 12, color: "#f87171" }}>{registerError}</p>
        )}

        <p style={{ margin: "20px 0 0", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#dc2626", textDecoration: "none" }}>Sign in →</Link>
        </p>

        <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
          By registering you agree to our Terms of Service.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
