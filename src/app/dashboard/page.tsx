"use client";

import { useState, useEffect } from "react";
import { normalizeConfig, type ProfileConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";
import {
  Link2, Eye, Palette, TrendingUp, Layers, Award,
  ArrowUpRight, Clock, Sparkles, ExternalLink,
} from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "brazy_demo_config";

export default function DashboardHome() {
  const [config, setConfig] = useState<ProfileConfig | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(normalizeConfig(JSON.parse(stored)));
        return;
      } catch {}
    }
    setConfig(normalizeConfig(brazyProfile));
  }, []);

  if (!config) return null;

  const linkCount = config.social.links.length;
  const profileUrl = config.identity.displayName
    ? `${window.location.origin}/${config.identity.displayName.toLowerCase().replace(/\s+/g, "")}`
    : null;

  const stats = [
    { icon: Eye, label: "Profile Views", value: "12,847", change: "+12.5%", trend: "up" as const, color: "text-violet-400", bg: "bg-violet-500/10" },
    { icon: Link2, label: "Link Clicks", value: "3,291", change: "+8.2%", trend: "up" as const, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { icon: Award, label: "Active Badges", value: `${config.badges.items.length}`, change: "Synced", trend: "neutral" as const, color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: ArrowUpRight, label: "CTR", value: "25.6%", change: "+2.1%", trend: "up" as const, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  const quickActions = [
    { href: "/dashboard/sections", label: "Edit Sections", desc: "Compose your profile with drag & drop", icon: Layers, border: "hover:border-violet-500/30" },
    { href: "/dashboard/customize", label: "Customize Theme", desc: "Change colors, styles, and effects", icon: Palette, border: "hover:border-fuchsia-500/30" },
    { href: "/dashboard/links", label: "Manage Links", desc: "Add or edit your social links", icon: Link2, border: "hover:border-cyan-500/30" },
    { href: "/dashboard/widgets", label: "Widgets", desc: "Configure widgets and embeds", icon: Sparkles, border: "hover:border-amber-500/30" },
  ];

  const activities = [
    { action: "Profile updated", time: "2 hours ago", icon: Palette },
    { action: "New link added", time: "1 day ago", icon: Link2 },
    { action: "Badge created", time: "3 days ago", icon: Award },
    { action: "Settings changed", time: "5 days ago", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="mt-1 text-sm text-white/40">
            Welcome back{config.identity.displayName ? `, ${config.identity.displayName}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All systems online
          </span>
        </div>
      </div>

      {/* ── Statistics ── */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
          Statistics
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.10]"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    stat.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/[0.04] text-white/30"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 ${action.border}`}
                style={{ backdropFilter: "blur(4px)" }}
              >
                <Icon className="mb-3 h-5 w-5 text-white/30 transition-colors group-hover:text-white/50" />
                <span className="block text-sm font-medium text-white">{action.label}</span>
                <p className="mt-1 text-xs text-white/40">{action.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity + Profile Preview ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
            Recent Activity
          </p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="space-y-3">
              {activities.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Icon className="h-3.5 w-3.5 text-white/30" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/70">{item.action}</p>
                      <p className="text-xs text-white/30">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Profile Preview
            </p>
            {profileUrl && (
              <Link
                href={profileUrl}
                className="flex items-center gap-1 text-xs text-white/30 transition-colors hover:text-white/50"
              >
                <ExternalLink className="h-3 w-3" />
                View page
              </Link>
            )}
          </div>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <Link
              href={profileUrl ?? "#"}
              className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-4 transition-all duration-200 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold text-white">
                {config.identity.displayName?.[0] ?? "B"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  {config.identity.displayName || "brazy"}
                </p>
                <p className="truncate text-xs text-white/40">
                  brazy.it/{config.identity.displayName?.toLowerCase().replace(/\s+/g, "") || "you"}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30" />
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/[0.03] px-3 py-2 text-xs text-white/30">
                <span className="text-white/50">Links</span> {linkCount}
              </div>
              <div className="rounded-xl bg-white/[0.03] px-3 py-2 text-xs text-white/30">
                <span className="text-white/50">Sections</span> 4 active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
