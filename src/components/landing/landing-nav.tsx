import Link from 'next/link'
import { SpiderWordmark } from '@/components/spider-logo'
import { DiscordLoginButton } from '@/components/discord-login-button'

export function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/">
          <SpiderWordmark />
        </Link>
        {isLoggedIn ? (
          <Link href="/dashboard" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-7 gap-1 px-2.5 transition-colors hover:bg-primary/80">Dashboard</Link>
        ) : (
          <DiscordLoginButton size="sm" label="Login" />
        )}
      </div>
    </header>
  )
}
