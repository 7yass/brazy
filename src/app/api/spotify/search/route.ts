import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.trim().length === 0) return NextResponse.json({ results: [] });

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      results: [
        { id: "mock", title: `"${q}" — Mock Track`, artist: "Mock Artist", albumArt: "", previewUrl: "", durationMs: 200000 },
      ],
    });
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });
    const { access_token } = await tokenRes.json();

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );
    if (!searchRes.ok) return NextResponse.json({ results: [] });

    const data = await searchRes.json();
    const results = (data.tracks?.items ?? []).map((t: Record<string, unknown>) => ({
      id: t.id,
      title: t.name,
      artist: (t.artists as Array<{ name: string }>)?.map((a) => a.name).join(", ") ?? "",
      albumArt: ((t.album as Record<string, unknown>)?.images as Array<Record<string, unknown>> | undefined)?.[0]?.url as string ?? "",
      previewUrl: t.preview_url ?? "",
      durationMs: t.duration_ms ?? 0,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
