"use client";

import { useEffect, useState } from "react";
import { brandIcons } from "./icons";
import { Link2 } from "lucide-react";
import { FaYoutube, FaGithub, FaTelegram, FaSpotify } from "react-icons/fa6";

// ─── Discord Presence ────────────────────────────────────────────────────────
export function DiscordPresenceWidget({
  discordId,
  accentColor,
  textColor,
  mutedColor,
}: {
  discordId: string;
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!discordId) return;
    const fetchPresence = async () => {
      try {
        const res = await fetch(`/api/discord/presence/${discordId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [discordId]);

  if (loading || !data) return null;

  const statusColors = { online: "#23a559", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e" };
  const statusColor = statusColors[data.discord_status as keyof typeof statusColors] || statusColors.offline;
  
  const customStatus = data.activities.find((a: any) => a.type === 4);
  const playing = data.activities.find((a: any) => a.type === 0);
  const listening = data.listening_to_spotify;

  const txtColor = textColor || "#fafafa";
  const mutColor = mutedColor || "rgba(255,255,255,0.4)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`} alt="Discord Avatar" style={{ width: 44, height: 44, borderRadius: "50%", background: "#1e1f22" }} />
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: statusColor, border: "3px solid #000" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: txtColor }}>{data.discord_user.global_name || data.discord_user.username}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: mutColor }}>@{data.discord_user.username}</p>
        </div>
        <brandIcons.discord size={20} color="#5865F2" />
      </div>
      
      {customStatus && customStatus.state && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: txtColor }}>
          {customStatus.emoji && (
            <span>{customStatus.emoji.name}</span>
          )}
          <span>{customStatus.state}</span>
        </div>
      )}

      {playing && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: mutColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>Playing</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, color: txtColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{playing.name}</p>
            {playing.details && <p style={{ margin: "2px 0 0", fontSize: 12, color: mutColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{playing.details}</p>}
          </div>
        </div>
      )}

      {listening && data.spotify && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, padding: "10px 12px", background: "rgba(29, 185, 84, 0.1)", border: "1px solid rgba(29, 185, 84, 0.2)", borderRadius: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.spotify.album_art_url} alt="Album Art" style={{ width: 44, height: 44, borderRadius: 6 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#1DB954", textTransform: "uppercase", letterSpacing: "0.05em" }}>Listening to Spotify</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: txtColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.spotify.song}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: mutColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>by {data.spotify.artist}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export function SkillsWidget({
  skills,
  accentColor,
  textColor,
  mutedColor,
}: {
  skills: any[];
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
}) {
  if (!skills || skills.length === 0) return null;
  
  const mutColor = mutedColor || "rgba(255,255,255,0.3)";
  const txtColor = textColor || "#fafafa";

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {skills.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 99 }}>
          {s.icon && <span style={{ fontSize: 13 }}>{s.icon}</span>}
          <span style={{ fontSize: 12, fontWeight: 600, color: s.color || accentColor || txtColor }}>{s.name}</span>
          {s.level && <span style={{ fontSize: 10, color: mutColor }}>({s.level})</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────
export function ProjectsWidget({
  projects,
  accentColor,
  textColor,
  mutedColor,
  layout = "list",
}: {
  projects: any[];
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
  layout?: "list" | "grid";
}) {
  if (!projects || projects.length === 0) return null;

  const txtColor = textColor || "#fafafa";
  const mutColor = mutedColor || "rgba(255,255,255,0.4)";

  return (
    <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "flex flex-col gap-2.5"}>
      {projects.map((p, i) => (
        <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, textDecoration: "none", transition: "background 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)"; }}>
          
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={p.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Link2 size={20} color={mutColor} />
            </div>
          )}
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: txtColor }}>{p.title}</p>
            {p.description && <p style={{ margin: "2px 0 0", fontSize: 12, color: mutColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.description}</p>}
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Time Widget ─────────────────────────────────────────────────────────────
export function TimeWidget({
  timezone,
  format,
  accentColor,
  textColor,
  mutedColor,
}: {
  timezone: string;
  format: "12h" | "24h";
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
}) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: format === "12h",
        };
        setTimeStr(new Intl.DateTimeFormat("en-US", options).format(date));
      } catch (e) {
        setTimeStr("Invalid timezone");
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone, format]);

  const txtColor = textColor || "#fafafa";
  const mutColor = mutedColor || "rgba(255,255,255,0.4)";
  const accColor = accentColor || "#7c3aed";

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: mutColor }}>Local Time</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: txtColor }}>{timezone.split("/")[1]?.replace("_", " ") || timezone}</span>
      </div>
      <span style={{ fontSize: 18, fontFamily: "monospace", fontWeight: 800, color: accColor }}>{timeStr}</span>
    </div>
  );
}

// ─── Spotify Embed Widget ────────────────────────────────────────────────────
export function SpotifyEmbedWidget({
  url,
  accentColor,
  textColor,
}: {
  url: string;
  accentColor?: string;
  textColor?: string;
}) {
  if (!url) return null;
  const trackId = url.split("spotify.com/")[1]?.replace(/\?.*/, "");
  const txtColor = textColor || "#fafafa";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FaSpotify size={16} color="#1DB954" />
        <span style={{ fontSize: 12, fontWeight: 700, color: txtColor }}>Spotify Playlist</span>
      </div>
      <iframe
        src={`https://open.spotify.com/embed/${trackId}`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ borderRadius: 10, border: "none" }}
      />
    </div>
  );
}

// ─── GitHub Stats Widget ─────────────────────────────────────────────────────
export function GithubStatsWidget({
  username,
  accentColor,
  textColor,
  mutedColor,
}: {
  username: string;
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
}) {
  if (!username) return null;
  const txtColor = textColor || "#fafafa";
  const accColor = accentColor || "#38bdf8";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FaGithub size={16} color={txtColor} />
        <span style={{ fontSize: 12, fontWeight: 700, color: txtColor }}>GitHub Profile</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=dark&bg_color=00000000&hide_border=true&text_color=94a3b8&icon_color=${accColor.replace("#", "")}&title_color=fafafa`}
        alt="GitHub Stats"
        style={{ width: "100%", borderRadius: 10 }}
      />
    </div>
  );
}

// ─── YouTube Embed Widget ────────────────────────────────────────────────────
export function YoutubeEmbedWidget({
  url,
  accentColor,
  textColor,
}: {
  url: string;
  accentColor?: string;
  textColor?: string;
}) {
  if (!url) return null;
  const vidId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];
  const txtColor = textColor || "#fafafa";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FaYoutube size={16} color="#FF0000" />
        <span style={{ fontSize: 12, fontWeight: 700, color: txtColor }}>YouTube Video</span>
      </div>
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)" }}>
        <iframe
          src={`https://www.youtube.com/embed/${vidId}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, border: "none" }}
          allowFullScreen
        />
      </div>
    </div>
  );
}

// ─── Telegram Widget ─────────────────────────────────────────────────────────
export function TelegramWidget({
  username,
  text,
  accentColor,
  textColor,
  mutedColor,
}: {
  username: string;
  text: string;
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
}) {
  if (!username) return null;
  const txtColor = textColor || "#fafafa";
  const mutColor = mutedColor || "rgba(255,255,255,0.4)";
  const accColor = accentColor || "#2AABEE";

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <FaTelegram size={24} color="#2AABEE" style={{ flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: txtColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Telegram Card</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: mutColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</p>
        </div>
      </div>
      <a
        href={`https://t.me/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          padding: "6px 12px",
          borderRadius: 8,
          background: `${accColor}15`,
          border: `1px solid ${accColor}33`,
          color: accColor,
          fontSize: 11,
          fontWeight: 700,
          textDecoration: "none",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = `${accColor}25`;
          (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accColor}55`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = `${accColor}15`;
          (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accColor}33`;
        }}
      >
        Join
      </a>
    </div>
  );
}
