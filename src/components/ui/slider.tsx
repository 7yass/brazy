'use client'

import { cn } from '@/lib/utils'

function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  ...props
}: React.ComponentProps<'input'> & {
  min?: number
  max?: number
  step?: number
  value?: number
  onValueChange?: (value: number) => void
}) {
  return (
    <input
      type="range"
      data-slot="slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary outline-none',
        className,
      )}
      {...props}
    />
  )
}

export { Slider }
