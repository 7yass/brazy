import Link from 'next/link'
import { SpiderLogo } from '@/components/spider-logo'

export function CtaSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="claim" className="relative mx-auto max-w-4xl px-4 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/50 p-10 text-center backdrop-blur sm:p-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[100px]" />
        <div className="relative">
          <SpiderLogo className="mx-auto mb-6 h-14 w-14 text-primary" />
          <h2 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            You in?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-lg text-muted-foreground">
            Log in with Discord and make <span className="font-mono text-foreground">brazy.it/username</span> yours.
          </p>
          <div className="mt-8 flex justify-center">
            {isLoggedIn ? (
              <Link href="/dashboard" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-2.5 transition-colors hover:bg-primary/80">Dashboard</Link>
            ) : (
              <Link href="/register" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-4 transition-colors hover:bg-primary/80">Get started</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
