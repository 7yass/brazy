"use client";

import { useEffect, useState } from "react";
import {
  UserCircle2, Eye, Link2, Award, Edit3, ExternalLink,
  Hash, BarChart3, Settings, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [username, setUsername] = useState<string | null>(null);

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

  const displayName = username ?? "...";

  // ── Info tiles (Username / Alias / UID / Profile Views)
  const infoTiles = [
    {
      label: "Username",
      icon: <Edit3 className="h-4 w-4" />,
      value: displayName,
      sub: "Change available now",
    },
    {
      label: "Alias",
      icon: <UserCircle2 className="h-4 w-4" />,
      value: "0 aliases used",
      sub: "1 alias slot remaining",
    },
    {
      label: "UID",
      icon: <Hash className="h-4 w-4" />,
      value: "—",
      sub: "Joined after 100% of all users",
    },
    {
      label: "Profile Views",
      icon: <Eye className="h-4 w-4" />,
      value: "0",
      sub: "0 views since last 7 days",
    },
  ];

  // ── Profile completion checklist
  const completionItems = [
    { label: "Upload An Avatar", href: "/dashboard/customize" },
    { label: "Add A Description", href: "/dashboard/customize" },
    { label: "Link Discord Account", href: "/dashboard/settings" },
    { label: "Add Socials", href: "/dashboard/links" },
    { label: "Reach 10 profile views", href: null },
  ];

  // ── Manage account quick actions
  const manageActions = [
    { label: "Change Username", icon: <Edit3 className="h-3.5 w-3.5" /> },
    { label: "Change Display Name", icon: <UserCircle2 className="h-3.5 w-3.5" /> },
    { label: "Manage Aliases", icon: <Link2 className="h-3.5 w-3.5" /> },
    { label: "Account Settings", icon: <Settings className="h-3.5 w-3.5" />, href: "/dashboard/settings" },
  ];

  return (
    <div className="space-y-6 p-8">
      {/* ── Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Account Overview</h1>
      </div>

      {/* ── Info tiles grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {infoTiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.10]"
          >
            <div className="mb-3 flex items-center justify-between text-white/30">
              <span className="text-xs font-medium text-white/50">{tile.label}</span>
              {tile.icon}
            </div>
            <p className="text-lg font-semibold text-white">{tile.value}</p>
            <p className="mt-1 text-xs text-white/30">{tile.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Account Statistics section header */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-white/60">Account Statistics</h2>

        {/* Profile Completion card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">Profile Completion</span>
            <span className="text-xs text-white/30">0 completed</span>
          </div>

          {/* Progress bar */}
          <div className="mb-4 mt-2 h-1.5 w-full rounded-full bg-white/[0.06]">
            <div className="h-1.5 w-0 rounded-full bg-violet-500" />
          </div>

          {/* Incomplete notice */}
          <div className="mb-4 flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
              <Award className="h-3 w-3 text-white/40" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Your profile isn&apos;t complete yet!</p>
              <p className="mt-0.5 text-xs text-white/30">Complete your profile to make it more discoverable and appealing.</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1.5">
            {completionItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded-full border border-white/20 bg-transparent" />
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
                {item.href ? (
                  <Link href={item.href} className="text-white/20 hover:text-white/50 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <ChevronRight className="h-4 w-4 text-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Manage Your Account */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-1 text-sm font-semibold text-white/70">Manage your account</h3>
          <p className="mb-4 text-xs text-white/30">Change your email, username and more.</p>
          <div className="space-y-1.5">
            {manageActions.map((action) => (
              <div key={action.label}>
                {action.href ? (
                  <Link
                    href={action.href}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70"
                  >
                    <span className="text-white/30">{action.icon}</span>
                    {action.label}
                  </Link>
                ) : (
                  <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70">
                    <span className="text-white/30">{action.icon}</span>
                    {action.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connections */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-1 text-sm font-semibold text-white/70">Connections</h3>
          <p className="mb-4 text-xs text-white/30">Connect your Discord or Google account with brazy.</p>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-white/[0.10] hover:text-white/80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12" />
              </svg>
              Connect Discord
            </button>
            <button className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-white/[0.10] hover:text-white/80">
              <svg width="16" height="16" viewBox="0 0 256 262" fill="none">
                <path fill="#4285F4" d="M255.68 133.53c0-10.03-.9-19.66-2.57-28.9H130.55v54.68h70.03c-3.02 16.27-12.17 30.06-25.94 39.29v32.66h41.93c24.54-22.6 38.71-55.94 38.71-97.73"/>
                <path fill="#34A853" d="M130.55 261.1c35.1 0 64.56-11.63 86.08-31.48l-41.93-32.66c-11.63 7.8-26.51 12.4-44.15 12.4c-33.92 0-62.64-22.9-72.9-53.68H14.3v33.66c21.4 42.52 65.42 71.76 116.25 71.76"/>
                <path fill="#FBBC05" d="M57.65 155.68c-2.61-7.8-4.1-16.12-4.1-24.68s1.49-16.88 4.1-24.68V72.66H14.3C5.18 90.84 0 110.2 0 131s5.18 40.16 14.3 58.34z"/>
                <path fill="#EA4335" d="M130.55 52.64c19.08 0 36.2 6.56 49.66 19.43l37.25-37.25C195.05 13.97 165.58 0 130.55 0C79.72 0 35.7 29.24 14.3 72.66l43.35 33.66c10.26-30.78 38.98-53.68 72.9-53.68"/>
              </svg>
              Connect Google
            </button>
          </div>
        </div>
      </div>

      {/* ── Account Analytics preview */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/70">
            Account Analytics{" "}
            <Link href="/dashboard/analytics" className="ml-2 text-xs font-normal text-white/30 hover:text-white/50 transition-colors">
              View More →
            </Link>
          </h3>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-4">
          <BarChart3 className="h-5 w-5 text-white/20" />
          <div>
            <p className="text-sm font-medium text-white/50">Profile Views in the last 7 days</p>
            <p className="mt-0.5 text-xs text-white/25">No data yet. Share your page to get clicks!</p>
          </div>
          <Link
            href={`/${username ?? ""}`}
            target="_blank"
            className="ml-auto flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View page
          </Link>
        </div>
      </div>
    </div>
  );
}
