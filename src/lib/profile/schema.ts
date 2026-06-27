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

export const cardStyleSchema = z.enum(["glass", "solid", "outline", "neon", "minimal"]);
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
    .enum(["geist", "inter", "poppins", "mono", "serif", "comic", "custom"])
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
});
export type Background = z.infer<typeof backgroundSchema>;

const cursorEffectSchema = z.object({
  enabled: z.boolean().default(true),
  type: z.enum(["trail", "sparkles", "dots", "rings", "glow", "snowflakes", "none"]).default("sparkles"),
  color: z.string().default("#22d3ee"),
  size: z.number().min(2).max(24).default(6),
  fade: z.number().min(0).max(1).default(0.12),
  followLag: z.number().min(0).max(1).default(0.18),
});

const clickEffectSchema = z.object({
  enabled: z.boolean().default(true),
  type: z.enum(["burst", "ripple", "hearts", "confetti", "emojis", "none"]).default("burst"),
  emoji: z.string().default("✨"),
  color: z.string().default("#ec4899"),
  count: z.number().min(2).max(40).default(12),
});

export const effectsSchema = z.object({
  cursor: cursorEffectSchema,
  click: clickEffectSchema,
  tilt3d: z.boolean().default(true),
  typewriterTitle: z.boolean().default(false),
  glowPulse: z.boolean().default(true),
  textGlow: z.boolean().default(true),
  usernameEffect: z.enum(["none", "glow", "glitch", "typewriter", "rainbow", "neon", "shake"]).default("none"),
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
]);
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

const socialLinkSchema = z.object({
  platform: socialPlatformSchema.default("website"),
  url: z.string().default(""),
  label: z.string().default(""),
  color: z.string().default(""),
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
});
export type Identity = z.infer<typeof identitySchema>;

export const profileConfigSchema = z.object({
  version: z.number().default(1),
  identity: identitySchema,
  theme: themeSchema,
  background: backgroundSchema,
  effects: effectsSchema,
  splash: splashSchema,
  audio: audioSchema,
  social: socialSchema,
  badges: badgesSchema,
  customCss: z.string().default(""),
  customHtml: z.string().default(""),
  seo: z
    .object({
      title: z.string().default(""),
      description: z.string().default(""),
      ogImage: z.string().default(""),
    }),
  analytics: z
    .object({
      trackViews: z.boolean().default(true),
    }),
});
export type ProfileConfig = z.infer<typeof profileConfigSchema>;

export function normalizeConfig(input: unknown): ProfileConfig {
  return profileConfigSchema.parse(input ?? {});
}
