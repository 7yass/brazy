"use client";

import { User, Globe, Bell, Shield, Palette, AtSign, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">
          Manage your account and profile settings.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10">
              <User className="h-4 w-4 text-violet-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Profile URL</h2>
          </div>
          <p className="mb-3 text-sm text-white/40">
            Choose your unique URL on brazy.it
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
              <span className="text-sm text-white/40">brazy.it/</span>
              <input
                type="text"
                defaultValue="you"
                className="ml-1 bg-transparent text-sm text-white outline-none"
              />
            </div>
            <button className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500">
              Save
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10">
              <Palette className="h-4 w-4 text-cyan-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Default Theme</h2>
          </div>
          <p className="mb-3 text-sm text-white/40">
            Choose the default theme for viewers without a preference.
          </p>
          <div className="flex gap-2">
            {["Dark", "Light", "System"].map((mode) => (
              <button
                key={mode}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  mode === "Dark"
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-white/[0.08] text-white/50 hover:border-white/[0.15] hover:text-white/70"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
              <Globe className="h-4 w-4 text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Language</h2>
          </div>
          <select className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50">
            <option value="en" className="bg-[#0f0d1a]">English</option>
            <option value="de" className="bg-[#0f0d1a]">Deutsch</option>
            <option value="fr" className="bg-[#0f0d1a]">Français</option>
            <option value="es" className="bg-[#0f0d1a]">Español</option>
            <option value="ja" className="bg-[#0f0d1a]">日本語</option>
          </select>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
              <Bell className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 cursor-pointer">
              <span className="text-sm text-white/70">Email notifications</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-violet-500" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 cursor-pointer">
              <span className="text-sm text-white/70">Profile views</span>
              <input type="checkbox" className="h-4 w-4 rounded accent-violet-500" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 cursor-pointer">
              <span className="text-sm text-white/70">New features & updates</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-violet-500" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10">
              <Shield className="h-4 w-4 text-red-400" />
            </div>
            <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
          </div>
          <p className="mb-4 text-sm text-white/40">
            Once you delete your account, there is no going back. All your profiles and data will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20">
              Delete Account
            </button>
            <button className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white/70">
              Export Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
