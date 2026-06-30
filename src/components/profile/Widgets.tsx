"use client";

import { useEffect, useState } from "react";
import { brandIcons } from "./icons";
import { Link2 } from "lucide-react";

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
