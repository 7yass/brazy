import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ variable: '--font-heading', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'brazy.it — your bio, but unhinged',
    template: 'brazy | %s',
  },
  description:
    'Create your own fully customizable bio page. Backgrounds, music, cursor effects, custom fonts and more. Claim your brazy.it/username today.',
  metadataBase: new URL('https://brazy.it'),
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="7" ry="10" fill="%23dc2626"/><circle cx="32" cy="22" r="5" fill="%23dc2626"/><path d="M26 28 L12 20 L6 24" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 32 L9 30 L4 35" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 36 L10 40 L6 46" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 40 L15 50 L13 57" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 28 L52 20 L58 24" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 32 L55 30 L60 35" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 36 L54 40 L58 46" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M37 40 L49 50 L51 57" stroke="%23dc2626" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: 'brazy.it — your bio, but unhinged',
    description: 'The most customizable bio link platform. Claim your brazy.it/username.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
        <Toaster position="top-center" theme="dark" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
