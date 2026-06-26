import {
  ImageIcon, Music, MousePointer2, Type, Link2, Eye, Sparkles, Palette, LayoutGrid,
} from 'lucide-react'

const features = [
  {
    icon: ImageIcon,
    title: 'Background uploader',
    desc: 'Images, looping video, gradients or solid colors with blur and brightness control.',
  },
  {
    icon: Music,
    title: 'Music player',
    desc: 'Upload a track that plays the moment someone enters your page, with volume control.',
  },
  {
    icon: MousePointer2,
    title: 'Cursor effects',
    desc: 'Trails, glow, sparkles and a signature spider cursor that follows visitors around.',
  },
  {
    icon: Type,
    title: 'Text effects & fonts',
    desc: 'Glow, glitch, typewriter, rainbow and a library of custom fonts for your name and bio.',
  },
  {
    icon: Link2,
    title: 'Social links',
    desc: 'Discord, Instagram, TikTok, X, YouTube, Spotify, GitHub and custom links with icons.',
  },
  {
    icon: Eye,
    title: 'View counter & stats',
    desc: 'Track how many people visit your profile with a live, built-in view counter.',
  },
  {
    icon: Sparkles,
    title: 'Enter animations',
    desc: 'A click-to-enter gate with fade, slide, zoom and blur reveal animations.',
  },
  {
    icon: Palette,
    title: 'Full theming',
    desc: 'Accent colors, card opacity, glassmorphism blur and rounded corners \u2014 all yours.',
  },
  {
    icon: LayoutGrid,
    title: 'Layouts',
    desc: 'Centered, left-aligned or wide layouts so no two brazy profiles look the same.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Everything you need to <span className="text-primary">stand out</span>
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          One profile, endless personalization. Every detail is yours to control.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-colors hover:border-primary/50"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
