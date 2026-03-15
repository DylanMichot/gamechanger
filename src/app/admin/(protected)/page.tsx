import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

export const metadata: Metadata = {
  title: 'Administration — GameChanger',
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [games, session] = await Promise.all([
    prisma.boardGame.findMany({ orderBy: { createdAt: 'desc' } }),
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
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Pathologies</TableHead>
                <TableHead className="hidden lg:table-cell">Fonctions</TableHead>
                <TableHead className="hidden sm:table-cell">Âge</TableHead>
                <TableHead className="hidden sm:table-cell">Joueurs</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted shrink-0">
                      {game.imageUrl ? (
                        <Image
                          src={game.imageUrl}
                          alt={game.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl">🎲</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground line-clamp-1">{game.name}</span>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{game.description}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {game.pathologyTags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="pathology" className="text-xs">{tag}</Badge>
                      ))}
                      {game.pathologyTags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{game.pathologyTags.length - 3}</Badge>
                      )}
                      {game.pathologyTags.length === 0 && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {game.psychomotorTags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="psychomotor" className="text-xs">{tag}</Badge>
                      ))}
                      {game.psychomotorTags.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{game.psychomotorTags.length - 2}</Badge>
                      )}
                      {game.psychomotorTags.length === 0 && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                    {game.minAge === game.maxAge ? `${game.minAge} ans` : `${game.minAge}–${game.maxAge} ans`}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                    {game.minPlayers === game.maxPlayers ? `${game.minPlayers}` : `${game.minPlayers}–${game.maxPlayers}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link href={`/admin/modifier/${game.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Link>
                      </Button>
                      {isAdmin && <DeleteGameButton gameId={game.id} gameName={game.name} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
