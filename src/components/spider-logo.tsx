import { cn } from '@/lib/utils'

export function SpiderLogo({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6', className)}
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="32" cy="34" rx="7" ry="10" fill="currentColor" stroke="none" />
      <circle cx="32" cy="22" r="5" fill="currentColor" stroke="none" />
      <path d="M26 28 L12 20 L6 24" />
      <path d="M25 32 L9 30 L4 35" />
      <path d="M25 36 L10 40 L6 46" />
      <path d="M27 40 L15 50 L13 57" />
      <path d="M38 28 L52 20 L58 24" />
      <path d="M39 32 L55 30 L60 35" />
      <path d="M39 36 L54 40 L58 46" />
      <path d="M37 40 L49 50 L51 57" />
    </svg>
  )
}

export function SpiderWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <SpiderLogo className="h-6 w-6 text-primary" />
      <span className="font-heading text-xl font-bold tracking-tight">
        brazy<span className="text-primary">.it</span>
      </span>
    </span>
  )
}
