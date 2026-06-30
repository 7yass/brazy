"use client";

import { useEffect, useState } from "react";
import {
  Eye, Link2, Award, BarChart3, ChevronRight, Settings, ExternalLink,
  ShieldCheck, Sparkles, Globe, Copy, Check, Layers, UserCircle2, Palette
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { normalizeConfig, ProfileConfig } from "@/lib/profile/schema";

export default function AccountPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ProfileConfig | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setEmail(user.email ?? null);
        setUserId(user.id);
        
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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const profileViews = config?.analytics?.trackViews ? "Tracking" : "Disabled";
  const numLinks = config?.social?.links?.length ?? 0;
  const numBadges = config?.badges?.items?.length ?? 0;
  const numWidgets = Object.values(config?.widgets || {}).filter((w: any) => w.enabled).length;

  // Calculate completeness & strength checklist
  const checks = [
    { label: "Add avatar image", met: !!config?.identity?.avatarUrl, href: "/customize" },
    { label: "Write a bio description", met: !!config?.identity?.bio, href: "/customize" },
    { label: "Add at least 3 social links", met: (config?.social?.links?.length ?? 0) >= 3, href: "/links" },
    { label: "Enable custom background effect", met: config?.background?.type !== "none" && config?.background?.type !== "color", href: "/customize" },
    { label: "Enable profile widget", met: Object.values(config?.widgets || {}).some((w: any) => w?.enabled), href: "/widgets" },
  ];
  const score = checks.filter(c => c.met).length * 20;
  const completeness = Math.max(15, score);

  const copyUserId = () => {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none font-sans">
      
      {/* Header */}
      <header className="border-b border-white/[0.04] pb-5">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Welcome back, {loading ? "..." : username}
        </h1>
        <p className="text-neutral-400 text-xs mt-1">Here's a quick look at your brazy.it page.</p>
      </header>

      {/* 4-Column Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Public Profile Link */}
        <a 
          href={username ? `/${username}` : "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col justify-between p-5 rounded-2xl border border-white/[0.03] bg-neutral-900/20 hover:bg-neutral-900/40 transition duration-150"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Your Page</span>
            <Globe className="w-4 h-4 text-neutral-500 group-hover:text-red-500 transition duration-150" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-black text-white truncate group-hover:underline">
              {loading ? "loading..." : `brazy.it/${username || "page"}`}
            </p>
          </div>
        </a>

        {/* Card 2: Completeness */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-white/[0.03] bg-neutral-900/20">
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Page Strength</span>
            <Sparkles className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-black text-white">{completeness}%</p>
            <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500" 
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Views */}
        <Link 
          href="/account/analytics"
          className="group flex flex-col justify-between p-5 rounded-2xl border border-white/[0.03] bg-neutral-900/20 hover:bg-neutral-900/40 transition duration-150"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Profile Views</span>
            <Eye className="w-4 h-4 text-neutral-500 group-hover:text-red-500 transition duration-150" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-black text-white">{profileViews}</p>
          </div>
        </Link>

        {/* Card 4: Membership */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-white/[0.03] bg-neutral-900/20">
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Membership</span>
            <ShieldCheck className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-black text-white">Free Member</p>
          </div>
        </div>
      </div>

      {/* Profile Checklist Guidance */}
      {config && (
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="border-b border-neutral-900/60 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Profile Strength Checklist</h3>
            <p className="text-[10px] text-neutral-500 mt-1">Complete these tasks to increase your search discoverability and customization index.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {checks.map((check, idx) => (
              <Link 
                key={idx}
                href={check.href}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition duration-150 select-none ${
                  check.met 
                    ? "bg-green-500/5 border-green-500/10 text-green-400 opacity-60 hover:opacity-100" 
                    : "bg-neutral-900/40 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border ${
                    check.met ? "bg-green-500/10 border-green-500/30 text-green-400" : "border-neutral-750 bg-neutral-950 text-neutral-500"
                  }`}>
                    {check.met ? "✓" : idx + 1}
                  </div>
                  <span className="text-xs font-bold truncate">{check.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Card Actions Grid */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">Quick Customization</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link href="/customize" className="group">
            <div className="bg-neutral-950/40 border border-neutral-900/80 hover:border-neutral-800 rounded-2xl p-5 flex items-center justify-between transition duration-150">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0 border border-red-500/5">
                  <Palette className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Customize Profile Look</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-snug">Backgrounds, cursor files, colors, and layouts.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link href="/links" className="group">
            <div className="bg-neutral-950/40 border border-neutral-900/80 hover:border-neutral-800 rounded-2xl p-5 flex items-center justify-between transition duration-150">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0 border border-red-500/5">
                  <Link2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Social Links ({numLinks})</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-snug">Configure your active socials list and buttons.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link href="/account/badges" className="group">
            <div className="bg-neutral-950/40 border border-neutral-900/80 hover:border-neutral-800 rounded-2xl p-5 flex items-center justify-between transition duration-150">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0 border border-red-500/5">
                  <Award className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Profile Badges ({numBadges})</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-snug">Claim and reorder SVG name badges.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link href="/sections" className="group">
            <div className="bg-neutral-950/40 border border-neutral-900/80 hover:border-neutral-800 rounded-2xl p-5 flex items-center justify-between transition duration-150">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0 border border-red-500/5">
                  <Layers className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Card Sections & Widgets ({numWidgets})</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-snug">Build profile section tabs and widgets.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Account Details Box */}
      <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-5 flex flex-col gap-4">
        <div className="border-b border-neutral-900 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Account Details</h3>
          <p className="text-[10px] text-neutral-500 mt-1">Your secure credentials and account metadata details.</p>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between py-1.5 border-b border-neutral-900/50">
            <span className="text-xs font-bold text-neutral-500">Email Address</span>
            <span className="text-xs text-white font-medium">{email ?? "..."}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-neutral-900/50">
            <span className="text-xs font-bold text-neutral-500">User UUID</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 truncate max-w-[200px] sm:max-w-none">{userId ?? "..."}</span>
              <button 
                onClick={copyUserId}
                className="text-neutral-500 hover:text-neutral-300 p-1 hover:bg-neutral-900 rounded-lg transition cursor-pointer"
                title="Copy User ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs font-bold text-neutral-500">General Settings</span>
            <Link 
              href="/account/settings"
              className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400 transition"
            >
              <Settings className="w-3.5 h-3.5" /> Edit Account Settings
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
