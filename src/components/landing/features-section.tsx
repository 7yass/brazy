import {
  ImageIcon, Music, MousePointer2, Type, Link2, Eye, Sparkles, Palette, LayoutGrid,
} from 'lucide-react'

const features = [
  {
    icon: ImageIcon,
    title: 'Background uploader',
    desc: 'Images, looping video, gradients or solid colors with blur and brightness control.',
    span: 1,
  },
  {
    icon: Music,
    title: 'Music player',
    desc: 'A track that plays the moment someone enters your page, with volume control.',
    span: 1,
  },
  {
    icon: Sparkles,
    title: 'Enter animations',
    desc: 'A click-to-enter gate with fade, slide, zoom and blur reveal animations.',
    span: 2,
  },
  {
    icon: MousePointer2,
    title: 'Cursor effects',
    desc: 'Trails, glow, sparkles and a signature spider cursor that follows visitors around.',
    span: 1,
  },
  {
    icon: Type,
    title: 'Text effects & fonts',
    desc: 'Glow, glitch, typewriter, rainbow and a library of custom fonts.',
    span: 1,
  },
  {
    icon: Link2,
    title: 'Social links',
    desc: 'Discord, Instagram, TikTok, X, YouTube, Spotify, GitHub and custom links with icons.',
    span: 1,
  },
  {
    icon: Eye,
    title: 'View counter',
    desc: 'Track visits with a live built-in counter.',
    span: 1,
  },
  {
    icon: Palette,
    title: 'Full theming',
    desc: 'Accent colors, card opacity, glassmorphism blur — all yours.',
    span: 1,
  },
  {
    icon: LayoutGrid,
    title: 'Layouts',
    desc: 'Centered, left-aligned or wide — no two brazy profiles look the same.',
    span: 1,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative mx-auto max-w-5xl px-4 py-28">
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Features</p>
        <h2 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Everything to{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            stand out
          </span>
        </h2>
        <p className="mt-4 text-pretty text-base text-muted-foreground">
          One profile, endless personalization. Every detail is yours to control.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-2 gap-3 sm:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-card/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.08)]"
            style={{
              gridColumn: f.span === 2 ? 'span 2' : 'span 1',
            }}
          >
            {/* Glow blob */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/8 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Left accent bar */}
            <div className="absolute left-0 top-4 h-8 w-[2px] rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary/70 group-hover:h-10" />

            <div className="relative flex h-full flex-col">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-sm font-semibold leading-tight">{f.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
