"use client";

import { useState, useEffect } from "react";
import {
  Link2, Eye, Palette, Layers, Award, Sparkles,
  ExternalLink, Image as ImageIcon, Settings, ChevronRight,
  TrendingUp, Users, Globe
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const F = "Satoshi, system-ui, sans-serif";

export default function DashboardHome() {
  const [username, setUsername] = useState<string | null>(null);
  const [linkCount, setLinkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const identities = user.identities ?? [];
        const discordIdent = identities.find((i) => i.provider === "discord");
        const fallback =
          (discordIdent?.identity_data?.username as string | undefined) ??
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ?? "user";
        const { data: profile } = await supabase
          .from("profiles").select("username, config").eq("id", user.id).maybeSingle();
        setUsername(profile?.username ?? fallback);
        const links = profile?.config?.social?.links;
        if (Array.isArray(links)) setLinkCount(links.length);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: F, maxWidth: 900 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>
            {loading ? "Overview" : `Hey, ${username ?? "there"} 👋`}
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Here&apos;s what&apos;s going on with your brazy page.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: 999, background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            padding: "4px 12px", fontSize: 12, color: "#22c55e",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
            Live
          </span>
          {!loading && username && (
            <a
              href={`https://brazy.it/${username}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                borderRadius: 10, border: "1px solid rgba(220,38,38,0.25)",
                background: "rgba(220,38,38,0.08)",
                padding: "5px 12px", fontSize: 12, fontWeight: 600,
                color: "#dc2626", textDecoration: "none",
              }}
            >
              <Globe style={{ width: 12, height: 12 }} />
              View page
              <ExternalLink style={{ width: 11, height: 11, opacity: 0.7 }} />
            </a>
          )}
        </div>
      </div>

      {/* Stats bento */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { icon: Link2, label: "Social Links", value: loading ? "—" : String(linkCount), color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.15)", href: "/dashboard/links" },
          { icon: Eye, label: "Profile Views", value: "—", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)", href: "/dashboard/analytics" },
          { icon: Award, label: "Badges", value: "—", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.15)", href: "/dashboard/badges" },
          { icon: TrendingUp, label: "Clicks", value: "—", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.15)", href: "/dashboard/analytics" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: 16, border: `1px solid ${s.border}`, background: s.bg, padding: "18px 20px", cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon style={{ width: 15, height: 15, color: s.color }} />
                </div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Quick Actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { href: "/dashboard/customize", label: "Customize Theme", desc: "Colors, backgrounds & effects", icon: Palette, accent: "#e11d48" },
            { href: "/dashboard/links", label: "Manage Links", desc: "Add or edit your social links", icon: Link2, accent: "#dc2626" },
            { href: "/dashboard/sections", label: "Edit Sections", desc: "Compose your profile layout", icon: Layers, accent: "#f43f5e" },
            { href: "/dashboard/widgets", label: "Widgets", desc: "Embeds, music & more", icon: Sparkles, accent: "#fb7185" },
            { href: "/dashboard/assets", label: "Assets", desc: "Upload & manage your files", icon: ImageIcon, accent: "#fda4af" },
            { href: "/dashboard/settings", label: "Settings", desc: "Account & preferences", icon: Settings, accent: "#f87171" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `${a.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 16, height: 16, color: a.accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{a.label}</span>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{a.desc}</p>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 2 }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Your page card */}
      {!loading && username && (
        <div>
          <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Your Page</p>
          <a
            href={`https://brazy.it/${username}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 16, borderRadius: 18, border: "1px solid rgba(220,38,38,0.15)", background: "linear-gradient(135deg, rgba(220,38,38,0.04) 0%, rgba(225,29,72,0.04) 100%)", padding: "18px 22px", textDecoration: "none" }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: "linear-gradient(135deg, #dc2626, #e11d48)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", boxShadow: "0 0 16px rgba(220,38,38,0.35)" }}>
              {username[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fafafa" }}>{username}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>brazy.it/{username}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(220,38,38,0.8)" }}>Open page</span>
              <ExternalLink style={{ width: 14, height: 14, color: "rgba(220,38,38,0.7)" }} />
            </div>
          </a>
        </div>
      )}

      {/* Share card only */}
      <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "rgba(88,101,242,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Users style={{ width: 16, height: 16, color: "#5865F2" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fafafa" }}>Share your page</p>
          <p style={{ margin: "4px 0 8px", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>Post your brazy link on Discord, Twitter, and more.</p>
          {username && (
            <button
              onClick={() => { try { navigator.clipboard.writeText(`https://brazy.it/${username}`); } catch {} }}
              style={{ background: "none", border: "none", padding: 0, fontSize: 11, fontWeight: 600, color: "#5865F2", cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              Copy link <ChevronRight style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
