import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient, STORAGE_BUCKET } from '@/lib/supabase'

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Validation du type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format non accepté. Utilisez JPEG ou PNG uniquement.' },
        { status: 400 }
      )
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. La taille maximale est 1 Mo.' },
        { status: 400 }
      )
    }

    const ext = file.type === 'image/png' ? '.png' : '.jpg'
    const filename = `games/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const supabase = createServiceClient()

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Erreur upload Supabase (détail):', JSON.stringify(uploadError))
      return NextResponse.json(
        { error: "Erreur lors de l'upload de l'image" },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Erreur inattendue lors de l\'upload:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
