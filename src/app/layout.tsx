import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'GameChanger — Jeux thérapeutiques pour professionnels de santé',
    template: '%s | GameChanger',
  },
  description:
    'Trouvez les jeux de société adaptés à votre pratique clinique. Outil de recherche pour psychomotriciens, ergothérapeutes et psychologues.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
