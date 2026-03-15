import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { GameForm } from '@/components/GameForm'
import type { BoardGame } from '@/types'

interface PageProps {
  params: { id: string }
}

export const metadata: Metadata = {
  title: 'Modifier un jeu — Admin',
}

export default async function ModifierPage({ params }: PageProps) {
  const [gameRaw, allGames] = await Promise.all([
    prisma.boardGame.findUnique({ where: { id: params.id } }),
    prisma.boardGame.findMany({ select: { pathologyTags: true, psychomotorTags: true } }),
  ])

  if (!gameRaw) notFound()

  const game: BoardGame = {
    ...gameRaw,
    createdAt: gameRaw.createdAt.toISOString(),
    updatedAt: gameRaw.updatedAt.toISOString(),
  }

  const existingPathologyTags = Array.from(new Set(allGames.flatMap((g) => g.pathologyTags))).sort((a, b) =>
    a.localeCompare(b, 'fr')
  )
  const existingPsychomotorTags = Array.from(new Set(allGames.flatMap((g) => g.psychomotorTags))).sort((a, b) =>
    a.localeCompare(b, 'fr')
  )

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 gap-2">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-2xl font-extrabold text-foreground">Modifier : {game.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Mettez à jour les informations de ce jeu.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-8">
        <GameForm
          mode="edit"
          initialData={game}
          existingPathologyTags={existingPathologyTags}
          existingPsychomotorTags={existingPsychomotorTags}
        />
      </div>
    </div>
  )
}
