import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { GameForm } from '@/components/GameForm'

export const metadata: Metadata = {
  title: 'Ajouter un jeu — Admin',
}

export default async function AjouterPage() {
  const games = await prisma.boardGame.findMany({
    select: { pathologyTags: true, psychomotorTags: true },
  })

  const existingPathologyTags = Array.from(new Set(games.flatMap((g) => g.pathologyTags))).sort((a, b) =>
    a.localeCompare(b, 'fr')
  )
  const existingPsychomotorTags = Array.from(new Set(games.flatMap((g) => g.psychomotorTags))).sort((a, b) =>
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
        <h1 className="text-2xl font-extrabold text-foreground">Ajouter un jeu</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Remplissez les informations du nouveau jeu de société.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-8">
        <GameForm
          mode="create"
          existingPathologyTags={existingPathologyTags}
          existingPsychomotorTags={existingPsychomotorTags}
        />
      </div>
    </div>
  )
}
