import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing track id" }, { status: 400 });

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      title: "Mock Track",
      artist: "Mock Artist",
      albumArt: "",
      previewUrl: "",
      trackId: id,
    });
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });
    const { access_token } = await tokenRes.json();

    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!trackRes.ok) return NextResponse.json({ error: "Track not found" }, { status: 404 });

    const data = await trackRes.json();
    return NextResponse.json({
      title: data.name,
      artist: data.artists.map((a: { name: string }) => a.name).join(", "),
      albumArt: data.album?.images?.[0]?.url ?? "",
      previewUrl: data.preview_url ?? "",
      trackId: data.id,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}
