"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Splash } from "@/lib/profile/schema";

export default function SplashIntro({ splash, onEnter }: { splash: Splash; onEnter: () => void }) {
  const [exited, setExited] = useState(false);

  if (!splash.enabled || exited) return null;

  const handleEnter = () => {
    setExited(true);
    onEnter();
  };

  return (
    <AnimatePresence>
      {!exited && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={handleEnter}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: splash.type === "black" || splash.type === "blur" ? splash.bgColor : "transparent",
            backdropFilter: splash.type === "blur" ? `blur(${splash.blurAmount}px)` : "none",
            WebkitBackdropFilter: splash.type === "blur" ? `blur(${splash.blurAmount}px)` : "none",
            cursor: "pointer",
            textAlign: "center",
            padding: 24,
          }}
        >
          {splash.type === "glitch" && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.05) 2px, rgba(34,211,238,0.05) 4px)`,
                mixBlendMode: "overlay",
              }}
            />
          )}
          {splash.type === "gradient" && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${splash.accentColor}33, ${splash.bgColor}, ${splash.accentColor}33)`,
                backgroundSize: "200% 200%",
                animation: "gradientShift 6s ease infinite",
              }}
            />
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              position: "relative",
              fontSize: "clamp(2.5rem, 10vw, 6rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: splash.textColor,
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              textShadow: `0 0 40px ${splash.accentColor}66`,
              margin: 0,
            }}
          >
            {splash.text}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              position: "relative",
              fontSize: 16,
              color: splash.textColor,
              fontFamily: "var(--font-geist-mono), monospace",
              margin: 0,
            }}
          >
            {splash.subtext}
          </motion.p>
          {splash.showEnterButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                position: "relative",
                marginTop: 16,
                padding: "12px 32px",
                background: splash.accentColor,
                color: splash.bgColor,
                border: "none",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {splash.cta}
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
