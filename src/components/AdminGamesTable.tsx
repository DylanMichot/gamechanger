'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteGameButton } from '@/components/DeleteGameButton'

interface Game {
  id: string
  name: string
  description: string
  imageUrl: string
  minAge: number
  maxAge: number
  minPlayers: number
  maxPlayers: number
  psychomotorTags: string[]
  pathologyTags: string[]
  addedBy: string | null
  createdAt: Date
}

interface Props {
  games: Game[]
  isAdmin: boolean
}

function formatAge(minAge: number, maxAge: number) {
  if (minAge === maxAge) return `${minAge} ans`
  if (maxAge >= 120) return `${minAge}+ ans`
  return `${minAge}–${maxAge} ans`
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function AdminGamesTable({ games, isAdmin }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? games.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : games

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Barre de recherche */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un jeu..."
            className="w-full pl-8 pr-8 h-9 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-muted-foreground mt-1.5">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} sur {games.length}
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden md:table-cell w-[320px]">Fonctions</TableHead>
            <TableHead className="hidden sm:table-cell">Âge</TableHead>
            <TableHead className="hidden sm:table-cell">Joueurs</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                Aucun jeu ne correspond à "{search}"
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted shrink-0">
                    {game.imageUrl ? (
                      <Image src={game.imageUrl} alt={game.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl">🎲</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-foreground line-clamp-1">{game.name}</span>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{game.description}</p>
                  {game.addedBy && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      Ajouté par {game.addedBy} · {formatDate(game.createdAt)}
                    </p>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {game.psychomotorTags.slice(0, 1).map((tag) => (
                      <Badge key={tag} variant="psychomotor" className="text-xs whitespace-nowrap">{tag}</Badge>
                    ))}
                    {game.psychomotorTags.length > 1 && (
                      <Badge variant="outline" className="text-xs whitespace-nowrap">+{game.psychomotorTags.length - 1}</Badge>
                    )}
                    {game.psychomotorTags.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                  {formatAge(game.minAge, game.maxAge)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                  {game.minPlayers === game.maxPlayers ? `${game.minPlayers}` : `${game.minPlayers}–${game.maxPlayers}`}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/modifier/${game.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Link>
                    </Button>
                    {isAdmin && <DeleteGameButton gameId={game.id} gameName={game.name} />}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
