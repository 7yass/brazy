"use client";

import { useEffect, useState } from "react";
import { Eye, Link2, Award, BarChart3, ChevronRight, Settings, ExternalLink, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

const F = "Satoshi, system-ui, sans-serif";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden shadow-2xl">
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
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none">

      <header className="border-b border-white/[0.04] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Overview
        </h1>
        <p className="text-neutral-400 text-sm mt-1">Your profile details, statistics, and profile strength at a glance.</p>
      </header>

      <Card>
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-[0_0_24px_rgba(220,38,38,0.35)] overflow-hidden">
              {config?.identity?.avatarUrl ? (
                <img src={config.identity.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : loading ? "?" : (username?.[0]?.toUpperCase() ?? "?")}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-base font-extrabold text-white truncate max-w-xs leading-snug">
                  {loading ? "Loading profile…" : username}
                </p>
                {config?.identity?.verified && <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />}
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-semibold truncate max-w-xs">{email ?? ""}</p>
              {!loading && username && (
                <p className="text-xs text-red-500 font-bold mt-1.5 flex items-center gap-1">
                  brazy.it/{username}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2.5 shrink-0 self-start md:self-center">
            <Link href="/dashboard/settings" className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:bg-neutral-900/60 text-neutral-400 hover:text-white text-xs font-bold transition">
              <Settings className="w-3.5 h-3.5" /> Settings
            </Link>
            {username && (
              <a href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:bg-neutral-900/60 text-neutral-400 hover:text-white text-xs font-bold transition">
                <ExternalLink className="w-3.5 h-3.5" /> View live page
              </a>
            )}
          </div>
        </div>
        
        {/* Completeness bar */}
        <div className="p-6 border-t border-neutral-900/60 bg-neutral-950/20">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-neutral-400">Profile completeness</span>
            <span className={`text-xs font-black ${completeness === 100 ? "text-green-400" : "text-red-500"}`}>{completeness}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-900 border border-neutral-850/60 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ease-out rounded-full ${
              completeness === 100 ? "bg-green-500" : "bg-gradient-to-r from-red-600 to-rose-500"
            }`} style={{ width: `${completeness}%` }} />
          </div>
          {completeness < 100 && (
            <p className="text-[10px] text-neutral-500 font-medium mt-2">Finish editing your profile details to unlock 100% completion badge.</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="group">
              <div className="bg-neutral-950/40 border border-neutral-900/85 hover:border-neutral-800 rounded-2xl p-5 flex items-center justify-between transition duration-150">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">{loading ? "—" : s.value}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-neutral-600 group-hover:text-neutral-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      <Link href="/dashboard/customize" className="w-full block text-center py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_24px_rgba(220,38,38,0.25)] transition">
        Customize my profile bio
      </Link>

    </div>
  );
}
