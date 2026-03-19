'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal, X, RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { GameCard } from '@/components/GameCard'
import type { BoardGame } from '@/types'

interface JeuxClientProps {
  games: BoardGame[]
  allPathologyTags: string[]
  allPsychomotorTags: string[]
}

interface Filters {
  name: string
  players: number | null
  ageRange: [number, number]
  pathologyTags: string[]
  psychomotorTags: string[]
}

const DEFAULT_FILTERS: Filters = {
  name: '',
  players: null,
  ageRange: [0, 120],
  pathologyTags: [],
  psychomotorTags: [],
}

export function JeuxClient({ games, allPathologyTags, allPsychomotorTags }: JeuxClientProps) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredGames = useMemo(() => {
    const result = games.filter((game) => {
      if (filters.name.trim()) {
        if (!game.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      }
      if (filters.players !== null) {
        if (game.minPlayers > filters.players || game.maxPlayers < filters.players) return false
      }
      const [filterAgeMin, filterAgeMax] = filters.ageRange
      if (filterAgeMin !== 0 || filterAgeMax !== 120) {
        if (game.maxAge < filterAgeMin || game.minAge > filterAgeMax) return false
      }
      if (filters.pathologyTags.length > 0) {
        if (!filters.pathologyTags.every((tag) => game.pathologyTags.includes(tag))) return false
      }
      if (filters.psychomotorTags.length > 0) {
        if (!filters.psychomotorTags.every((tag) => game.psychomotorTags.includes(tag))) return false
      }
      return true
    })
    return result.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [games, filters])

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  function handleTagClick(tag: string, type: 'pathology' | 'psychomotor') {
    if (type === 'pathology') {
      setFilters((prev) => ({
        ...prev,
        pathologyTags: prev.pathologyTags.includes(tag)
          ? prev.pathologyTags
          : [...prev.pathologyTags, tag],
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        psychomotorTags: prev.psychomotorTags.includes(tag)
          ? prev.psychomotorTags
          : [...prev.psychomotorTags, tag],
      }))
    }
  }

  function removePathologyTag(tag: string) {
    setFilters((prev) => ({ ...prev, pathologyTags: prev.pathologyTags.filter((t) => t !== tag) }))
  }

  function removePsychomotorTag(tag: string) {
    setFilters((prev) => ({ ...prev, psychomotorTags: prev.psychomotorTags.filter((t) => t !== tag) }))
  }

  const hasActiveFilters =
    filters.name.trim() !== '' ||
    filters.players !== null ||
    filters.ageRange[0] !== 0 ||
    filters.ageRange[1] !== 120 ||
    filters.pathologyTags.length > 0 ||
    filters.psychomotorTags.length > 0

  const availablePathologyTags = allPathologyTags.filter((t) => !filters.pathologyTags.includes(t))
  const availablePsychomotorTags = allPsychomotorTags.filter((t) => !filters.psychomotorTags.includes(t))

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Nom */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Nom du jeu</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.name}
            onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Rechercher par nom..."
            className="w-full pl-8 pr-3 h-9 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {filters.name && (
            <button
              onClick={() => setFilters((p) => ({ ...p, name: '' }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Joueurs */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Nombre de joueurs</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={50}
            value={filters.players ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                players: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
            placeholder="Ex : 4"
            className="flex h-9 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {filters.players !== null && (
            <button
              onClick={() => setFilters((p) => ({ ...p, players: null }))}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Tranche d'âge */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Tranche d'âge</h3>
        <div className="px-1">
          <Slider
            min={0}
            max={120}
            step={1}
            value={filters.ageRange}
            onValueChange={(v) => {
              const [a, b] = v as [number, number]
              setFilters((prev) => ({ ...prev, ageRange: [Math.min(a, b), Math.max(a, b)] }))
            }}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={120}
            value={filters.ageRange[0]}
            onChange={(e) => {
              const val = Math.min(Math.max(parseInt(e.target.value) || 0, 0), filters.ageRange[1])
              setFilters((prev) => ({ ...prev, ageRange: [val, prev.ageRange[1]] }))
            }}
            className="w-16 text-center rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="text-muted-foreground text-sm">—</span>
          <input
            type="number"
            min={0}
            max={120}
            value={filters.ageRange[1]}
            onChange={(e) => {
              const val = Math.min(Math.max(parseInt(e.target.value) || 0, filters.ageRange[0]), 120)
              setFilters((prev) => ({ ...prev, ageRange: [prev.ageRange[0], val] }))
            }}
            className="w-16 text-center rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="text-xs text-muted-foreground">ans</span>
        </div>
      </div>

      <Separator />

      {/* Fonctions - dropdown */}
      {allPsychomotorTags.length > 0 && (
        <>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Fonctions</h3>
            {availablePsychomotorTags.length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    setFilters((prev) => ({
                      ...prev,
                      psychomotorTags: [...prev.psychomotorTags, e.target.value],
                    }))
                  }
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Ajouter une fonction...</option>
                {availablePsychomotorTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}
            {filters.psychomotorTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {filters.psychomotorTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-100 text-teal-800 px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {tag}
                    <button
                      onClick={() => removePsychomotorTag(tag)}
                      className="hover:opacity-70"
                      aria-label={`Retirer ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Populations - dropdown */}
      {allPathologyTags.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Populations</h3>
          {availablePathologyTags.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setFilters((prev) => ({
                    ...prev,
                    pathologyTags: [...prev.pathologyTags, e.target.value],
                  }))
                }
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Ajouter une population...</option>
              {availablePathologyTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
          {filters.pathologyTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filters.pathologyTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-semibold"
                >
                  {tag}
                  <button
                    onClick={() => removePathologyTag(tag)}
                    className="hover:opacity-70"
                    aria-label={`Retirer ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catalogue de jeux</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé
            {filteredGames.length !== 1 ? 's' : ''}
            {games.length !== filteredGames.length && ` sur ${games.length}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-2"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {(filters.name.trim() ? 1 : 0) +
                  (filters.players !== null ? 1 : 0) +
                  filters.pathologyTags.length +
                  filters.psychomotorTags.length +
                  (filters.ageRange[0] !== 0 || filters.ageRange[1] !== 120 ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile filters */}
      {mobileFiltersOpen && (
        <div className="lg:hidden mb-6 p-4 bg-white border rounded-xl shadow-sm">
          {FilterPanel()}
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Réinitialiser
                </button>
              )}
            </div>
            {FilterPanel()}
          </div>
        </aside>

        {/* Game grid */}
        <main className="flex-1">
          {filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🎲</div>
              <h3 className="text-lg font-semibold mb-2">Aucun jeu trouvé</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Essayez de modifier vos filtres pour trouver des jeux adaptés à vos besoins.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4 gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} onTagClick={handleTagClick} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
