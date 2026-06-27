import Link from "next/link";

export function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-[Satoshi] text-base font-bold tracking-tight text-foreground">
          brazy
        </Link>

        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
