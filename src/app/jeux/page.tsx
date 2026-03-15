import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { JeuxClient } from '@/components/JeuxClient'
import type { BoardGame } from '@/types'

export const metadata: Metadata = {
  title: 'Catalogue de jeux',
  description:
    'Recherchez et filtrez les jeux de société thérapeutiques par pathologie, tranche d\'âge et fonctions psychomotrices.',
}

export const dynamic = 'force-dynamic'

export default async function JeuxPage() {
  const gamesRaw = await prisma.boardGame.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const games: BoardGame[] = gamesRaw.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  }))

  // Dédupliquer et trier les tags
  const allPathologyTagsSet = new Set<string>()
  const allPsychomotorTagsSet = new Set<string>()

  for (const game of games) {
    game.pathologyTags.forEach((t) => allPathologyTagsSet.add(t))
    game.psychomotorTags.forEach((t) => allPsychomotorTagsSet.add(t))
  }

  const allPathologyTags = Array.from(allPathologyTagsSet).sort((a, b) =>
    a.localeCompare(b, 'fr')
  )
  const allPsychomotorTags = Array.from(allPsychomotorTagsSet).sort((a, b) =>
    a.localeCompare(b, 'fr')
  )

  return (
    <JeuxClient
      games={games}
      allPathologyTags={allPathologyTags}
      allPsychomotorTags={allPsychomotorTags}
    />
  )
}
