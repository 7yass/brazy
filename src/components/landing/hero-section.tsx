import Link from 'next/link'
import { SpiderLogo } from '@/components/spider-logo'
import { DiscordLoginButton } from '@/components/discord-login-button'

export function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      <div className="brazy-grid-bg absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          The next-gen bio link platform
        </div>

        <SpiderLogo
          className="mb-6 h-20 w-20 text-primary"
          style={{ animation: 'brazy-float 4s ease-in-out infinite' }}
        />

        <h1 className="text-balance font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Your bio,{' '}
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            but unhinged
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Claim your <span className="font-mono text-foreground">brazy.it/you</span> and build a
          fully customizable profile — backgrounds, music, cursor effects, custom fonts and way
          more than guns.lol or haunt.gg ever gave you.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          {isLoggedIn ? (
            <Link href="/dashboard" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-2.5 transition-colors hover:bg-primary/80">Go to dashboard</Link>
          ) : (
            <DiscordLoginButton />
          )}
          <a href="#features" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium h-9 gap-1.5 px-2.5 transition-colors hover:bg-muted hover:text-foreground">See what&apos;s inside</a>
        </div>

        <p className="mt-6 font-mono text-sm text-muted-foreground">
          brazy.it/<span className="text-primary">yourname</span>
        </p>
      </div>
    </section>
  )
}
