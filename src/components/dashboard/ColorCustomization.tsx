"use client";

import { ColorInput } from "./controls";

export function ColorCustomization() {
  return (
    <div className="flex flex-col gap-4">
      <Row label="Accent Color">
        <ColorInput value="#8b5cf6" onChange={() => {}} />
      </Row>
      <Row label="Background Color">
        <ColorInput value="#0a0911" onChange={() => {}} />
      </Row>
      <Row label="Text Color">
        <ColorInput value="#e2e8f0" onChange={() => {}} />
      </Row>
      <Row label="Icon Color">
        <ColorInput value="#a78bfa" onChange={() => {}} />
      </Row>
      <Row label="Profile Gradient">
        <div className="flex items-center gap-2">
          <ColorInput value="#6366f1" onChange={() => {}} />
          <ColorInput value="#a855f7" onChange={() => {}} />
        </div>
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-white/60">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
