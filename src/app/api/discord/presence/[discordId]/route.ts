import { NextResponse } from "next/server";

// Using Lanyard REST API to fetch Discord presence.
// The user must be in a server with the Lanyard bot.
export async function GET(request: Request, { params }: { params: Promise<{ discordId: string }> }) {
  try {
    const { discordId } = await params;
    
    if (!discordId) {
      return NextResponse.json({ error: "Missing discordId" }, { status: 400 });
    }

    const lanyardRes = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`, {
      next: { revalidate: 10 } // Cache for 10 seconds
    });

    if (!lanyardRes.ok) {
      return NextResponse.json({ error: "Could not fetch presence data. Make sure the user is in a server with the Lanyard bot (e.g. discord.gg/lanyard)." }, { status: 404 });
    }

    const data = await lanyardRes.json();
    return NextResponse.json(data.data);
    
  } catch (error) {
    console.error("Discord presence error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
