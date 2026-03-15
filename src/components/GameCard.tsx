'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Users, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/FavoriteButton'
import type { BoardGame } from '@/types'

interface GameCardProps {
  game: BoardGame
  onTagClick?: (tag: string, type: 'pathology' | 'psychomotor') => void
}

export function GameCard({ game, onTagClick }: GameCardProps) {
  return (
    <Link href={`/jeux/${game.id}`} className="group block">
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {game.imageUrl ? (
            <Image
              src={game.imageUrl}
              alt={game.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-4xl">🎲</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton
              gameId={game.id}
              size="sm"
              className="bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div>
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-1">
              {game.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {game.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {game.pathologyTags.slice(0, 3).map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onTagClick(tag, 'pathology')
                  }}
                  title={`Filtrer par "${tag}"`}
                >
                  <Badge variant="pathology" className="text-xs cursor-pointer hover:opacity-75 transition-opacity">
                    {tag}
                  </Badge>
                </button>
              ) : (
                <Badge key={tag} variant="pathology" className="text-xs">
                  {tag}
                </Badge>
              )
            )}
            {game.psychomotorTags.slice(0, 2).map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onTagClick(tag, 'psychomotor')
                  }}
                  title={`Filtrer par "${tag}"`}
                >
                  <Badge variant="psychomotor" className="text-xs cursor-pointer hover:opacity-75 transition-opacity">
                    {tag}
                  </Badge>
                </button>
              ) : (
                <Badge key={tag} variant="psychomotor" className="text-xs">
                  {tag}
                </Badge>
              )
            )}
            {game.pathologyTags.length + game.psychomotorTags.length > 5 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{game.pathologyTags.length + game.psychomotorTags.length - 5}
              </Badge>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto pt-2 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {game.minAge === game.maxAge
                  ? `${game.minAge} ans`
                  : game.maxAge >= 120
                  ? `${game.minAge}+`
                  : `${game.minAge}–${game.maxAge} ans`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>
                {game.minPlayers === game.maxPlayers
                  ? `${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`
                  : `${game.minPlayers}–${game.maxPlayers} joueurs`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
