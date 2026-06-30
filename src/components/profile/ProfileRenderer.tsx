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
  const [tick, setTick] = useState(0);
  const [typewriterIdx, setTypewriterIdx] = useState(0);
  const [typewriterForward, setTypewriterForward] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (effect !== "typewriter") return;
    const interval = setInterval(() => {
      setTypewriterIdx(prev => {
        if (typewriterForward) {
          if (prev >= text.length) { setTypewriterForward(false); return prev; }
          return prev + 1;
        } else {
          if (prev <= 0) { setTypewriterForward(true); return prev; }
          return prev - 1;
        }
      });
    }, 120);
    return () => clearInterval(interval);
  }, [effect, text, typewriterForward]);

  const glowStyle = textGlow
    ? { textShadow: `0 0 12px ${accent}99, 0 0 24px ${accent}55` }
    : {};

  const baseClass = "font-extrabold tracking-tight break-all";

  if (effect === "typewriter") {
    return (
      <span className={baseClass} style={{ color: textColor, ...glowStyle }}>
        {text.slice(0, typewriterIdx)}
        <span className="animate-pulse opacity-70">|</span>
      </span>
    );
  }

  if (effect === "rainbow") {
    const colors = ["#ff0000","#ff7700","#ffff00","#00ff00","#0099ff","#9900ff"];
    return (
      <span className={baseClass}>
        {text.split("").map((ch, i) => (
          <span key={i} style={{ color: colors[(i + tick) % colors.length], transition: "color 0.1s" }}>{ch}</span>
        ))}
      </span>
    );
  }

  if (effect === "glow") {
    const glowOpacity = 0.5 + 0.5 * Math.sin(tick * 0.15);
    return (
      <span
        className={baseClass}
        style={{
          color: textColor,
          textShadow: `0 0 ${8 + glowOpacity * 14}px ${accent}${Math.round((0.4 + glowOpacity * 0.6) * 255).toString(16).padStart(2,"0")}`,
        }}
      >
        {text}
      </span>
    );
  }

  if (effect === "glitch") {
    const glitching = tick % 20 < 3;
    return (
      <span
        className={baseClass}
        style={{
          color: textColor,
          textShadow: glitching ? "2px 0 #ff0040, -2px 0 #00ffff" : "none",
          display: "inline-block",
          transform: glitching ? `translate(${(Math.random() - 0.5) * 3}px, 0)` : "none",
          ...glowStyle,
        }}
      >
        {text}
      </span>
    );
  }

  if (effect === "neon") {
    const pulse = 0.6 + 0.4 * Math.sin(tick * 0.12);
    return (
      <span
        className={baseClass}
        style={{
          color: `rgba(200,180,255,${0.8 + pulse * 0.2})`,
          textShadow: `0 0 8px rgba(160,100,255,${pulse}), 0 0 20px rgba(160,100,255,${pulse * 0.5})`,
        }}
      >
        {text}
      </span>
    );
  }

  if (effect === "shake") {
    const shaking = tick % 30 < 5;
    return (
      <span
        className={baseClass}
        style={{
          color: textColor,
          display: "inline-block",
          transform: shaking ? `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*3}px)` : "none",
          ...glowStyle,
        }}
      >
        {text}
      </span>
    );
  }

  if (effect === "gradient") {
    const offset = (tick * 2) % 360;
    return (
      <span
        className={baseClass}
        style={{
          background: `linear-gradient(${offset}deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </span>
    );
  }

  if (effect === "bounce") {
    return (
      <span className={baseClass}>
        {text.split("").map((ch, i) => (
          <span
            key={i}
            style={{
              color: textColor,
              display: "inline-block",
              transform: `translateY(${Math.sin((tick * 0.2) + i * 0.6) * 4}px)`,
              ...glowStyle,
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  }

  if (effect === "pulse") {
    const scale = 1 + 0.06 * Math.sin(tick * 0.12);
    return (
      <span
        className={baseClass}
        style={{
          color: textColor,
          display: "inline-block",
          transform: `scale(${scale})`,
          ...glowStyle,
        }}
      >
        {text}
      </span>
    );
  }

  if (effect === "wave") {
    return (
      <span className={baseClass}>
        {text.split("").map((ch, i) => (
          <span
            key={i}
            style={{
              color: textColor,
              display: "inline-block",
              transform: `translateY(${Math.sin((tick * 0.15) + i * 0.8) * 5}px)`,
              ...glowStyle,
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  }

  // default / none
  return (
    <span className={baseClass} style={{ color: textColor, ...glowStyle }}>
      {text}
    </span>
  );
}

// ─── Social Link Button ────────────────────────────────────────────────────────

function SocialButton({ href, platform, label, color, glow, cardStyle }: {
  href: string; platform: string; label: string; color: string; glow: boolean; cardStyle: string;
}) {
  const Icon = brandIcons[platform as keyof typeof brandIcons];
  const glowStyle = glow ? { boxShadow: `0 0 12px ${color}55, 0 0 24px ${color}22` } : {};

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border"
      style={{
        borderColor: `${color}30`,
        background: `${color}10`,
        ...glowStyle,
      }}
    >
      {Icon && (
        <span className="shrink-0 w-4 h-4" style={{ color }}>
          <Icon className="w-4 h-4" />
        </span>
      )}
      <span className="text-sm font-semibold truncate flex-1" style={{ color: "rgba(255,255,255,0.9)" }}>
        {label}
      </span>
    </motion.a>
  );
}

// ─── Audio Player ──────────────────────────────────────────────────────────────

function AudioPlayer({ cfg }: { cfg: ProfileConfig }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolvedSrc, setResolvedSrc] = useState("");
  const [lyricsIdx, setLyricsIdx] = useState(-1);

  useEffect(() => {
    (async () => {
      if (!cfg.audio.src) return;
      const url = await getPipedStreamUrl(cfg.audio.src);
      setResolvedSrc(url || cfg.audio.src);
    })();
  }, [cfg.audio.src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = cfg.audio.volume ?? 0.5;
    const onTime = () => {
      setProgress(el.duration ? el.currentTime / el.duration : 0);
      if (cfg.audio.lyrics?.length) {
        const t = el.currentTime;
        let idx = -1;
        for (let i = 0; i < cfg.audio.lyrics.length; i++) {
          if (t >= cfg.audio.lyrics[i].time) idx = i;
        }
        setLyricsIdx(idx);
      }
    };
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [cfg.audio.lyrics, cfg.audio.volume]);

  const togglePlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try { await el.play(); setPlaying(true); } catch {}
    }
  }, [playing]);

  if (!cfg.audio.enabled || !cfg.audio.src) return null;

  const currentLyric = lyricsIdx >= 0 ? cfg.audio.lyrics?.[lyricsIdx]?.text : null;

  return (
    <div className="w-full rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm p-3 flex flex-col gap-2">
      <audio ref={audioRef} src={resolvedSrc} preload="metadata" />
      <div className="flex items-center gap-3">
        {cfg.audio.coverUrl && (
          <img src={cfg.audio.coverUrl} alt="cover" className="w-10 h-10 rounded-lg object-cover shrink-0" />
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-bold text-white truncate">{cfg.audio.title || "Unknown Track"}</span>
          <span className="text-[10px] text-white/50 truncate">{cfg.audio.artist || ""}</span>
        </div>
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0 cursor-pointer"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><path d="M2 1.5l9 4.5-9 4.5V1.5z"/></svg>
          )}
        </button>
      </div>
      <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-white/60 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
      </div>
      {currentLyric && (
        <p className="text-[10px] text-white/60 text-center italic truncate px-1">{currentLyric}</p>
      )}
    </div>
  );
}

// ─── Main Renderer ─────────────────────────────────────────────────────────────

export default function ProfileRenderer({ config, username, isOwner = false }: {
  config: ProfileConfig;
  username: string;
  isOwner?: boolean;
}) {
  const cfg = config;
  const theme = cfg.theme;
  const bg = cfg.background;
  const identity = cfg.identity;
  const effects = cfg.effects;
  const [splashDone, setSplashDone] = useState(!cfg.splashIntro?.enabled);

  const cardStyle = (() => {
    switch (theme.cardStyle) {
      case "glass": return {
        background: `rgba(${hexToRgb(bg.color1)}, ${theme.cardOpacity})`,
        backdropFilter: `blur(${theme.cardBlur}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur}px)`,
        border: `${theme.borderWidth}px solid rgba(255,255,255,0.08)`,
        borderRadius: `${theme.borderRadius}px`,
      };
      case "solid": return {
        background: bg.color1,
        border: `${theme.borderWidth}px solid ${bg.color2}`,
        borderRadius: `${theme.borderRadius}px`,
      };
      case "outline": return {
        background: "transparent",
        border: `${theme.borderWidth}px solid ${theme.primaryColor}`,
        borderRadius: `${theme.borderRadius}px`,
      };
      case "neon": return {
        background: `rgba(${hexToRgb(bg.color1)}, ${theme.cardOpacity})`,
        border: `${theme.borderWidth}px solid ${theme.primaryColor}`,
        boxShadow: `0 0 20px ${theme.primaryColor}55, inset 0 0 20px ${theme.primaryColor}11`,
        borderRadius: `${theme.borderRadius}px`,
      };
      case "minimal": return {
        background: "transparent",
        border: "none",
        borderRadius: `${theme.borderRadius}px`,
      };
      case "portfolio": return {
        background: `rgba(${hexToRgb(bg.color1)}, ${Math.min(theme.cardOpacity + 0.1, 1)})`,
        backdropFilter: `blur(${theme.cardBlur + 4}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur + 4}px)`,
        border: `${theme.borderWidth}px solid rgba(255,255,255,0.06)`,
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      };
      case "simplistic": return {
        background: `rgba(0,0,0,${theme.cardOpacity * 0.6})`,
        border: `${theme.borderWidth}px solid rgba(255,255,255,0.04)`,
        borderRadius: `${theme.borderRadius}px`,
      };
      case "modern": return {
        background: `linear-gradient(135deg, rgba(${hexToRgb(bg.color1)},${theme.cardOpacity}), rgba(${hexToRgb(bg.color2)},${theme.cardOpacity * 0.7}))`,
        backdropFilter: `blur(${theme.cardBlur}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur}px)`,
        border: `${theme.borderWidth}px solid rgba(255,255,255,0.1)`,
        borderRadius: `${theme.borderRadius}px`,
      };
      case "sleek": return {
        background: `rgba(${hexToRgb(bg.color1)}, ${theme.cardOpacity})`,
        backdropFilter: `blur(${theme.cardBlur * 1.5}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur * 1.5}px)`,
        border: `1px solid rgba(255,255,255,0.05)`,
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)",
      };
      default: return {
        background: `rgba(${hexToRgb(bg.color1)}, ${theme.cardOpacity})`,
        backdropFilter: `blur(${theme.cardBlur}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur}px)`,
        border: `${theme.borderWidth}px solid rgba(255,255,255,0.08)`,
        borderRadius: `${theme.borderRadius}px`,
      };
    }
  })();

  const fontClass = (() => {
    switch (theme.fontFamily) {
      case "inter": return "font-sans";
      case "poppins": return "font-[Poppins,sans-serif]";
      case "mono": return "font-mono";
      case "serif": return "font-serif";
      default: return "font-sans";
    }
  })();

  const earnedBadges: Badge[] = (cfg.badges.list ?? []).map((id: string) => {
    const found = PREDEFINED_BADGES.find((b) => b.id === id);
    return found ?? null;
  }).filter(Boolean) as Badge[];

  const viewsPlacement = cfg.analytics?.viewsPlacement ?? (cfg.analytics?.showViews ? "inside" : "none");

  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center ${fontClass}`}
      style={{ position: "fixed", inset: 0, overflow: "auto" }}
    >
      {/* Background */}
      <BackgroundLayer config={cfg} />

      {/* Cursor / Click effects */}
      {effects.cursor.enabled && <CursorEffect config={effects.cursor} />}
      {effects.click.enabled && <ClickEffect config={effects.click} />}

      {/* Splash */}
      <AnimatePresence>
        {!splashDone && cfg.splashIntro?.enabled && (
          <SplashIntro config={cfg.splashIntro} onDone={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      {/* View counter outside card */}
      {viewsPlacement === "outside" && (
        <div className="absolute top-4 right-4 z-20">
          <ViewCounter username={username} textColor={theme.textColor} />
        </div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`relative z-10 w-full max-w-sm mx-4 my-8 p-6 flex flex-col gap-5 ${
          theme.animatedBorder ? "animated-border" : ""
        }`}
        style={cardStyle}
      >
        {/* Identity */}
        <div className="flex flex-col items-center gap-3 text-center">
          {identity.avatarUrl && (
            <motion.img
              src={identity.avatarUrl}
              alt={identity.displayName || username}
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: `${theme.primaryColor}55` }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
            />
          )}

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl">
              <UsernameText
                text={identity.displayName || username}
                effect={effects.usernameEffect ?? "none"}
                accent={theme.primaryColor}
                accent2={bg.color2}
                textColor={theme.textColor}
                textGlow={effects.textGlow}
              />
            </h1>

            {identity.tagline && (
              <p className="text-xs font-medium" style={{ color: theme.mutedTextColor }}>
                {identity.tagline}
              </p>
            )}

            {identity.pronouns && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border font-semibold"
                style={{ borderColor: `${theme.primaryColor}40`, color: theme.primaryColor, background: `${theme.primaryColor}10` }}
              >
                {identity.pronouns}
              </span>
            )}

            {identity.location && (
              <span className="text-[10px] font-medium" style={{ color: theme.mutedTextColor }}>📍 {identity.location}</span>
            )}
          </div>

          {identity.bio && (
            <p className="text-xs leading-relaxed" style={{ color: theme.mutedTextColor }}>
              {identity.bio}
            </p>
          )}

          {/* Badges */}
          {cfg.badges.enabled && earnedBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {earnedBadges.map((badge) => (
                <span
                  key={badge.id}
                  title={badge.description}
                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${badge.color}40`,
                    color: badge.color,
                    background: `${badge.color}15`,
                    boxShadow: `0 0 8px ${badge.color}30`,
                  }}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          )}

          {/* Views inside card */}
          {viewsPlacement === "inside" && (
            <ViewCounter username={username} textColor={theme.mutedTextColor} />
          )}
        </div>

        {/* Audio Player */}
        <AudioPlayer cfg={cfg} />

        {/* Discord Presence */}
        {cfg.widgets?.discordPresence?.enabled && cfg.widgets.discordPresence.discordId && (
          <DiscordPresenceWidget
            discordId={cfg.widgets.discordPresence.discordId}
            accentColor={theme.primaryColor}
            textColor={theme.textColor}
            mutedColor={theme.mutedTextColor}
          />
        )}

        {/* Social Links */}
        {cfg.links.length > 0 && (
          <div className="flex flex-col gap-2">
            {cfg.links.filter(l => l.enabled !== false).map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: EASE }}
              >
                <SocialButton
                  href={link.url}
                  platform={link.platform}
                  label={link.label || link.platform}
                  color={link.color || theme.primaryColor}
                  glow={theme.glow}
                  cardStyle={theme.cardStyle}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Skills Widget */}
        {cfg.widgets?.skills?.enabled && cfg.widgets.skills.list?.length > 0 && (
          <SkillsWidget
            skills={cfg.widgets.skills.list}
            accentColor={theme.primaryColor}
            textColor={theme.textColor}
            mutedColor={theme.mutedTextColor}
          />
        )}

        {/* Projects Widget */}
        {cfg.widgets?.projects?.enabled && cfg.widgets.projects.list?.length > 0 && (
          <ProjectsWidget
            projects={cfg.widgets.projects.list}
            accentColor={theme.primaryColor}
            textColor={theme.textColor}
            mutedColor={theme.mutedTextColor}
          />
        )}

        {/* Branding */}
        <div className="flex items-center justify-center pt-1">
          <a
            href="https://brazy.lol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity"
          >
            <SpiderLogo className="w-3 h-3" />
            <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: theme.mutedTextColor }}>brazy.lol</span>
          </a>
        </div>
      </motion.div>

      {/* Custom CSS */}
      {cfg.customCss && <style dangerouslySetInnerHTML={{ __html: cfg.customCss }} />}
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "20,20,20";
  return `${r},${g},${b}`;
}
