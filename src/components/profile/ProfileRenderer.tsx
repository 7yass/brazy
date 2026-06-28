"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfileConfig } from "@/lib/profile/schema";
import type { Transition, TargetAndTransition } from "framer-motion";
import BackgroundLayer from "./BackgroundLayer";
import CursorEffect from "./CursorEffect";
import ClickEffect from "./ClickEffect";
import SplashIntro from "./SplashIntro";
import ViewCounter from "./ViewCounter";
import { brandIcons } from "./icons";
import { SpiderLogo } from "@/components/spider-logo";

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface StaggerProps {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
}

// ─── Username Effect Component ─────────────────────────────────────────────────

function UsernameText({
  text, effect, accent, accent2, textColor, textGlow, accent3,
}: {
  text: string; effect: string; accent: string; accent2: string; textColor: string; textGlow: boolean; accent3: string;
}) {
  const [displayed, setDisplayed] = useState(effect === "typewriter" ? "" : text);
  const [cursor, setCursor] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (effect !== "typewriter") { setDisplayed(text); return; }
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [text, effect]);

  // Cursor blink
  useEffect(() => {
    if (effect !== "typewriter") return;
    const t = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(t);
  }, [effect]);

  const baseStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: textColor || "#fafafa",
    display: "inline-block",
  };

  if (effect === "glow") {
    return (
      <>
        <style>{`
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 10px ${accent}66, 0 0 30px ${accent}33; }
            50% { text-shadow: 0 0 20px ${accent}99, 0 0 50px ${accent}55, 0 0 80px ${accent}33; }
          }
        `}</style>
        <h1 style={{ ...baseStyle, animation: "glowPulse 2.5s ease-in-out infinite" }}>{text}</h1>
      </>
    );
  }

  if (effect === "glitch") {
    return (
      <>
        <style>{`
          @keyframes glitchTop {
            0%, 90%, 100% { clip-path: inset(0 0 100% 0); transform: translateX(0); }
            92% { clip-path: inset(0 0 60% 0); transform: translateX(-4px); color: #ff0044; }
            94% { clip-path: inset(30% 0 40% 0); transform: translateX(4px); color: #00ffff; }
            96% { clip-path: inset(60% 0 20% 0); transform: translateX(-2px); }
          }
          @keyframes glitchBot {
            0%, 90%, 100% { clip-path: inset(100% 0 0 0); transform: translateX(0); }
            92% { clip-path: inset(60% 0 0 0); transform: translateX(4px); color: #00ffff; }
            94% { clip-path: inset(40% 0 30% 0); transform: translateX(-4px); color: #ff0044; }
            96% { clip-path: inset(20% 0 60% 0); transform: translateX(2px); }
          }
        `}</style>
        <div style={{ position: "relative", display: "inline-block" }}>
          <h1 style={{ ...baseStyle, visibility: "visible" }}>{text}</h1>
          <h1 style={{ ...baseStyle, position: "absolute", top: 0, left: 0, animation: "glitchTop 3s infinite" }}>{text}</h1>
          <h1 style={{ ...baseStyle, position: "absolute", top: 0, left: 0, animation: "glitchBot 3s infinite 0.05s" }}>{text}</h1>
        </div>
      </>
    );
  }

  if (effect === "typewriter") {
    return (
      <h1 style={{ ...baseStyle, textShadow: textGlow ? `0 0 28px ${accent3}66` : "none" }}>
        {displayed}
        <span style={{ opacity: cursor ? 1 : 0, color: accent, fontWeight: 300, marginLeft: 1 }}>|</span>
      </h1>
    );
  }

  if (effect === "rainbow") {
    return (
      <>
        <style>{`
          @keyframes rainbowShift {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
        <h1 style={{
          ...baseStyle,
          background: "linear-gradient(90deg, #ff0080, #ff8c00, #ffe000, #40ff00, #00c0ff, #8000ff, #ff0080)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "rainbowShift 2.5s linear infinite",
        }}>{text}</h1>
      </>
    );
  }

  if (effect === "neon") {
    return (
      <>
        <style>{`
          @keyframes neonFlicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px ${accent}, 0 0 80px ${accent}, 0 0 90px ${accent};
            }
            20%, 24%, 55% { text-shadow: none; }
          }
        `}</style>
        <h1 style={{ ...baseStyle, color: "#fff", animation: "neonFlicker 5s infinite alternate" }}>{text}</h1>
      </>
    );
  }

  if (effect === "shake") {
    return (
      <>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-3px) rotate(-1deg); }
            20% { transform: translateX(3px) rotate(1deg); }
            30% { transform: translateX(-2px); }
            40% { transform: translateX(2px); }
            50% { transform: translateX(-1px); }
            60% { transform: translateX(1px); }
            70% { transform: translateX(-2px) rotate(-0.5deg); }
            80% { transform: translateX(2px) rotate(0.5deg); }
            90% { transform: translateX(-1px); }
          }
        `}</style>
        <h1 style={{ ...baseStyle, textShadow: textGlow ? `0 0 28px ${accent3}66` : "none", animation: "shake 0.6s ease-in-out infinite", display: "inline-block" }}>{text}</h1>
      </>
    );
  }

  // Default / none
  return (
    <h1 style={{ ...baseStyle, textShadow: textGlow ? `0 0 28px ${accent3}66` : "none" }}>{text}</h1>
  );
}

// ─── Animated Border ───────────────────────────────────────────────────────────

function AnimatedBorderWrapper({ children, accent, accent2, borderRadius }: { children: React.ReactNode; accent: string; accent2: string; borderRadius: number }) {
  return (
    <>
      <style>{`
        @keyframes rotateBorder {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .animated-border-wrap {
          background: conic-gradient(from var(--angle), ${accent}, ${accent2}, #ff0080, #ffff00, ${accent}, ${accent2});
          animation: rotateBorder 3s linear infinite;
          padding: 2px;
          border-radius: ${borderRadius + 2}px;
        }
      `}</style>
      <div className="animated-border-wrap">
        {children}
      </div>
    </>
  );
}

// ─── Time Widget ───────────────────────────────────────────────────────────────

function TimeWidget({ timezone, format }: { timezone: string; format: "12h" | "24h" }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      try {
        const t = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: format === "12h",
        }).format(new Date());
        setTime(t);
      } catch { setTime("--:--"); }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone, format]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12 }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>🕐</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}>{time}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{timezone}</span>
    </div>
  );
}

// ─── Main Renderer ─────────────────────────────────────────────────────────────

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
  const { theme, identity, background, effects, splash, social, widgets } = config;
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const [tiltStyle, setTiltStyle] = useState({});

  // Animated browser title
  useEffect(() => {
    if (!effects.animatedTitle || !effects.animatedTitleText) return;
    const base = effects.animatedTitleText || identity.displayName || identity.username || "brazy";
    const padded = `${base}    `;
    let i = 0;
    const t = setInterval(() => {
      const shifted = padded.slice(i) + padded.slice(0, i);
      document.title = shifted;
      i = (i + 1) % padded.length;
    }, 180);
    return () => { clearInterval(t); document.title = config.seo.title || base; };
  }, [effects.animatedTitle, effects.animatedTitleText, identity, config.seo.title]);

  // 3D Tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!effects.tilt3d || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const intensity = effects.tiltIntensity ?? 12;
    const x = ((e.clientX - cx) / (rect.width / 2)) * intensity;
    const y = -((e.clientY - cy) / (rect.height / 2)) * intensity;
    tiltRef.current = { x, y };
    setTiltStyle({ transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.01)` });
  }, [effects.tilt3d, effects.tiltIntensity]);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)", transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" });
    setTimeout(() => setTiltStyle({}), 500);
  }, []);

  const fontFamily =
    theme.fontFamily === "custom" && theme.fontFamilyUrl
      ? "var(--font-custom)"
      : theme.fontFamily === "mono"
        ? "var(--font-geist-mono), monospace"
        : theme.fontFamily === "inter"
          ? "Inter, system-ui, sans-serif"
          : theme.fontFamily === "poppins"
            ? "Poppins, system-ui, sans-serif"
            : theme.fontFamily === "serif"
              ? "Georgia, serif"
              : "Satoshi, var(--font-geist-sans), system-ui, sans-serif";

  const accent = theme.primaryColor || "#a855f7";
  const accent2 = theme.secondaryColor || "#ec4899";
  const accent3 = theme.accentColor || "#8b5cf6";

  const maxWidthMap = { default: theme.maxWidth ?? 480, medium: 560, large: 680 };
  const cardMaxWidth = maxWidthMap[(theme.profileSize ?? "default") as keyof typeof maxWidthMap];

  const cardBg =
    theme.cardStyle === "glass"
      ? `rgba(10, 9, 18, ${theme.cardOpacity ?? 0.72})`
      : theme.cardStyle === "minimal"
        ? "transparent"
        : `rgba(8, 7, 16, ${theme.cardOpacity ?? 0.85})`;

  const cardGlow = theme.glow
    ? `0 0 ${theme.glowIntensity ?? 40}px ${accent}28, 0 32px 80px rgba(0,0,0,0.6)`
    : "0 32px 80px rgba(0,0,0,0.5)";

  const stagger = (i: number): StaggerProps => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: entered ? 1 : 0, y: entered ? 0 : 22 },
    transition: { duration: 0.55, delay: i * 0.07, ease: EASE },
  });

  const cardElement = (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 36, scale: entered ? 1 : 0.96 }}
      transition={{ duration: 0.65, ease: EASE }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="brazy-card"
      style={{
        width: "100%",
        maxWidth: cardMaxWidth,
        margin: "0 auto",
        borderRadius: theme.borderRadius ?? 28,
        border: theme.animatedBorder ? "none" : `${theme.borderWidth ?? 1}px solid rgba(255,255,255,${theme.cardStyle === "minimal" ? 0 : 0.07})`,
        backdropFilter: theme.cardStyle === "glass" ? `blur(${theme.cardBlur ?? 18}px)` : "none",
        WebkitBackdropFilter: theme.cardStyle === "glass" ? `blur(${theme.cardBlur ?? 18}px)` : "none",
        background: cardBg,
        boxShadow: cardGlow,
        color: theme.textColor || "#f4f4f5",
        fontFamily,
        overflow: "hidden",
        transition: effects.tilt3d ? "box-shadow 0.2s" : undefined,
        ...tiltStyle,
      }}
    >
      {/* Neon card outline */}
      {theme.cardStyle === "neon" && (
        <div style={{ position: "absolute", inset: 0, borderRadius: theme.borderRadius ?? 28, border: `1px solid ${accent}88`, boxShadow: `inset 0 0 20px ${accent}11, 0 0 30px ${accent}22`, pointerEvents: "none", zIndex: 0 }} />
      )}

      {/* Avatar + Identity */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 28px 24px", position: "relative", zIndex: 1 }}>

        {identity.avatarUrl && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 22 }}
            transition={{ duration: 0.55, delay: 0, ease: EASE }}
            style={{
              width: 96, height: 96, borderRadius: "50%", padding: 3,
              background: `linear-gradient(135deg, ${accent}, ${accent2}, ${accent3})`,
              boxShadow: `0 0 28px ${accent}44`, flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={identity.avatarUrl}
              alt={identity.displayName || identity.username}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block", background: "#0d0d0d" }}
            />
          </motion.div>
        )}

        {/* Name + Badges */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 22 }}
          transition={{ duration: 0.55, delay: 0.07, ease: EASE }}
          style={{ marginTop: identity.avatarUrl ? 14 : 0, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", justifyContent: "center" }}
        >
          <UsernameText
            text={identity.displayName || identity.username}
            effect={effects.usernameEffect}
            accent={accent}
            accent2={accent2}
            accent3={accent3}
            textColor={theme.textColor || "#fafafa"}
            textGlow={effects.textGlow}
          />
          {profileBadges?.map((badge) => (
            <BadgeIcon key={badge.id} badge={badge} />
          ))}
        </motion.div>

        {/* Username / pronouns / location */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 22 }}
          transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
          style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center", fontSize: 13, color: theme.mutedTextColor || "rgba(255,255,255,0.38)" }}
        >
          <span>@{identity.username}</span>
          {identity.pronouns && (<><span style={{ opacity: 0.35 }}>·</span><span>{identity.pronouns}</span></>)}
          {identity.location && (<><span style={{ opacity: 0.35 }}>·</span><span>📍 {identity.location}</span></>)}
        </motion.div>

        {/* Bio */}
        {identity.bio && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: entered ? 0.85 : 0, y: entered ? 0 : 22 }}
            transition={{ duration: 0.55, delay: 0.21, ease: EASE }}
            style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.65, color: theme.textColor || "#e4e4e7", textAlign: "center", maxWidth: 360 }}
          >
            {identity.bioMarkdown
              ? <MarkdownBio text={identity.bio} />
              : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{identity.bio}</p>}
          </motion.div>
        )}

        {/* Time widget (card placement) */}
        {widgets?.time?.enabled && widgets.time.placement === "card" && (
          <motion.div {...stagger(4)} style={{ marginTop: 12 }}>
            <TimeWidget timezone={widgets.time.timezone} format={widgets.time.format} />
          </motion.div>
        )}

        {/* View counter */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 22 }}
          transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
          style={{ marginTop: 14 }}
        >
          <ViewCounter initial={0} accent={accent} />
        </motion.div>
      </div>

      {/* Social Links */}
      {social.links.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 22 }}
          transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
          style={{
            padding: "0 20px 20px",
            display: "grid",
            gridTemplateColumns: social.links.length === 1 ? "1fr" : "repeat(2, 1fr)",
            gap: 8,
          }}
        >
          {social.links.map((link, i) => {
            const Icon = brandIcons[link.platform as keyof typeof brandIcons] || brandIcons.website;
            const color = link.color || accent;
            return (
              <SocialLink key={i} href={link.url} label={link.label || link.platform} color={color} textColor={theme.textColor || "#fafafa"}>
                <Icon size={16} />
              </SocialLink>
            );
          })}
        </motion.div>
      )}

      {/* Spotify widget (card) */}
      {widgets?.spotify?.enabled && widgets.spotify.placement === "card" && widgets.spotify.url && (
        <motion.div {...stagger(6)} style={{ padding: "0 20px 16px" }}>
          <iframe
            src={`https://open.spotify.com/embed/${widgets.spotify.url.split("spotify.com/")[1]?.replace(/\?.*/, "")}`}
            width="100%" height="80" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: 12 }}
          />
        </motion.div>
      )}

      {/* YouTube widget (card) */}
      {widgets?.youtube?.enabled && widgets.youtube.placement === "card" && widgets.youtube.url && (
        <motion.div {...stagger(7)} style={{ padding: "0 20px 16px" }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden" }}>
            <iframe
              src={widgets.youtube.url.replace("watch?v=", "embed/")}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}

      {/* Audio */}
      {audioTrackId && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 22 }}
          transition={{ duration: 0.55, delay: 0.42, ease: EASE }}
          style={{ padding: "0 20px 20px" }}
        >
          <AudioPill
            audioTrackId={audioTrackId}
            title={audioTitle}
            artist={audioArtist}
            thumb={audioThumb}
            accentColor={accent}
            textColor={theme.textColor}
            mutedTextColor={theme.mutedTextColor}
          />
        </motion.div>
      )}

      {/* Brazy watermark */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 20px 18px", opacity: 0.22, transition: "opacity 0.2s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.55"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.22"; }}
      >
        <a href="https://brazy.it" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: theme.mutedTextColor || "rgba(255,255,255,0.5)" }}>
          <SpiderLogo width={13} height={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>brazy.it</span>
        </a>
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px ${accent}22; }
          50% { box-shadow: 0 0 40px ${accent}44; }
        }
        ${effects.glowPulse ? ".brazy-card { animation: glowPulse 3s ease-in-out infinite; }" : ""}
      `}</style>

      <BackgroundLayer background={background} />
      <CursorEffect effects={effects} />
      <ClickEffect effects={effects} />
      <SplashIntro splash={splash} onEnter={() => setEntered(true)} />

      <div style={{
        position: "relative", zIndex: 10,
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(20px, 5vw, 60px) clamp(16px, 4vw, 40px)",
      }}>
        {theme.animatedBorder
          ? <AnimatedBorderWrapper accent={accent} accent2={accent2} borderRadius={theme.borderRadius ?? 28}>{cardElement}</AnimatedBorderWrapper>
          : cardElement
        }
      </div>

      {/* Bottom widgets */}
      {(widgets?.time?.enabled && widgets.time.placement === "bottom") ||
       (widgets?.github?.enabled && widgets.github.placement === "bottom") ||
       (widgets?.youtube?.enabled && widgets.youtube.placement === "bottom") ||
       (widgets?.spotify?.enabled && widgets.spotify.placement === "bottom") ? (
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "0 clamp(16px,4vw,40px) 60px", maxWidth: 560, margin: "0 auto", width: "100%" }}>
          {widgets?.time?.enabled && widgets.time.placement === "bottom" && (
            <TimeWidget timezone={widgets.time.timezone} format={widgets.time.format} />
          )}
          {widgets?.github?.enabled && widgets.github.placement === "bottom" && widgets.github.username && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${widgets.github.username}&show_icons=true&theme=dark&bg_color=0d0d0d&hide_border=true&text_color=94a3b8&icon_color=dc2626&title_color=fafafa`}
              alt="GitHub Stats"
              style={{ width: "100%", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)" }}
            />
          )}
          {widgets?.youtube?.enabled && widgets.youtube.placement === "bottom" && widgets.youtube.url && (
            <div style={{ width: "100%", position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
              <iframe
                src={widgets.youtube.url.replace("watch?v=", "embed/")}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {widgets?.spotify?.enabled && widgets.spotify.placement === "bottom" && widgets.spotify.url && (
            <iframe
              src={`https://open.spotify.com/embed/${widgets.spotify.url.split("spotify.com/")[1]?.replace(/\?.*/, "")}`}
              width="100%" height="80" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)" }}
            />
          )}
        </div>
      ) : null}

      {config.customCss && <style dangerouslySetInnerHTML={{ __html: config.customCss }} />}
    </>
  );
}

// ─── Markdown Bio ──────────────────────────────────────────────────────────────

function MarkdownBio({ text }: { text: string }) {
  const rendered = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<u>$1</u>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;opacity:0.7">$1</a>')
    .replace(/\n/g, "<br>");
  return <p style={{ margin: 0, whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: rendered }} />;
}

// ─── Social Link Button ────────────────────────────────────────────────────────

function SocialLink({ href, label, color, textColor, children }: {
  href: string; label: string; color: string; textColor: string; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        height: 42, borderRadius: 14, padding: "0 14px",
        background: hovered ? `${color}18` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? color + "55" : color + "20"}`,
        boxShadow: hovered ? `0 0 18px ${color}28` : "none",
        color: textColor, textDecoration: "none",
        fontSize: 13, fontWeight: 500,
        transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-1px)" : "none",
        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0, color }}>{children}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    </a>
  );
}

// ─── Badge Icon ────────────────────────────────────────────────────────────────

function BadgeIcon({ badge }: { badge: Badge }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{badge.icon}</span>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
              background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              padding: "5px 12px", whiteSpace: "nowrap", fontSize: 12, color: "#fafafa",
              pointerEvents: "none", zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontWeight: 600 }}>{badge.label}</div>
            {badge.description && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 1 }}>{badge.description}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Audio Pill ────────────────────────────────────────────────────────────────

function AudioPill({
  audioTrackId, title, artist, thumb, accentColor, textColor, mutedTextColor,
}: {
  audioTrackId?: string; title?: string; artist?: string; thumb?: string;
  accentColor: string; textColor?: string; mutedTextColor?: string;
}) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioTrackId) return;
    const init = () => {
      playerRef.current = new window.YT!.Player("yt-player-inline", {
        videoId: audioTrackId,
        playerVars: { autoplay: 0, enablejsapi: 1, rel: 0, modestbranding: 1 },
        events: { onStateChange: (e: { data: number }) => setPlaying(e.data === window.YT?.PlayerState.PLAYING) },
      });
    };
    if (window.YT) init();
    else {
      window.onYouTubeIframeAPIReady = init;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => { playerRef.current?.destroy(); playerRef.current = null; };
  }, [audioTrackId]);

  if (!audioTrackId) return null;

  return (
    <>
      <div id="yt-player-inline" style={{ width: 0, height: 0, position: "absolute", pointerEvents: "none", opacity: 0 }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
        background: "rgba(255,255,255,0.04)", border: `1px solid ${accentColor}22`,
        borderRadius: 16, width: "100%", boxSizing: "border-box",
      }}>
        {thumb && <img src={thumb} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: textColor ?? "#fafafa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title || "track"}</p>
          {artist && <p style={{ margin: "1px 0 0", fontSize: 11, color: mutedTextColor ?? "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{artist}</p>}
        </div>
        <button
          onClick={() => { const p = playerRef.current; if (!p) return; if (playing) { p.pauseVideo(); setPlaying(false); } else { p.playVideo(); setPlaying(true); } }}
          style={{ width: 32, height: 32, borderRadius: "50%", background: `${accentColor}22`, border: `1px solid ${accentColor}44`, color: "#fafafa", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.18s" }}
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
