"use client";

import { SelectInput, Slider } from "./controls";

const alignOpts = [
  { value: "center" as const, label: "Center" },
  { value: "left" as const, label: "Left" },
];

export function OtherCustomization() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Monochrome Icons">
        <Switch value={false} onChange={() => {}} />
      </Row>
      <Row label="Animated Title">
        <Switch value={false} onChange={() => {}} />
      </Row>
      <Row label="Swap Box Colors">
        <SelectInput value="center" onChange={() => {}} options={alignOpts} />
      </Row>
      <Row label="Volume Control">
        <div className="flex w-32 items-center gap-3">
          <Slider value={0.8} onChange={() => {}} min={0} max={1} step={0.05} />
          <span className="min-w-[2rem] text-right text-xs text-white/40">80%</span>
        </div>
      </Row>
      <Row label="Use Discord Avatar">
        <Switch value={false} onChange={() => {}} />
      </Row>
      <Row label="Discord Avatar Decoration">
        <Switch value={false} onChange={() => {}} />
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-white/50">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative h-5 w-9 shrink-0 rounded-full transition"
      style={{ backgroundColor: value ? "#8b5cf6" : "rgba(255,255,255,0.12)" }}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition"
        style={{ left: value ? "18px" : "2px" }}
      />
    </button>
  );
}
