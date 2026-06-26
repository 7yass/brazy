export type Profile = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  is_claimed: boolean
  discord_id: string | null
  discord_username: string | null
  created_at: string
  updated_at: string
}

export type Customization = {
  profile_id: string
  background_type: 'gradient' | 'image' | 'video' | 'solid'
  background_url: string | null
  background_color: string | null
  gradient_from: string | null
  gradient_to: string | null
  background_blur: number
  background_brightness: number
  accent_color: string | null
  card_opacity: number
  card_blur: number
  border_radius: number
  font_family: string
  text_color: string | null
  text_effect: 'none' | 'glow' | 'glitch' | 'typewriter' | 'rainbow'
  cursor_effect: 'none' | 'trail' | 'glow' | 'sparkle' | 'spider'
  enter_animation: 'fade' | 'slide' | 'zoom' | 'blur'
  profile_tilt: boolean
  enable_enter_gate: boolean
  enter_text: string | null
  audio_url: string | null
  audio_title: string | null
  autoplay: boolean
  volume: number
  layout: 'centered' | 'left' | 'wide'
  show_view_count: boolean
  show_badges: boolean
  updated_at: string
}

export type SocialLink = {
  id: string
  profile_id: string
  platform: SocialPlatform
  url: string
  label: string | null
  sort_order: number
  created_at: string
}

export type SocialPlatform =
  | 'discord'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'youtube'
  | 'github'
  | 'spotify'
  | 'twitch'
  | 'telegram'
  | 'website'
  | 'custom'

export type FullProfile = Profile & {
  profile_customization: Customization | null
  social_links: SocialLink[]
}
