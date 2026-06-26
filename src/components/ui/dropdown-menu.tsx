'use client'

import { cn } from '@/lib/utils'

function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dropdown-content"
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md',
        className,
      )}
      {...props}
    />
  )
}

export { DropdownMenuContent }
