"use client";

import { useState, useEffect } from "react";
import { User, Globe, Bell, Shield, Palette, Check, AlertCircle } from "lucide-react";
import { saveProfileAction } from "@/app/dashboard/customize/actions";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, type ProfileConfig } from "@/lib/profile/schema";
import { brazyProfile } from "@/lib/profile/defaults";

export default function SettingsPage() {
  const [usernameInput, setUsernameInput] = useState("you");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.username) setUsernameInput(profile.username);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase!.auth.getUser();
      const config: ProfileConfig = normalizeConfig(brazyProfile);
      const identity = user?.identities?.find((i) => i.provider === "discord");
      const fallbackName = (identity?.identity_data?.username as string) ?? user?.email?.split("@")[0] ?? "user";
      config.identity.username = usernameInput;
      config.identity.displayName = fallbackName;
      const res = await saveProfileAction(config, undefined, usernameInput);
      if (res.error) {
        setToast({ type: "error", msg: res.error });
      } else {
        setToast({ type: "success", msg: "Username saved!" });
      }
    } catch {
      setToast({ type: "error", msg: "Something went wrong" });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Manage your account and profile settings.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Profile</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10"><User className="h-4 w-4 text-violet-400" /></div>
              <h2 className="text-base font-semibold text-white">Profile URL</h2>
            </div>
            <p className="mb-3 text-sm text-white/40">Choose your unique URL on brazy.it</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5">
                <span className="text-sm text-white/40">brazy.it/</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="ml-1 bg-transparent text-sm text-white outline-none"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            {toast && (
              <div className={`mt-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs ${
                toast.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {toast.type === "success" ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {toast.msg}
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Appearance</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10"><Palette className="h-4 w-4 text-cyan-400" /></div>
              <h2 className="text-base font-semibold text-white">Default Theme</h2>
            </div>
            <p className="mb-3 text-sm text-white/40">Choose the default theme for viewers without a preference.</p>
            <div className="flex gap-2">
              {["Dark", "Light", "System"].map((mode) => (
                <button
                  key={mode}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    mode === "Dark"
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                      : "border-white/[0.08] text-white/50 hover:border-white/[0.15] hover:text-white/70"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Localization</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10"><Globe className="h-4 w-4 text-emerald-400" /></div>
              <h2 className="text-base font-semibold text-white">Language</h2>
            </div>
            <select className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-violet-500/50 focus:outline-none">
              <option value="en" className="bg-[#0f0d1a]">English</option>
              <option value="de" className="bg-[#0f0d1a]">Deutsch</option>
              <option value="fr" className="bg-[#0f0d1a]">Français</option>
              <option value="es" className="bg-[#0f0d1a]">Español</option>
              <option value="ja" className="bg-[#0f0d1a]">日本語</option>
            </select>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Notifications</p>
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.10]"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10"><Bell className="h-4 w-4 text-amber-400" /></div>
              <h2 className="text-base font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              {["Email notifications", "Profile views", "New features & updates"].map((label, i) => (
                <label key={label} className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:border-white/[0.10]">
                  <span className="text-sm text-white/70">{label}</span>
                  <div className={`relative h-5 w-9 rounded-full ${i !== 1 ? "bg-violet-500" : "bg-white/10"} transition-colors`}>
                    <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${i !== 1 ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Danger Zone</p>
          <div
            className="overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 transition-all duration-200 hover:border-red-500/30"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10"><Shield className="h-4 w-4 text-red-400" /></div>
              <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
            </div>
            <p className="mb-4 text-sm text-white/40">Once you delete your account, there is no going back.</p>
            <div className="flex gap-3">
              <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20">Delete Account</button>
              <button className="rounded-xl border border-white/[0.08] bg-transparent px-4 py-2.5 text-sm text-white/50 transition-all duration-200 hover:border-white/20 hover:text-white">Export Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
