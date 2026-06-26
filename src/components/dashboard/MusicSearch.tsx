"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Search, X } from "lucide-react";

interface MusicSearchProps {
  selectedTrack: {
    trackId: string;
    title: string;
    artist: string;
    thumb: string;
  } | null;
  onSelect: (track: { trackId: string; title: string; artist: string; thumb: string }) => void;
  onClear: () => void;
}

interface SearchResult {
  trackId: string;
  title: string;
  artist: string;
  thumb: string;
}

export function MusicSearch({ selectedTrack, onSelect, onClear }: MusicSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) { setResults([]); setShowDropdown(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !anon) return;

        const res = await fetch(`${url}/functions/v1/spotify-search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anon}`,
          },
          body: JSON.stringify({ query: q }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : (data.results ?? [])).map((item: { id?: string; name?: string; artist?: string; albumArt?: string }) => ({
          trackId: item.id ?? "",
          title: item.name ?? "",
          artist: item.artist ?? "",
          thumb: item.albumArt ?? "",
        }));
        setResults(mapped);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (r: SearchResult) => {
    onSelect(r);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {selectedTrack ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#121212",
            border: "2px solid #1b1b1b",
            borderRadius: 14,
            padding: 12,
          }}
        >
          {selectedTrack.thumb && (
            <img
              src={selectedTrack.thumb}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: "#fafafa", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedTrack.title}
            </p>
            <p style={{ fontSize: 12, color: "#797979" }}>{selectedTrack.artist}</p>
          </div>
          <button
            onClick={onClear}
            style={{ background: "none", border: "none", color: "#797979", cursor: "pointer", flexShrink: 0 }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search style={{ width: 16, height: 16, color: "#797979", position: "absolute", left: 14, pointerEvents: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a song..."
              style={{
                background: "#121212",
                border: "2px solid #1b1b1b",
                borderRadius: 14,
                padding: "10px 14px 10px 38px",
                color: "#f1f1f1",
                fontSize: 15,
                fontFamily: "Satoshi, sans-serif",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          {loading && (
            <p style={{ fontSize: 12, color: "#797979", marginTop: 6, marginLeft: 4 }}>Searching...</p>
          )}

          {showDropdown && results.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                zIndex: 50,
                background: "#141414",
                border: "2px solid #1b1b1b",
                borderRadius: 14,
                padding: 6,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              {results.map((r) => (
                <div
                  key={r.trackId}
                  onClick={() => handleSelect(r)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 8px",
                    borderRadius: 10,
                    cursor: "pointer",
                    height: 48,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {r.thumb ? (
                    <img src={r.thumb} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: "#1a1a1a", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: "#fafafa", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#797979", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
