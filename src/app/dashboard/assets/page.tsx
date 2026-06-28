"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Music, Video, File, Trash2, Copy, Check } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

type Asset = { id: string; name: string; type: "image" | "audio" | "video" | "other"; size: string; url: string };

const mockAssets: Asset[] = [];

function typeIcon(type: Asset["type"]) {
  if (type === "image") return ImageIcon;
  if (type === "audio") return Music;
  if (type === "video") return Video;
  return File;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newAssets: Asset[] = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      type: f.type.startsWith("image") ? "image" : f.type.startsWith("audio") ? "audio" : f.type.startsWith("video") ? "video" : "other",
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      url: URL.createObjectURL(f),
    }));
    setAssets((prev) => [...prev, ...newAssets]);
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = (id: string) => setAssets((prev) => prev.filter((a) => a.id !== id));

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Assets</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Upload and manage your files.</p>
        </div>
        <button onClick={() => inputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 11, background: "linear-gradient(135deg, #dc2626, #e11d48)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F, boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}>
          <Upload style={{ width: 13, height: 13 }} /> Upload
        </button>
        <input ref={inputRef} type="file" multiple style={{ display: "none" }} onChange={handleUpload} />
      </div>

      {assets.length === 0 ? (
        <div onClick={() => inputRef.current?.click()} style={{ borderRadius: 18, border: "2px dashed rgba(255,255,255,0.08)", padding: "56px 24px", textAlign: "center", cursor: "pointer" }}>
          <Upload style={{ width: 32, height: 32, color: "rgba(255,255,255,0.15)", margin: "0 auto 12px" }} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>Drop files here or click to upload</p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Images, audio, video — any file type</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {assets.map((a) => {
            const Icon = typeIcon(a.type);
            return (
              <div key={a.id} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 15, height: 15, color: "#dc2626" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fafafa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{a.size} · {a.type}</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => handleCopy(a.url, a.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {copied === a.id ? <Check style={{ width: 13, height: 13, color: "#22c55e" }} /> : <Copy style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />}
                  </button>
                  <button onClick={() => handleDelete(a.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Trash2 style={{ width: 13, height: 13, color: "#ef4444" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
