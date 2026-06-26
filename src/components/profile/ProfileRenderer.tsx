"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ProfileConfig } from "@/lib/profile/schema";
import BackgroundLayer from "./BackgroundLayer";
import CursorEffect from "./CursorEffect";
import ClickEffect from "./ClickEffect";
import AudioPlayer from "./AudioPlayer";
import SplashIntro from "./SplashIntro";
import { brandIcons } from "./icons";

export default function ProfileRenderer({ config }: { config: ProfileConfig }) {
  const [entered, setEntered] = useState(!config.splash.enabled);
  const { theme, identity, background, effects, splash, audio, social, badges } = config;

  const fontFamily =
    theme.fontFamily === "custom" && theme.fontFamilyUrl
      ? "var(--font-custom)"
      : theme.fontFamily === "mono"
        ? "var(--font-geist-mono), monospace"
        : "var(--font-geist-sans), system-ui, sans-serif";

  const cardStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: theme.maxWidth,
    margin: "0 auto",
    padding: "clamp(20px, 4vw, 40px)",
    borderRadius: theme.borderRadius,
    border: `${theme.borderWidth}px solid rgba(255,255,255,${theme.cardStyle === "outline" ? 0.25 : 0.08})`,
    backdropFilter: theme.cardStyle === "glass" ? `blur(${theme.cardBlur}px)` : "none",
    WebkitBackdropFilter: theme.cardStyle === "glass" ? `blur(${theme.cardBlur}px)` : "none",
    background:
      theme.cardStyle === "glass"
        ? `rgba(20, 18, 30, ${theme.cardOpacity})`
        : theme.cardStyle === "neon"
          ? "rgba(10, 8, 20, 0.6)"
          : theme.cardStyle === "minimal"
            ? "transparent"
            : `rgba(15, 13, 25, ${theme.cardOpacity})`,
    boxShadow: theme.glow
      ? `0 0 ${theme.glowIntensity}px ${theme.primaryColor}44, 0 20px 60px rgba(0,0,0,0.5)`
      : "0 20px 60px rgba(0,0,0,0.5)",
    color: theme.textColor,
    fontFamily,
    textAlign: theme.contentAlign,
    ["--accent" as string]: theme.accentColor,
  };

  return (
    <>
      <BackgroundLayer background={background} />
      <CursorEffect effects={effects} />
      <ClickEffect effects={effects} />
      <AudioPlayer audio={audio} />
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
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: entered ? 1 : 0.15, y: entered ? 0 : 30, scale: entered ? 1 : 0.96 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={cardStyle}
        >
          {badges.enabled && badges.position === "top" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {badges.items.map((badge, i) => (
                <span
                  key={i}
                  title={badge.tooltip}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    background: `${badge.color}22`,
                    border: `1px solid ${badge.color}44`,
                    color: badge.color,
                  }}
                >
                  <span>{badge.emoji}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          )}

          {identity.avatarUrl && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  padding: 3,
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`,
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
                    background: theme.backgroundColor,
                  }}
                />
              </div>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textShadow: effects.textGlow ? `0 0 30px ${theme.accentColor}55` : "none",
            }}
          >
            {identity.displayName || identity.username}
            {identity.verified && (
              <span style={{ marginLeft: 6, color: theme.accentColor, fontSize: "0.7em" }}>✓</span>
            )}
          </motion.h1>

          {(identity.tagline || identity.pronouns || identity.location) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3 }}
              style={{ margin: "8px 0 0", fontSize: 13, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}
            >
              {identity.tagline && <span>{identity.tagline}</span>}
              {identity.pronouns && <span>· {identity.pronouns}</span>}
              {identity.location && <span>· {identity.location}</span>}
            </motion.p>
          )}

          {identity.bio && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                margin: "16px auto 0",
                maxWidth: 420,
                fontSize: 15,
                lineHeight: 1.6,
                opacity: 0.85,
              }}
            >
              {identity.bio}
            </motion.p>
          )}

          {social.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: social.layout === "row" ? 14 : 10,
                marginTop: 24,
                flexWrap: social.layout === "wrap" || social.layout === "grid" ? "wrap" : "nowrap",
              }}
            >
              {social.links.map((link, i) => {
                const Icon = brandIcons[link.platform] || brandIcons.website;
                const size = social.size === "sm" ? 18 : social.size === "lg" ? 28 : 22;
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
                      width: size + 18,
                      height: size + 18,
                      borderRadius: social.shape === "circle" ? "50%" : social.shape === "rounded" ? 12 : 2,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: link.color || theme.textColor,
                      textDecoration: "none",
                      transition: "transform 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (social.hoverEffect) {
                        e.currentTarget.style.transform = "translateY(-3px) scale(1.1)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                  >
                    <Icon size={size} />
                  </a>
                );
              })}
            </motion.div>
          )}

          {badges.enabled && badges.position === "bottom" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
              {badges.items.map((badge, i) => (
                <span
                  key={i}
                  title={badge.tooltip}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    background: `${badge.color}22`,
                    border: `1px solid ${badge.color}44`,
                    color: badge.color,
                  }}
                >
                  <span>{badge.emoji}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          )}

          {config.customHtml && (
            <div style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: config.customHtml }} />
          )}
        </motion.div>
      </div>

      {config.customCss && <style dangerouslySetInnerHTML={{ __html: config.customCss }} />}
    </>
  );
}
