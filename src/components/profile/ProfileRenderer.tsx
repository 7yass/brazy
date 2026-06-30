"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfileConfig } from "@/lib/profile/schema";
import type { Transition, TargetAndTransition } from "framer-motion";
import BackgroundLayer from "./BackgroundLayer";
import CursorEffect from "./CursorEffect";
import ClickEffect from "./ClickEffect";
import SplashIntro from "./SplashIntro";
import ViewCounter from "./ViewCounter";
import { brandIcons } from "./icons";
import { SpiderLogo } from "@/components/spider-logo";
import { DiscordPresenceWidget, SkillsWidget, ProjectsWidget } from "./Widgets";
import { PREDEFINED_BADGES } from "@/lib/profile/badges-data";
import { getPipedStreamUrl } from "@/lib/profile/audio-resolver";

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Username Effect ───────────────────────────────────────────────────────────

function UsernameText({ text, effect, accent, accent2, textColor, textGlow }: {
  text: string; effect: string; accent: string; accent2: string; textColor: string; textGlow: boolean;
}) {
  const [tick, setTick] = useState(0);
  const [typewriterIdx, setTypewriterIdx] = useStat