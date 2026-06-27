import { LayoutTemplate } from "lucide-react";

export default function PremiumLayoutPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-white">Layout Settings</h1>
        <p className="mt-1 text-sm text-white/30">Control how your profile card is structured.</p>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
            <LayoutTemplate className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Premium Feature</p>
            <p className="text-xs text-white/30">Upgrade to Premium to access layout settings.</p>
          </div>
          <a
            href="/dashboard/premium"
            className="ml-auto rounded-xl bg-violet-500/20 px-4 py-2 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/30"
          >
            Upgrade
          </a>
        </div>
      </div>

      {[
        { label: "Card Alignment", options: ["Left", "Center", "Right"] },
        { label: "Section Spacing", options: ["Compact", "Default", "Spacious"] },
        { label: "Border Radius", options: ["None", "Small", "Medium", "Large"] },
      ].map((setting) => (
        <div key={setting.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 opacity-40 pointer-events-none">
          <p className="mb-3 text-sm font-semibold text-white/60">{setting.label}</p>
          <div className="flex gap-2">
            {setting.options.map((opt) => (
              <button
                key={opt}
                className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2 text-xs text-white/40"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
