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

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${user.id}/${type}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
