import { Check, X } from 'lucide-react'
import { SpiderLogo } from '@/components/spider-logo'

const rows = [
  'Video & image backgrounds',
  'Custom uploaded music',
  'Spider cursor effects',
  'Text glow, glitch & rainbow',
  'Custom font library',
  'Multiple page layouts',
  'Live view counter',
  'Discord login',
  'Free to start',
]

const competitors = [
  { name: 'brazy.it', brand: true, values: rows.map(() => true) },
  { name: 'guns.lol', brand: false, values: [true, true, false, true, true, false, true, true, true] },
  { name: 'haunt.gg', brand: false, values: [true, true, false, false, true, false, true, true, true] },
]

export function ComparisonSection() {
  return (
    <section id="compare" className="relative mx-auto max-w-5xl px-4 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Why <span className="text-primary">brazy.it</span> wins
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          We took what guns.lol and haunt.gg do and pushed every single feature further.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
        <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-border/60 text-sm">
          <div className="p-4 font-medium text-muted-foreground">Feature</div>
          {competitors.map((c) => (
            <div
              key={c.name}
              className={`flex items-center justify-center gap-1.5 p-4 font-heading font-semibold ${c.brand ? 'text-primary' : 'text-foreground'}`}
            >
              {c.brand && <SpiderLogo className="h-4 w-4" />}
              {c.name}
            </div>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={row}
            className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-border/40 text-sm last:border-0"
          >
            <div className="p-4 text-foreground">{row}</div>
            {competitors.map((c) => (
              <div key={c.name + row} className={`flex items-center justify-center p-4 ${c.brand ? 'bg-primary/5' : ''}`}>
                {c.values[i] ? (
                  <Check className={`h-5 w-5 ${c.brand ? 'text-primary' : 'text-accent'}`} />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
