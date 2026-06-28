import Link from 'next/link'
import { SpiderLogo } from '@/components/spider-logo'

export function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      <div className="brazy-grid-bg absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Members only
        </div>

        <SpiderLogo
          className="mb-6 h-20 w-20 text-primary"
          style={{ animation: 'brazy-float 4s ease-in-out infinite' }}
        />

        <h1 className="text-balance font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'gradientShift 4s ease infinite' }}>
            brazy
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          From the people. For the people.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          {isLoggedIn ? (
            <Link href="/dashboard" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-4 transition-all hover:bg-primary/80 hover:shadow-[0_0_24px_rgba(220,38,38,0.4)]">Dashboard</Link>
          ) : (
            <Link href="/register" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-6 transition-all hover:bg-primary/80 hover:shadow-[0_0_24px_rgba(220,38,38,0.4)]">Get started</Link>
          )}
          <Link href="#features" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border/60 bg-transparent text-foreground text-sm font-medium h-9 gap-1.5 px-6 transition-colors hover:border-primary/40 hover:text-primary">
            See features
          </Link>
        </div>

        <p className="mt-8 font-mono text-sm text-muted-foreground">
          brazy.it/<span className="text-primary">yourname</span>
        </p>
      </div>
    </section>
  )
}
