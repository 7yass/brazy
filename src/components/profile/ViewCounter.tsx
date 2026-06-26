"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({
  initial,
  accent,
}: {
  initial: number;
  accent: string;
}) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const key = "brazy_view_counted";
    const counted = sessionStorage.getItem(key);
    const base = initial > 0 ? initial : Math.floor(Math.random() * 4000) + 800;
    const next = counted ? base : base + 1;
    setViews(next);
    if (!counted) sessionStorage.setItem(key, "1");
  }, [initial]);

  const formatted = views >= 1000 ? (views / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(views);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginTop: 22,
        fontSize: 12,
        color: "rgba(226,232,240,0.45)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={accent} opacity={0.7}>
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
      <span>{formatted} views</span>
    </div>
  );
}
