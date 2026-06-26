"use client";

import { useState } from "react";

type Uploaded = { name: string; url: string } | null;

export function AssetsUploader() {
  const [background, setBackground] = useState<Uploaded>(null);
  const [avatar, setAvatar] = useState<Uploaded>(null);
  const [cursor, setCursor] = useState<Uploaded>(null);

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-3 sm:w-full">
      <AssetBlock label="Background">
        {background ? (
          <PreviewBox
            icon={<BgIcon />}
            name={background.name}
            onRemove={() => setBackground(null)}
          />
        ) : (
          <UploadBox onClick={() => {}}>
            <BgIcon />
            <span className="text-xs text-white/40">Click to upload</span>
          </UploadBox>
        )}
      </AssetBlock>

      <AssetBlock label="Audio">
        <UploadBox onClick={() => {}}>
          <MusicIcon />
          <span className="text-xs text-white/40">Click to open audio manager</span>
        </UploadBox>
      </AssetBlock>

      <AssetBlock label="Profile Avatar">
        {avatar ? (
          <PreviewBox
            icon={<AvatarIcon />}
            name={avatar.name}
            onRemove={() => setAvatar(null)}
          />
        ) : (
          <UploadBox onClick={() => {}}>
            <AvatarIcon />
            <div className="text-center">
              <p className="text-xs text-white/40">Click to upload a file</p>
              <p className="text-[10px] text-white/20">.gif .webp .png .jpg .jpeg</p>
            </div>
          </UploadBox>
        )}
      </AssetBlock>

      <AssetBlock label="Custom Cursor">
        {cursor ? (
          <PreviewBox
            icon={<CursorIcon />}
            name={cursor.name}
            onRemove={() => setCursor(null)}
          />
        ) : (
          <UploadBox onClick={() => {}}>
            <CursorIcon />
            <span className="text-xs text-white/40">Click to upload</span>
          </UploadBox>
        )}
      </AssetBlock>
    </div>
  );
}

function AssetBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <span className="text-xs font-medium text-white/50">{label}</span>
      {children}
    </div>
  );
}

function UploadBox({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 min-h-[90px] cursor-pointer hover:bg-white/[0.06] transition w-full"
    >
      {children}
    </button>
  );
}

function PreviewBox({
  icon,
  name,
  onRemove,
}: {
  icon: React.ReactNode;
  name: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 min-h-[90px] w-full">
      {icon}
      <p className="truncate max-w-full text-xs text-white/50">{name}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/60 text-white/50 flex items-center justify-center text-[10px] hover:bg-red-500/60 hover:text-white transition"
      >
        ✕
      </button>
    </div>
  );
}

function BgIcon() {
  return (
    <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3L3 5.25l5.25 5.25L9 9l-3.75-3.75L9 1.5 5.25 3zM3 18.75L5.25 21l5.25-5.25L9 15l-3.75 3.75L1.5 15 3 18.75zM15 19.5l-3 3-3-3M18.75 3L21 5.25l-5.25 5.25L15 9l3.75-3.75L15 1.5 18.75 3z" />
    </svg>
  );
}
