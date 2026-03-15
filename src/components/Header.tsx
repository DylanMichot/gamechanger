'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2, BookMarked, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <span>GameChanger</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2',
              pathname === '/jeux' && 'bg-accent/10 text-accent'
            )}
          >
            <Link href="/jeux">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Rechercher</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2',
              pathname === '/favoris' && 'bg-accent/10 text-accent'
            )}
          >
            <Link href="/favoris">
              <BookMarked className="h-4 w-4" />
              <span className="hidden sm:inline">Favoris</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
