import { createClient } from '@supabase/supabase-js'

// Client public (côté client) - utilise la clé anon
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Client serveur avec la clé service role (côté serveur uniquement)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export const STORAGE_BUCKET = 'board-games'

export function getStoragePathFromUrl(imageUrl: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null
  const prefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`
  if (imageUrl.startsWith(prefix)) {
    return imageUrl.slice(prefix.length)
  }
  return null
}
