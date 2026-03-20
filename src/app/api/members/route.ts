import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const members = await prisma.member.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(members)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  try {
    const member = await prisma.member.create({ data: { name: name.trim() } })
    return NextResponse.json(member, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Ce membre existe déjà' }, { status: 409 })
  }
}
