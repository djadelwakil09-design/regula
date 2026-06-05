import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Regula – Anticipez les règles. Gardez une longueur d\'avance.',
    template: '%s | Regula',
  },
  description: 'Regula est l\'assistant IA de veille réglementaire pour les PME, cabinets comptables, cabinets RH et entreprises du BTP. Transformez automatiquement les changements réglementaires en actions concrètes.',
  keywords: ['conformité réglementaire', 'veille réglementaire', 'IA conformité', 'PME conformité', 'RGPD', 'droit du travail'],
  authors: [{ name: 'Regula' }],
  creator: 'Regula',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://regula.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://regula.app',
    siteName: 'Regula',
    title: 'Regula – Assistant IA de Conformité Réglementaire',
    description: 'Anticipez les changements réglementaires et transformez-les en actions concrètes.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Regula' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regula – Conformité Réglementaire IA',
    description: 'Anticipez les règles. Gardez une longueur d\'avance.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="min-h-screen bg-[#F8FAFC] antialiased">
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
