import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKETS: Record<string, string> = {
  background: "backgrounds",
  avatar: "avatars",
  audio: "audio",
  cursor: "cursors",
};

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  if (!supabase) return NextResponse.json({ error: "db not configured" }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const type = form.get("type") as string | null;

  if (!file || !type) return NextResponse.json({ error: "missing file or type" }, { status: 400 });

  const bucket = BUCKETS[type];
  if (!bucket) return NextResponse.json({ error: "unknown asset type" }, { status: 400 });

  const MAX_SIZES: Record<string, number> = {
    background: 50 * 1024 * 1024,
    avatar: 5 * 1024 * 1024,
    audio: 25 * 1024 * 1024,
    cursor: 1 * 1024 * 1024,
  };
  const maxSize = MAX_SIZES[type] ?? 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB` }, { status: 400 });
  }

  const ALLOWED: Record<string, string[]> = {
    background: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"],
    avatar: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"],
    cursor: ["image/png", "image/svg+xml"],
  };
  const allowed = ALLOWED[type] ?? ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${user.id}/${type}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
