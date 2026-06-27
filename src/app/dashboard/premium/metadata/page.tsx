import { FileText } from "lucide-react";

export default function PremiumMetadataPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-white">Profile Metadata</h1>
        <p className="mt-1 text-sm text-white/30">Customize how your profile appears when shared online.</p>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
            <FileText className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Premium Feature</p>
            <p className="text-xs text-white/30">Upgrade to Premium to edit profile metadata.</p>
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
        { label: "Embed Title", placeholder: "Your custom embed title", type: "text" },
        { label: "Embed Description", placeholder: "A short description for link previews", type: "textarea" },
        { label: "OG Image URL", placeholder: "https://yourimage.com/og.png", type: "text" },
      ].map((field) => (
        <div key={field.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 opacity-40 pointer-events-none">
          <label className="mb-1.5 block text-xs font-medium text-white/40">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              placeholder={field.placeholder}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/50 outline-none placeholder:text-white/15"
            />
          ) : (
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/50 outline-none placeholder:text-white/15"
            />
          )}
        </div>
      ))}
    </div>
  );
}
