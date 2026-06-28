"use client";

import { useEffect, useState } from "react";
import { Eye, Link2, Award, BarChart3, ChevronRight, Settings, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const F = "Satoshi, system-ui, sans-serif";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

export default function AccountPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setEmail(user.email ?? null);
        const identities = user.identities ?? [];
        const discordIdent = identities.find((i) => i.provider === "discord");
        const fallback =
          (discordIdent?.identity_data?.username as string | undefined) ??
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ?? "user";
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
        setUsername(profile?.username ?? fallback);
      } finally { setLoading(false); }
    })();
  }, []);

  const stats = [
    { icon: Eye,      label: "Profile Views", href: "/dashboard/analytics" },
    { icon: Link2,    label: "Social Links",   href: "/dashboard/links" },
    { icon: Award,    label: "Badges",         href: "/dashboard/badges" },
    { icon: BarChart3,label: "Clicks",         href: "/dashboard/analytics" },
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>

      <header>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Account</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Your profile & stats at a glance.</p>
      </header>

      <Card>
        <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #dc2626, #e11d48)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 0 24px rgba(220,38,38,0.35)" }}>
            {loading ? "?" : (username?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fafafa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {loading ? "Loading…" : username}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email ?? ""}</p>
            {!loading && username && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(220,38,38,0.65)", fontWeight: 600 }}>brazy.it/{username}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Link href="/dashboard/settings" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 13px" }}>
              <Settings style={{ width: 12, height: 12 }} /> Settings
            </Link>
            {username && (
              <a href={`https://brazy.it/${username}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 13px" }}>
                <ExternalLink style={{ width: 12, height: 12 }} /> View page
              </a>
            )}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "border-color 0.15s" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 15, height: 15, color: "#dc2626" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fafafa" }}>—</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                </div>
                <ChevronRight style={{ width: 13, height: 13, color: "rgba(255,255,255,0.15)" }} />
              </div>
            </Link>
          );
        })}
      </div>

      <Link href="/dashboard/customize" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 14, background: "linear-gradient(135deg, #dc2626, #e11d48)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 18px rgba(220,38,38,0.3)" }}>
        Customize my page
      </Link>

    </div>
  );
}
