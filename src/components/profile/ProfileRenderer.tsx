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
import { DiscordPresenceWidget, SkillsWidget, ProjectsWidget } from "./Widgets";
import { PREDEFINED_BADGES } from "@/lib/profile/badges-data";
import { getPipedStreamUrl } from "@/lib/profile/audio-resolver";

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Username Effect ───────────────────────────────────────────────────────────

function UsernameText({ text, effect, accent, accent2, textColor, textGlow }: {
  text: string; effect: string; accent: string; accent2: string; textColor: string; textGlow: boolean;
}) {
  const base: React.CSSProperties = {
    margin: 0, fontSize: 26, fontWeight: 800,
    letterSpacing: "-0.03em", display: "inline-block",
    color: textColor || "#fafafa",
  };

  if (effect === "gradient") {
    return (
      <>
        <style>{`@keyframes gradShift{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
        <h1 style={{
          ...base,
          background: `linear-gradient(90deg,${accent},${accent2},${accent},${accent2})`,
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "gradShift 3s linear infinite",
        }}>{text}</h1>
      </>
    );
  }

  if (effect === "glow") {
    return (
      <>
        <style>{`@keyframes glowPulse{0%,100%{text-shadow:0 0 12px ${accent}55,0 0 30px ${accent}22}50%{text-shadow:0 0 24px ${accent}99,0 0 60px ${accent}44}}`}</style>
        <h1 style={{ ...base, animation: "glowPulse 2.5s ease-in-out infinite" }}>{text}</h1>
      </>
    );
  }

  if (effect === "glitch") {
    return (
      <>
        <style>{`
          @keyframes gt{0%,89%,100%{clip-path:inset(100% 0 0 0);transform:translateX(0)}90%{clip-path:inset(10% 0 60% 0);transform:translateX(-4px);color:#ff0044}93%{clip-path:inset(50% 0 20% 0);transform:translateX(4px);color:#00ffff}96%{clip-path:inset(70% 0 5% 0);transform:translateX(-2px)}}
          @keyframes gb{0%,89%,100%{clip-path:inset(0 0 100% 0);transform:translateX(0)}90%{clip-path:inset(60% 0 10% 0);transform:translateX(4px);color:#00ffff}93%{clip-path:inset(20% 0 50% 0);transform:translateX(-4px);color:#ff0044}96%{clip-path:inset(5% 0 70% 0);transform:translateX(2px)}}
        `}</style>
        <div style={{ position: "relative", display: "inline-block" }}>
          <h1 style={base}>{text}</h1>
          <h1 style={{ ...base, position: "absolute", top: 0, left: 0, animation: "gt 4s infinite" }}>{text}</h1>
          <h1 style={{ ...base, position: "absolute", top: 0, left: 0, animation: "gb 4s infinite 0.05s" }}>{text}</h1>
        </div>
      </>
    );
  }

  // none / default
  return <h1 style={{ ...base, textShadow: textGlow ? `0 0 28px ${accent}55` : "none" }}>{text}</h1>;
}

// ─── Animated Border ───────────────────────────────────────────────────────────

function AnimatedBorderWrapper({ children, accent, accent2, borderRadius }: {
  children: React.ReactNode; accent: string; accent2: string; borderRadius: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const tick = () => {
      angleRef.current = (angleRef.current + 1) % 360;
      el.style.background = `conic-gradient(from ${angleRef.current}deg, ${accent}, ${accent2}, #ff0080, #ffff00, ${accent})`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [accent, accent2]);

  return (
    <div ref={wrapRef} style={{ padding: 2, borderRadius: borderRadius + 2, display: "inline-flex", width: "100%" }}>
      {children}
    </div>
  );
}

// ─── Time Widget ───────────────────────────────────────────────────────────────

function TimeWidget({ timezone, format }: { timezone: string; format: "12h" | "24h" }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      try {
        setTime(new Intl.DateTimeFormat("en-US", {
          timeZone: timezone, hour: "2-digit", minute: "2-digit",
          second: "2-digit", hour12: format === "12h",
        }).format(new Date()));
      } catch { setTime("--:--"); }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [timezone, format]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>🕐</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{timezone}</span>
    </div>
  );
}

// ─── Badge Icon ────────────────────────────────────────────────────────────────

function BadgeIcon({ badge }: { badge: Badge }) {
  const [show, setShow] = useState(false);
  const key = badge.icon?.toLowerCase().replace(/ /g, "_");
  const predefined = PREDEFINED_BADGES[key];
  const color = badge.color || predefined?.color || "#ffffff";

  // Inject color into SVG by replacing fill/stroke/currentColor
  const coloredSvg = predefined?.svg
    ? predefined.svg
        .replace(/fill="(?!none)[^"]*"/g, `fill="${color}"`)
        .replace(/stroke="(?!none)[^"]*"/g, `stroke="${color}"`)
        .replace(/currentColor/g, color)
    : null;

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {coloredSvg ? (
        <div
          style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: coloredSvg }}
        />
      ) : (
        <span style={{ fontSize: 18, lineHeight: 1 }}>{badge.icon}</span>
      )}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
              transform: "translateX(-50%)", background: "#111",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              padding: "5px 12px", whiteSpace: "nowrap", fontSize: 12,
              color: "#fafafa", pointerEvents: "none", zIndex: 50,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
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

// ─── Social Icon Button ────────────────────────────────────────────────────────

function SocialIconBtn({ href, label, color, children }: {
  href: string; label: string; color: string; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 44, height: 44,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "50%",
        background: hovered ? `${color}20` : "rgba(255,255,255,0.05)",
        border: `1px solid ${hovered ? color + "60" : "rgba(255,255,255,0.08)"}`,
        color: hovered ? color : "rgba(255,255,255,0.55)",
        textDecoration: "none",
        transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-2px) scale(1.08)" : "none",
        boxShadow: hovered ? `0 4px 20px ${color}30` : "none",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

// ─── Markdown Bio ──────────────────────────────────────────────────────────────

function MarkdownBio({ text, textColor }: { text: string; textColor: string }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<u>$1</u>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" style="color:${textColor};opacity:0.7;text-decoration:underline">$1</a>`)
    .replace(/\n/g, "<br>");
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// ─── Audio Pill ────────────────────────────────────────────────────────────────

function AudioPill({ audioTrackId, audioUrl, title, artist, thumb, accent, textColor, mutedColor, volume, loop, entered }: {
  audioTrackId?: string; audioUrl?: string; title?: string; artist?: string; thumb?: string;
  accent: string; textColor?: string; mutedColor?: string; volume: number; loop: boolean; entered: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioTrackId) {
      let alive = true;
      getPipedStreamUrl(audioTrackId).then(url => { if (alive) setStreamUrl(url); });
      return () => { alive = false; };
    }
    setStreamUrl(audioUrl || null);
  }, [audioTrackId, audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, streamUrl]);

  useEffect(() => {
    if (!audioRef.current || !streamUrl || !entered) return;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [entered, streamUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    playing ? audioRef.current.play().catch(() => setPlaying(false)) : audioRef.current.pause();
  }, [playing]);

  if (!audioTrackId && !audioUrl) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 14px",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${accent}22`,
      borderRadius: 16, width: "100%", boxSizing: "border-box",
    }}>
      {streamUrl && <audio ref={audioRef} src={streamUrl} loop={loop} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
      {thumb && <img src={thumb} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: textColor ?? "#fafafa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title || "track"}</p>
        {artist && <p style={{ margin: "1px 0 0", fontSize: 11, color: mutedColor ?? "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{artist}</p>}
      </div>
      <button
        onClick={() => setPlaying(p => !p)}
        style={{
          width: 30, height: 30, borderRadius: "50%",
          background: `${accent}22`, border: `1px solid ${accent}44`,
          color: "#fff", cursor: "pointer", fontSize: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.15s",
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "❚❚" : "▶"}
      </button>
    </div>
  );
}

// ─── Main Renderer ─────────────────────────────────────────────────────────────

export default function ProfileRenderer({
  config, preview, audioTrackId, audioTitle, audioArtist, audioThumb, profileBadges,
}: {
  config: ProfileConfig; preview?: boolean;
  audioTrackId?: string; audioTitle?: string; audioArtist?: string; audioThumb?: string;
  profileBadges?: Badge[];
}) {
  const [entered, setEntered] = useState(preview || !config.splash.enabled);
  const { theme, identity, background, effects, splash, social, widgets } = config;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Animated browser title
  useEffect(() => {
    if (!effects.animatedTitle || !effects.animatedTitleText) return;
    const base = effects.animatedTitleText;
    const padded = base + "    ";
    let i = 0;
    const t = setInterval(() => {
      document.title = padded.slice(i) + padded.slice(0, i);
      i = (i + 1) % padded.length;
    }, 180);
    return () => { clearInterval(t); document.title = config.seo.title || base; };
  }, [effects.animatedTitle, effects.animatedTitleText, config.seo.title]);

  // 3D Tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!effects.tilt3d || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const intensity = effects.tiltIntensity ?? 10;
    const x = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * intensity;
    const y = -((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * intensity;
    setTiltStyle({ transform: `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.01)`, transition: "transform 0.1s" });
  }, [effects.tilt3d, effects.tiltIntensity]);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)", transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" });
  }, []);

  const fontFamily =
    theme.fontFamily === "mono" ? "var(--font-geist-mono), monospace" :
    theme.fontFamily === "inter" ? "Inter, system-ui, sans-serif" :
    theme.fontFamily === "poppins" ? "Poppins, system-ui, sans-serif" :
    theme.fontFamily === "serif" ? "Georgia, serif" :
    "Satoshi, var(--font-geist-sans), system-ui, sans-serif";

  const accent = theme.primaryColor || "#a855f7";
  const accent2 = theme.secondaryColor || "#ec4899";
  const textColor = theme.textColor || "#fafafa";
  const mutedColor = theme.mutedTextColor || "rgba(255,255,255,0.38)";
  const align = theme.contentAlign || "center";
  const alignItems = align === "left" ? "flex-start" : "center";
  const textAlign = align === "left" ? "left" : "center";

  const cardBorderRadius = theme.borderRadius ?? 24;
  const cardBorderWidth = theme.borderWidth ?? 1;

  const cardBg = theme.cardStyle === "minimal" || theme.cardStyle === "simplistic"
    ? "transparent"
    : `rgba(8,7,16,${theme.cardOpacity ?? 0.65})`;

  const cardBorder = theme.cardStyle === "minimal" || theme.cardStyle === "simplistic"
    ? "none"
    : `${cardBorderWidth}px solid rgba(255,255,255,${theme.cardStyle === "neon" ? 0 : 0.07})`;

  const cardBlur = theme.cardStyle === "glass" ? `blur(${theme.cardBlur ?? 18}px)` : "none";

  const cardShadow = theme.glow
    ? `0 0 ${theme.glowIntensity ?? 40}px ${accent}22, 0 24px 64px rgba(0,0,0,0.55)`
    : "0 24px 64px rgba(0,0,0,0.4)";

  const showViewsInside = config.analytics?.showViews !== false &&
    (config.analytics?.viewsPlacement === "inside" || !config.analytics?.viewsPlacement);
  const showViewsOutside = config.analytics?.showViews !== false &&
    config.analytics?.viewsPlacement === "outside";

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 18 } as TargetAndTransition,
    animate: { opacity: entered ? 1 : 0, y: entered ? 0 : 18 } as TargetAndTransition,
    transition: { duration: 0.5, delay: i * 0.07, ease: EASE } as Transition,
  });

  const hasBadges = profileBadges && profileBadges.length > 0;

  const cardInner = (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems,
      padding: "36px 28px 24px",
      gap: 0,
      position: "relative", zIndex: 1,
    }}>

      {/* Avatar */}
      {identity.avatarUrl && (
        <motion.div {...stagger(0)} style={{ position: "relative", marginBottom: hasBadges ? 8 : 14 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%", padding: 3,
            background: `linear-gradient(135deg,${accent},${accent2})`,
            boxShadow: `0 0 24px ${accent}44`,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={identity.avatarUrl}
              alt={identity.displayName || identity.username}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block", background: "#0d0d0d" }}
            />
          </div>
        </motion.div>
      )}

      {/* Badges row — below avatar, above name */}
      {hasBadges && (
        <motion.div {...stagger(1)} style={{
          display: "flex", alignItems: "center", justifyContent: alignItems === "flex-start" ? "flex-start" : "center",
          gap: 6, flexWrap: "wrap", marginBottom: 10,
        }}>
          {profileBadges!.map(b => <BadgeIcon key={b.id} badge={b} />)}
        </motion.div>
      )}

      {/* Username */}
      <motion.div {...stagger(2)} style={{ marginBottom: 4 }}>
        <UsernameText
          text={identity.displayName || identity.username}
          effect={effects.usernameEffect}
          accent={accent}
          accent2={accent2}
          textColor={textColor}
          textGlow={effects.textGlow}
        />
      </motion.div>

      {/* Handle + pronouns + location */}
      <motion.div {...stagger(3)} style={{
        display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap",
        justifyContent: alignItems === "flex-start" ? "flex-start" : "center",
        fontSize: 12, color: mutedColor, marginBottom: identity.bio ? 12 : 16,
      }}>
        <span>@{identity.username}</span>
        {identity.pronouns && (<><span style={{ opacity: 0.3 }}>·</span><span>{identity.pronouns}</span></>)}
        {identity.location && (<><span style={{ opacity: 0.3 }}>·</span><span>📍 {identity.location}</span></>)}
      </motion.div>

      {/* Bio — single muted line, clean */}
      {identity.bio && (
        <motion.div {...stagger(4)} style={{
          marginBottom: 18,
          fontSize: 13,
          color: mutedColor,
          textAlign,
          lineHeight: 1.6,
          maxWidth: 320,
          opacity: 0.85,
        }}>
          {identity.bioMarkdown
            ? <MarkdownBio text={identity.bio} textColor={textColor} />
            : <span>{identity.bio}</span>}
        </motion.div>
      )}

      {/* Discord presence */}
      {widgets?.discordPresence?.enabled && widgets.discordPresence.placement === "card" && widgets.discordPresence.discordId && (
        <motion.div {...stagger(5)} style={{ marginBottom: 16, width: "100%", maxWidth: 320 }}>
          <DiscordPresenceWidget discordId={widgets.discordPresence.discordId} />
        </motion.div>
      )}

      {/* Time widget */}
      {widgets?.time?.enabled && widgets.time.placement === "card" && (
        <motion.div {...stagger(5)} style={{ marginBottom: 12 }}>
          <TimeWidget timezone={widgets.time.timezone} format={widgets.time.format} />
        </motion.div>
      )}

      {/* Skills */}
      {config.skills?.enabled && config.skills.items?.length > 0 && (
        <motion.div {...stagger(6)} style={{ marginBottom: 16, width: "100%", maxWidth: 320 }}>
          <SkillsWidget skills={config.skills.items} />
        </motion.div>
      )}

      {/* Projects */}
      {config.projects?.enabled && config.projects.items?.length > 0 && (
        <motion.div {...stagger(6)} style={{ marginBottom: 16, width: "100%", maxWidth: 320 }}>
          <ProjectsWidget projects={config.projects.items} />
        </motion.div>
      )}

      {/* Views — inside */}
      {showViewsInside && (
        <motion.div {...stagger(7)} style={{ marginBottom: 16 }}>
          <ViewCounter initial={0} accent={accent} />
        </motion.div>
      )}

      {/* Social links — icon strip */}
      {social.links.length > 0 && (
        <motion.div {...stagger(8)} style={{
          display: "flex", alignItems: "center",
          justifyContent: alignItems === "flex-start" ? "flex-start" : "center",
          gap: 8, flexWrap: "wrap",
          marginBottom: 16,
        }}>
          {social.links.map((link, i) => {
            const Icon = brandIcons[link.platform as keyof typeof brandIcons] || brandIcons.website;
            const color = link.color || accent;
            return (
              <SocialIconBtn key={i} href={link.url} label={link.label || link.platform} color={color}>
                <Icon size={18} />
              </SocialIconBtn>
            );
          })}
        </motion.div>
      )}

      {/* Spotify embed */}
      {widgets?.spotify?.enabled && widgets.spotify.placement === "card" && widgets.spotify.url && (
        <motion.div {...stagger(9)} style={{ width: "100%", marginBottom: 12 }}>
          <iframe
            src={`https://open.spotify.com/embed/${widgets.spotify.url.split("spotify.com/")[1]?.replace(/\?.*/, "")}`}
            width="100%" height="80" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: 12 }}
          />
        </motion.div>
      )}

      {/* YouTube embed */}
      {widgets?.youtube?.enabled && widgets.youtube.placement === "card" && widgets.youtube.url && (
        <motion.div {...stagger(9)} style={{ width: "100%", marginBottom: 12 }}>
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
      {config.audio?.enabled && (audioTrackId || config.audio.src) && (
        <motion.div {...stagger(10)} style={{ width: "100%", marginBottom: 12 }}>
          <AudioPill
            audioTrackId={audioTrackId}
            audioUrl={config.audio.src}
            title={audioTitle || config.audio.title}
            artist={audioArtist || config.audio.artist}
            thumb={audioThumb}
            accent={accent}
            textColor={textColor}
            mutedColor={mutedColor}
            volume={config.audio?.volume ?? 0.6}
            loop={config.audio?.loop ?? true}
            entered={entered}
          />
        </motion.div>
      )}

      {/* Custom HTML */}
      {config.customHtml && (
        <div style={{ width: "100%", marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: config.customHtml }} />
      )}

      {/* Watermark */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 8, opacity: 0.18, transition: "opacity 0.2s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.5"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.18"; }}
      >
        <a href="https://brazy.it" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 5, textDecoration: "none", color: mutedColor }}>
          <SpiderLogo width={12} height={12} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em" }}>brazy.it</span>
        </a>
      </div>

    </div>
  );

  const cardElement = (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 32, scale: entered ? 1 : 0.96 }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="brazy-card"
      style={{
        width: "100%",
        maxWidth: theme.maxWidth ?? 460,
        margin: "0 auto",
        borderRadius: cardBorderRadius,
        border: theme.animatedBorder ? "none" : cardBorder,
        backdropFilter: cardBlur,
        WebkitBackdropFilter: cardBlur,
        background: cardBg,
        boxShadow: cardShadow,
        color: textColor,
        fontFamily,
        overflow: "hidden",
        ...tiltStyle,
      }}
    >
      {theme.cardStyle === "neon" && (
        <div style={{ position: "absolute", inset: 0, borderRadius: cardBorderRadius, border: `1px solid ${accent}66`, boxShadow: `inset 0 0 20px ${accent}11, 0 0 30px ${accent}22`, pointerEvents: "none", zIndex: 0 }} />
      )}
      {cardInner}
    </motion.div>
  );

  return (
    <>
      <style>{`
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px ${accent}18}50%{box-shadow:0 0 40px ${accent}38}}
        ${effects.glowPulse ? ".brazy-card{animation:glowPulse 3s ease-in-out infinite}" : ""}
      `}</style>

      <BackgroundLayer background={background} />
      <CursorEffect effects={effects} />
      <ClickEffect effects={effects} />
      <SplashIntro splash={splash} onEnter={() => setEntered(true)} />

      <div style={{
        position: "relative", zIndex: 10, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(20px,5vw,60px) clamp(16px,4vw,40px)",
      }}>
        {theme.animatedBorder
          ? <AnimatedBorderWrapper accent={accent} accent2={accent2} borderRadius={cardBorderRadius}>{cardElement}</AnimatedBorderWrapper>
          : cardElement}
      </div>

      {/* Bottom widgets */}
      {(showViewsOutside ||
        (widgets?.time?.enabled && widgets.time.placement === "bottom") ||
        (widgets?.github?.enabled && widgets.github.placement === "bottom") ||
        (widgets?.youtube?.enabled && widgets.youtube.placement === "bottom") ||
        (widgets?.spotify?.enabled && widgets.spotify.placement === "bottom")
      ) && (
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, padding: "0 clamp(16px,4vw,40px) 60px",
          maxWidth: 520, margin: "0 auto", width: "100%",
        }}>
          {showViewsOutside && <ViewCounter initial={0} accent={accent} />}
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
            <div style={{ width: "100%", position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden" }}>
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
              style={{ borderRadius: 16 }}
            />
          )}
        </div>
      )}

      {config.customCss && <style dangerouslySetInnerHTML={{ __html: config.customCss }} />}
      {effects.cursor.type === "custom" && effects.cursor.url && (
        <style dangerouslySetInnerHTML={{ __html: `*{cursor:url(${effects.cursor.url}),auto!important}` }} />
      )}
    </>
  );
}
