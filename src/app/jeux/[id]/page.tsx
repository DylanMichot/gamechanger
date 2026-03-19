import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users, Cake } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/FavoriteButton'
import { CopyLinkButton } from '@/components/CopyLinkButton'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = await prisma.boardGame.findUnique({ where: { id: params.id } })
  if (!game) return { title: 'Jeu introuvable' }
  return {
    title: game.name,
    description: game.description,
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const game = await prisma.boardGame.findUnique({ where: { id: params.id } })

  if (!game) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-5xl">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 gap-2">
        <Link href="/jeux">
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border shadow-md bg-muted">
          {game.imageUrl ? (
            <Image
              src={game.imageUrl}
              alt={game.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-8xl">🎲</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-foreground leading-tight">
              {game.name}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <CopyLinkButton />
              <FavoriteButton gameId={game.id} />
            </div>
          </div>

          <p className="text-muted-foreground text-base leading-relaxed">
            {game.description}
          </p>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <Cake className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Tranche d'âge
                </p>
                <p className="font-bold text-foreground mt-0.5">
                  {game.minAge === game.maxAge
                    ? `${game.minAge} ans`
                    : game.maxAge >= 120
                    ? `${game.minAge}+`
                    : `${game.minAge} – ${game.maxAge} ans`}
                </p>
              </div>
            </div>
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Joueurs
                </p>
                <p className="font-bold text-foreground mt-0.5">
                  {game.minPlayers === game.maxPlayers
                    ? `${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`
                    : `${game.minPlayers} – ${game.maxPlayers} joueurs`}
                </p>
              </div>
            </div>
          </div>

          {/* Tags fonctions — en premier */}
          {game.psychomotorTags.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Fonctions
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.psychomotorTags.map((tag) => (
                  <Badge key={tag} variant="psychomotor">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags populations */}
          {game.pathologyTags.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Populations ciblées
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.pathologyTags.map((tag) => (
                  <Badge key={tag} variant="pathology">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
