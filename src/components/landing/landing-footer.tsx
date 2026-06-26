import { SpiderWordmark } from '@/components/spider-logo'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <SpiderWordmark />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} brazy.it &mdash; your bio, but unhinged.
        </p>
      </div>
    </footer>
  )
}
