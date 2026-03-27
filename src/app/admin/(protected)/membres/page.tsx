'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Member {
  id: string
  name: string
  active: boolean
}

export default function MembresPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/members')
    const data = await res.json()
    setMembers(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setError('')
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    if (res.ok) {
      setNewName('')
      await load()
    } else {
      const d = await res.json()
      setError(d.error ?? 'Erreur')
    }
    setAdding(false)
  }

  async function handleRename(id: string) {
    if (!editingName.trim()) return
    const res = await fetch(`/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() }),
    })
    if (res.ok) {
      setEditingId(null)
      await load()
    }
  }

  async function handleToggleActive(member: Member) {
    await fetch(`/api/members/${member.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !member.active }),
    })
    await load()
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer "${name}" définitivement ?`)) return
    await fetch(`/api/members/${id}`, { method: 'DELETE' })
    await load()
  }

  const active = members.filter((m) => m.active)
  const inactive = members.filter((m) => !m.active)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <UserRound className="h-6 w-6 text-accent" />
          Gestion des membres
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Les membres actifs apparaissent dans le menu "Ajouté par" lors de la création ou modification d'un jeu.
        </p>
      </div>

      {/* Formulaire ajout */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => { setNewName(e.target.value); setError('') }}
          placeholder="Prénom N (ex : Sarah A)"
          className="flex-1"
        />
        <Button type="submit" disabled={adding || !newName.trim()} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Membres actifs */}
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-muted/30 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Membres actifs ({active.length})
            </div>
            {active.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Aucun membre actif.</p>
            ) : (
              <ul className="divide-y divide-border">
                {active.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                    {editingId === m.id ? (
                      <>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(m.id)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                        />
                        <button onClick={() => handleRename(m.id)} className="text-green-600 hover:text-green-700">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium">{m.name}</span>
                        <button
                          onClick={() => { setEditingId(m.id); setEditingName(m.name) }}
                          className="text-muted-foreground hover:text-foreground"
                          title="Renommer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(m)}
                          className="text-muted-foreground hover:text-amber-600 text-xs"
                          title="Désactiver (masquer du menu sans supprimer)"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.name)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Membres inactifs */}
          {inactive.length > 0 && (
            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm opacity-60">
              <div className="px-4 py-2 bg-muted/30 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Membres inactifs ({inactive.length}) — n'apparaissent pas dans le menu
              </div>
              <ul className="divide-y divide-border">
                {inactive.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="flex-1 text-sm text-muted-foreground line-through">{m.name}</span>
                    <button
                      onClick={() => handleToggleActive(m)}
                      className="text-xs text-accent hover:underline"
                      title="Réactiver"
                    >
                      Réactiver
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
