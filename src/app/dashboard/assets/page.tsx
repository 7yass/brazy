"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Trash2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: "image" | "audio" | "video" | "other";
  size: string;
  url: string;
  date: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", name: "avatar-default.png", type: "image", size: "24 KB", url: "/assets/avatar.png", date: "Today" },
    { id: "2", name: "background.mp4", type: "video", size: "1.2 MB", url: "/assets/bg.mp4", date: "Yesterday" },
    { id: "3", name: "track.mp3", type: "audio", size: "3.4 MB", url: "/assets/track.mp3", date: "2 days ago" },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const assetIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="h-5 w-5 text-violet-400" />;
      case "audio": return <Music className="h-5 w-5 text-cyan-400" />;
      case "video": return <Video className="h-5 w-5 text-amber-400" />;
      default: return <FileText className="h-5 w-5 text-white/40" />;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "image": return "bg-violet-500/10 text-violet-400";
      case "audio": return "bg-cyan-500/10 text-cyan-400";
      case "video": return "bg-amber-500/10 text-amber-400";
      default: return "bg-white/5 text-white/40";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Assets</h1>
        <p className="mt-1 text-sm text-white/40">
          Upload and manage images, audio, and video files for your profile.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative mb-8 rounded-2xl border-2 border-dashed p-12 text-center transition ${
          dragOver
            ? "border-violet-500/50 bg-violet-500/5"
            : "border-white/[0.08] hover:border-white/[0.15]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={() => {}}
        />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
          <Upload className="h-6 w-6 text-white/30" />
        </div>
        <p className="text-sm text-white/60">
          <button
            onClick={() => fileRef.current?.click()}
            className="font-medium text-violet-400 transition hover:text-violet-300"
          >
            Click to upload
          </button>{" "}
          or drag and drop
        </p>
        <p className="mt-1 text-xs text-white/30">
          PNG, JPG, GIF, MP3, MP4, WEBM up to 10MB
        </p>
      </div>

      {assets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.06] py-20 text-center">
          <ImageIcon className="mx-auto mb-3 h-8 w-8 text-white/20" />
          <p className="text-sm text-white/30">No assets yet. Upload your first file above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.12]"
            >
              <div className="mb-3 flex aspect-video items-center justify-center rounded-xl bg-white/[0.03]">
                {asset.type === "image" ? (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5">
                    <ImageIcon className="h-8 w-8 text-white/20" />
                  </div>
                ) : asset.type === "audio" ? (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5">
                    <Music className="h-8 w-8 text-white/20" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                    <Video className="h-8 w-8 text-white/20" />
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{asset.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase ${typeColor(asset.type)}`}>
                      {asset.type}
                    </span>
                    <span className="text-xs text-white/30">{asset.size}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <button
                  onClick={() => copyUrl(asset.url, asset.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white/60"
                >
                  {copiedId === asset.id ? (
                    <><Check className="h-3 w-3 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy URL</>
                  )}
                </button>
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="rounded-lg p-1.5 text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
