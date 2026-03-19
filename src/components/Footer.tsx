import Link from 'next/link'
import { Dices } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container py-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Dices className="h-4 w-4" />
            <strong className="text-foreground">GameChanger</strong>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/jeux"
              className="hover:text-foreground transition-colors"
            >
              Rechercher
            </Link>
            <Link
              href="/favoris"
              className="hover:text-foreground transition-colors"
            >
              Favoris
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-foreground transition-colors"
            >
              Accès équipe
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Aucune donnée personnelle n'est collectée. Vos favoris sont enregistrés uniquement sur votre appareil et ne sont ni partagés ni accessibles par l'équipe.
        </p>
      </div>
    </footer>
  )
}
