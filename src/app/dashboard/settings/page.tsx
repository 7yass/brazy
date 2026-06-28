"use client";

import { useState, useEffect } from "react";
import { User, Mail, Bell, ShieldAlert, Check, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const F = "Satoshi, system-ui, sans-serif";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fafafa" }}>{label}</p>
        {description && <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{description}</p>}
      </div>
      <div style={{ flexShrink: 0, minWidth: 200 }}>{children}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <Icon style={{ width: 13, height: 13, color: "#dc2626" }} />
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{title}</p>
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

  const inputBase: React.CSSProperties = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>

      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Settings</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Manage your account preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 12, background: "linear-gradient(135deg,#dc2626,#e11d48)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "default" : "pointer", fontFamily: F, boxShadow: "0 4px 14px rgba(220,38,38,0.25)", flexShrink: 0, opacity: saving ? 0.7 : 1 }}
        >
          {saved ? <><Check style={{ width: 13, height: 13 }} /> Saved!</> : saving ? "Saving…" : <><Save style={{ width: 13, height: 13 }} /> Save changes</>}
        </button>
      </header>

      {/* Profile */}
      <Card>
        <SectionHeader icon={User} title="Profile" />
        <Row label="Display name" description="Shown on your public profile page.">
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={inputBase} />
        </Row>
        <Row label="Email" description="Your login email. Cannot be changed here.">
          <input value={email} readOnly style={{ ...inputBase, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.35)", cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.04)" }} />
        </Row>
      </Card>

      {/* Notifications */}
      <Card>
        <SectionHeader icon={Bell} title="Notifications" />
        <div style={{ padding: "28px 24px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.25)" }}>Notification preferences coming soon.</p>
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <SectionHeader icon={ShieldAlert} title="Privacy" />
        <div style={{ padding: "28px 24px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.25)" }}>Privacy controls coming soon.</p>
        </div>
      </Card>

    </div>
  );
}
