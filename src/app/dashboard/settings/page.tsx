"use client";

import { useState, useEffect } from "react";
import { User, Mail, ShieldAlert, Bell, Palette, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const identities = user.identities ?? [];
      const discordIdent = identities.find((i) => i.provider === "discord");
      const name =
        (discordIdent?.identity_data?.username as string | undefined) ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "";
      setUsername(name);
      setDisplayName(name);
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.username) { setUsername(profile.username); setDisplayName(profile.username); }
    })();
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/40">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-white/20 focus:ring-0 transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/30">Manage your account settings.</p>
      </div>

      {/* Profile Settings */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04]">
            <User className="h-4 w-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/70">Profile</h2>
            <p className="text-xs text-white/30">Update your public-facing info.</p>
          </div>
        </div>
        <div className="space-y-3">
          <Field label="Username" value={username} onChange={setUsername} />
          <Field label="Display Name" value={displayName} onChange={setDisplayName} />
        </div>
      </div>

      {/* Account Settings */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04]">
            <Mail className="h-4 w-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/70">Account</h2>
            <p className="text-xs text-white/30">Your login credentials.</p>
          </div>
        </div>
        <Field label="Email Address" value={email} onChange={setEmail} type="email" />
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04]">
            <Bell className="h-4 w-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/70">Notifications</h2>
            <p className="text-xs text-white/30">Choose what you want to be notified about.</p>
          </div>
        </div>
        {[
          { label: "Profile view milestones", sub: "Get notified when your profile hits view goals" },
          { label: "New badge earned", sub: "Notify me when I unlock a new badge" },
          { label: "Product updates", sub: "News and announcements from brazy" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between border-t border-white/[0.04] py-3 first:border-t-0">
            <div>
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="text-xs text-white/25">{item.sub}</p>
            </div>
            <button
              role="switch"
              className="relative h-5 w-9 rounded-full bg-white/[0.06] transition-colors"
            >
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white/20 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04]">
            <Palette className="h-4 w-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/70">Appearance</h2>
            <p className="text-xs text-white/30">Dashboard theme preferences.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["Dark", "System"].map((theme) => (
            <button
              key={theme}
              className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all ${
                theme === "Dark"
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                  : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/[0.10]"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-5 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/30"
      >
        <Save className="h-4 w-4" />
        {saved ? "Saved!" : "Save Changes"}
      </button>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10">
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
            <p className="text-xs text-red-400/50">Irreversible actions.</p>
          </div>
        </div>
        <p className="mb-4 text-sm text-white/30">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20">
          Delete Account
        </button>
      </div>
    </div>
  );
}
