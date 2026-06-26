import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ variable: '--font-heading', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'brazy.it \u2014 your bio, but unhinged',
  description:
    'Create your own fully customizable bio page. Backgrounds, music, cursor effects, custom fonts and more. Claim your brazy.it/username today.',
  metadataBase: new URL('https://brazy.it'),
  openGraph: {
    title: 'brazy.it \u2014 your bio, but unhinged',
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
