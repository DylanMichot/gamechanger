'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookMarked, ArrowLeft, Printer, Cake, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameCard } from '@/components/GameCard'
import { getFavoriteIds } from '@/components/FavoriteButton'
import type { BoardGame } from '@/types'

function formatAge(game: BoardGame) {
  if (game.minAge === game.maxAge) return `${game.minAge} ans`
  if (game.maxAge >= 120) return `${game.minAge}+`
  return `${game.minAge}–${game.maxAge} ans`
}

function formatPlayers(game: BoardGame) {
  if (game.minPlayers === game.maxPlayers)
    return `${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`
  return `${game.minPlayers}–${game.maxPlayers} joueurs`
}

export default function FavorisPage() {
  const [games, setGames] = useState<BoardGame[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [printDate, setPrintDate] = useState('')

  useEffect(() => {
    const ids = getFavoriteIds()
    setFavoriteIds(ids)
    setPrintDate(new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }))

    if (ids.length === 0) {
      setLoading(false)
      return
    }

    fetch(`/api/games?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data: BoardGame[]) => setGames(data))
      .catch(() => setGames([]))
      .finally(() => setLoading(false))
  }, [])

  function handleRemove() {
    const newIds = getFavoriteIds()
    setFavoriteIds(newIds)
    setGames((prev) => prev.filter((g) => newIds.includes(g.id)))
  }

  return (
    <div className="container py-8">
      {/* Bouton retour — masqué à l'impression */}
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 gap-2 print:hidden">
        <Link href="/jeux">
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>

      {/* En-tête écran — masqué à l'impression */}
      <div className="mb-8 flex items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
            <BookMarked className="h-7 w-7 text-accent" />
            Mes favoris
          </h1>
          <p className="text-muted-foreground mt-2">
            {favoriteIds.length === 0
              ? 'Aucun jeu sauvegardé pour le moment.'
              : `${games.length} jeu${games.length !== 1 ? 'x' : ''} sauvegardé${games.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {games.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0 print:hidden"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            Imprimer / PDF
          </Button>
        )}
      </div>

      {/* En-tête impression — visible uniquement à l'impression */}
      {games.length > 0 && (
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-black">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-extrabold tracking-tight">GameChanger</p>
              <p className="text-sm text-gray-500">gamechanger-pea.vercel.app</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p className="font-semibold">Mes favoris</p>
              <p>Exporté le {printDate}</p>
              <p>{games.length} jeu{games.length !== 1 ? 'x' : ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vue grille écran — masquée à l'impression */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : favoriteIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center print:hidden">
          <BookMarked className="h-16 w-16 text-muted-foreground/30 mb-6" />
          <h2 className="text-xl font-bold mb-3">Aucun favori pour le moment</h2>
          <p className="text-muted-foreground max-w-sm mb-8">
            Parcourez le catalogue et cliquez sur le cœur ❤️ pour sauvegarder
            les jeux qui vous intéressent.
          </p>
          <Button asChild>
            <Link href="/jeux">Parcourir le catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
          {games.map((game) => (
            <div key={game.id} className="relative">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}

      {/* Vue compacte impression — masquée à l'écran */}
      {games.length > 0 && (
        <div className="hidden print:block">
          {games.map((game) => (
            <div
              key={game.id}
              className="print-item py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <span className="font-bold text-sm">{game.name}</span>
                <span className="text-xs text-gray-500 shrink-0 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Cake className="inline h-3 w-3" />
                    {formatAge(game)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="inline h-3 w-3" />
                    {formatPlayers(game)}
                  </span>
                </span>
              </div>
              {game.description && (
                <p className="text-xs text-gray-600 mb-1.5 line-clamp-2 leading-snug">
                  {game.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {game.psychomotorTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block border border-teal-700 text-teal-800 text-xs px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {game.pathologyTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block border border-blue-700 text-blue-800 text-xs px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
