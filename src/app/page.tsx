import { createClient } from '@/lib/supabase/server'
import { LandingNav } from '@/components/landing/landing-nav'
import { HeroSection } from '@/components/landing/hero-section'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'

export default async function HomePage() {
  const supabase = await createClient()
  let isLoggedIn = false
  if (supabase) {
    const { data } = await supabase.auth.getUser()
    isLoggedIn = !!data?.user
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <LandingNav isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <CtaSection isLoggedIn={isLoggedIn} />
      <LandingFooter />
    </main>
  )
}
