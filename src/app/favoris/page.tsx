'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookMarked, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameCard } from '@/components/GameCard'
import { getFavoriteIds } from '@/components/FavoriteButton'
import type { BoardGame } from '@/types'

export default function FavorisPage() {
  const [games, setGames] = useState<BoardGame[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    const ids = getFavoriteIds()
    setFavoriteIds(ids)

    if (ids.length === 0) {
      setLoading(false)
      return
    }

    fetch(`/api/games?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data: BoardGame[]) => {
        setGames(data)
      })
      .catch(() => {
        setGames([])
      })
      .finally(() => setLoading(false))
  }, [])

  function handleRemove() {
    const newIds = getFavoriteIds()
    setFavoriteIds(newIds)
    setGames((prev) => prev.filter((g) => newIds.includes(g.id)))
  }

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 gap-2">
        <Link href="/jeux">
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>

      <div className="mb-8">
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted rounded-xl h-80 animate-pulse"
            />
          ))}
        </div>
      ) : favoriteIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <div key={game.id} className="relative">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
