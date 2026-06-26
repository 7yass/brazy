import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get("artist");
  const title = req.nextUrl.searchParams.get("title");
  const trackId = req.nextUrl.searchParams.get("trackId");
  const q = artist && title ? `${artist} ${title}` : trackId ?? "";
  if (!q) return NextResponse.json({ synced: false, lines: [] });

  const token = process.env.GENIUS_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      synced: false,
      lines: [
        { time: null as number | null, text: "Set GENIUS_ACCESS_TOKEN in env to fetch lyrics." },
      ],
    });
  }

  try {
    const searchRes = await fetch(
      `https://api.genius.com/search?q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const searchData = await searchRes.json();
    const hit = searchData.response?.hits?.[0];
    if (!hit) return NextResponse.json({ synced: false, lines: [] });

    const songPath = hit.result.api_path as string;
    const songRes = await fetch(`https://api.genius.com${songPath}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const songData = await songRes.json();
    const path = songData.response?.song?.path;
    if (!path) return NextResponse.json({ synced: false, lines: [] });

    const embedRes = await fetch(`https://genius.com${path}/embed_data`);
    const embedData = await embedRes.json();
    const html: string = embedData?.data ?? "";

    const lines = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => ({ time: null as number | null, text: l }));

    return NextResponse.json({ synced: false, lines });
  } catch {
    return NextResponse.json({ synced: false, lines: [] });
  }
}
