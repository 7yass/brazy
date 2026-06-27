"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ProfileConfig } from "@/lib/profile/schema";
import BackgroundLayer from "./BackgroundLayer";
import CursorEffect from "./CursorEffect";
import ClickEffect from "./ClickEffect";
import SplashIntro from "./SplashIntro";
import ViewCounter from "./ViewCounter";
import { brandIcons } from "./icons";

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export default function ProfileRenderer({
  config,
  preview,
  audioTrackId,
  audioTitle,
  audioArtist,
  audioThumb,
  profileBadges,
}: {
  config: ProfileConfig;
  preview?: boolean;
  audioTrackId?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioThumb?: string;
  profileBadges?: Badge[];
}) {
  const [entered, setEntered] = useState(preview || !config.splash.enabled);
  const { theme, identity, background, effects, splash, social } = config;

  const fontFamily =
    theme.fontFamily === "custom" && theme.fontFamilyUrl
      ? "var(--font-custom)"
      : theme.fontFamily === "mono"
        ? "var(--font-geist-mono), monospace"
        : "var(--font-geist-sans), system-ui, sans-serif";

  return (
    <>
      <BackgroundLayer background={background} />
      <CursorEffect effects={effects} />
      <ClickEffect effects={effects} />
      <SplashIntro splash={splash} onEnter={() => setEntered(true)} />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(16px, 4vw, 48px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{
            opacity: entered ? 1 : 0.12,
            y: entered ? 0 : 30,
            scale: entered ? 1 : 0.97,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 500,
            margin: "0 auto",
            padding: "24px 24px 20px",
            borderRadius: theme.borderRadius,
            border: `${theme.borderWidth}px solid rgba(255,255,255,0.08)`,
            backdropFilter: theme.cardStyle === "glass" ? `blur(${theme.cardBlur}px)` : "none",
            WebkitBackdropFilter: theme.cardStyle === "glass" ? `blur(${theme.cardBlur}px)` : "none",
            background:
              theme.cardStyle === "glass"
                ? `rgba(15, 14, 22, ${theme.cardOpacity})`
                : theme.cardStyle === "minimal"
                  ? "transparent"
                  : `rgba(12, 11, 20, ${theme.cardOpacity})`,
            boxShadow: theme.glow
              ? `0 0 ${theme.glowIntensity}px ${theme.primaryColor}22, 0 24px 70px rgba(0,0,0,0.55)`
              : "0 24px 70px rgba(0,0,0,0.55)",
            color: theme.textColor,
            fontFamily,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {identity.avatarUrl && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: entered ? 1 : 0.6, opacity: entered ? 1 : 0.12 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: "50%",
                  padding: 3,
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`,
                  boxShadow: `0 0 30px ${theme.primaryColor}55`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={identity.avatarUrl}
                  alt={identity.displayName}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    background: theme.backgroundColor,
                  }}
                />
              </motion.div>
            )}

            <div style={{ marginTop: identity.avatarUrl ? 16 : 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
              <motion.h1
                custom={0}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: entered ? 1 : 0.12, y: entered ? 0 : 24 }}
                transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  margin: 0,
                  fontSize: 21,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  textShadow: effects.textGlow ? `0 0 24px ${theme.accentColor}66` : "none",
                  display: "inline",
                }}
              >
                {identity.displayName || identity.username}
              </motion.h1>
              {profileBadges?.map((badge) => (
                <BadgeIcon key={badge.id} badge={badge} />
              ))}
            </div>

            <motion.div
              custom={1}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: entered ? 1 : 0.12, y: entered ? 0 : 24 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 6,
                fontSize: 14,
                color: theme.mutedTextColor,
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span>@{identity.username}</span>
              {identity.pronouns && (
                <>
                  <span style={{ color: theme.mutedTextColor, opacity: 0.5 }}>·</span>
                  <span>{identity.pronouns}</span>
                </>
              )}
              {identity.location && (
                <>
                  <span style={{ color: theme.mutedTextColor, opacity: 0.5 }}>·</span>
                  <span>📍 {identity.location}</span>
                </>
              )}
            </motion.div>

            {identity.bio && (
              <motion.p
                custom={2}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: entered ? 1 : 0.12, y: entered ? 0 : 24 }}
                transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  margin: "16px 0 0",
                  maxWidth: 360,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: theme.textColor,
                  opacity: 0.65,
                  textAlign: "center",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {identity.bio}
              </motion.p>
            )}

            {social.links.length > 0 && (
              <motion.div
                custom={3}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: entered ? 1 : 0.12, y: entered ? 0 : 24 }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 20,
                  width: "100%",
                }}
              >
                {social.links.map((link, i) => {
                  const Icon = brandIcons[link.platform] || brandIcons.website;
                  const color = link.color || theme.accentColor;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label || link.platform}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 44,
                        borderRadius: 12,
                        padding: "0 16px",
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${color}22`,
                        color: theme.textColor,
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 500,
                        gap: 10,
                        transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${color}18`;
                        e.currentTarget.style.borderColor = `${color}55`;
                        e.currentTarget.style.boxShadow = `0 0 20px ${color}33`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = `${color}22`;
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <Icon size={18} />
                      </span>
                      <span style={{ flex: 1, textAlign: "center" }}>{link.label || link.platform}</span>
                    </a>
                  );
                })}
              </motion.div>
            )}

            <motion.div
              custom={4}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: entered ? 1 : 0.12, y: entered ? 0 : 24 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <ViewCounter initial={0} accent={theme.accentColor} />
            </motion.div>

            {(audioTrackId || (identity as { audio?: { src?: string } }).audio?.src) && (
              <motion.div
                custom={5}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: entered ? 1 : 0.12, y: entered ? 0 : 24 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 16,
                  width: "100%",
                }}
              >
                <AudioPill
                  audioTrackId={audioTrackId}
                  title={audioTitle}
                  artist={audioArtist}
                  thumb={audioThumb}
                  accentColor={theme.accentColor}
                  textColor={theme.textColor}
                  mutedTextColor={theme.mutedTextColor}
                />
              </motion.div>
            )}

            {config.customHtml && (
              <div style={{ marginTop: 20 }} dangerouslySetInnerHTML={{ __html: config.customHtml }} />
            )}
          </div>
        </motion.div>
      </div>

      {config.customCss && <style dangerouslySetInnerHTML={{ __html: config.customCss }} />}
    </>
  );
}

function BadgeIcon({ badge }: { badge: Badge }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{badge.icon}</span>
      {show && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "4px 10px",
            whiteSpace: "nowrap",
            fontSize: 12,
            color: "#fafafa",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 600 }}>{badge.label}</div>
          {badge.description && <div style={{ color: "#a5a4a4", fontSize: 11 }}>{badge.description}</div>}
        </div>
      )}
    </div>
  );
}

function AudioPill({
  audioTrackId,
  title,
  artist,
  thumb,
  accentColor,
  textColor,
  mutedTextColor,
}: {
  audioTrackId?: string;
  title?: string;
  artist?: string;
  thumb?: string;
  accentColor: string;
  textColor?: string;
  mutedTextColor?: string;
}) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioTrackId) return;
    const initPlayer = () => {
      playerRef.current = new window.YT!.Player("yt-player-inline", {
        videoId: audioTrackId,
        playerVars: { autoplay: 0, enablejsapi: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === window.YT?.PlayerState.PLAYING);
          },
        },
      });
    };
    if (window.YT) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [audioTrackId]);

  if (!audioTrackId) return null;

  return (
    <>
      <div id="yt-player-inline" style={{ width: 0, height: 0, position: "absolute", pointerEvents: "none", opacity: 0 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${accentColor}22`,
          borderRadius: 100,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {thumb && (
          <img
            src={thumb}
            alt=""
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: textColor ?? "#e9d5ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title || "track"}
          </p>
          {artist && (
            <p style={{ margin: "1px 0 0", fontSize: 11, color: mutedTextColor ?? "#71717a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {artist}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            const p = playerRef.current;
            if (!p) return;
            if (playing) { p.pauseVideo(); setPlaying(false); }
            else { p.playVideo(); setPlaying(true); }
          }}
          style={{
            background: "none",
            border: "none",
            color: "#fafafa",
            cursor: "pointer",
            fontSize: 16,
            padding: "4px 6px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
    </>
  );
}

declare global {
  interface Window {
    YT?: {
      Player: new (id: string, opts: Record<string, unknown>) => YTPlayer;
      PlayerState: { PLAYING: number; [key: string]: number };
      ready?: boolean;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}


