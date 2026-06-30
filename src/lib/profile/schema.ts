import { z } from "zod";

export const backgroundTypeSchema = z.enum([
  "none",
  "color",
  "gradient",
  "image",
  "video",
  "particles",
  "matrix",
  "starfield",
  "aurora",
  "rain",
  "snow",
  "bubbles",
  "grid",
]);
export type BackgroundType = z.infer<typeof backgroundTypeSchema>;

export const cardStyleSchema = z.enum(["glass", "solid", "outline", "neon", "minimal", "portfolio", "simplistic", "modern", "sleek"]);
export const themeModeSchema = z.enum(["dark", "light", "midnight", "amoled", "custom"]);

export const themeSchema = z.object({
  mode: themeModeSchema.default("dark"),
  primaryColor: z.string().default("#7c3aed"),
  secondaryColor: z.string().default("#ec4899"),
  accentColor: z.string().default("#22d3ee"),
  textColor: z.string().default("#f8fafc"),
  mutedTextColor: z.string().default("#94a3b8"),
  backgroundColor: z.string().default("#08070d"),
  fontFamily: z
    .enum(["geist", "inter", "poppins", "mono", "serif", "comic", "custom", "grotesk-serif", "mono-sans", "sharp-sans"])
    .default("geist"),
  fontFamilyUrl: z.string().default(""),
  cardStyle: cardStyleSchema.default("glass"),
  cardOpacity: z.number().min(0).max(1).default(0.55),
  cardBlur: z.number().min(0).max(60).default(20),
  borderRadius: z.number().min(0).max(48).default(24),
  borderWidth: z.number().min(0).max(8).default(1),
  glow: z.boolean().default(true),
  glowIntensity: z.number().min(0).max(100).default(60),
  maxWidth: z.number().min(280).max(900).default(520),
  contentAlign: z.enum(["center", "left"]).default("center"),
  backgroundImage: z.string().default(""),
  backgroundOverlayColor: z.string().default("#000000"),
  backgroundOverlayOpacity: z.number().min(0).max(1).default(0.45),
  animatedBorder: z.boolean().default(false),
  profileSize: z.enum(["default", "medium", "large"]).default("default"),
});
export type Theme = z.infer<typeof themeSchema>;

export const backgroundSchema = z.object({
  type: backgroundTypeSchema.default("particles"),
  color1: z.string().default("#7c3aed"),
  color2: z.string().default("#22d3ee"),
  color3: z.string().default("#ec4899"),
  imageUrl: z.string().default(""),
  videoUrl: z.string().default(""),
  speed: z.number().min(0).max(5).default(1),
  density: z.number().min(0).max(5).default(1),
  size: z.number().min(1).max(12).default(3),
  direction: z.enum(["up", "down", "left", "right", "random"]).default("down"),
  glow: z.boolean().default(true),
  blur: z.number().min(0).max(40).default(0),
});
export type Background = z.infer<typeof backgroundSchema>;

const cursorEffectSchema = z.object({
  enabled: z.boolean().default(true),
  type: z.enum([
    "trail", "sparkles", "dots", "rings", "glow",
    "snowflakes", "cat", "bubble", "snowflake",
    "dot", "ghost", "particles", "shooting",
    "custom", "none"
  ]).default("sparkles"),
  color: z.string().default("#22d3ee"),
  size: z.number().min(2).max(24).default(6),
  fade: z.number().min(0).max(1).default(0.12),
  followLag: z.number().min(0).max(1).default(0.18),
  url: z.string().default(""),
});

const clickEffectSchema = z.object({
  enabled: z.boolean().default(true),
  type: z.enum(["burst", "ripple", "hearts", "confetti", "emojis", "none"]).default("burst"),
  emoji: z.string().default("✨"),
  color: z.string().default("#ec4899"),
  count: z.number().min(2).max(40).default(12),
});

export const usernameEffectSchema = z.enum([
  "none",
  "glow",
  "glitch",
  "typewriter",
  "rainbow",
  "neon",
  "shake",
  "gradient",
  "bounce",
  "pulse",
  "wave",
]);
export type UsernameEffect = z.infer<typeof usernameEffectSchema>;

export const effectsSchema = z.object({
  cursor: cursorEffectSchema.default(() => ({} as any)),
  click: clickEffectSchema.default(() => ({} as any)),
  tilt3d: z.boolean().default(true),
  tiltIntensity: z.number().min(0).max(30).default(12),
  typewriterTitle: z.boolean().default(false),
  glowPulse: z.boolean().default(true),
  textGlow: z.boolean().default(true),
  usernameEffect: usernameEffectSchema.default("none"),
  animatedTitle: z.boolean().default(false),
  animatedTitleText: z.string().default(""),
});
export type Effects = z.infer<typeof effectsSchema>;

export const splashSchema = z.object({
  enabled: z.boolean().default(true),
  type: z.enum(["blur", "black", "image", "glitch", "gradient"]).default("blur"),
  text: z.string().default("brazy"),
  subtext: z.string().default("click to enter"),
  cta: z.string().default("enter"),
  blurAmount: z.number().min(0).max(40).default(16),
  bgColor: z.string().default("#08070d"),
  textColor: z.string().default("#f8fafc"),
  accentColor: z.string().default("#22d3ee"),
  imageUrl: z.string().default(""),
  showEnterButton: z.boolean().default(false),
  duration: z.number().min(0).max(6).default(0),
  enterSoundUrl: z.string().default(""),
});
export type Splash = z.infer<typeof splashSchema>;

export const audioSchema = z.object({
  enabled: z.boolean().default(true),
  src: z.string().default(""),
  title: z.string().default(""),
  artist: z.string().default(""),
  volume: z.number().min(0).max(1).default(0.6),
  loop: z.boolean().default(true),
  autoplay: z.boolean().default(true),
  showVisualizer: z.boolean().default(true),
  style: z.enum(["pill", "minimal", "full"]).default("pill"),
  trackId: z.string().default(""),
  coverUrl: z.string().default(""),
  lyrics: z.array(z.object({
    time: z.number().nullable(),
    text: z.string(),
  })).default([]),
});
export type Audio = z.infer<typeof audioSchema>;

export const socialPlatformSchema = z.enum([
  "discord",
  "twitter",
  "instagram",
  "tiktok",
  "github",
  "twitch",
  "youtube",
  "spotify",
  "telegram",
  "snapchat",
  "reddit",
  "kick",
  "email",
  "website",
  "custom",
  "bluesky",
  "mastodon",
  "threads",
  "roblox",
  "soundcloud",
  "steam",
  "paypal",
  "linkedin",
]);
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

const socialLinkSchema = z.object({
  platform: socialPlatformSchema.default("website"),
  url: z.string().default(""),
  label: z.string().default(""),
  color: z.string().default(""),
  subtitle: z.string().optional(),
  thumbnail: z.string().optional(),
  badgeText: z.string().optional(),
  badgeColor: z.string().optional(),
  visible: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const socialSchema = z.object({
  links: z.array(socialLinkSchema).default([]),
  layout: z.enum(["row", "grid", "wrap"]).default("wrap"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  shape: z.enum(["circle", "square", "rounded"]).default("circle"),
  showLabels: z.boolean().default(false),
  hoverEffect: z.boolean().default(true),
});
export type Social = z.infer<typeof socialSchema>;

const badgeSchema = z.object({
  label: z.string().default(""),
  emoji: z.string().default("⭐"),
  color: z.string().default("#22d3ee"),
  tooltip: z.string().default(""),
});

export const badgesSchema = z.object({
  enabled: z.boolean().default(true),
  items: z.array(badgeSchema).default([]),
  position: z.enum(["top", "bottom", "inline"]).default("top"),
});

export const identitySchema = z.object({
  username: z.string().default(""),
  displayName: z.string().default(""),
  bio: z.string().default(""),
  avatarUrl: z.string().default(""),
  tagline: z.string().default(""),
  pronouns: z.string().default(""),
  location: z.string().default(""),
  verified: z.boolean().default(false),
  bioMarkdown: z.boolean().default(false),
});
export type Identity = z.infer<typeof identitySchema>;

const skillSchema = z.object({
  name: z.string().default(""),
  level: z.number().min(0).max(100).default(80),
  icon: z.string().default(""),
  color: z.string().default("#7c3aed"),
});

export const skillsSchema = z.object({
  enabled: z.boolean().default(false),
  items: z.array(skillSchema).default([]),
});
export type Skills = z.infer<typeof skillsSchema>;

const projectSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  url: z.string().default(""),
  image: z.string().default(""),
  color: z.string().default("#7c3aed"),
});

export const projectsSchema = z.object({
  enabled: z.boolean().default(false),
  items: z.array(projectSchema).default([]),
});
export type Projects = z.infer<typeof projectsSchema>;

export const sectionsSchema = z.object({
  order: z.array(z.string()).default([
    "avatar", "name", "identity", "bio", "badges",
    "social", "audio", "discord", "views", "skills", "projects", "customHtml"
  ]),
  visibility: z.record(z.string(), z.boolean()).default({}),
});
export type Sections = z.infer<typeof sectionsSchema>;

export const widgetsSchema = z.object({
  discordPresence: z.object({
    enabled: z.boolean().default(false),
    discordId: z.string().default(""),
    placement: z.enum(["card", "bottom"]).default("card"),
  }).default(() => ({ enabled: false, discordId: "", placement: "card" as const })),
  youtube: z.object({
    enabled: z.boolean().default(false),
    url: z.string().default(""),
    placement: z.enum(["card", "bottom"]).default("bottom"),
  }).default(() => ({ enabled: false, url: "", placement: "bottom" as const })),
  github: z.object({
    enabled: z.boolean().default(false),
    username: z.string().default(""),
    placement: z.enum(["card", "bottom"]).default("bottom"),
  }).default(() => ({ enabled: false, username: "", placement: "bottom" as const })),
  time: z.object({
    enabled: z.boolean().default(false),
    timezone: z.string().default("UTC"),
    format: z.enum(["12h", "24h"]).default("12h"),
    placement: z.enum(["card", "bottom"]).default("card"),
  }).default(() => ({ enabled: false, timezone: "UTC", format: "12h" as const, placement: "card" as const })),
  spotify: z.object({
    enabled: z.boolean().default(false),
    url: z.string().default(""),
    placement: z.enum(["card", "bottom"]).default("card"),
  }).default(() => ({ enabled: false, url: "", placement: "card" as const })),
});
export type Widgets = z.infer<typeof widgetsSchema>;

export const profileConfigSchema = z.object({
  version: z.number().default(1),
  identity: identitySchema.default(() => ({} as any)),
  theme: themeSchema.default(() => ({} as any)),
  background: backgroundSchema.default(() => ({} as any)),
  effects: effectsSchema.default(() => ({} as any)),
  splash: splashSchema.default(() => ({} as any)),
  audio: audioSchema.default(() => ({} as any)),
  social: socialSchema.default(() => ({} as any)),
  badges: badgesSchema.default(() => ({} as any)),
  skills: skillsSchema.default(() => ({} as any)),
  projects: projectsSchema.default(() => ({} as any)),
  sections: sectionsSchema.default(() => ({} as any)),
  widgets: widgetsSchema.default(() => ({} as any)),
  customCss: z.string().default(""),
  customHtml: z.string().default(""),
  seo: z
    .object({
      title: z.string().default(""),
      description: z.string().default(""),
      ogImage: z.string().default(""),
    }).default(() => ({ title: "", description: "", ogImage: "" })),
  analytics: z
    .object({
      trackViews: z.boolean().default(true),
      showViews: z.boolean().default(true),
      viewsPlacement: z.enum(["inside", "outside", "none"]).default("inside"),
    }).default(() => ({ trackViews: true, showViews: true, viewsPlacement: "inside" as const })),
});
export type ProfileConfig = z.infer<typeof profileConfigSchema>;

import { brazyProfile } from "./defaults";

function deepMerge(target: any, source: any): any {
  if (target === null || target === undefined) return source;
  if (typeof target !== "object" || Array.isArray(target)) return target;
  
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (target[key] === undefined) {
      output[key] = source[key];
    }
  }
  return output;
}

export function normalizeConfig(input: unknown): ProfileConfig {
  let parsed: any;
  try {
    parsed = profileConfigSchema.parse(input ?? {});
  } catch (err) {
    console.error("normalizeConfig error, falling back to defaults:", err);
    try {
      parsed = profileConfigSchema.parse({});
    } catch (fallbackErr) {
      console.error("Critical: default schema parsing failed:", fallbackErr);
      parsed = {};
    }
  }
  return deepMerge(parsed, brazyProfile);
}
