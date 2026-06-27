"use client";

import { useState } from "react";

// ── Shared tokens ────────────────────────────────────────────────
const font = "Satoshi, sans-serif";

// Section wrapper (white title bar + inner content)
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* title bar */}
      <span style={{
        fontSize: 15, fontWeight: 600, color: "#fafafa",
        fontFamily: font, marginBottom: 14,
      }}>
        {label}
      </span>
      {/* content card */}
      <div style={{
        backgroundColor: "#111111",
        borderRadius: 18,
        padding: "20px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        {children}
      </div>
    </div>
  );
}

// Feature cell: label on top, control below
function Cell({ label, children, tooltip }: { label: string; children: React.ReactNode; tooltip?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#c8c8c8", fontFamily: font }}>
          {label}
        </h1>
        {tooltip && (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" style={{ flexShrink: 0, opacity: 0.5 }}>
            <path fill="#fff" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12m8-48.72v.72a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8c13.23 0 24-9 24-20s-10.77-20-24-20s-24 9-24 20v4a8 8 0 0 1-16 0v-4c0-19.85 17.94-36 40-36s40 16.15 40 36c0 17.38-13.76 31.93-32 35.28" />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}

// Dropdown select (Discord Presence, Background Effects, Username Effects)
function Dropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 12px", borderRadius: 12,
          backgroundColor: "#171717", border: "2px solid #232323",
          color: "#e0e0e0", fontFamily: font, fontSize: 14, fontWeight: 500,
          cursor: "pointer", transition: ".25s",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* discord/fx icon placeholder */}
          <span style={{ width: 16, height: 16, opacity: 0.6, display: "flex", alignItems: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path fill="currentColor" d="m24.95 42.36l5.466-11.99l12.689-3.72l-9.767-8.88l.368-13.163l-11.502 6.503l-12.46-4.416l2.657 12.9l-8.069 10.433l13.145 1.47z" />
              <path d="m36.178 36.054l8 7.964" />
            </svg>
          </span>
          {value}
        </span>
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, color: "#888" }}>
          <path d="M3.135 6.158C3.324 5.957 3.64 5.946 3.842 6.135L7.5 9.565L11.158 6.135c.2-.19.516-.179.706.023c.189.2.179.516-.023.706l-4 3.75a.5.5 0 0 1-.682 0l-4-3.75a.5.5 0 0 1-.024-.706Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          backgroundColor: "#171717", border: "2px solid #232323", borderRadius: 12,
          listStyle: "none", margin: 0, padding: "4px 0",
          zIndex: 50, maxHeight: 240, overflowY: "auto",
        }}>
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "9px 12px", cursor: "pointer", fontSize: 14,
                fontFamily: font, color: opt === value ? "#d283eb" : "#e0e0e0",
                backgroundColor: opt === value ? "#9849ac22" : "transparent",
                transition: ".15s",
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Color input row (swatch + hex text input + pencil button)
function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      backgroundColor: "#1a1a1a", border: "2px solid #232323",
      borderRadius: 12, padding: "7px 10px",
    }}>
      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
        <span style={{
          width: 20, height: 20, borderRadius: 6, display: "block",
          backgroundColor: value.startsWith("#") ? value : `#${value}`,
          border: "1.5px solid #333", flexShrink: 0,
        }} />
        <input type="color" value={value.startsWith("#") ? value : `#${value}`}
          onChange={(e) => onChange(e.target.value.replace("#", ""))}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
      </label>
      <input
        type="text" value={value} maxLength={7}
        onChange={(e) => onChange(e.target.value.replace("#", ""))}
        placeholder="Pick a color"
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: "#e0e0e0", fontFamily: font, fontSize: 13, fontWeight: 500,
        }}
      />
      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#888", display: "flex" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 3.56a2.26 2.26 0 0 0-3.18 0l-2.05 2.05l-.48-.48a.75.75 0 0 0-1.06 0l-1 1a.75.75 0 0 0 0 1.06l.48.48l-6.8 6.8a2.5 2.5 0 0 0-.66 1.15l-.54 2.06a1 1 0 0 0 1.21 1.21l2.06-.54a2.5 2.5 0 0 0 1.15-.66l6.8-6.8l.48.48a.75.75 0 0 0 1.06 0l1-1a.75.75 0 0 0 0-1.06l-.48-.48l2.05-2.05a2.26 2.26 0 0 0 0-3.18Z" />
        </svg>
      </button>
    </div>
  );
}

// Toggle pill (purple when on, grey when off)
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "fit-content" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: "relative", width: 44, height: 24, borderRadius: 999,
        backgroundColor: checked ? "#9849ac" : "#2a2a2a",
        border: `2px solid ${checked ? "#9849ac" : "#333"}`,
        display: "block", transition: ".25s", flexShrink: 0,
      }}>
        <span style={{
          position: "absolute", top: 2,
          left: checked ? 20 : 2,
          width: 16, height: 16, borderRadius: "50%",
          backgroundColor: "#fafafa", transition: ".25s", display: "block",
        }} />
      </span>
    </label>
  );
}

// Glow button (star icon + label, green-tinted like the screenshot)
function GlowBtn({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "9px 14px", borderRadius: 12,
        backgroundColor: active ? "#1a2e1a" : hover ? "#1c1c1c" : "#181818",
        border: `2px solid ${active ? "#2d5e2d" : hover ? "#2a2a2a" : "#222"}`,
        color: active ? "#7ec87e" : "#c8c8c8", fontFamily: font, fontSize: 14, fontWeight: 500,
        cursor: "pointer", transition: ".2s", flex: 1,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 32" fill="currentColor">
        <path d="m17.565 3.324l1.726 3.72c.326.694.967 1.18 1.717 1.29l4.056.624c1.835.278 2.575 2.53 1.293 3.859L23.268 16a2.28 2.28 0 0 0-.612 1.964l.71 4.374c.307 1.885-1.687 3.293-3.354 2.37l-3.405-1.894a2.25 2.25 0 0 0-2.21 0l-3.404 1.895c-1.668.922-3.661-.486-3.355-2.37l.71-4.375A2.28 2.28 0 0 0 7.736 16l-3.088-3.184c-1.293-1.34-.543-3.581 1.293-3.859l4.055-.625a2.3 2.3 0 0 0 1.717-1.29l1.727-3.719c.819-1.765 3.306-1.765 4.124 0" />
      </svg>
      {label}
    </button>
  );
}

// Slider with tick marks below (20%, 50%, 80% or 20px, 50px, 80px)
function SliderWithTicks({ stops, unit, max }: { stops: number[]; unit: string; max: number }) {
  const [val, setVal] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ position: "relative", paddingBottom: 20 }}>
        <input type="range" min={0} max={max} value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#9849ac", cursor: "pointer" } as React.CSSProperties}
        />
        <div style={{ position: "relative", height: 18 }}>
          {stops.map((s) => {
            const pct = (s / max) * 100;
            return (
              <span key={s} style={{
                position: "absolute", left: `${pct}%`, transform: "translateX(-50%)",
                fontSize: 11, color: "#666", fontFamily: font,
              }}>
                {s}{unit}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Upload box (for Assets Uploader — square with icon + label)
function UploadBox({ label, sub, icon }: { label: string; sub: string; icon: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#aaa", fontFamily: font }}>{label}</span>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundColor: hover ? "#181818" : "#141414",
          border: "2px solid #1e1e1e",
          borderRadius: 14, cursor: "pointer", transition: ".2s",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 8, padding: "28px 12px", minHeight: 120,
        }}
      >
        <div style={{ color: "#555", fontSize: 32 }}>{icon}</div>
        <h1 style={{ margin: 0, fontSize: 13, color: "#666", fontFamily: font, fontWeight: 400, textAlign: "center" }}>{sub}</h1>
      </div>
    </div>
  );
}

// Location input with pin icon
function LocationInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#1a1a1a", border: "2px solid #1f1f1f", borderRadius: 12,
      padding: "9px 12px",
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="4 2 16 20" fill="currentColor" style={{ color: "#777", flexShrink: 0 }}>
        <path d="M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12m0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22" />
      </svg>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="My Location" autoCorrect="off"
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: "#e0e0e0", fontFamily: font, fontSize: 14, fontWeight: 500,
        }}
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function CustomizePage() {
  // Assets
  // General
  const [discordPresence, setDiscordPresence] = useState("Enabled");
  const [bgEffect, setBgEffect]               = useState("Blurred Background");
  const [usernameEffect, setUsernameEffect]   = useState("Username Effects");
  const [location, setLocation]               = useState("italy");
  const [glowUsername, setGlowUsername]       = useState(true);
  const [glowSocials, setGlowSocials]         = useState(true);
  const [glowBadges, setGlowBadges]           = useState(false);
  // Colors
  const [cAccent, setCAccent]   = useState("000000");
  const [cText, setCText]       = useState("000000");
  const [cBg, setCBg]           = useState("000000");
  const [cIcon, setCIcon]       = useState("000000");
  const [cFx, setCFx]           = useState("000000");
  const [cPrimary, setCPrimary] = useState("000000");
  const [cSecond, setCSecond]   = useState("ffffff");
  // Other
  const [monoIcons, setMonoIcons]     = useState(true);
  const [animTitle, setAnimTitle]     = useState(true);
  const [swapColors, setSwapColors]   = useState(true);
  const [volumeCtrl, setVolumeCtrl]   = useState(false);
  const [discordAva, setDiscordAva]   = useState(false);
  const [avaDecor, setAvaDecor]       = useState(true);

  const bgFxOptions = ["None", "Dither", "Plasma", "Aurora", "Snowflakes", "Rain", "Blurred Background", "Night Time", "Old TV"];
  const discordOptions = ["Enabled", "Disabled"];

  return (
    <div style={{ padding: "28px 28px", display: "flex", flexDirection: "column", gap: 28, fontFamily: font }}>

      {/* ── Assets Uploader ── */}
      <Section label="Assets Uploader">
        {/* 4-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <UploadBox label="Background" sub=".MP4" icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm0 2H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm-6 3l5 3l-5 3z" />
            </svg>
          } />
          <UploadBox label="Audio" sub="Click to open audio manager" icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#ffffff55">
              <path d="M14 22v-3.075l5.525-5.5q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55t-.1.563t-.325.512l-5.5 5.5zm6.575-5.6l.925-.975l-.925-.925l-.95.95zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v3.3q-.35-.15-.725-.225t-.75-.075q-.7 0-1.312.25T18.1 12L12 18.1V20z" />
            </svg>
          } />
          <UploadBox label="Profile Avatar" sub="Click to upload a file" icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm2-4h10q.3 0 .45-.275t-.05-.525l-2.75-3.675q-.15-.2-.4-.2t-.4.2L11.25 16L9.4 13.525q-.15-.2-.4-.2t-.4.2l-2 2.675q-.2.25-.05.525T7 17" />
            </svg>
          } />
          <UploadBox label="Custom Cursor" sub=".CUR" icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 7l10 10M7 17L17 7" />
            </svg>
          } />
        </div>
      </Section>

      {/* ── General Customization ── */}
      <Section label="General Customization">
        {/* Row 1: Description | Discord Presence | Profile Opacity ? | Profile Blur ? */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.2fr 1.2fr", gap: 20 }}>
          {/* Description */}
          <Cell label="Description">
            <div style={{
              backgroundColor: "#161616", border: "2px solid #1e1e1e", borderRadius: 12,
              padding: "10px 12px", minHeight: 70,
            }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "#aaa", fontFamily: font }}>
                Typewriter in{" "}
                <a href="/premium" style={{ background: "linear-gradient(90deg,#d283eb,#e3b5f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, textDecoration: "none" }}>
                  Premium
                </a>
                {" "}is already enabled.
              </p>
            </div>
          </Cell>

          {/* Discord Presence */}
          <Cell label="Discord Presence">
            <Dropdown value={discordPresence} onChange={setDiscordPresence} options={discordOptions} />
          </Cell>

          {/* Profile Opacity */}
          <Cell label="Profile Opacity" tooltip>
            <SliderWithTicks stops={[20, 50, 80]} unit="%" max={100} />
          </Cell>

          {/* Profile Blur */}
          <Cell label="Profile Blur" tooltip>
            <SliderWithTicks stops={[20, 50, 80]} unit="px" max={80} />
          </Cell>
        </div>

        {/* Row 2: Background Effects | Username Effects | Location | Glow Settings */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.2fr 1.2fr", gap: 20 }}>
          {/* Background Effects */}
          <Cell label="Background Effects">
            <Dropdown value={bgEffect} onChange={setBgEffect} options={bgFxOptions} />
          </Cell>

          {/* Username Effects */}
          <Cell label="Username Effects">
            <Dropdown value={usernameEffect} onChange={setUsernameEffect} options={["None", "Glitch", "Rainbow", "Shadow", "Neon", "Gradient", "Username Effects"]} />
          </Cell>

          {/* Location */}
          <Cell label="Location">
            <LocationInput value={location} onChange={setLocation} />
          </Cell>

          {/* Glow Settings */}
          <Cell label="Glow Settings" tooltip>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <GlowBtn label="Username" active={glowUsername} onClick={() => setGlowUsername(!glowUsername)} />
                <GlowBtn label="Socials"  active={glowSocials}  onClick={() => setGlowSocials(!glowSocials)} />
              </div>
              <GlowBtn label="Badges" active={glowBadges} onClick={() => setGlowBadges(!glowBadges)} />
            </div>
          </Cell>
        </div>
      </Section>

      {/* ── Color Customization ── */}
      <Section label="Color Customization">
        {/* Row 1: Accent | Text | (empty) | Disable Profile Gradient */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, alignItems: "start" }}>
          <Cell label="Accent Color"><ColorInput value={cAccent} onChange={setCAccent} /></Cell>
          <Cell label="Text Color"><ColorInput value={cText} onChange={setCText} /></Cell>
          <div />
          {/* Disable Profile Gradient — full width button */}
          <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
            <button style={{
              width: "100%", padding: "11px 16px", borderRadius: 12,
              backgroundColor: "#1a2e1a", border: "2px solid #2d5e2d",
              color: "#aaccaa", fontFamily: font, fontSize: 14, fontWeight: 500,
              cursor: "pointer", transition: ".2s",
            }}>
              Disable Profile Gradient
            </button>
          </div>
        </div>

        {/* Row 2: Background | Icon | (empty) | Primary | Secondary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, alignItems: "start" }}>
          <Cell label="Background Color"><ColorInput value={cBg} onChange={setCBg} /></Cell>
          <Cell label="Icon Color"><ColorInput value={cIcon} onChange={setCIcon} /></Cell>
          <div />
          <Cell label="Primary Color"><ColorInput value={cPrimary} onChange={setCPrimary} /></Cell>
        </div>

        {/* Row 3: Background Effect Color | (empty x2) | Secondary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, alignItems: "start" }}>
          <Cell label="Background Effect Color"><ColorInput value={cFx} onChange={setCFx} /></Cell>
          <div /><div />
          <Cell label="Secondary Color"><ColorInput value={cSecond} onChange={setCSecond} /></Cell>
        </div>
      </Section>

      {/* ── Other Customization ── */}
      <Section label="Other Customization">
        {/* Row 1: 3 toggles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <ToggleCell label="Monochrome Icons" tooltip checked={monoIcons} onChange={setMonoIcons} />
          <ToggleCell label="Animated Title" checked={animTitle} onChange={setAnimTitle} />
          <ToggleCell label="Swap Box Colors" tooltip checked={swapColors} onChange={setSwapColors} />
        </div>
        {/* Row 2: 3 toggles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <ToggleCell label="Volume Control" checked={volumeCtrl} onChange={setVolumeCtrl} />
          <ToggleCell label="Use Discord Avatar" checked={discordAva} onChange={setDiscordAva} />
          <ToggleCell label="Discord Avatar Decoration" checked={avaDecor} onChange={setAvaDecor} />
        </div>
      </Section>

    </div>
  );
}

// Toggle cell (label + toggle on same line, used in Other Customization)
function ToggleCell({ label, checked, onChange, tooltip }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; tooltip?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#c8c8c8", fontFamily: "Satoshi, sans-serif" }}>
          {label}
        </h1>
        {tooltip && (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" style={{ flexShrink: 0, opacity: 0.5 }}>
            <path fill="#fff" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12m8-48.72v.72a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8c13.23 0 24-9 24-20s-10.77-20-24-20s-24 9-24 20v4a8 8 0 0 1-16 0v-4c0-19.85 17.94-36 40-36s40 16.15 40 36c0 17.38-13.76 31.93-32 35.28" />
          </svg>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
