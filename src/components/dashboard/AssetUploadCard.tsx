"use client";

export function AssetUploadCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <p className="text-sm font-medium text-white/80">{title}</p>
      {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function UploadZone({ label }: { label: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] px-4 py-5 transition hover:border-white/[0.2]">
      <UploadIcon />
      <p className="text-xs text-white/40">
        <span className="font-medium text-violet-400">Click to upload</span> — {label}
      </p>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}
