import { Gem, Zap, Sparkles, Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    current: true,
    features: [
      "Basic profile page",
      "Up to 10 links",
      "Basic analytics",
      "Standard effects",
    ],
    cta: "Current Plan",
    style: "border-white/[0.06] bg-white/[0.02]",
    ctaStyle: "bg-white/[0.06] text-white/40 cursor-default",
  },
  {
    name: "Premium",
    price: "$3",
    period: "/mo",
    current: false,
    features: [
      "Everything in Free",
      "Unlimited links",
      "Advanced analytics",
      "All background effects",
      "Custom cursor",
      "Profile metadata",
      "Layout settings",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    style: "border-violet-500/30 bg-violet-500/[0.04]",
    ctaStyle: "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30",
  },
];

export default function PremiumPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-white">Premium</h1>
        <p className="mt-1 text-sm text-white/30">Unlock the full potential of your brazy profile.</p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-2xl border p-6 transition-all ${plan.style}`}
          >
            <div className="mb-1 flex items-center gap-2">
              {plan.name === "Premium" ? (
                <Gem className="h-4 w-4 text-violet-400" />
              ) : (
                <Zap className="h-4 w-4 text-white/30" />
              )}
              <span className="text-sm font-semibold text-white/70">{plan.name}</span>
              {plan.current && (
                <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">
                  Current
                </span>
              )}
            </div>
            <div className="mb-5 mt-2">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              <span className="text-sm text-white/30">{plan.period}</span>
            </div>
            <ul className="mb-6 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled={plan.current}
              className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all ${plan.ctaStyle}`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Feature highlights */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white/70">Premium Features</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Layout Settings", desc: "Control your profile card layout, spacing, and alignment.", href: "/dashboard/premium/layout" },
            { title: "Profile Metadata", desc: "Custom embed titles, descriptions, and OG images.", href: "/dashboard/premium/metadata" },
            { title: "All Effects", desc: "Unlock every background effect including Aurora and Night Time.", href: "/dashboard/customize" },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-violet-500/20 hover:bg-violet-500/[0.03]"
            >
              <p className="text-sm font-medium text-white/60">{f.title}</p>
              <p className="mt-1 text-xs text-white/25">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
