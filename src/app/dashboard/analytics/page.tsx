"use client";

import { Eye, MousePointerClick, Users, TrendingUp, MonitorSmartphone, Globe } from "lucide-react";

const stats = [
  { label: "Profile Views", value: "0", sub: "Last 7 days", icon: Eye, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Link Clicks", value: "0", sub: "Last 7 days", icon: MousePointerClick, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Unique Visitors", value: "0", sub: "Last 7 days", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Click-Through Rate", value: "0%", sub: "Last 7 days", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-white/30">Track your profile performance.</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-0.5 text-xs text-white/50">{s.label}</p>
              <p className="mt-0.5 text-[11px] text-white/25">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Chart placeholder — Profile Views */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/60">Profile Views in the last <span className="text-white/80">7 days</span></h3>
        <div className="flex h-48 items-end gap-1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-violet-500/10"
              style={{ height: `${Math.max(8, Math.random() * 40)}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-white/20">
          <span>Jun 13</span><span>Jun 27</span>
        </div>
      </div>

      {/* Visitor Devices + Top Countries */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/60">
            <MonitorSmartphone className="h-4 w-4 text-white/30" />
            Visitor Devices in the last <span className="text-white/80">7 days</span>
          </div>
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-white/25">No device data yet. Share your page to get clicks!</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/60">
            <Globe className="h-4 w-4 text-white/30" />
            Top Countries
          </div>
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-white/25">No location data yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
