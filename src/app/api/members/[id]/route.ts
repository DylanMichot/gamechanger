import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name, active } = await req.json()
  try {
    const member = await prisma.member.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(active !== undefined ? { active } : {}),
      },
    })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'Membre introuvable ou nom déjà utilisé' }, { status: 404 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await prisma.member.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
