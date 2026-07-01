// src/lib/audio/lrc-parser.ts

export interface LyricLine {
  time: number;
  text: string;
}

export function parseLrc(raw: string): LyricLine[] {
  const cleaned = raw.replace(/^\uFEFF/, "");
  const lines = cleaned.split(/\r?\n/);
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{1,2}):(\d{2}\.\d{1,3})\]/g;
  const metaRegex = /^\[(ti|ar|al|by|offset|re|ve|length):/i;

  for (const line of lines) {
    if (metaRegex.test(line)) continue;
    const times: number[] = [];
    let match: RegExpExecArray | null;
    let lastMatchEnd = 0;

    timeRegex.lastIndex = 0;
    while ((match = timeRegex.exec(line)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      times.push(minutes * 60 + seconds);
      lastMatchEnd = timeRegex.lastIndex;
    }

    if (times.length === 0) continue;
    const text = line.slice(lastMatchEnd).trim();
    for (const time of times) {
      result.push({ time, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export function findActiveLine(lyrics: LyricLine[], currentTime: number): number {
  if (lyrics.length === 0) return 0;
  let lo = 0, hi = lyrics.length - 1, idx = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lyrics[mid].time <= currentTime) {
      idx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return idx;
}