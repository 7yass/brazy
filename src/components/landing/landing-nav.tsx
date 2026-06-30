"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpiderLogo } from "@/components/spider-logo";

const navLinks = [
  { label: "Discord", href: "https://discord.gg/brazy", external: true },
  { label: "Changelog", href: "/changelog" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: scrolled ? 10 : 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "100%",
        maxWidth: scrolled ? 540 : 720,
        padding: "0 16px",
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          height: scrolled ? 42 : 52,
          padding: scrolled ? "0 14px" : "0 18px",
          borderRadius: 999,
          background: "rgba(10,5,5,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(220,38,38,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset",
          transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "all",
          fontFamily: "Satoshi, system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <SpiderLogo
            width={scrolled ? 16 : 18}
            height={scrolled ? 16 : 18}
            style={{
              color: "#dc2626",
              transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          <span
            style={{
              fontSize: scrolled ? 13 : 15,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.02em",
              transition: "font-size 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            brazy
          </span>
        </Link>

        {/* Nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            overflow: "hidden",
            maxWidth: scrolled ? 0 : 400,
            opacity: scrolled ? 0 : 1,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: scrolled ? "none" : "all",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                padding: "5px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                e.currentTarget.style.background = "rgba(220,38,38,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {isLoggedIn ? (
            <Link
              href="/account"
              style={{
                fontSize: scrolled ? 12 : 13,
                fontWeight: 600,
                color: "#fafafa",
                textDecoration: "none",
                padding: scrolled ? "5px 12px" : "6px 16px",
                borderRadius: 999,
                background: "rgba(220,38,38,0.15)",
                border: "1px solid rgba(220,38,38,0.3)",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(220,38,38,0.28)";
                e.currentTarget.style.borderColor = "rgba(220,38,38,0.55)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(220,38,38,0.15)";
                e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                  display: scrolled ? "none" : "block",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                style={{
                  fontSize: scrolled ? 12 : 13,
                  fontWeight: 600,
                  color: "#fafafa",
                  textDecoration: "none",
                  padding: scrolled ? "5px 12px" : "6px 16px",
                  borderRadius: 999,
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(220,38,38,0.28)";
                  e.currentTarget.style.borderColor = "rgba(220,38,38,0.55)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(220,38,38,0.15)";
                  e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
