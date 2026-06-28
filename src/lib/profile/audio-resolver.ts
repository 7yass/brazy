const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.lunar.icu",
  "https://pipedapi.colt.top",
  "https://api.piped.yt"
];

export async function getPipedStreamUrl(videoId: string): Promise<string | null> {
  if (!videoId) return null;
  
  // Try each public Piped instance sequentially
  for (const instance of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 4000);
      
      const res = await fetch(`${instance}/streams/${videoId}`, {
        signal: controller.signal,
      });
      clearTimeout(id);
      
      if (res.ok) {
        const data = await res.json();
        // Look for the best audio-only stream (mp4/webm formats are highly compatible)
        const audioStream = data.audioStreams?.find(
          (s: any) => s.mimeType?.startsWith("audio/mp4") || s.mimeType?.startsWith("audio/webm")
        ) || data.audioStreams?.[0];
        
        if (audioStream?.url) {
          return audioStream.url;
        }
      }
    } catch (e) {
      console.warn(`Piped instance ${instance} failed for video ${videoId}:`, e);
    }
  }
  
  return null;
}
