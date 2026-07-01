import { NextRequest, NextResponse } from "next/server";

const LRCLIB_BASE = "https://lrclib.net/api";
const CLIENT_HEADER = "brazy.it lyrics-display/1.0";

export async function GET(req: NextRequest) {
  const track = req.nextUrl.searchParams.get("track") || "";
  const artist = req.nextUrl.searchParams.get("artist") || "";

  if (!track) {
    return NextResponse.json(
      { error: "track parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Try LRCLIB direct get first
    const url = new URL(`${LRCLIB_BASE}/get`);
    url.searchParams.set("track_name", track);
    if (artist) url.searchParams.set("artist_name", artist);

    const res = await fetch(url.toString(), {
      headers: { "Lrclib-Client": CLIENT_HEADER },
      next: { revalidate: 86400 }, // cache 24h
    });

    if (res.status === 404) {
      // Fallback to search endpoint
      const searchUrl = new URL(`${LRCLIB_BASE}/search`);
      searchUrl.searchParams.set("q", `${artist} ${track}`.trim());
      const searchRes = await fetch(searchUrl.toString());
      const searchData = await searchRes.json();

      if (Array.isArray(searchData) && searchData.length > 0) {
        const synced = searchData.find(
          (r: Record<string, unknown>) => !!r.syncedLyrics
        );
        const best = synced || searchData[0];
        return NextResponse.json({
          syncedLyrics: (best.syncedLyrics as string) || null,
          plainLyrics: (best.plainLyrics as string) || null,
          source: "lrclib",
        });
      }
      return NextResponse.json(
        { error: "No lyrics found for this track" },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "LRCLIB error" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      syncedLyrics: data.syncedLyrics || null,
      plainLyrics: data.plainLyrics || null,
      source: "lrclib",
    });
  } catch (err) {
    console.error("Lyrics search error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}