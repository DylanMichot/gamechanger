'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Déconnexion</span>
    </Button>
  )
}
