import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { AdminGamesTable } from '@/components/AdminGamesTable'

export const metadata: Metadata = {
  title: 'Administration — GameChanger',
}

export const dynamic = 'force-dynamic'


export default async function AdminPage() {
  const [games, session] = await Promise.all([
    prisma.boardGame.findMany({ orderBy: { name: 'asc' } }),
    getServerSession(authOptions),
  ])

  const isAdmin = session?.user?.name === 'admin'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Gestion des jeux</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {games.length} jeu{games.length !== 1 ? 'x' : ''} dans le catalogue
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/ajouter">
            <Plus className="h-4 w-4" />
            Ajouter un jeu
          </Link>
        </Button>
      </div>

      {games.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-16 text-center">
          <div className="text-4xl mb-4">🎲</div>
          <h3 className="text-lg font-bold mb-2">Aucun jeu pour le moment</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Commencez par ajouter votre premier jeu au catalogue.
          </p>
          <Button asChild className="gap-2">
            <Link href="/admin/ajouter">
              <Plus className="h-4 w-4" />
              Ajouter un jeu
            </Link>
          </Button>
        </div>
      ) : (
        <AdminGamesTable games={games} isAdmin={isAdmin} />
      )}
    </div>
  )
}
