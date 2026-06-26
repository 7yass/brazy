"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ProfileConfig } from "@/lib/profile/schema";
import BackgroundLayer from "./BackgroundLayer";
import CursorEffect from "./CursorEffect";
import ClickEffect from "./ClickEffect";
import AudioPlayer from "./AudioPlayer";
import SplashIntro from "./SplashIntro";
import ViewCounter from "./ViewCounter";
import { brandIcons } from "./icons";

export default function ProfileRenderer({ config, preview }: { config: ProfileConfig; preview?: boolean }) {
  const [entered, setEntered] = useState(preview || !config.splash.enabled);
  const { theme, identity, background, effects, splash, audio, social } = config;

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
    padding: "clamp(24px, 5vw, 44px) clamp(20px, 4vw, 40px)",
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
  };

  const container = {
    initial: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: entered ? 1 : 0.12,
      y: entered ? 0 : 24,
      transition: { duration: 0.5, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] as const },
    }),
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
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{
            opacity: entered ? 1 : 0.12,
            y: entered ? 0 : 30,
            scale: entered ? 1 : 0.97,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={cardStyle}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {identity.avatarUrl && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: entered ? 1 : 0.6, opacity: entered ? 1 : 0.12 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                style={{
                  width: 108,
                  height: 108,
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

            <motion.div custom={0} variants={container} initial="initial" animate="show" style={{ marginTop: 16 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.5rem, 5vw, 2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  textShadow: effects.textGlow ? `0 0 24px ${theme.accentColor}66` : "none",
                }}
              >
                {identity.displayName || identity.username}
                {identity.verified && (
                  <span
                    style={{
                      marginLeft: 7,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: theme.accentColor,
                      color: theme.backgroundColor,
                      fontSize: 11,
                      verticalAlign: "middle",
                    }}
                  >
                    ✓
                  </span>
                )}
              </h1>
            </motion.div>

            {(identity.tagline || identity.pronouns || identity.location) && (
              <motion.p
                custom={1}
                variants={container}
                initial="initial"
                animate="show"
                style={{
                  margin: "8px 0 0",
                  fontSize: 12.5,
                  color: theme.mutedTextColor,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {identity.tagline && <span>{identity.tagline}</span>}
                {identity.pronouns && <span>· {identity.pronouns}</span>}
                {identity.location && <span>· {identity.location}</span>}
              </motion.p>
            )}

            {identity.bio && (
              <motion.p
                custom={2}
                variants={container}
                initial="initial"
                animate="show"
                style={{
                  margin: "18px 0 0",
                  maxWidth: 360,
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: theme.textColor,
                  opacity: 0.78,
                }}
              >
                {identity.bio}
              </motion.p>
            )}

            {social.links.length > 0 && (
              <motion.div
                custom={3}
                variants={container}
                initial="initial"
                animate="show"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 26,
                  flexWrap: "wrap",
                }}
              >
                {social.links.map((link, i) => {
                  const Icon = brandIcons[link.platform] || brandIcons.website;
                  const color = link.color || theme.textColor;
                  const size = social.size === "sm" ? 17 : social.size === "lg" ? 24 : 20;
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
                        width: size + 24,
                        height: size + 24,
                        borderRadius: social.shape === "circle" ? "50%" : social.shape === "rounded" ? 12 : 4,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color,
                        textDecoration: "none",
                        transition: "transform 0.18s, background 0.18s, box-shadow 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        if (social.hoverEffect) {
                          e.currentTarget.style.transform = "translateY(-3px)";
                          e.currentTarget.style.background = `${color}1f`;
                          e.currentTarget.style.boxShadow = `0 6px 20px ${color}33`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "";
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      <Icon size={size} />
                    </a>
                  );
                })}
              </motion.div>
            )}

            <ViewCounter initial={0} accent={theme.accentColor} />

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
