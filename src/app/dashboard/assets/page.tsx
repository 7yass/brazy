"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Image as ImageIcon, Music, Video, File, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const F = "Satoshi, system-ui, sans-serif";

type Asset = { id: string; name: string; type: "image" | "audio" | "video" | "other"; size: string; url: string; path: string };

function typeIcon(type: Asset["type"]) {
  if (type === "image") return ImageIcon;
  if (type === "audio") return Music;
  if (type === "video") return Video;
  return File;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const fetchAssets = useCallback(async (uid: string) => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.storage.from("assets").list(uid);
    if (!error && data) {
      const formatted: Asset[] = data.filter((f) => f.id).map((f) => {
        const url = supabase.storage.from("assets").getPublicUrl(`${uid}/${f.name}`).data.publicUrl;
        const mime = f.metadata?.mimetype || "";
        const type = mime.startsWith("image/") ? "image" : mime.startsWith("audio/") ? "audio" : mime.startsWith("video/") ? "video" : "other";
        const sizeBytes = f.metadata?.size || 0;
        const sizeStr = sizeBytes > 1024 * 1024 ? `${(sizeBytes / 1024 / 1024).toFixed(1)} MB` : `${(sizeBytes / 1024).toFixed(0)} KB`;
        
        return {
          id: f.id as string,
          name: f.name,
          type,
          size: sizeStr,
          url,
          path: `${uid}/${f.name}`,
        };
      });
      setAssets(formatted);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchAssets(user.id);
      }
    })();
  }, [supabase, fetchAssets]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !userId || !supabase) return;
    
    setUploading(true);
    try {
      for (const file of files) {
        // Safe filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${userId}/${Date.now()}_${safeName}`;
        
        await supabase.storage.from("assets").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      }
      await fetchAssets(userId);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = async (path: string, id: string) => {
    if (!supabase) return;
    setAssets((prev) => prev.filter((a) => a.id !== id));
    await supabase.storage.from("assets").remove([path]);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Assets</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Upload and manage your files.</p>
        </div>
        <button disabled={uploading || !userId} onClick={() => inputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 11, background: "linear-gradient(135deg, #dc2626, #e11d48)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: uploading ? "default" : "pointer", fontFamily: F, boxShadow: "0 4px 14px rgba(220,38,38,0.3)", opacity: uploading ? 0.7 : 1 }}>
          {uploading ? <Loader2 className="animate-spin" style={{ width: 13, height: 13 }} /> : <Upload style={{ width: 13, height: 13 }} />} 
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={inputRef} type="file" multiple style={{ display: "none" }} onChange={handleUpload} />
      </div>

      {loading ? (
        <div style={{ padding: "56px 24px", textAlign: "center" }}>
          <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: "rgba(255,255,255,0.15)", margin: "0 auto 12px" }} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div onClick={() => !uploading && inputRef.current?.click()} style={{ borderRadius: 18, border: "2px dashed rgba(255,255,255,0.08)", padding: "56px 24px", textAlign: "center", cursor: "pointer", opacity: uploading ? 0.5 : 1 }}>
          <Upload style={{ width: 32, height: 32, color: "rgba(255,255,255,0.15)", margin: "0 auto 12px" }} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>Drop files here or click to upload</p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Images, audio, video — any file type up to 50MB</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {assets.map((a) => {
            const Icon = typeIcon(a.type);
            return (
              <div key={a.id} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {a.type === "image" ? (
                    <img src={a.url} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
                  ) : (
                    <Icon style={{ width: 15, height: 15, color: "#dc2626" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fafafa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{a.size} · {a.type}</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => handleCopy(a.url, a.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {copied === a.id ? <Check style={{ width: 13, height: 13, color: "#22c55e" }} /> : <Copy style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />}
                  </button>
                  <button onClick={() => handleDelete(a.path, a.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
