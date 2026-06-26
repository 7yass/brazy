"use client";

import { TextArea, TextInput, SelectInput, Slider } from "./controls";

const backgroundOpts = [
  { value: "none" as const, label: "None" },
  { value: "color" as const, label: "Color" },
  { value: "gradient" as const, label: "Gradient" },
  { value: "particles" as const, label: "Particles" },
  { value: "matrix" as const, label: "Matrix" },
  { value: "starfield" as const, label: "Starfield" },
  { value: "aurora" as const, label: "Aurora" },
  { value: "rain" as const, label: "Rain" },
  { value: "snow" as const, label: "Snow" },
  { value: "bubbles" as const, label: "Bubbles" },
  { value: "grid" as const, label: "Grid" },
  { value: "image" as const, label: "Image" },
  { value: "video" as const, label: "Video" },
];

export function GeneralCustomization() {
  return (
    <div className="flex flex-col gap-4">
      <Row label="Description">
        <TextArea value="" onChange={() => {}} placeholder="Bio" rows={2} />
      </Row>
      <Row label="Discord Presence">
        <SelectInput
          value="none"
          onChange={() => {}}
          options={[{ value: "none" as const, label: "Disabled" }, { value: "enabled" as const, label: "Enabled" }]}
        />
      </Row>
      <Row label="Background Effects">
        <SelectInput value="none" onChange={() => {}} options={backgroundOpts} />
      </Row>
      <Row label="Username Effects">
        <Switch value={false} onChange={() => {}} />
      </Row>
      <Row label="Profile Opacity">
        <div className="flex w-full max-w-[160px] items-center gap-3">
          <Slider value={1} onChange={() => {}} min={0} max={1} step={0.05} />
          <span className="min-w-[2.5rem] text-right text-xs text-white/40">100%</span>
        </div>
      </Row>
      <Row label="Profile Blur">
        <div className="flex w-full max-w-[160px] items-center gap-3">
          <Slider value={0} onChange={() => {}} min={0} max={60} step={1} />
          <span className="min-w-[2.5rem] text-right text-xs text-white/40">0px</span>
        </div>
      </Row>
      <Row label="Location">
        <TextInput value="" onChange={() => {}} placeholder="Location" />
      </Row>
      <Row label="Glow Settings">
        <div className="flex items-center gap-3">
          <Switch value={false} onChange={() => {}} />
          <div className="flex w-full max-w-[160px] items-center gap-3">
            <Slider value={50} onChange={() => {}} min={0} max={100} step={5} />
            <span className="min-w-[2.5rem] text-right text-xs text-white/40">50%</span>
          </div>
        </div>
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-white/60">{label}</span>
      <div className="flex shrink-0 items-center gap-3">{children}</div>
    </div>
  );
}

function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative h-5 w-9 shrink-0 rounded-full transition"
      style={{ backgroundColor: value ? "#8b5cf6" : "rgba(255,255,255,0.15)" }}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition"
        style={{ left: value ? "18px" : "2px" }}
      />
    </button>
  );
}
