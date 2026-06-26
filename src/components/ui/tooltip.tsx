'use client'

import { cn } from '@/lib/utils'

function TooltipContent({
  className,
  side = 'top',
  ...props
}: React.ComponentProps<'div'> & { side?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <div
      data-slot="tooltip-content"
      className={cn(
        'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
        className,
      )}
      {...props}
    />
  )
}

export { TooltipContent }
