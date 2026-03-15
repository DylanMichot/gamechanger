import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gamepad2 className="h-4 w-4" />
          <span>
            <strong className="text-foreground">GameChanger</strong> - Outil de
            recherche de jeux thérapeutiques
          </span>
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
    </footer>
  )
}
