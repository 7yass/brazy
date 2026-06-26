"use client";

import { useRef } from "react";
import { Image, FolderOpen, Upload, MousePointer2 } from "lucide-react";

interface AssetsUploaderProps {
  backgroundUrl: string;
  onBackgroundChange: (url: string) => void;
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  cursorUrl: string;
  onCursorChange: (url: string) => void;
}

type Uploaded = { name: string; url: string; type: string } | null;

function toUploaded(url: string): Uploaded {
  if (!url) return null;
  const parts = url.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1] : "file";
  return { name: url.split("/").pop() ?? "file", url, type: ext };
}

export function AssetsUploader({
  backgroundUrl,
  onBackgroundChange,
  avatarUrl,
  onAvatarChange,
  cursorUrl,
  onCursorChange,
}: AssetsUploaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
    e.target.value = "";
  };

  const bgUploaded = toUploaded(backgroundUrl);
  const avatarUploaded = toUploaded(avatarUrl);
  const cursorUploaded = toUploaded(cursorUrl);

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .assets-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <div className="assets-grid" style={{ display: "flex", gap: 10, width: "100%" }}>
        <AssetBox
          label="Background"
          uploaded={bgUploaded}
          onRemove={() => onBackgroundChange("")}
          onClick={() => bgInputRef.current?.click()}
        >
          <Image style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to upload
          </span>
          <input
            ref={bgInputRef}
            type="file"
            accept=".gif,.webp,.png,.jpg,.jpeg,.mp4,.webm,.mov"
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            onChange={(e) => handleFileSelect(e, onBackgroundChange)}
          />
        </AssetBox>

        <AssetBox label="Audio" alwaysShow onClick={() => {}}>
          <FolderOpen style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to open audio manager
          </span>
        </AssetBox>

        <AssetBox
          label="Profile Avatar"
          uploaded={avatarUploaded}
          onRemove={() => onAvatarChange("")}
          onClick={() => avatarInputRef.current?.click()}
        >
          <Upload style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to upload a file
          </span>
          <input
            ref={avatarInputRef}
            type="file"
            accept=".gif,.webp,.png,.jpg,.jpeg"
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            onChange={(e) => handleFileSelect(e, onAvatarChange)}
          />
        </AssetBox>

        <AssetBox
          label="Custom Cursor"
          uploaded={cursorUploaded}
          onRemove={() => onCursorChange("")}
          onClick={() => cursorInputRef.current?.click()}
        >
          <MousePointer2 style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to upload
          </span>
          <input
            ref={cursorInputRef}
            type="file"
            accept=".cur,.png,.svg,.gif,.webp"
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            onChange={(e) => handleFileSelect(e, onCursorChange)}
          />
        </AssetBox>
      </div>
    </>
  );
}

function AssetBox({
  label,
  children,
  uploaded,
  onRemove,
  alwaysShow,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  uploaded?: Uploaded;
  onRemove?: () => void;
  alwaysShow?: boolean;
  onClick?: () => void;
}) {
  const isVideo =
    label === "Background" &&
    uploaded &&
    ["mp4", "webm", "mov", "avi", "mkv"].includes(uploaded.type);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <span
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#dddddd",
          marginBottom: 5.5,
        }}
      >
        {label}
      </span>
      <div
        style={{
          backgroundColor: "#0f0f0f",
          border: "2px solid #181818",
          borderRadius: 10,
          height: 130,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
          userSelect: "none",
          overflow: "hidden",
        }}
        onClick={onClick}
      >
        {uploaded && !alwaysShow ? (
          <>
            {label === "Background" && isVideo ? (
              <video
                src={uploaded.url}
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                muted
                loop
                autoPlay
              />
            ) : null}

            {label === "Background" && !isVideo ? (
              <img
                src={uploaded.url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
              />
            ) : null}

            {label === "Profile Avatar" && (
              <img
                src={uploaded.url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
              />
            )}

            {label === "Custom Cursor" && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MousePointer2 style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
              </div>
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
              <span style={{ fontSize: 13, color: "#fafafa" }}>.{uploaded.type}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
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
    </div>
  );
}
