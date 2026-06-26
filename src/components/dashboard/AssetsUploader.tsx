"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Image, FolderOpen, Upload, MousePointer2, Music, X } from "lucide-react";

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
}

type UploadedFile = {
  name: string;
  url: string;
  ext: string;
  isVideo: boolean;
} | null;

function toUploaded(url: string, presetVideo?: boolean): UploadedFile {
  if (!url) return null;
  const parts = url.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  const isVideo = presetVideo ?? ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
  return { name: url.split("/").pop() ?? "file", url, ext, isVideo };
}

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
}: AssetsUploaderProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);

  const [bgIsVideo, setBgIsVideo] = useState(false);
  const [cursorExt, setCursorExt] = useState("");
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [modalUrl, setModalUrl] = useState(audioUrl);
  const [modalVolume, setModalVolume] = useState(audioVolume);

  const openAudioModal = () => {
    setModalUrl(audioUrl);
    setModalVolume(audioVolume);
    setShowAudioModal(true);
  };

  const saveAudioModal = () => {
    onAudioChange(modalUrl);
    onAudioVolumeChange(modalVolume);
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

  const bgUploaded = toUploaded(backgroundUrl, bgIsVideo || undefined);
  const avatarUploaded = toUploaded(avatarUrl);
  const cursorUploaded = toUploaded(cursorUrl, false);

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
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)" }} />
          <div
            style={{
              position: "relative",
              background: "#141414",
              border: "2px solid #181818",
              borderRadius: 25,
              padding: 25,
              width: 420,
              maxWidth: "90vw",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Music style={{ width: 20, height: 20, color: "#fafafa" }} />
                <span style={{ fontSize: 18, fontWeight: 500, color: "#fafafa" }}>Audio Manager</span>
              </div>
              <button
                onClick={() => setShowAudioModal(false)}
                style={{ background: "none", border: "none", color: "#797979", cursor: "pointer", padding: 4 }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#a5a4a4", fontWeight: 450 }}>Audio URL</span>
              <input
                value={modalUrl}
                onChange={(e) => setModalUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                style={{
                  background: "#121212",
                  border: "2px solid #1b1b1b",
                  borderRadius: 14,
                  padding: "10px 14px",
                  color: "#f1f1f1",
                  fontSize: 15,
                  fontFamily: "Satoshi, sans-serif",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#a5a4a4", fontWeight: 450 }}>Volume</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ModalSlider
                  value={modalVolume}
                  onChange={setModalVolume}
                  min={0}
                  max={1}
                  step={0.05}
                />
                <span style={{ fontSize: 12, color: "#797979", minWidth: 36, textAlign: "right" }}>
                  {Math.round(modalVolume * 100)}%
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button
                onClick={() => setShowAudioModal(false)}
                style={{
                  background: "#1a1a1a",
                  border: "2px solid #222",
                  borderRadius: 15,
                  padding: "8px 18px",
                  color: "#a5a4a4",
                  fontSize: 14,
                  fontFamily: "Satoshi, sans-serif",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveAudioModal}
                style={{
                  backgroundColor: "rgba(126,44,139,0.44)",
                  border: "2px solid rgba(126,44,139,0.61)",
                  borderRadius: 15,
                  padding: "8px 18px",
                  color: "#fafafa",
                  fontSize: 14,
                  fontFamily: "Satoshi, sans-serif",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  uploaded,
  onRemove,
  alwaysShow,
  onClick,
  children,
}: {
  uploaded?: UploadedFile;
  onRemove?: () => void;
  alwaysShow?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const hasFile = uploaded && !alwaysShow;

  return (
    <div
      style={{
        backgroundColor: "#0f0f0f",
        border: "2px solid #181818",
        borderRadius: 10,
        height: 130,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      {hasFile ? (
        <>
          {uploaded!.isVideo ? (
            <video
              src={uploaded!.url}
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
              muted
              loop
              autoPlay
            />
          ) : (
            <img
              src={uploaded!.url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
            />
          )}

          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(24,24,24,0.46)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              borderRadius: 10,
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 2,
            }}
          >
            <span style={{ fontSize: 13, color: "#fafafa" }}>.{uploaded!.ext || "file"}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "#fafafa",
                fontSize: 14,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

function ModalSlider({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const computeValue = useCallback((clientX: number) => {
    if (!trackRef.current) return valueRef.current;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  }, [min, max, step]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    draggingRef.current = true;
    onChange(computeValue(e.clientX));
  }, [onChange, computeValue]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      onChange(computeValue(e.clientX));
    };
    const handleUp = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [onChange, computeValue]);

  const pct = max !== min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div
      ref={trackRef}
      style={{
        position: "relative",
        flex: 1,
        height: 4,
        background: "#2a2a2a",
        borderRadius: 999,
        cursor: "pointer",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: "rgba(218,102,218,0.7)",
          borderRadius: 999,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${Math.max(0, Math.min(100, pct))}%`,
          transform: "translate(-50%, -50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid rgba(218,102,218,0.8)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
