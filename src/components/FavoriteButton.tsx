'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FAVORITES_KEY = 'gamechanger_favorites'

export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setFavoriteIds(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

interface FavoriteButtonProps {
  gameId: string
  size?: 'sm' | 'default'
  className?: string
  onRemove?: () => void
}

export function FavoriteButton({
  gameId,
  size = 'default',
  className,
  onRemove,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const ids = getFavoriteIds()
    setIsFavorite(ids.includes(gameId))
  }, [gameId])

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const ids = getFavoriteIds()
    if (ids.includes(gameId)) {
      const newIds = ids.filter((id) => id !== gameId)
      setFavoriteIds(newIds)
      setIsFavorite(false)
      onRemove?.()
    } else {
      setFavoriteIds([...ids, gameId])
      setIsFavorite(true)
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : 'icon'}
        className={cn('opacity-0', className)}
        aria-hidden
      >
        <Heart className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'sm' : 'icon'}
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={cn(
        'transition-all',
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-muted-foreground hover:text-red-400',
        className
      )}
    >
      <Heart
        className={cn('h-5 w-5', isFavorite && 'fill-current')}
      />
    </Button>
  )
}
