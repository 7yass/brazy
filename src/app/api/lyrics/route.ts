import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get("artist");
  const title = req.nextUrl.searchParams.get("title");
  if (!artist || !title) return NextResponse.json({ error: "Missing artist or title" }, { status: 400 });

  const token = process.env.GENIUS_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      lines: [
        { time: null, text: `Lyrics for "${title}" by ${artist} are not available.` },
        { time: null, text: "Set GENIUS_ACCESS_TOKEN in env to fetch real lyrics." },
      ],
    });
  }

  try {
    const searchRes = await fetch(
      `https://api.genius.com/search?q=${encodeURIComponent(`${artist} ${title}`)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const searchData = await searchRes.json();
    const hit = searchData.response?.hits?.[0];
    if (!hit) return NextResponse.json({ lines: [] });

    const songRes = await fetch(hit.result.api_path, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const songData = await songRes.json();
    const path = songData.response?.song?.path;

    if (!path) return NextResponse.json({ lines: [] });

    const embedRes = await fetch(`https://genius.com${path}/embed_data`);
    const embedData = await embedRes.json();
    const html = embedData?.data ?? "";

    const lines = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0)
      .map((l: string) => ({ time: null as number | null, text: l }));

    return NextResponse.json({ lines });
  } catch {
    return NextResponse.json({ error: "Failed to fetch lyrics" }, { status: 500 });
  }
}
