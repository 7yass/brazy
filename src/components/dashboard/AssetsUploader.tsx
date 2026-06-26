"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Image, FolderOpen, Upload, MousePointer2, Music, X, Search, Scissors } from "lucide-react";
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
    setShowAudioModal(true);
  };

  const saveAudioModal = () => {
    onAudioChange(modalUrl);
    onAudioVolumeChange(modalVolume);
    if (onLyricsChange) onLyricsChange(lyricsData);
    setShowAudioModal(false);
  };

  const handleBgSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgIsVideo(file.type.startsWith("video/"));
    onBackgroundChange(url);
    e.target.value = "";
  }, [onBackgroundChange]);

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAvatarChange(URL.createObjectURL(file));
    e.target.value = "";
  }, [onAvatarChange]);

  const handleCursorSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const parts = file.name.split(".");
    setCursorExt(parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "");
    onCursorChange(url);
    e.target.value = "";
  }, [onCursorChange]);

  const handleAudioUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setUploadedAudio({ name: file.name, size, url });
    setModalUrl(url);
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
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAudioModal(false); }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)" }} />
          <div
            style={{
              position: "relative", background: "#141414", border: "2px solid #181818",
              borderRadius: 25, padding: 25, width: 480, maxWidth: "90vw",
              display: "flex", flexDirection: "column", gap: 16, zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Music style={{ width: 20, height: 20, color: "#fafafa" }} />
                <span style={{ fontSize: 18, fontWeight: 500, color: "#fafafa" }}>Audio Manager</span>
              </div>
              <button onClick={() => setShowAudioModal(false)} style={{ background: "none", border: "none", color: "#797979", cursor: "pointer", padding: 4 }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setAudioTab(t.key)}
                  style={{
                    background: audioTab === t.key ? "rgba(218,102,218,0.2)" : "#1a1a1a",
                    border: audioTab === t.key ? "1px solid rgba(218,102,218,0.4)" : "1px solid #222",
                    borderRadius: 8, padding: "4px 12px", fontSize: 13,
                    color: audioTab === t.key ? "#fafafa" : "#a5a4a4",
                    cursor: "pointer", fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {audioTab === "url" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 14, color: "#a5a4a4", fontWeight: 450 }}>Audio URL</span>
                <input
                  value={modalUrl}
                  onChange={(e) => setModalUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  style={{
                    background: "#121212", border: "2px solid #1b1b1b", borderRadius: 14,
                    padding: "10px 14px", color: "#f1f1f1", fontSize: 15,
                    fontFamily: "Satoshi, sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {audioTab === "upload" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  onClick={() => audioInputRef.current?.click()}
                  style={{
                    background: "#0f0f0f", border: "2px solid #181818", borderRadius: 14,
                    padding: 30, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 6,
                  }}
                >
                  <Upload style={{ width: 32, height: 32, color: "#797979" }} />
                  <span style={{ fontSize: 14, color: "#797979" }}>Click to upload .mp3, .wav, or .ogg</span>
                </div>

                {uploadedAudio && (
                  <div style={{
                    background: "#121212", border: "2px solid #1b1b1b", borderRadius: 12,
                    padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: 14, color: "#f1f1f1", fontWeight: 500 }}>{uploadedAudio.name}</p>
                      <p style={{ fontSize: 12, color: "#797979" }}>{uploadedAudio.size}</p>
                    </div>
                    <button
                      onClick={openTrimPopup}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: "rgba(126,44,139,0.3)", border: "1px solid rgba(126,44,139,0.5)",
                        borderRadius: 8, padding: "6px 12px", color: "#fafafa", fontSize: 13,
                        cursor: "pointer", fontFamily: "Satoshi, sans-serif",
                      }}
                    >
                      <Scissors style={{ width: 14, height: 14 }} />
                      Trim audio
                    </button>
                  </div>
                )}
              </div>
            )}

            {audioTab === "youtube" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {externalTrack ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#121212", border: "2px solid #1b1b1b", borderRadius: 14, padding: 12 }}>
                    {externalTrack.thumb && (
                      <img src={externalTrack.thumb} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, color: "#fafafa", fontWeight: 500 }}>{externalTrack.title}</p>
                      <p style={{ fontSize: 12, color: "#797979" }}>{externalTrack.artist}</p>
                    </div>
                    <button onClick={() => onAudioMetaChange?.(null)} style={{ background: "none", border: "none", color: "#797979", cursor: "pointer" }}>
                      <X style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <input
                      value={spotifyInput}
                      onChange={(e) => setSpotifyInput(e.target.value)}
                      placeholder="Search for a song..."
                      style={{
                        background: "#121212", border: "2px solid #1b1b1b", borderRadius: 14,
                        padding: "10px 14px", color: "#f1f1f1", fontSize: 15,
                        fontFamily: "Satoshi, sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}

                {searchLoading && <p style={{ fontSize: 12, color: "#797979" }}>Searching...</p>}

                {searchResults.length > 0 && !externalTrack && (
                  <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                    {searchResults.map((r) => (
                      <div
                        key={r.trackId}
                        onClick={() => {
                          onAudioMetaChange?.({ trackId: r.trackId, title: r.title, artist: r.artist, thumb: r.thumb });
                          setSearchResults([]);
                          setSpotifyInput("");
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
                          borderRadius: 12, cursor: "pointer", height: 52,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {r.thumb ? (
                          <img src={r.thumb} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 6, background: "#1a1a1a", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, color: "#fafafa", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {r.title}
                          </p>
                          <p style={{ fontSize: 12, color: "#797979", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {r.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#a5a4a4", fontWeight: 450 }}>Volume</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Slider value={modalVolume} onChange={setModalVolume} min={0} max={1} step={0.05} />
                <span style={{ fontSize: 12, color: "#797979", minWidth: 36, textAlign: "right" }}>
                  {Math.round(modalVolume * 100)}%
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button onClick={() => setShowAudioModal(false)} style={{
                background: "#1a1a1a", border: "2px solid #222", borderRadius: 15,
                padding: "8px 18px", color: "#a5a4a4", fontSize: 14, cursor: "pointer", fontFamily: "Satoshi, sans-serif",
              }}>Cancel</button>
              <button onClick={saveAudioModal} style={{
                backgroundColor: "rgba(126,44,139,0.44)", border: "2px solid rgba(126,44,139,0.61)",
                borderRadius: 15, padding: "8px 18px", color: "#fafafa", fontSize: 14,
                cursor: "pointer", fontFamily: "Satoshi, sans-serif",
              }}>Save</button>
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
