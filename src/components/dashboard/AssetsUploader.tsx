"use client";

import { useState } from "react";

type Uploaded = { name: string; url: string } | null;

export function AssetsUploader() {
  const [background, setBackground] = useState<Uploaded>(null);
  const [avatar, setAvatar] = useState<Uploaded>(null);
  const [cursor, setCursor] = useState<Uploaded>(null);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <AssetBox label="Background" uploaded={background} onRemove={() => setBackground(null)}>
        <BgIcon />
        <span style={{ fontSize: 14.5, fontWeight: 500, color: "#797979", marginTop: 2 }}>
          Click to upload
        </span>
      </AssetBox>

      <AssetBox label="Audio" alwaysShow>
        <AudioIcon />
        <span style={{ fontSize: 14.5, fontWeight: 500, color: "#797979", marginTop: 2 }}>
          Click to open audio manager
        </span>
      </AssetBox>

      <AssetBox label="Profile Avatar" uploaded={avatar} onRemove={() => setAvatar(null)}>
        <AvatarIcon />
        <span style={{ fontSize: 14.5, fontWeight: 500, color: "#797979", marginTop: 2 }}>
          Click to upload a file
        </span>
      </AssetBox>

      <AssetBox label="Custom Cursor" uploaded={cursor} onRemove={() => setCursor(null)}>
        <CursorIcon />
        <span style={{ fontSize: 14.5, fontWeight: 500, color: "#797979", marginTop: 2 }}>
          Click to upload
        </span>
      </AssetBox>
    </div>
  );
}

function AssetBox({
  label,
  children,
  uploaded,
  onRemove,
  alwaysShow,
}: {
  label: string;
  children: React.ReactNode;
  uploaded?: Uploaded;
  onRemove?: () => void;
  alwaysShow?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col" style={{ gap: 6 }}>
      <span style={{ fontSize: 16, fontWeight: 500, color: "#dddddd", marginBottom: 5.5 }}>
        {label}
      </span>
      <div
        style={{
          background: "#0f0f0f",
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
        }}
        onClick={() => {}}
      >
        {uploaded && !alwaysShow ? (
          <>
            {children}
            <span
              style={{
                fontSize: 12,
                color: "#a8a8a8",
                marginTop: 4,
                maxWidth: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {uploaded.name}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                color: "#fafafa",
                border: "none",
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function BgIcon() {
  return (
    <svg style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <svg style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg style={{ width: 42, height: 42, color: "#fafafa", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3L3 5.25l5.25 5.25L9 9l-3.75-3.75L9 1.5 5.25 3zM3 18.75L5.25 21l5.25-5.25L9 15l-3.75 3.75L1.5 15 3 18.75zM15 19.5l-3 3-3-3M18.75 3L21 5.25l-5.25 5.25L15 9l3.75-3.75L15 1.5 18.75 3z" />
    </svg>
  );
}
