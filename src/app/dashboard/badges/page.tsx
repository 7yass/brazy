"use client";

import { Award, Lock, Sparkles } from "lucide-react";

const earnedBadges: { name: string; desc: string; emoji: string }[] = [];

const lockedBadges = [
  { name: "Early Adopter", desc: "Join brazy in its first month.", emoji: "🚀" },
  { name: "Link Master", desc: "Add 10 or more links to your profile.", emoji: "🔗" },
  { name: "Viral", desc: "Reach 1,000 profile views.", emoji: "📈" },
  { name: "Premium Member", desc: "Subscribe to brazy Premium.", emoji: "💎" },
  { name: "Social Butterfly", desc: "Connect 5 social accounts.", emoji: "🦋" },
  { name: "Night Owl", desc: "Use the dashboard after midnight.", emoji: "🦉" },
];

export default function BadgesPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-white">Badges</h1>
        <p className="mt-1 text-sm text-white/30">Collect badges by completing milestones on brazy.</p>
      </div>

      {/* Earned */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Earned Badges</h2>
        {earnedBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Award className="h-6 w-6 text-white/20" />
            </div>
            <p className="text-sm text-white/40">No badges earned yet</p>
            <p className="text-xs text-white/20">Complete milestones below to earn your first badge.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {earnedBadges.map((b) => (
              <div key={b.name} className="flex flex-col items-center gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-4 text-center">
                <span className="text-3xl">{b.emoji}</span>
                <p className="text-sm font-medium text-white/80">{b.name}</p>
                <p className="text-xs text-white/30">{b.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Locked Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {lockedBadges.map((b) => (
            <div
              key={b.name}
              className="relative flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center opacity-50"
            >
              <span className="text-3xl grayscale">{b.emoji}</span>
              <p className="text-sm font-medium text-white/60">{b.name}</p>
              <p className="text-xs text-white/25">{b.desc}</p>
              <div className="absolute right-2.5 top-2.5">
                <Lock className="h-3 w-3 text-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium tease */}
      <div className="flex items-center gap-4 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
          <Sparkles className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/70">Unlock exclusive badges with Premium</p>
          <p className="mt-0.5 text-xs text-white/30">Upgrade to brazy Premium to access exclusive badge drops.</p>
        </div>
        <a
          href="/dashboard/premium"
          className="ml-auto shrink-0 rounded-xl bg-violet-500/20 px-4 py-2 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/30"
        >
          Upgrade
        </a>
      </div>
    </div>
  );
}
