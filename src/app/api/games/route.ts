import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')

    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean)
      const games = await prisma.boardGame.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(games)
    }

    const games = await prisma.boardGame.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(games)
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      imageUrl,
      minAge,
      maxAge,
      minPlayers,
      maxPlayers,
      pathologyTags,
      psychomotorTags,
      addedBy,
    } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: 'La description est requise' }, { status: 400 })
    }
    if (!imageUrl?.trim()) {
      return NextResponse.json({ error: "L'image est requise" }, { status: 400 })
    }
    if (
      typeof minAge !== 'number' ||
      typeof maxAge !== 'number' ||
      minAge < 0 ||
      maxAge < minAge
    ) {
      return NextResponse.json(
        { error: 'Tranches d\'âge invalides' },
        { status: 400 }
      )
    }
    if (
      typeof minPlayers !== 'number' ||
      typeof maxPlayers !== 'number' ||
      minPlayers < 1 ||
      maxPlayers < minPlayers
    ) {
      return NextResponse.json(
        { error: 'Nombre de joueurs invalide' },
        { status: 400 }
      )
    }

    const game = await prisma.boardGame.create({
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

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du jeu:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
