"use client";

import { useState } from "react";
import {
  Upload, Music, Image as ImageIcon, MousePointer2,
  Type, Zap, Palette, Sliders, MapPin, Sparkles,
  Eye, EyeOff, ChevronDown, ChevronUp, Lock, ExternalLink,
} from "lucide-react";

// ─── Background effects list ───────────────────────────────────────────────
const BG_EFFECTS = [
  { id: "none",        label: "None" },
  { id: "snow",        label: "Snow" },
  { id: "rain",        label: "Rain" },
  { id: "confetti",   label: "Confetti" },
  { id: "particles",  label: "Particles" },
  { id: "aurora",     label: "Aurora",    premium: true },
  { id: "nighttime",  label: "Night Time", premium: true },
  { id: "bubbles",    label: "Bubbles",    premium: true },
  { id: "fireflies",  label: "Fireflies",  premium: true },
];

const USERNAME_EFFECTS = ["None", "Glitch", "Rainbow", "Shake", "Gradient"];

// ─── Collapsible Section wrapper ───────────────────────────────────────────
function Section({
  title, icon, children, defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-white/30">{icon}</span>
          <span className="text-sm font-semibold text-white/70">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-white/20" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/20" />
        )}
      </button>
      {open && <div className="border-t border-white/[0.04] p-4 pt-3">{children}</div>}
    </div>
  );
}

// ─── Upload button ──────────────────────────────────────────────────────────
function UploadBtn({ label, ext }: { label: string; ext: string }) {
  return (
    <button className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/50 transition-all hover:border-white/[0.10] hover:text-white/70">
      <Upload className="h-3.5 w-3.5 shrink-0 text-white/30" />
      <span className="flex-1 text-left">{label}</span>
      <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/30">{ext}</span>
    </button>
  );
}

// ─── Color swatch picker ────────────────────────────────────────────────────
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/40">{label}</span>
      <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/[0.10] overflow-hidden">
        <span className="absolute inset-0 rounded-lg" style={{ background: value }} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
      </label>
    </div>
  );
}

// ─── Slider row ─────────────────────────────────────────────────────────────
function SliderRow({
  label, value, onChange, min = 0, max = 100, steps, unit = "%",
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; steps?: string[]; unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs text-white/30">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500"
      />
      {steps && (
        <div className="flex justify-between">
          {steps.map((s) => <span key={s} className="text-[10px] text-white/20">{s}</span>)}
        </div>
      )}
    </div>
  );
}

// ─── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-white/50">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-violet-500/60" : "bg-white/[0.08]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function CustomizePage() {
  // State
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [bgEffect, setBgEffect] = useState("none");
  const [usernameEffect, setUsernameEffect] = useState("None");
  const [opacity, setOpacity] = useState(80);
  const [blur, setBlur] = useState(0);
  const [accentColor, setAccentColor] = useState("#8b519c");
  const [textColor, setTextColor] = useState("#fafafa");
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [primaryColor, setPrimaryColor] = useState("#8b519c");
  const [secondaryColor, setSecondaryColor] = useState("#c5a8ce");
  const [disableGradient, setDisableGradient] = useState(false);
  const [glowUsername, setGlowUsername] = useState(false);
  const [glowSocials, setGlowSocials] = useState(false);
  const [glowBadges, setGlowBadges] = useState(false);
  const [discordPresence, setDiscordPresence] = useState(false);

  return (
    <div className="flex h-full gap-6 p-8">
      {/* ── Left panel (controls) ── */}
      <div className="flex w-full max-w-[420px] flex-col gap-4 overflow-y-auto pb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Customize</h1>
          <p className="mt-1 text-sm text-white/30">Personalize your public profile page.</p>
        </div>

        {/* Assets Uploader */}
        <Section title="Assets Uploader" icon={<Upload className="h-4 w-4" />}>
          <div className="space-y-2">
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/25">Background</p>
              <UploadBtn label="Click to upload a background" ext=".MP4" />
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/25">Audio</p>
              <UploadBtn label="Click to open audio manager" ext=".MP3" />
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/25">Profile Avatar</p>
              <UploadBtn label="Click to upload a file" ext="IMG" />
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/25">Custom Cursor</p>
              <div className="flex items-center gap-2 opacity-50">
                <UploadBtn label="Upgrade to Premium" ext=".CUR" />
                <span className="shrink-0 rounded-lg bg-violet-500/10 p-1.5">
                  <Lock className="h-3 w-3 text-violet-400" />
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* General Customization */}
        <Section title="General Customization" icon={<Type className="h-4 w-4" />}>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/25">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write something about yourself..."
                className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/70 outline-none placeholder:text-white/20 focus:border-white/20 transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/25">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, USA"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-9 pr-3.5 text-sm text-white/70 outline-none placeholder:text-white/20 focus:border-white/20 transition-colors"
                />
              </div>
            </div>
            <Toggle label="Discord Presence" checked={discordPresence} onChange={setDiscordPresence} />
          </div>
        </Section>

        {/* Background Effects */}
        <Section title="Background Effects" icon={<Zap className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-2">
            {BG_EFFECTS.map((e) => (
              <button
                key={e.id}
                disabled={e.premium}
                onClick={() => !e.premium && setBgEffect(e.id)}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-xl border py-3 text-xs font-medium transition-all ${
                  bgEffect === e.id
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : e.premium
                    ? "border-white/[0.04] bg-white/[0.01] text-white/20 cursor-not-allowed"
                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.10] hover:text-white/60"
                }`}
              >
                {e.premium && (
                  <Lock className="absolute right-1.5 top-1.5 h-2.5 w-2.5 text-violet-400/50" />
                )}
                {e.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Username Effects */}
        <Section title="Username Effects" icon={<Sparkles className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-2">
            {USERNAME_EFFECTS.map((fx) => (
              <button
                key={fx}
                onClick={() => setUsernameEffect(fx)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                  usernameEffect === fx
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.10]"
                }`}
              >
                {fx}
              </button>
            ))}
          </div>
        </Section>

        {/* Profile Opacity & Blur */}
        <Section title="Profile Opacity & Blur" icon={<Sliders className="h-4 w-4" />}>
          <div className="space-y-4">
            <SliderRow
              label="Profile Opacity" value={opacity} onChange={setOpacity}
              steps={["0%", "20%", "50%", "80%", "100%"]}
            />
            <SliderRow
              label="Profile Blur" value={blur} onChange={setBlur}
              max={80} unit="px" steps={["0px", "20px", "50px", "80px"]}
            />
          </div>
        </Section>

        {/* Glow Settings */}
        <Section title="Glow Settings" icon={<Eye className="h-4 w-4" />} defaultOpen={false}>
          <div className="space-y-1">
            <Toggle label="Username Glow" checked={glowUsername} onChange={setGlowUsername} />
            <Toggle label="Socials Glow" checked={glowSocials} onChange={setGlowSocials} />
            <Toggle label="Badges Glow" checked={glowBadges} onChange={setGlowBadges} />
          </div>
        </Section>

        {/* Color Customization */}
        <Section title="Color Customization" icon={<Palette className="h-4 w-4" />} defaultOpen={false}>
          <div className="space-y-3">
            <ColorPicker label="Accent Color" value={accentColor} onChange={setAccentColor} />
            <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
            <ColorPicker label="Background Color" value={bgColor} onChange={setBgColor} />
            <ColorPicker label="Icon Color" value={iconColor} onChange={setIconColor} />
            <div className="my-2 h-px bg-white/[0.04]" />
            <Toggle label="Disable Profile Gradient" checked={disableGradient} onChange={setDisableGradient} />
            <ColorPicker label="Primary Gradient Color" value={primaryColor} onChange={setPrimaryColor} />
            <ColorPicker label="Secondary Gradient Color" value={secondaryColor} onChange={setSecondaryColor} />
          </div>
        </Section>

        {/* Save */}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500/20 py-3 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/30 active:scale-[0.98]">
          Save Changes
        </button>
      </div>

      {/* ── Right panel (live preview) ── */}
      <div className="sticky top-8 hidden flex-1 self-start lg:block">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-white/30">Live Preview</span>
          <a
            href="/user"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/50"
          >
            <ExternalLink className="h-3 w-3" /> View page
          </a>
        </div>

        {/* Preview card */}
        <div
          className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06]"
          style={{ background: bgColor }}
        >
          {/* BG effect overlay placeholder */}
          {bgEffect !== "none" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-white/20 uppercase tracking-widest">{bgEffect} effect</span>
            </div>
          )}

          {/* Profile card */}
          <div
            className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] p-6 text-center"
            style={{
              background: disableGradient
                ? "rgba(20,20,20,0.85)"
                : `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}11)`,
              opacity: opacity / 100,
              backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
              color: textColor,
            }}
          >
            {/* Avatar */}
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full border-2"
              style={{ borderColor: accentColor + "66", background: accentColor + "22" }}
            >
              <span className="text-2xl text-white/30">👤</span>
            </div>

            {/* Username */}
            <div>
              <p
                className={`text-lg font-bold ${
                  usernameEffect === "Rainbow"
                    ? "bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent"
                    : usernameEffect === "Gradient"
                    ? "bg-gradient-to-r bg-clip-text text-transparent"
                    : ""
                }`}
                style={{
                  ...(usernameEffect === "Gradient"
                    ? { backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }
                    : {}),
                  color: usernameEffect === "Rainbow" || usernameEffect === "Gradient" ? undefined : textColor,
                  textShadow: glowUsername ? `0 0 12px ${accentColor}` : undefined,
                }}
              >
                username
              </p>
              {description && (
                <p className="mt-1 max-w-[200px] text-xs" style={{ color: textColor + "99" }}>
                  {description}
                </p>
              )}
              {location && (
                <p className="mt-1 flex items-center justify-center gap-1 text-xs" style={{ color: textColor + "66" }}>
                  <MapPin className="h-3 w-3" /> {location}
                </p>
              )}
            </div>

            {/* Socials placeholder */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08]"
                  style={{ background: accentColor + "22", borderColor: accentColor + "44" }}
                >
                  <span className="h-3.5 w-3.5 rounded bg-white/10" />
                </div>
              ))}
            </div>

            {/* Links placeholder */}
            <div className="w-full space-y-1.5">
              {["Link One", "Link Two"].map((l) => (
                <div
                  key={l}
                  className="flex items-center justify-center rounded-xl border px-4 py-2 text-xs"
                  style={{
                    borderColor: accentColor + "44",
                    background: accentColor + "11",
                    color: textColor + "cc",
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
