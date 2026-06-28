"use client";

import { useEffect, useState } from "react";
import { Eye, Link2, Award, BarChart3, ChevronRight, Settings, ExternalLink, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

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
  const [config, setConfig] = useState<ProfileConfig | null>(null);

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
        
        let { data: profile, error } = await supabase.from("profiles").select("username, config").eq("user_id", user.id).maybeSingle();
        if (error || !profile) {
          const { data: profileById } = await supabase.from("profiles").select("username, config").eq("id", user.id).maybeSingle();
          if (profileById) profile = profileById;
        }
        setUsername(profile?.username ?? fallback);
        if (profile?.config) {
          setConfig(normalizeConfig(profile.config));
        }
      } finally { setLoading(false); }
    })();
  }, []);

  const profileViews = config?.analytics?.trackViews ? "Tracking" : "Off";
  const numLinks = config?.social?.links?.length ?? 0;
  const numBadges = config?.badges?.items?.length ?? 0;
  const numWidgets = Object.values(config?.widgets || {}).filter((w: any) => w.enabled).length;

  const stats = [
    { icon: Eye,      label: "Profile Views", value: profileViews, href: "/dashboard/analytics" },
    { icon: Link2,    label: "Social Links",  value: numLinks.toString(), href: "/dashboard/links" },
    { icon: Award,    label: "Badges",        value: numBadges.toString(), href: "/dashboard/badges" },
    { icon: BarChart3,label: "Widgets",       value: numWidgets.toString(), href: "/dashboard/widgets" },
  ];

  // Calculate completeness
  let score = 0;
  if (config) {
    if (config.identity.avatarUrl) score += 20;
    if (config.identity.bio) score += 20;
    if (config.social.links.length > 0) score += 20;
    if (config.background.type !== "color") score += 20;
    if (config.theme.primaryColor !== "#a855f7") score += 20;
  }
  const completeness = Math.min(100, score || 10);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>

      <header>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Account</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Your profile & stats at a glance.</p>
      </header>

      <Card>
        <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #dc2626, #e11d48)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 0 24px rgba(220,38,38,0.35)", overflow: "hidden" }}>
            {config?.identity?.avatarUrl ? (
              <img src={config.identity.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : loading ? "?" : (username?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fafafa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {loading ? "Loading…" : username}
              </p>
              {config?.identity?.verified && <ShieldCheck style={{ width: 14, height: 14, color: "#3b82f6" }} />}
            </div>
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
        
        {/* Completeness bar */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Profile Completeness</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: completeness === 100 ? "#22c55e" : "#dc2626" }}>{completeness}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${completeness}%`, height: "100%", background: completeness === 100 ? "#22c55e" : "linear-gradient(90deg, #dc2626, #e11d48)", transition: "width 0.5s ease-out" }} />
          </div>
          {completeness < 100 && (
            <p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Add an avatar, bio, and custom background to hit 100%.</p>
          )}
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
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fafafa" }}>{loading ? "—" : s.value}</p>
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
