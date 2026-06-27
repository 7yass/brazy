"use client";

import { useState } from "react";
import { Upload, Music, User, MousePointer2 } from "lucide-react";

// ── exact guns.lol CSS tokens ────────────────────────────────────────────────
// card:        bg #111111  padding:25px  border-radius:15px  gap:25px
// section h1:  font-size:19px  font-weight:500  color:#fafafa  margin:0
// sub-label:   font-size:16px  font-weight:500  color:#989898  margin:0 0 8px 3px
// btn:         padding:10px  border-radius:15px  bg rgb(49,49,49)  border:2px solid transparent
//              hover border:#454545  active translateY(4px)  font-size:15px font-weight:500
// upload row:  bg #131313  border:#191919  padding:9px 14px  gap:8px  border-radius:15px
//              hover border:#1d1d1d  active translateY(4px)  font-size:14px
// accordion:   plain flex row justify-between, no bg/border, svg font-size:30px color:#e0e0e0
//              active translateY(4px)
// toggle:      pill, active #9849ac, inactive #232323
// slider stop: bg:#171717 border:#202020 border-radius:15px, active purple
// input:       bg:#1a1a1a border:#1f1f1f border-radius:15px

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: "#111111",
      borderRadius: 15,
      padding: 25,
      display: "flex",
      flexDirection: "column",
      gap: 25,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ margin: 0, fontSize: 19, fontWeight: 500, color: "#fafafa" }}>
      {children}
    </h1>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ margin: "0 0 8px 3px", fontSize: 16, fontWeight: 500, color: "#989898" }}>
      {children}
    </h1>
  );
}

// The standard guns.lol button: bg rgb(49,49,49), border transparent → #454545 on hover, translateY(4px) on active
function Btn({
  children, onClick, red = false,
}: {
  children: React.ReactNode; onClick?: () => void; red?: boolean;
}) {
  const [active, setActive] = useState(false);
  const [hover, setHover]   = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: 15,
        border: `2px solid ${
          red
            ? hover ? "rgba(255,56,56,.55)" : "rgba(255,56,56,.33)"
            : hover ? "#454545" : "transparent"
        }`,
        backgroundColor: red
          ? hover ? "rgba(255,56,56,.3)" : "rgba(255,56,56,.18)"
          : "rgb(49,49,49)",
        color: "#fafafa",
        fontFamily: "Satoshi, sans-serif",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        transition: ".25s",
        transform: active ? "translateY(4px)" : "none",
        boxSizing: "border-box",
      }}
    >
      {children}
    </button>
  );
}

// Upload row: bg #131313, border #191919, padding 9px 14px, gap 8, font-size 14
function UploadRow({
  icon, label, sub,
}: {
  icon: React.ReactNode; label: string; sub: string;
}) {
  const [active, setActive] = useState(false);
  const [hover, setHover]   = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 14px",
        backgroundColor: "#131313",
        border: `2px solid ${hover ? "#1d1d1d" : "#191919"}`,
        borderRadius: 15,
        cursor: "pointer",
        transition: ".25s",
        transform: active ? "translateY(4px)" : "none",
        userSelect: "none",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#101010",
        border: "2px solid #1b1b1b",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#f2f2f2", fontFamily: "Satoshi, sans-serif" }}>{label}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#5a5a5a", marginTop: 1, fontFamily: "Satoshi, sans-serif" }}>{sub}</p>
      </div>
    </div>
  );
}

// Accordion: plain flex row, no bg/border, just text + ▲▼ svg 30px, active translateY(4px)
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen]   = useState(false);
  const [active, setActive] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        onClick={() => setOpen(!open)}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onMouseLeave={() => setActive(false)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          color: "#fafafa",
          transition: ".25s",
          transform: active ? "translateY(4px)" : "none",
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, fontFamily: "Satoshi, sans-serif" }}>{title}</span>
        {/* guns.lol uses two stacked small triangles (▲▼) as a single svg at 30px */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ width: 30, height: 30, color: "#e0e0e0", flexShrink: 0 }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 4 18 9" />
          <polyline points="6 15 12 20 18 15" />
        </svg>
      </div>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Toggle pill
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: 46,
        height: 26,
        borderRadius: 999,
        border: `2px solid ${checked ? "#9849ac" : "#2d2d2d"}`,
        backgroundColor: checked ? "#9849ac" : "#232323",
        cursor: "pointer",
        transition: ".25s",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 2,
        left: checked ? 22 : 2,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: "#fafafa",
        transition: ".25s",
      }} />
    </div>
  );
}

// Color picker row
function ColorRow({ label }: { label: string }) {
  const [color, setColor] = useState("#ffffff");
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      backgroundColor: "#151515",
      border: "2px solid #1b1b1b",
      borderRadius: 15,
    }}>
      <span style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", fontFamily: "Satoshi, sans-serif" }}>{label}</span>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <span style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          border: "2px solid #2a2a2a",
          backgroundColor: color,
          display: "block",
        }} />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
        />
        <span style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>{color.toUpperCase()}</span>
      </label>
    </div>
  );
}

// Slider with preset stops
function SliderRow({
  label, unit, stops, min = 0, max = 100,
}: {
  label: string; unit: string; stops: number[]; min?: number; max?: number;
}) {
  const [val, setVal] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <SubLabel>{label}</SubLabel>
      <div style={{ display: "flex", gap: 7 }}>
        {stops.map((s) => {
          const [active, setActive] = useState(false);
          const sel = val === s;
          return (
            <button
              key={s}
              onMouseDown={() => setActive(true)}
              onMouseUp={() => { setActive(false); setVal(s); }}
              onMouseLeave={() => setActive(false)}
              onClick={() => setVal(s)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 15,
                border: `2px solid ${sel ? "#9849ac55" : "#202020"}`,
                backgroundColor: sel ? "#9849ac33" : "#171717",
                color: sel ? "#d283eb" : "#888",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "Satoshi, sans-serif",
                cursor: "pointer",
                transition: ".25s",
                transform: active ? "translateY(4px)" : "none",
              }}
            >
              {s}{unit}
            </button>
          );
        })}
      </div>
      <input
        type="range" min={min} max={max} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#9849ac", cursor: "pointer" }}
      />
    </div>
  );
}

// Text input
function TextInput({
  placeholder, value, onChange,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 15,
        border: "2px solid #1f1f1f",
        backgroundColor: "#1a1a1a",
        color: "#e8e8e8",
        fontSize: 15,
        fontWeight: 500,
        fontFamily: "Satoshi, sans-serif",
        outline: "none",
        boxSizing: "border-box",
        transition: ".25s",
      }}
    />
  );
}

// Toggle row (label + toggle)
function ToggleRow({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      backgroundColor: "#151515",
      border: "2px solid #1b1b1b",
      borderRadius: 15,
    }}>
      <span style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", fontFamily: "Satoshi, sans-serif" }}>{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CustomizePage() {
  const [description, setDescription] = useState("");
  const [location, setLocation]       = useState("");
  const [disableGradient, setDGrad]   = useState(false);
  const [glowUsername, setGlowUser]   = useState(false);
  const [glowSocials, setGlowSoc]     = useState(false);
  const [glowBadges, setGlowBadge]    = useState(false);

  return (
    <div style={{
      padding: 30,
      display: "flex",
      flexDirection: "column",
      gap: 25,
      fontFamily: "Satoshi, sans-serif",
    }}>

      {/* ── Assets Uploader ── */}
      <Card>
        <SectionTitle>Assets Uploader</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 13.5, gap: 10 }}>
          <UploadRow icon={<Upload size={19} color="#888" />} label="Background" sub=".MP4" />
          <UploadRow icon={<Music size={19} color="#888" />} label="Audio" sub="Click to open audio manager" />
          <UploadRow icon={<User size={19} color="#888" />} label="Profile Avatar" sub="Click to upload a file" />
          <UploadRow icon={<MousePointer2 size={19} color="#888" />} label="Custom Cursor" sub=".CUR" />
        </div>
      </Card>

      {/* ── General Customization ── */}
      <Card>
        <SectionTitle>General Customization</SectionTitle>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <SubLabel>Description</SubLabel>
          <TextInput
            placeholder="Write something about yourself…"
            value={description}
            onChange={setDescription}
          />
          <p style={{ margin: "4px 0 0 3px", fontSize: 13, color: "#555" }}>
            Typewriter in{" "}
            <span style={{ color: "#d283eb", fontWeight: 700 }}>Premium</span>{" "}
            is already enabled.
          </p>
        </div>

        {/* Discord Presence */}
        <Accordion title="Discord Presence">
          <Btn>Connect Discord</Btn>
        </Accordion>

        {/* Background Effects */}
        <Accordion title="Background Effects">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Particles", "Snow", "Rain", "Stars", "Matrix", "Bubbles"].map((fx) => (
              <Btn key={fx}>{fx}</Btn>
            ))}
          </div>
        </Accordion>

        {/* Username Effects */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SubLabel>Username Effects</SubLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Glitch", "Rainbow", "Shadow", "Neon", "Gradient"].map((fx) => (
              <Btn key={fx}>{fx}</Btn>
            ))}
          </div>
        </div>

        {/* Profile Opacity */}
        <SliderRow label="Profile Opacity" unit="%" stops={[0, 20, 50, 80]} min={0} max={100} />

        {/* Profile Blur */}
        <SliderRow label="Profile Blur" unit="px" stops={[0, 20, 50, 80]} min={0} max={80} />

        {/* Location */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <SubLabel>Location</SubLabel>
          <TextInput placeholder="e.g. New York, USA" value={location} onChange={setLocation} />
        </div>

        {/* Glow Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SubLabel>Glow Settings</SubLabel>
          <ToggleRow label="Username" checked={glowUsername} onChange={setGlowUser} />
          <ToggleRow label="Socials"  checked={glowSocials}  onChange={setGlowSoc}  />
          <ToggleRow label="Badges"   checked={glowBadges}   onChange={setGlowBadge} />
        </div>
      </Card>

      {/* ── Color Customization ── */}
      <Card>
        <SectionTitle>Color Customization</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Accent Color", "Text Color", "Background Color", "Icon Color", "Background Effect Color"].map((c) => (
            <ColorRow key={c} label={c} />
          ))}
        </div>
        <ToggleRow label="Disable Profile Gradient" checked={disableGradient} onChange={setDGrad} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <ColorRow label="Primary Color" />
          <ColorRow label="Secondary Color" />
        </div>
      </Card>

      {/* ── Other Customization ── */}
      <Card>
        <SectionTitle>Other Customization</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 12, gap: 10 }}>
          <Btn>Custom Domain</Btn>
          <Btn>SEO Settings</Btn>
          <Btn>
            Custom CSS{" "}
            <span style={{
              marginLeft: 6,
              fontSize: 11,
              background: "linear-gradient(90deg,#d283eb,#e3b5f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}>PREMIUM</span>
          </Btn>
          <Btn red>Reset Profile</Btn>
        </div>
      </Card>

    </div>
  );
}
