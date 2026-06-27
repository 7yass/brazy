"use client";

import { useState } from "react";
import {
  Eye, MousePointerClick, Globe, TrendingUp, TrendingDown, ArrowUpRight,
} from "lucide-react";

const stats = [
  { icon: Eye, label: "Total Views", value: "12,847", change: "+12.5%", trend: "up" as const, color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: MousePointerClick, label: "Total Clicks", value: "3,291", change: "+8.2%", trend: "up" as const, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: ArrowUpRight, label: "CTR", value: "25.6%", change: "+2.1%", trend: "up" as const, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Globe, label: "Top Referrer", value: "Twitter", change: "34.2%", trend: "up" as const, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const viewsData = [420, 580, 750, 610, 890, 1020, 940];
const maxView = Math.max(...viewsData);

const chartPath = viewsData.map((v, i) => {
  const x = 40 + i * ((600 - 80) / (viewsData.length - 1));
  const y = 200 - (v / maxView) * 160;
  return `${i === 0 ? "M" : "L"}${x},${y}`;
}).join(" ");

const areaPath = chartPath + ` L${40 + (viewsData.length - 1) * ((600 - 80) / (viewsData.length - 1))},200 L40,200 Z`;

const referrers = [
  { source: "Twitter", views: 4392, color: "#22d3ee" },
  { source: "Discord", views: 2841, color: "#a855f7" },
  { source: "GitHub", views: 2104, color: "#f59e0b" },
  { source: "Instagram", views: 1573, color: "#ec4899" },
  { source: "Direct", views: 1937, color: "#6b7280" },
];
const totalRefViews = referrers.reduce((a, r) => a + r.views, 0);

const devices = [
  { name: "Mobile", percentage: 62, color: "#a855f7" },
  { name: "Desktop", percentage: 28, color: "#22d3ee" },
  { name: "Tablet", percentage: 10, color: "#f59e0b" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7d");

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-white/40">Track your profile views, link clicks, and audience insights.</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {["24h", "7d", "30d", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                period === p ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              {p === "24h" ? "24H" : p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Overview</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.10]"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Views Over Time</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Views Over Time</h2>
              <span className="text-xs text-white/30">Last 7 days</span>
            </div>
            <svg viewBox="0 0 600 220" className="h-48 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#areaGrad)" />
              <path d={chartPath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {viewsData.map((v, i) => {
                const x = 40 + i * ((600 - 80) / (viewsData.length - 1));
                const y = 200 - (v / maxView) * 160;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#a855f7" stroke="#0f0d1a" strokeWidth="2" />
                    <text x={x} y="218" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">{days[i]}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Top Referrers</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="space-y-3">
              {referrers.map((ref) => {
                const pct = ((ref.views / totalRefViews) * 100).toFixed(0);
                return (
                  <div key={ref.source}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-white/70">{ref.source}</span>
                      <span className="text-xs text-white/40">{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: ref.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Devices</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="flex items-center justify-center gap-6">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    return devices.map((d) => {
                      const pct = d.percentage;
                      const circumference = 2 * Math.PI * 14;
                      const length = (pct / 100) * circumference;
                      const seg = (
                        <circle key={d.name} cx="18" cy="18" r="14" fill="none" stroke={d.color} strokeWidth="4" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} />
                      );
                      offset += length;
                      return seg;
                    });
                  })()}
                </svg>
              </div>
              <div className="space-y-2.5">
                {devices.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-white/70">{d.name}</span>
                    <span className="text-xs text-white/40">{d.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Link Clicks</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="space-y-2.5">
              {[
                { name: "discord", clicks: 892 },
                { name: "twitter", clicks: 654 },
                { name: "github", clicks: 423 },
                { name: "instagram", clicks: 312 },
                { name: "spotify", clicks: 198 },
              ].map((link) => {
                const maxClicks = 892;
                const barWidth = (link.clicks / maxClicks) * 100;
                return (
                  <div key={link.name} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-white/50 capitalize">{link.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${barWidth}%` }} />
                    </div>
                    <span className="w-12 text-right text-xs text-white/50">{link.clicks}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-xl border border-dashed border-white/[0.06] p-4 text-center">
              <p className="text-xs text-white/30">Detailed per-link analytics available on premium.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
