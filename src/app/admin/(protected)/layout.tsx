import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { Gamepad2, Plus, LayoutDashboard, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/SignOutButton'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin nav */}
      <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-lg"
          >
            <Gamepad2 className="h-6 w-6" />
            <span>GameChanger</span>
            <span className="text-xs font-normal opacity-70 ml-1">Admin</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              <Link href="/admin/membres">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Membres</span>
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-accent hover:bg-accent/90 text-white gap-2"
            >
              <Link href="/admin/ajouter">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter un jeu</span>
              </Link>
            </Button>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container py-8">{children}</main>
    </div>
  )
}
