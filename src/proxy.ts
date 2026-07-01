/**
 * Supabase Auth Middleware Proxy
 * 
 * This is the Next.js middleware entry point for Supabase session management.
 * It runs on every request matching the matcher pattern below and refreshes
 * the auth session cookie automatically.
 * 
 * Used by: next.config.ts or middleware.ts (Next.js auto-detects proxy.ts in src/)
 */
import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
