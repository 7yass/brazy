import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ results: [] });

  try {
    // Use iTunes Search API (free, no key needed)
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20&entity=song`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const json = await res.json();
    const results = (json.results ?? []).map((t: {
      trackId: number;
      trackName: string;
      artistName: string;
      artworkUrl100: string;
      previewUrl: string;
      trackTimeMillis: number;
    }) => ({
      id: String(t.trackId),
      title: t.trackName,
      artist: t.artistName,
      thumb: t.artworkUrl100?.replace("100x100", "300x300"),
      preview: t.previewUrl,
      duration: Math.round((t.trackTimeMillis ?? 0) / 1000),
    }));
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [], error: String(e) });
  }
}
