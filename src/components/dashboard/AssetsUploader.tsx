"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Image, FolderOpen, Upload, MousePointer2, Music, X, Search, Scissors, Link2, Mic } from "lucide-react";
import { Slider } from "./controls";

interface AssetsUploaderProps {
  backgroundUrl: string;
  onBackgroundChange: (url: string) => void;
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  cursorUrl: string;
  onCursorChange: (url: string) => void;
  audioUrl: string;
  onAudioChange: (url: string) => void;
  audioVolume: number;
  onAudioVolumeChange: (v: number) => void;
  lyrics?: { time: number | null; text: string }[];
  onLyricsChange?: (lyrics: { time: number | null; text: string }[]) => void;
  selectedTrack?: { trackId: string; title: string; artist: string; thumb: string } | null;
  onAudioMetaChange?: (meta: { trackId: string; title: string; artist: string; thumb: string } | null) => void;
}

type UploadedFile = { name: string; url: string; ext: string; isVideo: boolean } | null;

function toUploaded(url: string, presetVideo?: boolean): UploadedFile {
  if (!url) return null;
  const parts = url.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  const isVideo = presetVideo ?? ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
  return { name: url.split("/").pop() ?? "file", url, ext, isVideo };
}

type AudioTab = "url" | "upload" | "youtube";

export function AssetsUploader({
  backgroundUrl,
  onBackgroundChange,
  avatarUrl,
  onAvatarChange,
  cursorUrl,
  onCursorChange,
  audioUrl,
  onAudioChange,
  audioVolume,
  onAudioVolumeChange,
  lyrics,
  onLyricsChange,
  selectedTrack: externalTrack,
  onAudioMetaChange,
}: AssetsUploaderProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [bgIsVideo, setBgIsVideo] = useState(false);
  const [cursorExt, setCursorExt] = useState("");
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [modalUrl, setModalUrl] = useState(audioUrl);
  const [modalVolume, setModalVolume] = useState(audioVolume);
  const [audioTab, setAudioTab] = useState<AudioTab>("url");
  const [uploadedAudio, setUploadedAudio] = useState<{ name: string; size: string; url: string } | null>(null);
  const [showTrim, setShowTrim] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);
  const [audioDuration, setAudioDuration] = useState(0);
  const [spotifyInput, setSpotifyInput] = useState("");
  const [searchResults, setSearchResults] = useState<{ trackId: string; title: string; artist: string; thumb: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [audioTitle, setAudioTitle] = useState("");
  const [audioArtist, setAudioArtist] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [lyricsText, setLyricsText] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  const uploadToStorage = async (file: File, folder: string): Promise<string> => {
    const supabase = createClient();
    if (!supabase) throw new Error("Supabase not configured");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("assets").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("assets").getPublicUrl(path);
    return data.publicUrl;
  };

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const q = spotifyInput.trim();
    if (q.length < 2) { setSearchResults([]); return; }
    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const su = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!su || !anon) return;
        const res = await fetch(`${su}/functions/v1/spotify-search`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${anon}` },
          body: JSON.stringify({ query: q }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const items = (Array.isArray(data) ? data : (data.results ?? [])).map((item: { id?: string; name?: string; artist?: string; albumArt?: string }) => ({
          trackId: item.id ?? "", title: item.name ?? "", artist: item.artist ?? "", thumb: item.albumArt ?? "",
        }));
        setSearchResults(items);
      } catch { setSearchResults([]); }
      setSearchLoading(false);
    }, 500);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [spotifyInput]);

  const openAudioModal = () => {
    setModalUrl(audioUrl);
    setModalVolume(audioVolume);
    setAudioTab("url");
    setAudioTitle(externalTrack?.title ?? "");
    setAudioArtist(externalTrack?.artist ?? "");
    setCoverUrl(externalTrack?.thumb ?? "");
    setLyricsText(
      lyrics?.map((l) => {
        if (l.time == null) return l.text;
        const m = Math.floor(l.time / 60);
        const s = Math.floor(l.time % 60);
        const cs = Math.round((l.time % 1) * 100);
        return `[${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}] ${l.text}`;
      }).join("\n") ?? ""
    );
    setExternalUrl("");
    setShowAudioModal(true);
  };

  const saveAudioModal = () => {
    let finalUrl = modalUrl;
    if (externalUrl.trim()) {
      finalUrl = externalUrl.trim();
    }
    onAudioChange(finalUrl);
    onAudioVolumeChange(modalVolume);
    if (audioTitle || audioArtist || coverUrl) {
      onAudioMetaChange?.({
        trackId: externalTrack?.trackId ?? "",
        title: audioTitle,
        artist: audioArtist,
        thumb: coverUrl,
      });
    }
    // Parse synced lyrics
    if (lyricsText.trim() && onLyricsChange) {
      const parsed = lyricsText.split("\n").map((line) => {
        const match = line.match(/^\[(\d{1,2}):(\d{2})\.(\d{2})\]\s*(.*)$/);
        if (match) {
          const time = parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3]) / 100;
          return { time, text: match[4] };
        }
        return { time: null, text: line };
      });
      onLyricsChange(parsed);
    }
    setShowAudioModal(false);
  };

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const url = await uploadToStorage(file, "covers");
      setCoverUrl(url);
    } catch (err) {
      console.error("Cover upload failed:", err);
    }
    setCoverUploading(false);
    e.target.value = "";
  }, []);

  const handleBgSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgIsVideo(file.type.startsWith("video/"));
    const url = await uploadToStorage(file, "backgrounds");
    onBackgroundChange(url);
    e.target.value = "";
  }, [onBackgroundChange]);

  const handleAvatarSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadToStorage(file, "avatars");
    onAvatarChange(url);
    e.target.value = "";
  }, [onAvatarChange]);

  const handleCursorSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const parts = file.name.split(".");
    setCursorExt(parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "");
    const url = await uploadToStorage(file, "cursors");
    onCursorChange(url);
    e.target.value = "";
  }, [onCursorChange]);

  const handleAudioUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setAudioUploading(true);
    try {
      const url = await uploadToStorage(file, "audio");
      setUploadedAudio({ name: file.name, size, url });
      setModalUrl(url);
    } catch (err) {
      console.error("Audio upload failed:", err);
    }
    setAudioUploading(false);
    e.target.value = "";
  }, []);

  const openTrimPopup = () => {
    setTrimStart(0);
    setTrimEnd(Math.min(30, audioDuration || 30));
    setShowTrim(true);
  };

  const applyTrim = () => {
    setShowTrim(false);
  };

  const bgUploaded = toUploaded(backgroundUrl, bgIsVideo || undefined);
  const avatarUploaded = toUploaded(avatarUrl);
  const cursorUploaded = toUploaded(cursorUrl, false);

  const tabs: { key: AudioTab; label: string }[] = [
    { key: "url", label: "URL" },
    { key: "upload", label: "Upload" },
    { key: "youtube", label: "YouTube" },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .assets-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <input ref={bgInputRef} type="file" accept=".mp4,.webm,.gif,.png,.jpg,.jpeg,.webp" style={{ display: "none" }} onChange={handleBgSelect} />
      <input ref={avatarInputRef} type="file" accept=".gif,.webp,.png,.jpg,.jpeg" style={{ display: "none" }} onChange={handleAvatarSelect} />
      <input ref={cursorInputRef} type="file" accept=".cur,.png" style={{ display: "none" }} onChange={handleCursorSelect} />
      <input ref={audioInputRef} type="file" accept=".mp3,.wav,.ogg" style={{ display: "none" }} onChange={handleAudioUpload} />
      <input ref={coverInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" style={{ display: "none" }} onChange={handleCoverUpload} />

      <div className="assets-grid" style={{ display: "flex", gap: 10, width: "100%" }}>
        <AssetCard label="Background">
          <AssetUploadZone
            uploaded={bgUploaded}
            onRemove={() => { setBgIsVideo(false); onBackgroundChange(""); }}
            onClick={() => bgInputRef.current?.click()}
          >
            <Image style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
            <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>Click to upload</span>
          </AssetUploadZone>
        </AssetCard>

        <AssetCard label="Audio">
          <AssetUploadZone alwaysShow onClick={openAudioModal}>
            <FolderOpen style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
            <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>Click to open audio manager</span>
          </AssetUploadZone>
        </AssetCard>

        <AssetCard label="Profile Avatar">
          <AssetUploadZone
            uploaded={avatarUploaded}
            onRemove={() => onAvatarChange("")}
            onClick={() => avatarInputRef.current?.click()}
          >
            <Upload style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
            <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>Click to upload a file</span>
          </AssetUploadZone>
        </AssetCard>

        <AssetCard label="Custom Cursor">
          <AssetUploadZone
            uploaded={cursorUploaded}
            onRemove={() => { setCursorExt(""); onCursorChange(""); }}
            onClick={() => cursorInputRef.current?.click()}
          >
            <MousePointer2 style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
            <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>Click to upload</span>
          </AssetUploadZone>
        </AssetCard>
      </div>

      {showAudioModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAudioModal(false); }}
        >
          {/* Glassmorphism backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(12px) saturate(180%)",
              background: "rgba(15,15,15,0.75)",
            }}
            onClick={() => setShowAudioModal(false)}
          />
          <div
            style={{
              position: "relative",
              background: "rgba(20,20,20,0.95)",
              borderRadius: 20,
              padding: 28,
              width: 560,
              maxWidth: "92vw",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              zIndex: 1,
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#fafafa" }}>Add audio</span>
                <button
                  onClick={() => setShowAudioModal(false)}
                  style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>
              <p style={{ fontSize: 13.5, color: "#666", margin: 0, lineHeight: 1.5 }}>
                Add a track with a title, optional cover, and audio file.
              </p>
            </div>

            {/* Upload zones row */}
            <div style={{ display: "flex", gap: 12 }}>
              {/* Audio file upload */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Audio file</span>
                <div
                  onClick={() => audioInputRef.current?.click()}
                  style={{
                    background: "#0a0a0a",
                    border: "1.5px dashed #2a2a2a",
                    borderRadius: 12,
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    gap: 6,
                    transition: "border-color 0.15s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
                >
                  {audioUploading ? (
                    <span style={{ fontSize: 13, color: "#666" }}>Uploading…</span>
                  ) : uploadedAudio ? (
                    <>
                      <Music style={{ width: 24, height: 24, color: "#666" }} />
                      <span style={{ fontSize: 12, color: "#999", maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>{uploadedAudio.name}</span>
                      <span style={{ fontSize: 11, color: "#555" }}>{uploadedAudio.size}</span>
                    </>
                  ) : (
                    <>
                      <Upload style={{ width: 24, height: 24, color: "#555" }} />
                      <span style={{ fontSize: 12, color: "#555" }}>Drop or click to upload</span>
                      <span style={{ fontSize: 11, color: "#444" }}>Max 10MB</span>
                    </>
                  )}
                </div>
              </div>

              {/* Cover art upload */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Cover <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></span>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    background: "#0a0a0a",
                    border: "1.5px dashed #2a2a2a",
                    borderRadius: 12,
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    gap: 6,
                    transition: "border-color 0.15s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
                >
                  {coverUploading ? (
                    <span style={{ fontSize: 13, color: "#666" }}>Uploading…</span>
                  ) : coverUrl ? (
                    <>
                      <img src={coverUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, color: "#ccc" }}>Click to replace</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload style={{ width: 24, height: 24, color: "#555" }} />
                      <span style={{ fontSize: 12, color: "#555" }}>Drop or click to upload</span>
                      <span style={{ fontSize: 11, color: "#444" }}>Max 10MB</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick import */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Quick import</span>
              <div
                style={{
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                    <Music style={{ width: 16, height: 16, color: "#1DB954" }} />
                    <span style={{ fontSize: 13, color: "#ccc" }}>Import from Spotify</span>
                  </div>
                </div>

                {externalTrack ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0d0d0d", borderRadius: 10, padding: 10 }}>
                    {externalTrack.thumb && (
                      <img src={externalTrack.thumb} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: "#fafafa", fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{externalTrack.title}</p>
                      <p style={{ fontSize: 11, color: "#777", margin: 0 }}>{externalTrack.artist}</p>
                    </div>
                    <button
                      onClick={() => onAudioMetaChange?.(null)}
                      style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}
                    >
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={spotifyInput}
                      onChange={(e) => setSpotifyInput(e.target.value)}
                      placeholder="Search for a song…"
                      style={{
                        background: "#0a0a0a",
                        border: "1px solid #222",
                        borderRadius: 8,
                        padding: "8px 12px",
                        color: "#f1f1f1",
                        fontSize: 13,
                        fontFamily: "Satoshi, sans-serif",
                        outline: "none",
                        flex: 1,
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      style={{
                        background: "rgba(22,163,74,0.2)",
                        border: "1px solid rgba(34,197,94,0.4)",
                        borderRadius: 8,
                        padding: "8px 14px",
                        color: "#4ade80",
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Search style={{ width: 14, height: 14 }} />
                      Search
                    </button>
                  </div>
                )}

                {searchLoading && <p style={{ fontSize: 12, color: "#666", margin: 0 }}>Searching…</p>}

                {searchResults.length > 0 && !externalTrack && (
                  <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                    {searchResults.map((r) => (
                      <div
                        key={r.trackId}
                        onClick={() => {
                          onAudioMetaChange?.({ trackId: r.trackId, title: r.title, artist: r.artist, thumb: r.thumb });
                          setAudioTitle(r.title);
                          setAudioArtist(r.artist);
                          if (r.thumb) setCoverUrl(r.thumb);
                          setSearchResults([]);
                          setSpotifyInput("");
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                          borderRadius: 8, cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {r.thumb ? (
                          <img src={r.thumb} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: 6, background: "#1a1a1a", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, color: "#fafafa", fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {r.title}
                          </p>
                          <p style={{ fontSize: 11, color: "#777", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {r.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ fontSize: 11, color: "#444", margin: 0 }}>Auto-fill title, artist, cover</p>
              </div>
            </div>

            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Title</span>
              <div style={{ position: "relative" }}>
                <Music style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#444", pointerEvents: "none" }} />
                <input
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                  placeholder="Give it a name"
                  style={{
                    background: "#121212", border: "1px solid #222", borderRadius: 12,
                    padding: "10px 14px 10px 36px", color: "#f1f1f1", fontSize: 14,
                    fontFamily: "Satoshi, sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Artist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Artist <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></span>
              <div style={{ position: "relative" }}>
                <Mic style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#444", pointerEvents: "none" }} />
                <input
                  value={audioArtist}
                  onChange={(e) => setAudioArtist(e.target.value)}
                  placeholder="Who made this track?"
                  style={{
                    background: "#121212", border: "1px solid #222", borderRadius: 12,
                    padding: "10px 14px 10px 36px", color: "#f1f1f1", fontSize: 14,
                    fontFamily: "Satoshi, sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Synced lyrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Synced lyrics <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></span>
                <button
                  style={{
                    background: "none", border: "1px solid #2a2a2a", borderRadius: 8,
                    padding: "4px 10px", color: "#888", fontSize: 12, cursor: "pointer",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  Find lyrics
                </button>
              </div>
              <textarea
                value={lyricsText}
                onChange={(e) => setLyricsText(e.target.value)}
                placeholder={"[mm:ss.xx] First line\n[mm:ss.xx] Second line…"}
                rows={4}
                style={{
                  background: "#121212", border: "1px solid #222", borderRadius: 12,
                  padding: "10px 14px", color: "#f1f1f1", fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace", outline: "none", width: "100%",
                  boxSizing: "border-box", resize: "vertical", lineHeight: 1.7,
                }}
              />
            </div>

            {/* External URL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>External URL <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></span>
              <div style={{ position: "relative" }}>
                <Link2 style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#444", pointerEvents: "none" }} />
                <input
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://example.com/track"
                  style={{
                    background: "#121212", border: "1px solid #222", borderRadius: 12,
                    padding: "10px 14px 10px 36px", color: "#f1f1f1", fontSize: 14,
                    fontFamily: "Satoshi, sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Volume */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Volume</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Slider value={modalVolume} onChange={setModalVolume} min={0} max={1} step={0.05} />
                <span style={{ fontSize: 13, color: "#777", minWidth: 36, textAlign: "right" }}>
                  {Math.round(modalVolume * 100)}%
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <button
                onClick={() => setShowAudioModal(false)}
                style={{
                  background: "#1a1a1a", border: "1px solid #222", borderRadius: 12,
                  padding: "9px 20px", color: "#aaa", fontSize: 14, cursor: "pointer",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveAudioModal}
                style={{
                  background: "rgba(219,39,119,0.3)", border: "1px solid rgba(236,72,153,0.4)",
                  borderRadius: 12, padding: "9px 20px", color: "#f9a8d4", fontSize: 14,
                  cursor: "pointer", fontFamily: "Satoshi, sans-serif", fontWeight: 500,
                }}
              >
                Add audio
              </button>
            </div>
          </div>
        </div>
      )}

      {showTrim && uploadedAudio && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowTrim(false); }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.65)" }} />
          <div
            style={{
              position: "relative", background: "#141414", border: "2px solid #181818",
              borderRadius: 25, padding: 25, width: 500, maxWidth: "90vw",
              display: "flex", flexDirection: "column", gap: 16, zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: "#fafafa" }}>Trim Audio</span>
              <button onClick={() => setShowTrim(false)} style={{ background: "none", border: "none", color: "#797979", cursor: "pointer" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div
              style={{ position: "relative", height: 40, background: "#1a1a1a", borderRadius: 12, border: "1px solid #222", overflow: "hidden" }}
            >
              <div
                style={{
                  position: "absolute", top: 0, height: "100%",
                  left: `${(trimStart / (audioDuration || 30)) * 100}%`,
                  width: `${((trimEnd - trimStart) / (audioDuration || 30)) * 100}%`,
                  background: "rgba(218,102,218,0.2)", borderLeft: "1px solid rgba(218,102,218,0.5)",
                  borderRight: "1px solid rgba(218,102,218,0.5)", pointerEvents: "none",
                }}
              />
            </div>

            <TrimHandle
              position={trimStart}
              max={audioDuration || 30}
              onChange={setTrimStart}
              boundMax={trimEnd}
              label="Start"
            />
            <TrimHandle
              position={trimEnd}
              max={audioDuration || 30}
              onChange={setTrimEnd}
              boundMin={trimStart}
              label="End"
            />

            <audio src={uploadedAudio.url} controls style={{ width: "100%", borderRadius: 8 }}
              onLoadedMetadata={(e) => setAudioDuration(Math.floor(e.currentTarget.duration))}
            />

            <div style={{ textAlign: "center", fontSize: 14, color: "#a5a4a4" }}>
              {Math.floor(trimStart / 60)}:{String(Math.floor(trimStart % 60)).padStart(2, "0")} → {Math.floor(trimEnd / 60)}:{String(Math.floor(trimEnd % 60)).padStart(2, "0")}
              <span style={{ color: "#797979", marginLeft: 8 }}>
                ({trimEnd - trimStart}s)
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowTrim(false)} style={{
                background: "#1a1a1a", border: "2px solid #222", borderRadius: 15,
                padding: "8px 18px", color: "#a5a4a4", fontSize: 14, cursor: "pointer", fontFamily: "Satoshi, sans-serif",
              }}>Cancel</button>
              <button onClick={applyTrim} style={{
                backgroundColor: "rgba(126,44,139,0.44)", border: "2px solid rgba(126,44,139,0.61)",
                borderRadius: 15, padding: "8px 18px", color: "#fafafa", fontSize: 14,
                cursor: "pointer", fontFamily: "Satoshi, sans-serif",
              }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TrimHandle({
  position, max, onChange, boundMin, boundMax, label,
}: {
  position: number; max: number; onChange: (v: number) => void;
  boundMin?: number; boundMax?: number; label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const getPos = useCallback((clientX: number) => {
    if (!trackRef.current) return position;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * max);
  }, [max, position]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      let raw = getPos(e.clientX);
      if (boundMin !== undefined) raw = Math.max(raw, boundMin + 1);
      if (boundMax !== undefined) raw = Math.min(raw, boundMax - 1);
      onChange(Math.max(0, Math.min(max, raw)));
    };
    const handleUp = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [getPos, boundMin, boundMax, max, onChange]);

  return (
    <div ref={trackRef} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 12, color: "#a5a4a4", minWidth: 30 }}>{label}</span>
      <div
        style={{ position: "relative", flex: 1, height: 6, background: "#2a2a2a", borderRadius: 999, cursor: "pointer" }}
        onMouseDown={(e) => {
          draggingRef.current = true;
          let raw = getPos(e.clientX);
          if (boundMin !== undefined) raw = Math.max(raw, boundMin + 1);
          if (boundMax !== undefined) raw = Math.min(raw, boundMax - 1);
          onChange(Math.max(0, Math.min(max, raw)));
        }}
      >
        <div
          style={{
            position: "absolute", top: "50%",
            left: `${(position / max) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 14, height: 14, borderRadius: "50%", background: "#fff",
            border: "2px solid rgba(218,102,218,0.8)", pointerEvents: "none",
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: "#797979", minWidth: 36, textAlign: "right" }}>
        {Math.floor(position / 60)}:{String(Math.floor(position % 60)).padStart(2, "0")}
      </span>
    </div>
  );
}

function AssetCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <span style={{ fontSize: 16, fontWeight: 500, color: "#dddddd", marginBottom: 5.5 }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function AssetUploadZone({
  uploaded, onRemove, alwaysShow, onClick, children,
}: {
  uploaded?: UploadedFile; onRemove?: () => void; alwaysShow?: boolean; onClick?: () => void; children: React.ReactNode;
}) {
  const hasFile = uploaded && !alwaysShow;

  return (
    <div
      style={{
        backgroundColor: "#0f0f0f", border: "2px solid #181818", borderRadius: 10,
        height: 130, width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        cursor: "pointer", userSelect: "none", overflow: "hidden",
      }}
      onClick={onClick}
    >
      {hasFile ? (
        <>
          {uploaded!.isVideo ? (
            <video src={uploaded!.url} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} muted loop autoPlay />
          ) : (
            <img src={uploaded!.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          )}
          <div style={{
            position: "absolute", top: 8, right: 8,
            background: "rgba(24,24,24,0.46)", backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)", borderRadius: 10,
            padding: "5px 10px", display: "flex", alignItems: "center", gap: 8, zIndex: 2,
          }}>
            <span style={{ fontSize: 13, color: "#fafafa" }}>.{uploaded!.ext || "file"}</span>
            <button onClick={(e) => { e.stopPropagation(); onRemove?.(); }} style={{
              cursor: "pointer", background: "none", border: "none", color: "#fafafa", fontSize: 14, padding: 0, lineHeight: 1,
            }}>✕</button>
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
