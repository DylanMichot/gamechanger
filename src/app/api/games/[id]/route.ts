import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient, STORAGE_BUCKET, getStoragePathFromUrl } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.boardGame.findUnique({ where: { id: params.id } })
    if (!game) return NextResponse.json({ error: 'Jeu non trouvé' }, { status: 404 })
    return NextResponse.json(game)
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { name, description, imageUrl, minAge, maxAge, minPlayers, maxPlayers, pathologyTags, psychomotorTags, addedBy, oldImageUrl } = body

    if (!name?.trim()) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    if (!description?.trim()) return NextResponse.json({ error: 'La description est requise' }, { status: 400 })
    if (!imageUrl?.trim()) return NextResponse.json({ error: "L'image est requise" }, { status: 400 })
    if (typeof minAge !== 'number' || typeof maxAge !== 'number' || minAge < 0 || maxAge < minAge)
      return NextResponse.json({ error: "Tranches d'âge invalides" }, { status: 400 })
    if (typeof minPlayers !== 'number' || typeof maxPlayers !== 'number' || minPlayers < 1 || maxPlayers < minPlayers)
      return NextResponse.json({ error: 'Nombre de joueurs invalide' }, { status: 400 })

    if (oldImageUrl && oldImageUrl !== imageUrl) {
      const oldPath = getStoragePathFromUrl(oldImageUrl)
      if (oldPath) {
        const supabase = createServiceClient()
        await supabase.storage.from(STORAGE_BUCKET).remove([oldPath])
      }
    }

    const game = await prisma.boardGame.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        minAge,
        maxAge,
        minPlayers,
        maxPlayers,
        pathologyTags: pathologyTags ?? [],
        psychomotorTags: psychomotorTags ?? [],
        addedBy: addedBy ?? null,
      },
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du jeu:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    if (session.user?.name !== 'admin')
      return NextResponse.json({ error: 'Accès refusé : seul l\'admin peut supprimer des jeux' }, { status: 403 })

    const game = await prisma.boardGame.findUnique({ where: { id: params.id } })
    if (!game) return NextResponse.json({ error: 'Jeu non trouvé' }, { status: 404 })

    if (game.imageUrl) {
      const storagePath = getStoragePathFromUrl(game.imageUrl)
      if (storagePath) {
        const supabase = createServiceClient()
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
      }
    }

    await prisma.boardGame.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
