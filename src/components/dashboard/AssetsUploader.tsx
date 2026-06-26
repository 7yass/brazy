"use client";

import { useRef, useState } from "react";
import { Image, FolderOpen, Upload, MousePointer2 } from "lucide-react";

type Uploaded = { name: string; url: string; type: string } | null;

export function AssetsUploader() {
  const [background, setBackground] = useState<Uploaded>(null);
  const [avatar, setAvatar] = useState<Uploaded>(null);
  const [cursor, setCursor] = useState<Uploaded>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    setAvatar({ name: file.name, url, type: ext });
    e.target.value = "";
  };

  const simulateUpload = (
    setter: (v: Uploaded) => void,
    name: string,
    type: string,
  ) => {
    setter({ name, url: URL.createObjectURL(new Blob()), type });
  };

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
          uploaded={background}
          onRemove={() => setBackground(null)}
          onClick={() => simulateUpload(setBackground, "bg.mp4", "mp4")}
        >
          <Image style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to upload
          </span>
        </AssetBox>

        <AssetBox label="Audio" alwaysShow onClick={() => {}}>
          <FolderOpen style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to open audio manager
          </span>
        </AssetBox>

        <AssetBox
          label="Profile Avatar"
          uploaded={avatar}
          onRemove={() => setAvatar(null)}
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
            onChange={handleAvatarSelect}
          />
        </AssetBox>

        <AssetBox
          label="Custom Cursor"
          uploaded={cursor}
          onRemove={() => setCursor(null)}
          onClick={() => simulateUpload(setCursor, "cursor.cur", "cur")}
        >
          <MousePointer2 style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, color: "#797979", fontWeight: 450, marginTop: 2 }}>
            Click to upload
          </span>
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
            ) : label === "Custom Cursor" ? (
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
