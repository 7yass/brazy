"use client";

import { useState } from "react";
import {
  Upload, Music, User, MousePointer2,
  ChevronUp, ChevronDown, Save
} from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111] rounded-[15px] p-[25px] flex flex-col gap-[13px] ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="m-0 text-[21px] font-[500] text-[#e9e9e9]">{children}</h1>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="m-0 ml-[3px] text-[16px] font-[500] text-[#989898]">{children}</p>;
}

function Btn({
  children, onClick, red = false, className = "",
}: {
  children: React.ReactNode; onClick?: () => void; red?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full min-h-[44px] flex items-center justify-center gap-[8px]",
        "rounded-[15px] border-2 font-[500] text-[15px] text-[#fafafa]",
        "cursor-pointer transition-all duration-[.25s] active:translate-y-[3px]",
        red
          ? "bg-[rgba(255,56,56,.18)] border-[rgba(255,56,56,.28)] hover:bg-[rgba(255,56,56,.26)] hover:border-[rgba(255,56,56,.38)]"
          : "bg-[#171717] border-[#232323] hover:bg-[#1d1d1d] hover:border-[#343434]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function UploadBtn({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-[10px] p-[10px] rounded-[15px] bg-[#131313] border-2 border-[#191919] cursor-pointer transition-all duration-[.25s] hover:border-[#252525] active:translate-y-[4px] select-none">
      <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] bg-[#101010] border-2 border-[#1b1b1b] shrink-0">
        {icon}
      </div>
      <div>
        <p className="m-0 text-[15px] font-[500] text-[#fafafa]">{label}</p>
        <p className="m-0 text-[13px] text-[#6e6e6e] mt-[2px]">{sub}</p>
      </div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-[10px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between min-h-[44px] px-[14px] rounded-[15px] border-2 border-[#1f1f1f] bg-[#1a1a1a] text-[#f0f0f0] font-[500] text-[15px] cursor-pointer transition-all duration-[.25s] hover:border-[#3a3a3a] hover:bg-[#1f1f1f] active:translate-y-[2px]"
      >
        <span>{title}</span>
        <span className="flex flex-col leading-none">
          <ChevronUp className="w-[13px] h-[13px] text-[#777]" />
          <ChevronDown className="w-[13px] h-[13px] text-[#777]" />
        </span>
      </button>
      {open && <div className="flex flex-col gap-[10px] pl-[2px]">{children}</div>}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative w-[46px] h-[26px] rounded-full border-2 transition-all duration-[.25s] shrink-0 cursor-pointer",
        checked ? "bg-[#9849ac] border-[#9849ac]" : "bg-[#232323] border-[#2d2d2d]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-[2px] w-[18px] h-[18px] rounded-full bg-[#fafafa] transition-all duration-[.25s]",
          checked ? "left-[22px]" : "left-[2px]",
        ].join(" ")}
      />
    </button>
  );
}

function ColorRow({ label }: { label: string }) {
  const [color, setColor] = useState("#ffffff");
  return (
    <div className="flex items-center justify-between px-[14px] min-h-[44px] rounded-[15px] border-2 border-[#1f1f1f] bg-[#1a1a1a]">
      <span className="text-[15px] font-[500] text-[#f0f0f0]">{label}</span>
      <label className="flex items-center gap-[8px] cursor-pointer">
        <span
          className="w-[28px] h-[28px] rounded-[8px] border-2 border-[#2a2a2a]"
          style={{ backgroundColor: color }}
        />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="sr-only" />
        <span className="text-[13px] text-[#555] font-mono">{color.toUpperCase()}</span>
      </label>
    </div>
  );
}

function SliderRow({
  label, unit, stops, min = 0, max = 100,
}: {
  label: string; unit: string; stops: string[]; min?: number; max?: number;
}) {
  const [val, setVal] = useState(0);
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-[13px] text-[#555] font-mono">{val}{unit}</span>
      </div>
      <div className="flex gap-[7px]">
        {stops.map((s) => (
          <button
            key={s}
            onClick={() => setVal(parseInt(s))}
            className={[
              "flex-1 py-[7px] rounded-[10px] border-2 text-[13px] font-[500] transition-all duration-[.25s] cursor-pointer active:translate-y-[2px]",
              val === parseInt(s)
                ? "bg-[#9849ac33] border-[#9849ac55] text-[#d283eb]"
                : "bg-[#171717] border-[#202020] text-[#888] hover:border-[#2d2d2d]",
            ].join(" ")}
          >
            {s}{unit}
          </button>
        ))}
      </div>
      <input
        type="range" min={min} max={max} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-[#9849ac] h-[4px] rounded-full cursor-pointer"
      />
    </div>
  );
}

function TextInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full min-h-[44px] px-[14px] rounded-[15px] border-2 border-[#1f1f1f] bg-[#1a1a1a] text-[#e8e8e8] text-[15px] font-[500] placeholder:text-[#444] outline-none focus:border-[#3a3a3a] transition-colors box-border"
    />
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
    <div className="p-[30px] flex flex-col gap-[30px]">

      {/* Assets Uploader */}
      <Card>
        <SectionTitle>Assets Uploader</SectionTitle>
        <div className="flex flex-col gap-[10px]">
          <UploadBtn icon={<Upload className="w-[22px] h-[22px] text-[#888]" />} label="Background" sub=".MP4" />
          <UploadBtn icon={<Music className="w-[22px] h-[22px] text-[#888]" />} label="Audio" sub="Click to open audio manager" />
          <UploadBtn icon={<User className="w-[22px] h-[22px] text-[#888]" />} label="Profile Avatar" sub="Click to upload a file" />
          <UploadBtn icon={<MousePointer2 className="w-[22px] h-[22px] text-[#888]" />} label="Custom Cursor" sub=".CUR" />
        </div>
      </Card>

      {/* General Customization */}
      <Card>
        <SectionTitle>General Customization</SectionTitle>

        <div className="flex flex-col gap-[8px]">
          <Label>Description</Label>
          <TextInput placeholder="Write something about yourself…" value={description} onChange={setDescription} />
          <p className="m-0 ml-[3px] text-[13px] text-[#555]">
            Typewriter in <span className="text-[#d283eb] font-[700]">Premium</span> is already enabled.
          </p>
        </div>

        <Accordion title="Discord Presence">
          <Btn>Connect Discord</Btn>
        </Accordion>

        <Accordion title="Background Effects">
          <div className="flex flex-col gap-[8px]">
            {["Particles","Snow","Rain","Stars","Matrix","Bubbles"].map((fx) => (
              <Btn key={fx}>{fx}</Btn>
            ))}
          </div>
        </Accordion>

        <div className="flex flex-col gap-[8px]">
          <Label>Username Effects</Label>
          <div className="flex flex-col gap-[8px]">
            {["Glitch","Rainbow","Shadow","Neon","Gradient"].map((fx) => (
              <Btn key={fx}>{fx}</Btn>
            ))}
          </div>
        </div>

        <SliderRow label="Profile Opacity" unit="%" stops={["0","20","50","80"]} min={0} max={100} />
        <SliderRow label="Profile Blur" unit="px" stops={["0","20","50","80"]} min={0} max={80} />

        <div className="flex flex-col gap-[8px]">
          <Label>Location</Label>
          <TextInput placeholder="e.g. New York, USA" value={location} onChange={setLocation} />
        </div>

        <div className="flex flex-col gap-[10px]">
          <Label>Glow Settings</Label>
          {([
            ["Username", glowUsername, setGlowUser],
            ["Socials",  glowSocials,  setGlowSoc],
            ["Badges",   glowBadges,   setGlowBadge],
          ] as [string, boolean, (v: boolean) => void][]).map(([name, val, set]) => (
            <div key={name} className="flex items-center justify-between px-[14px] min-h-[44px] rounded-[15px] border-2 border-[#1f1f1f] bg-[#1a1a1a]">
              <span className="text-[15px] font-[500] text-[#f0f0f0]">{name}</span>
              <Toggle checked={val} onChange={set} />
            </div>
          ))}
        </div>
      </Card>

      {/* Color Customization */}
      <Card>
        <SectionTitle>Color Customization</SectionTitle>
        <div className="flex flex-col gap-[8px]">
          {["Accent Color","Text Color","Background Color","Icon Color","Background Effect Color"].map((c) => (
            <ColorRow key={c} label={c} />
          ))}
        </div>
        <div className="flex items-center justify-between px-[14px] min-h-[44px] rounded-[15px] border-2 border-[#1f1f1f] bg-[#1a1a1a]">
          <span className="text-[15px] font-[500] text-[#f0f0f0]">Disable Profile Gradient</span>
          <Toggle checked={disableGradient} onChange={setDGrad} />
        </div>
        <div className="flex flex-col gap-[8px]">
          <ColorRow label="Primary Color" />
          <ColorRow label="Secondary Color" />
        </div>
      </Card>

      {/* Other Customization */}
      <Card>
        <SectionTitle>Other Customization</SectionTitle>
        <div className="flex flex-col gap-[10px]">
          <Btn>Custom Domain</Btn>
          <Btn>SEO Settings</Btn>
          <Btn>Custom CSS <span className="ml-[6px] text-[12px] bg-[#9849ac33] border border-[#9849ac55] text-[#d283eb] font-[700] px-[6px] py-[2px] rounded-[6px]">PREMIUM</span></Btn>
          <Btn red>Reset Profile</Btn>
        </div>
      </Card>

      {/* Save */}
      <button className="w-full min-h-[48px] flex items-center justify-center gap-[9px] rounded-[15px] border-2 font-[600] text-[16px] text-[#fafafa] cursor-pointer transition-all duration-[.25s] bg-[#9849ac33] border-[#9849ac55] hover:bg-[#9849ac55] active:translate-y-[3px]">
        <Save className="w-[20px] h-[20px]" />
        Save Changes
      </button>

    </div>
  );
}
