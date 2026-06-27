"use client";

import { useEffect, useState } from "react";
import {
  UserCircle2, Eye, Link2, Award, Edit3, ExternalLink,
  Share2, Copy, ShieldAlert, CalendarDays, Palette, Music,
  User, Image, MousePointer2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const identities = user.identities ?? [];
      const discordIdent = identities.find((i) => i.provider === "discord");
      const name =
        (discordIdent?.identity_data?.username as string | undefined) ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "user";
      setUsername(name);
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.username) setUsername(profile.username);
    })();
  }, []);

  const profileUrl = username ? `https://brazy.lol/${username}` : "brazy.lol/...";
  const displayName = username ?? "...";

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(profileUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) { await navigator.share({ url: profileUrl }).catch(() => {}); } else { handleCopyLink(); }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/40">Manage your account overview and preferences.</p>
      </div>

      <div
        className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.10]"
        style={{ backdropFilter: "blur(4px)" }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="shrink-0 ring-2 ring-violet-500/40"
              style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px oklch(0.62 0.22 295 / 0.3)",
              }}
            >
              <UserCircle2 style={{ width: 32, height: 32, color: "#fff" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{displayName}</h2>
              <p className="mt-0.5 text-sm text-white/40">{profileUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/60">
              <Eye className="h-3 w-3" /> 12,847 Views
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/60">
              <Link2 className="h-3 w-3" /> 12 Links
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/60">
              <CalendarDays className="h-3 w-3" /> Joined Jan 2025
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
          <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-2 text-xs font-medium text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-white">
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </button>
          <Link href={`/${username ?? ""}`} target="_blank" className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-2 text-xs font-medium text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-white">
            <ExternalLink className="h-3.5 w-3.5" /> View Page
          </Link>
          <button onClick={handleShare} className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-2 text-xs font-medium text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-white">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button onClick={handleCopyLink} className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-transparent px-3.5 py-2 text-xs font-medium text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-white">
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Statistics</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Eye, label: "Total Views", value: "12,847" },
            { icon: Link2, label: "Links", value: "12" },
            { icon: Award, label: "Badges", value: "3" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:scale-[1.02] hover:border-white/[0.10]"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <Icon className="mb-1 h-5 w-5 text-white/20" />
                <p className="text-3xl font-bold text-violet-300">{stat.value}</p>
                <p className="mt-1 text-sm text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Quick Settings</p>
        <div
          className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-200 hover:border-white/[0.10]"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="divide-y divide-white/[0.04]">
            {[
              { icon: Image, label: "Background Effect", on: true },
              { icon: User, label: "Discord Presence", on: true },
              { icon: Palette, label: "Profile Gradient", on: false },
              { icon: Music, label: "Music Widget", on: false },
              { icon: MousePointer2, label: "Custom Cursor", on: true },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-white/30" />
                    <span className="text-sm text-white/60">{item.label}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${item.on ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.04] text-white/30"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${item.on ? "bg-emerald-400" : "bg-white/20"}`} />
                    {item.on ? "Enabled" : "Disabled"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Danger Zone</p>
        <div
          className="overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 transition-all duration-200 hover:border-red-500/30"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10">
              <ShieldAlert className="h-4 w-4 text-red-400" />
            </div>
            <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
          </div>
          <p className="mb-4 text-sm text-white/40">Once you delete your account, there is no going back.</p>
          <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
