"use client";

import { useState } from "react";
import { Upload, Music, User, MousePointer2 } from "lucide-react";

const S = {
  card: {
    backgroundColor: "#111111",
    borderRadius: 15,
    textAlign: "left" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: 25,
    padding: 25,
  },
  cardTitle: {
    margin: 0,
    fontSize: 19,
    color: "#fafafa",
    fontWeight: 500,
    fontFamily: "Satoshi, sans-serif",
  },
  subLabel: {
    fontSize: 16,
    fontWeight: 500,
    margin: "0 0 8px 3px",
    color: "#989898",
    fontFamily: "Satoshi, sans-serif",
  },
  genList: {
    display: "flex",
    flexDirection: "column" as const,
    marginTop: 13.5,
    gap: 10,
  },
  genBtn: {
    color: "#fafafa",
    padding: "10px",
    borderRadius: 15,
    fontFamily: "Satoshi, sans-serif",
    fontWeight: 500,
    fontSize: 15,
    backgroundColor: "rgb(49,49,49)",
    border: "2px solid transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: ".25s",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  otherBtn: {
    textAlign: "center" as const,
    color: "#fafafa",
    padding: "10px",
    backgroundColor: "#191919",
    border: "2px solid #202020",
    borderRadius: 15,
    cursor: "pointer",
    transition: ".25s",
    fontFamily: "Satoshi, sans-serif",
    fontWeight: 500,
    fontSize: 15,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    boxSizing: "border-box" as const,
  },
  resetBtn: {
    backgroundColor: "#ff000044",
    border: "2px solid #ff000033",
    borderRadius: 15,
    padding: "10px",
    color: "#fafafa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    transition: ".25s",
    fontFamily: "Satoshi, sans-serif",
    fontWeight: 500,
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box" as const,
  },
  uploadRow: {
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    padding: "9px 14px",
    backgroundColor: "#131313",
    border: "2px solid #191919",
    borderRadius: 15,
    color: "#f2f2f2",
    fontFamily: "Satoshi, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: ".25s",
    userSelect: "none" as const,
    width: "100%",
    boxSizing: "border-box" as const,
  },
  uploadIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#101010",
    border: "2px solid #1b1b1b",
    flexShrink: 0,
  },
  accordionTrigger: {
    textDecoration: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    color: "#fafafa",
    transition: ".25s",
    userSelect: "none" as const,
  },
  colorRow: {
    textAlign: "left" as const,
    padding: 15,
    backgroundColor: "#151515",
    borderRadius: 15,
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 13,
  },
};

function Card({ children }: { children: React.ReactNode }) {
  return <div style={S.card}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h1 style={S.cardTitle}>{children}</h1>;
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <h1 style={S.subLabel}>{children}</h1>;
}

function GenBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hover, setHover]   = useState(false);
  const [active, setActive] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...S.genBtn,
        border: `2px solid ${hover ? "#454545" : "transparent"}`,
        transform: active ? "translateY(4px)" : "none",
      }}
    >
      {children}
    </span>
  );
}

function OtherBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hover, setHover]   = useState(false);
  const [active, setActive] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...S.otherBtn,
        border: `2px solid ${hover ? "#323232" : "#202020"}`,
        transform: active ? "translateY(4px)" : "none",
      }}
    >
      {children}
    </span>
  );
}

function ResetBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hover, setHover]   = useState(false);
  const [active, setActive] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...S.resetBtn,
        border: `2px solid ${hover ? "#ff000055" : "#ff000033"}`,
        transform: active ? "translateY(4px)" : "none",
      }}
    >
      {children}
    </span>
  );
}

function UploadRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  const [hover, setHover]   = useState(false);
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...S.uploadRow,
        border: `2px solid ${hover ? "#1d1d1d" : "#191919"}`,
        backgroundColor: hover ? "#181818" : "#131313",
        transform: active ? "translateY(4px)" : "none",
      }}
    >
      <div style={S.uploadIcon}>{icon}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "#fafafa", fontFamily: "Satoshi, sans-serif" }}>{label}</h1>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 450, color: "#9d9d9d", fontFamily: "Satoshi, sans-serif", lineHeight: 1.45 }}>{sub}</h3>
      </div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen]     = useState(false);
  const [active, setActive] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        onClick={() => setOpen(!open)}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onMouseLeave={() => setActive(false)}
        style={{
          ...S.accordionTrigger,
          transform: active ? "translateY(4px)" : "none",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, fontFamily: "Satoshi, sans-serif" }}>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ width: 30, height: 30, color: "#e0e0e0", flexShrink: 0 }}
          fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
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
        display: "block",
      }} />
    </div>
  );
}

function ColorRow({ label }: { label: string }) {
  const [color, setColor] = useState("#ffffff");
  return (
    <div style={S.colorRow}>
      <h1 style={{ margin: 0, fontSize: 16, fontWeight: 450, color: "#e6e6e6", fontFamily: "Satoshi, sans-serif" }}>{label}</h1>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}>
        <span style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          border: "2px solid #2a2a2a",
          backgroundColor: color,
          display: "block",
          flexShrink: 0,
        }} />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
      </label>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={S.colorRow}>
      <h1 style={{ margin: 0, fontSize: 16, fontWeight: 450, color: "#e6e6e6", fontFamily: "Satoshi, sans-serif" }}>{label}</h1>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function TextInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
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
      } as React.CSSProperties}
    />
  );
}

function StopBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [active, setActive] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      style={{
        padding: "8px 17px",
        backgroundColor: selected ? "#9849ac33" : "#171717",
        border: `2px solid ${selected ? "#9849ac55" : "#202020"}`,
        borderRadius: 15,
        display: "flex",
        cursor: "pointer",
        transition: ".25s",
        fontFamily: "Satoshi, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: selected ? "#d283eb" : "#888",
        transform: active ? "translateY(4px)" : "none",
        userSelect: "none",
      } as React.CSSProperties}
    >
      {label}
    </span>
  );
}

function SliderRow({ label, unit, stops, min = 0, max = 100 }: {
  label: string; unit: string; stops: number[]; min?: number; max?: number;
}) {
  const [val, setVal] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <SubLabel>{label}</SubLabel>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {stops.map((s) => (
          <StopBtn key={s} label={`${s}${unit}`} selected={val === s} onClick={() => setVal(s)} />
        ))}
      </div>
      <input
        type="range" min={min} max={max} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#9849ac", cursor: "pointer" } as React.CSSProperties}
      />
    </div>
  );
}

function DiscordBanner() {
  return (
    <div style={{
      color: "#fafafa",
      borderRadius: 15,
      backgroundImage: "url(https://assets.guns.lol/gradient_background.png)",
      border: "2px solid #9849ac3a",
      backgroundOrigin: "border-box",
      padding: 10,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ height: 20, width: 20 }} fill="#fafafa">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.072.072 0 0 0-.041-.1 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.1c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
      <a style={{ fontWeight: 450, textDecoration: "none", backgroundColor: "transparent", color: "#fafafa", marginLeft: 5, fontSize: 14, fontFamily: "Satoshi, sans-serif" }}>
        Connect Discord
      </a>
    </div>
  );
}

export default function CustomizePage() {
  const [description, setDescription] = useState("");
  const [location, setLocation]       = useState("");
  const [disableGradient, setDGrad]   = useState(false);
  const [glowUsername, setGlowUser]   = useState(false);
  const [glowSocials, setGlowSoc]     = useState(false);
  const [glowBadges, setGlowBadge]    = useState(false);

  return (
    <div style={{ padding: 30, display: "flex", flexDirection: "column", gap: 25, fontFamily: "Satoshi, sans-serif" }}>

      {/* Assets Uploader */}
      <Card>
        <SectionTitle>Assets Uploader</SectionTitle>
        <div style={S.genList}>
          <UploadRow icon={<Upload style={{ width: 23, height: 23, color: "#888" }} />}       label="Background"    sub=".MP4" />
          <UploadRow icon={<Music  style={{ width: 23, height: 23, color: "#888" }} />}       label="Audio"         sub="Click to open audio manager" />
          <UploadRow icon={<User   style={{ width: 23, height: 23, color: "#888" }} />}       label="Profile Avatar" sub="Click to upload a file" />
          <UploadRow icon={<MousePointer2 style={{ width: 23, height: 23, color: "#888" }} />} label="Custom Cursor" sub=".CUR" />
        </div>
      </Card>

      {/* General Customization */}
      <Card>
        <SectionTitle>General Customization</SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <SubLabel>Description</SubLabel>
          <TextInput placeholder="Write something about yourself…" value={description} onChange={setDescription} />
          <p style={{ margin: "4px 0 0 3px", fontSize: 13, color: "#555", fontFamily: "Satoshi, sans-serif" }}>
            Typewriter in{" "}
            <span style={{ background: "linear-gradient(90deg,#d283eb,#e3b5f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Premium</span>
            {" "}is already enabled.
          </p>
        </div>

        <Accordion title="Discord Presence">
          <DiscordBanner />
        </Accordion>

        <Accordion title="Background Effects">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Particles", "Snow", "Rain", "Stars", "Matrix", "Bubbles"].map((fx) => (
              <GenBtn key={fx}>{fx}</GenBtn>
            ))}
          </div>
        </Accordion>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <SubLabel>Username Effects</SubLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Glitch", "Rainbow", "Shadow", "Neon", "Gradient"].map((fx) => (
              <GenBtn key={fx}>{fx}</GenBtn>
            ))}
          </div>
        </div>

        <SliderRow label="Profile Opacity" unit="%"  stops={[0, 20, 50, 80]} min={0} max={100} />
        <SliderRow label="Profile Blur"    unit="px" stops={[0, 20, 50, 80]} min={0} max={80}  />

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <SubLabel>Location</SubLabel>
          <TextInput placeholder="e.g. New York, USA" value={location} onChange={setLocation} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <SubLabel>Glow Settings</SubLabel>
          <ToggleRow label="Username" checked={glowUsername} onChange={setGlowUser} />
          <ToggleRow label="Socials"  checked={glowSocials}  onChange={setGlowSoc}  />
          <ToggleRow label="Badges"   checked={glowBadges}   onChange={setGlowBadge} />
        </div>
      </Card>

      {/* Color Customization */}
      <Card>
        <SectionTitle>Color Customization</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <ColorRow label="Accent Color" />
          <ColorRow label="Text Color" />
          <ColorRow label="Background Color" />
          <ColorRow label="Icon Color" />
          <ColorRow label="Background Effect Color" />
        </div>
        <ToggleRow label="Disable Profile Gradient" checked={disableGradient} onChange={setDGrad} />
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <ColorRow label="Primary Color" />
          <ColorRow label="Secondary Color" />
        </div>
      </Card>

      {/* Other Customization */}
      <Card>
        <SectionTitle>Other Customization</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 12, gap: 13 }}>
          <OtherBtn>Custom Domain</OtherBtn>
          <OtherBtn>SEO Settings</OtherBtn>
          <OtherBtn>
            Custom CSS{" "}
            <span style={{
              background: "linear-gradient(90deg,#d283eb,#e3b5f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              fontSize: 13,
            }}>PREMIUM</span>
          </OtherBtn>
          <ResetBtn>Reset Profile</ResetBtn>
        </div>
      </Card>

    </div>
  );
}
