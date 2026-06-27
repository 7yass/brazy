"use client";

import { useState, useRef } from "react";
import {
  Upload, Image as ImageIcon, File, Trash2,
  Copy, ExternalLink, Lock, HardDrive, X, Check
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "image" | "file";
  url: string;
  uploadedAt: string;
}

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED: UploadedFile[] = [
  { id: "1", name: "avatar.png",      size: "128 KB", type: "image", url: "https://i.guns.lol/avatar.png",    uploadedAt: "2 days ago" },
  { id: "2", name: "banner.jpg",      size: "342 KB", type: "image", url: "https://i.guns.lol/banner.jpg",   uploadedAt: "5 days ago" },
  { id: "3", name: "resume.pdf",      size: "89 KB",  type: "file",  url: "https://i.guns.lol/resume.pdf", uploadedAt: "1 week ago" },
];

const MAX_FREE_MB  = 100;
const USED_FREE_MB = 3.2;

// ── File card ──────────────────────────────────────────────────────────────────
function FileCard({
  file,
  onDelete,
}: {
  file: UploadedFile;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all hover:border-white/[0.10]">
      {/* Preview */}
      <div className="flex h-36 items-center justify-center border-b border-white/[0.04] bg-white/[0.02]">
        {file.type === "image" ? (
          <ImageIcon className="h-10 w-10 text-white/10" />
        ) : (
          <File className="h-10 w-10 text-white/10" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="truncate text-sm font-medium text-white/70">{file.name}</p>
          <p className="text-[11px] text-white/25">{file.size} &middot; {file.uploadedAt}</p>
        </div>

        {/* URL row */}
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5">
          <span className="flex-1 truncate text-[11px] text-white/25">{file.url}</span>
          <button
            onClick={copy}
            className="shrink-0 text-white/30 transition-colors hover:text-white/60"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] py-1.5 text-xs text-white/40 transition-all hover:border-white/[0.10] hover:text-white/60"
          >
            <ExternalLink className="h-3 w-3" /> Open
          </a>
          <button
            onClick={() => onDelete(file.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function ImageHostPage() {
  const [files, setFiles]     = useState<UploadedFile[]>(SEED);
  const [dragging, setDrag]   = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  const deleteFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const usedPct = (USED_FREE_MB / MAX_FREE_MB) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Image Host</h1>
        <p className="mt-1 text-sm text-white/30">Upload and share images & files instantly.</p>
      </div>

      {/* Stats + storage row */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Files",   value: files.length },
          { label: "Storage Used",  value: `${USED_FREE_MB} MB` },
          { label: "Storage Left",  value: `${(MAX_FREE_MB - USED_FREE_MB).toFixed(1)} MB` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-white/30">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Storage bar */}
      <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-white/30" />
            <span className="text-sm font-medium text-white/60">Storage</span>
          </div>
          <span className="text-xs text-white/30">{USED_FREE_MB} MB / {MAX_FREE_MB} MB</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/[0.06]">
          <div
            className="h-2 rounded-full bg-violet-500/60 transition-all"
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-white/20">{usedPct.toFixed(1)}% used &mdash; upgrade to Premium for 2 GB storage</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); }}
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12 transition-all ${
          dragging
            ? "border-violet-500/40 bg-violet-500/5"
            : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.10] hover:bg-white/[0.02]"
        }`}
      >
        <input ref={inputRef} type="file" multiple className="hidden" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <Upload className="h-5 w-5 text-white/30" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white/50">Drop files here or <span className="text-violet-400">click to upload</span></p>
          <p className="mt-1 text-xs text-white/20">PNG, JPG, GIF, MP4, PDF up to 25 MB each</p>
        </div>
      </div>

      {/* Files grid */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-16 text-center">
          <ImageIcon className="mb-3 h-8 w-8 text-white/15" />
          <p className="text-sm font-medium text-white/30">No files uploaded yet</p>
          <p className="mt-1 text-xs text-white/20">Upload something above to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} onDelete={deleteFile} />
          ))}
        </div>
      )}

      {/* Premium upsell */}
      <div className="mt-8 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
            <Lock className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80">
              More storage with Premium
              <span className="ml-1.5 rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-300">PREMIUM</span>
            </p>
            <p className="mt-1 text-xs text-white/35">Get 2 GB of storage, custom file domains, and password-protected uploads.</p>
          </div>
          <button className="shrink-0 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition-all hover:bg-violet-500/20">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
