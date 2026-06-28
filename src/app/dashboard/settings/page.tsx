"use client";

import { useState, useEffect } from "react";
import { User, Mail, Bell, ShieldAlert, Check, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const F = "Satoshi, system-ui, sans-serif";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl overflow-hidden shadow-2xl">
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-neutral-900/60">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-neutral-300">{label}</span>
        {description && <span className="text-[10px] text-neutral-500 mt-0.5 max-w-sm leading-normal">{description}</span>}
      </div>
      <div className="shrink-0 w-72">{children}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="px-5 py-3.5 flex items-center gap-2 bg-neutral-950/20 border-b border-neutral-900/60">
      <Icon className="w-4 h-4 text-red-500" />
      <span className="text-[10px] font-bold text-neutral-405 uppercase tracking-wider">{title}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        setEmail(user.email ?? "");
        const identities = user.identities ?? [];
        const discordIdent = identities.find((i) => i.provider === "discord");
        const fallback =
          (discordIdent?.identity_data?.username as string | undefined) ??
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ?? "";
        let { data: profile, error } = await supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle();
        if (error || !profile) {
          const { data: profileById } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
          if (profileById) profile = profileById;
        }
        setUsername(profile?.username ?? fallback);
      } catch {}
    })();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const supabase = createClient();
      if (!supabase) return;
      const { error: errorId } = await supabase.from("profiles").update({ username }).eq("id", userId);
      if (errorId) {
        await supabase.from("profiles").update({ username }).eq("user_id", userId);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 select-none">

      <header className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Settings
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Manage your account preferences and login credentials.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition shadow-[0_4px_14px_rgba(220,38,38,0.25)] shrink-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving…" : <><Save className="w-4 h-4" /> Save changes</>}
        </button>
      </header>

      {/* Profile */}
      <Card>
        <SectionHeader icon={User} title="Profile Details" />
        <Row label="Reserved Username" description="Used for your public URL bio path.">
          <input 
            type="text"
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Username" 
            className="bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500/40 placeholder-neutral-700 w-full transition"
          />
        </Row>
        <Row label="Account Email" description="Used for your secure authentication. Cannot be modified directly.">
          <input 
            type="text"
            value={email} 
            readOnly 
            className="bg-neutral-950/20 border border-neutral-900/60 rounded-xl px-3.5 py-2 text-xs text-neutral-500 cursor-not-allowed outline-none w-full"
          />
        </Row>
      </Card>

      {/* Notifications */}
      <Card>
        <SectionHeader icon={Bell} title="Notifications Preferences" />
        <div className="py-10 text-center">
          <p className="text-xs text-neutral-600">Preferences and email subscriptions are configured automatically.</p>
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <SectionHeader icon={ShieldAlert} title="Privacy & Security" />
        <div className="py-10 text-center">
          <p className="text-xs text-neutral-600">Secure encryption is enabled automatically for all page features.</p>
        </div>
      </Card>

    </div>
  );
}
