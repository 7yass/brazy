"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  icon,
  label,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {label && (
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1.5 font-medium">
          {label}
        </p>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center gap-2.5 px-3 py-2.5
          bg-white/[0.04] hover:bg-white/[0.07]
          border border-white/[0.08] hover:border-white/[0.14]
          rounded-lg text-sm text-white/90
          transition-all duration-150 cursor-pointer
          focus:outline-none focus:border-white/25
        "
      >
        {(selected?.icon ?? icon) && (
          <span className="text-white/50 flex-shrink-0">
            {selected?.icon ?? icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">
          {selected?.label ?? value}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 w-full mt-1
            bg-[#111111] border border-white/[0.08]
            rounded-lg overflow-hidden
            shadow-2xl shadow-black/60
          "
        >
          <div className="max-h-56 overflow-y-auto brazy-no-scrollbar py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2
                  text-sm text-left transition-colors duration-100
                  cursor-pointer
                  ${
                    opt.value === value
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                  }
                `}
              >
                {opt.icon && (
                  <span className="text-white/50 flex-shrink-0">{opt.icon}</span>
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
